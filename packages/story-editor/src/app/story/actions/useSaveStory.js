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
import { __ } from '@googleforcreators/i18n';
import { useCallback, useState } from '@googleforcreators/react';
import { getTimeTracker, trackError } from '@googleforcreators/tracking';
import { useSnackbar } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useAPI } from '../../api';
import { useConfig } from '../../config';
import useRefreshPostEditURL from '../../../utils/useRefreshPostEditURL';
import getStoryPropsToSave from '../utils/getStoryPropsToSave';
import { useHistory } from '../../history';

/**
 * Custom hook to save story.
 *
 * @param {Object} properties Properties to update.
 * @param {number} properties.storyId Story post id.
 * @param {Array} properties.pages Array of all pages.
 * @param {Object} properties.story Story-global properties.
 * @param {Function} properties.updateStory Function to update a story.
 * @return {Function} Function that can be called to save a story.
 */
function useSaveStory({ storyId, pages, story, updateStory }) {
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

  const { editLink } = story;
  const refreshPostEditURL = useRefreshPostEditURL(storyId, editLink);

  const saveStory = useCallback(
    (props) => {
      setIsSaving(true);

      const isStoryAlreadyPublished = ['publish', 'future', 'private'].includes(
        story.status
      );

      const trackTiming = getTimeTracker('load_save_story');

      return saveStoryById({
        storyId,
        ...getStoryPropsToSave({
          story,
          pages,
          metadata,
          flags,
        }),
        ...props,
      })
        .then((data) => {
          const {
            status,
            slug,
            link,
            previewLink,
            editLink: newEditLink,
            embedPostLink,
            featuredMedia,
          } = data;

          const properties = {
            status,
            slug,
            link,
            previewLink,
            editLink: newEditLink,
            embedPostLink,
            featuredMedia,
          };
          updateStory({ properties });

          refreshPostEditURL();

          const isStoryPublished = ['publish', 'future', 'private'].includes(
            data.status
          );
          setIsFreshlyPublished(!isStoryAlreadyPublished && isStoryPublished);
        })
        .catch((err) => {
          let message = __('Failed to save the story', 'web-stories');
          const status = err?.data?.status;
          const error_400 = __(
            'Client error bad request failed to save the story',
            'web-stories'
          );
          const error_401 = __(
            'Client error unauthorized failed to save the story',
            'web-stories'
          );
          const error_403 = __(
            'Client error forbidden failed to save the story',
            'web-stories'
          );
          const error_500 = __(
            'Server error failed to save the story',
            'web-stories'
          );

          switch (status) {
            case 400:
              message = error_400;
              break;
            case 401:
              message = error_401;
              break;
            case 403:
              message = error_403;
              break;
            case 500:
              message = error_500;
              break;
            default:
            // noop
          }

          // eslint-disable-next-line no-console -- We want to surface this error.
          console.log(err);
          trackError('save_story', err.message);
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

  return { saveStory, isSaving, isFreshlyPublished };
}

export default useSaveStory;
