/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * External dependencies
 */
import { __, _x, sprintf } from '@googleforcreators/i18n';
import { useCallback, useState } from '@googleforcreators/react';
import { getTimeTracker, trackError } from '@googleforcreators/tracking';
import { useSnackbar } from '@googleforcreators/design-system';
import { stripHTML } from '@googleforcreators/dom';
import type { Page, Story } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { useAPI } from '../../api';
import { useConfig } from '../../config';
import useRefreshPostEditURL from '../../../utils/useRefreshPostEditURL';
import getStoryPropsToSave from '../utils/getStoryPropsToSave';
import { useHistory } from '../../history';
import type {
  RESTError,
  StorySaveData,
  UpdateStoryProps,
  ReducerState,
} from '../../../types';

const HTTP_STATUS_DESCRIPTIONS = {
  400: _x('Bad Request', 'HTTP status description', 'web-stories'),
  401: _x('Unauthorized', 'HTTP status description', 'web-stories'),
  403: _x('Forbidden', 'HTTP status description', 'web-stories'),
  500: _x('Internal Server Error', 'HTTP status description', 'web-stories'),
};

interface UseSaveStoryProps {
  storyId: number;
  pages: Page[];
  story: Story;
  updateStory: (props: UpdateStoryProps) => ReducerState;
}

/**
 * Custom hook to save story.
 */
function useSaveStory({
  storyId,
  pages,
  story,
  updateStory,
}: UseSaveStoryProps) {
  const {
    actions: { saveStoryById },
  } = useAPI();
  const {
    actions: { resetNewChanges },
  } = useHistory();
  const { metadata, flags } = useConfig();
  const { showSnackbar } = useSnackbar();
  const [isSaving, setIsSaving] = useState(false);
  const [isFreshlyPublished, setIsFreshlyPublished] = useState(false);
  const [isFreshlyPending, setIsFreshlyPending] = useState(false);

  const { editLink } = story;
  const refreshPostEditURL = useRefreshPostEditURL(storyId, editLink);

  const saveStory = useCallback(
    (props: Partial<StorySaveData>) => {
      setIsSaving(true);

      const isStoryAlreadyPublished = ['publish', 'future', 'private'].includes(
        story.status
      );
      const isStoryAlreadyPending = 'pending' === story.status;
      const trackTiming = getTimeTracker('load_save_story');

      // Wrapping everything in a Promise so we can catch
      // errors caused by getStoryPropsToSave() / getStoryMarkup().
      return Promise.resolve()
        .then(() =>
          saveStoryById?.({
            storyId,
            ...getStoryPropsToSave({
              story,
              pages,
              metadata,
              flags,
            }),
            // Saving an auto-draft should create a draft by default.
            status: 'auto-draft' === story.status ? 'draft' : story.status,
            ...props,
          })
        )
        .then((data) => {
          if (!data) {
            return;
          }
          const {
            status,
            slug,
            link,
            previewLink,
            revisions,
            editLink: newEditLink,
            embedPostLink,
            featuredMedia,
          } = data;

          const properties: Partial<Story> = {
            status,
            slug,
            link,
            previewLink,
            editLink: newEditLink,
            embedPostLink,
            featuredMedia,
            revisions,
          };
          updateStory({ properties });

          refreshPostEditURL();

          const isStoryPublished = ['publish', 'future', 'private'].includes(
            data.status
          );
          const isStoryPending = 'pending' === data.status;
          setIsFreshlyPublished(!isStoryAlreadyPublished && isStoryPublished);
          setIsFreshlyPending(!isStoryAlreadyPending && isStoryPending);
        })
        .catch((err: RESTError) => {
          const description = err.message ? stripHTML(err.message) : null;
          let message = __('Failed to save the story', 'web-stories');

          if (description) {
            message = sprintf(
              /* translators: %s: error message */
              __('Failed to save the story: %s', 'web-stories'),
              description
            );
          }

          if (
            err?.data?.status &&
            Object.prototype.hasOwnProperty.call(
              HTTP_STATUS_DESCRIPTIONS,
              err?.data?.status
            )
          ) {
            if (description) {
              message = sprintf(
                /* translators: 1: error message. 2: status code */
                __('Failed to save the story: %1$s (%2$s)', 'web-stories'),
                description,
                HTTP_STATUS_DESCRIPTIONS[err.data.status]
              );
            } else {
              message = sprintf(
                /* translators: %s: error message */
                __('Failed to save the story: %s', 'web-stories'),
                HTTP_STATUS_DESCRIPTIONS[err.data.status]
              );
            }
          }

          // eslint-disable-next-line no-console -- We want to surface this error.
          console.log(__('Failed to save the story', 'web-stories'), err);
          void trackError('save_story', description || '');

          showSnackbar({
            message,
            dismissible: true,
          });
        })
        .finally(() => {
          setIsSaving(false);
          resetNewChanges();
          trackTiming();
        });
    },
    [
      story,
      pages,
      metadata,
      saveStoryById,
      storyId,
      updateStory,
      refreshPostEditURL,
      showSnackbar,
      resetNewChanges,
      flags,
    ]
  );

  return { saveStory, isSaving, isFreshlyPublished, isFreshlyPending };
}

export default useSaveStory;
