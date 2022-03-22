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
import { trackEvent } from '@googleforcreators/tracking';
import PropTypes from 'prop-types';
import { useFeature } from 'flagged';
/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import useRefreshPostEditURL from '../../../utils/useRefreshPostEditURL';
import { useCheckpoint, ReviewChecklistDialog } from '../../checklist';
import { PublishModal } from '../../publishModal';
import ButtonWithChecklistWarning from './buttonWithChecklistWarning';

function PublishButton({ forceIsSaving }) {
  const isUpdatedPublishModalEnabled = useFeature(
    'enableUpdatedPublishStoryModal'
  );
  const { date, storyId, saveStory, title, editLink, canPublish } = useStory(
    ({
      state: {
        story: { date, storyId, title, editLink },
        capabilities,
      },
      actions: { saveStory },
    }) => ({
      date,
      storyId,
      saveStory,
      title,
      editLink,
      canPublish: Boolean(capabilities?.publish),
    })
  );

  const { shouldReviewDialogBeSeen, showPriorityIssues } = useCheckpoint(
    ({
      state: { shouldReviewDialogBeSeen },
      actions: { showPriorityIssues },
    }) => ({
      shouldReviewDialogBeSeen,
      showPriorityIssues,
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
    showPriorityIssues();
    if (shouldReviewDialogBeSeen || isUpdatedPublishModalEnabled) {
      setShowDialog(true);
      return;
    }

    publish();
  }, [
    showPriorityIssues,
    shouldReviewDialogBeSeen,
    isUpdatedPublishModalEnabled,
    publish,
  ]);

  const closeDialog = useCallback(() => setShowDialog(false), []);

  return (
    <>
      <ButtonWithChecklistWarning
        onClick={handlePublish}
        disabled={forceIsSaving}
        hasFutureDate={hasFutureDate}
      />
      {isUpdatedPublishModalEnabled ? (
        <PublishModal
          isOpen={showDialog}
          onPublish={publish}
          onClose={closeDialog}
          hasFutureDate={hasFutureDate}
          publishButtonDisabled={forceIsSaving}
        />
      ) : (
        <ReviewChecklistDialog
          isOpen={showDialog}
          onIgnore={publish}
          onClose={closeDialog}
          onReview={closeDialog}
        />
      )}
    </>
  );
}

PublishButton.propTypes = {
  forceIsSaving: PropTypes.bool,
};

export default PublishButton;
