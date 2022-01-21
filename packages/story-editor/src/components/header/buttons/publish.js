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
import { useCallback, useState } from '@googleforcreators/react';
import {
  toDate,
  isAfter,
  subMinutes,
  getOptions,
} from '@googleforcreators/date';
import { __ } from '@googleforcreators/i18n';
import { trackEvent } from '@googleforcreators/tracking';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { useStory, useLocalMedia } from '../../../app';
import useRefreshPostEditURL from '../../../utils/useRefreshPostEditURL';
import { useCheckpoint, ReviewChecklistDialog } from '../../checklist';
import ButtonWithChecklistWarning from './buttonWithChecklistWarning';

function PublishButton({ forceIsSaving }) {
  const {
    isSaving,
    date,
    storyId,
    saveStory,
    title,
    editLink,
    status,
    canPublish,
  } = useStory(
    ({
      state: {
        meta: { isSaving },
        story: { date, storyId, title, editLink, status },
        capabilities,
      },
      actions: { saveStory },
    }) => ({
      isSaving,
      date,
      storyId,
      saveStory,
      title,
      editLink,
      status,
      canPublish: Boolean(capabilities?.publish),
    })
  );
  const { isUploading } = useLocalMedia((state) => ({
    isUploading: state.state.isUploading,
  }));

  const { shouldReviewDialogBeSeen } = useCheckpoint(
    ({ state: { shouldReviewDialogBeSeen } }) => ({
      shouldReviewDialogBeSeen,
    })
  );

  const [showDialog, setShowDialog] = useState(false);

  const refreshPostEditURL = useRefreshPostEditURL(storyId, editLink);
  // Offset the date by one minute to accommodate for network latency.
  const hasFutureDate = isAfter(
    subMinutes(toDate(date, getOptions()), 1),
    toDate(new Date(), getOptions())
  );

  const publish = useCallback(() => {
    let newStatus = 'pending';

    if (canPublish) {
      if (hasFutureDate) {
        newStatus = 'future';
      } else {
        newStatus = 'publish';
      }
    }

    trackEvent('publish_story', {
      status: newStatus,
      title_length: title.length,
    });

    setShowDialog(false);
    saveStory({ status: newStatus });
    refreshPostEditURL();
  }, [refreshPostEditURL, saveStory, hasFutureDate, title, canPublish]);

  const handlePublish = useCallback(() => {
    if (shouldReviewDialogBeSeen && canPublish) {
      setShowDialog(true);
      return;
    }

    publish();
  }, [shouldReviewDialogBeSeen, canPublish, publish]);

  const closeDialog = useCallback(() => setShowDialog(false), []);

  const text =
    hasFutureDate && status !== 'private'
      ? __('Schedule', 'web-stories')
      : __('Publish', 'web-stories');

  return (
    <>
      <ButtonWithChecklistWarning
        onClick={handlePublish}
        disabled={isSaving || forceIsSaving || isUploading}
        text={canPublish ? text : __('Submit for review', 'web-stories')}
        isUploading={isUploading}
        canPublish={canPublish}
      />
      <ReviewChecklistDialog
        isOpen={showDialog}
        onIgnore={publish}
        onClose={closeDialog}
        onReview={closeDialog}
      />
    </>
  );
}

PublishButton.propTypes = {
  forceIsSaving: PropTypes.bool,
};

export default PublishButton;
