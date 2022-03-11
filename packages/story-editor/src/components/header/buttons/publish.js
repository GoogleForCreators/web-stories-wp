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
/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import useRefreshPostEditURL from '../../../utils/useRefreshPostEditURL';
import { useCheckpoint } from '../../checklist';
import { PublishModal } from '../../publishModal';
import ButtonWithChecklistWarning from './buttonWithChecklistWarning';

function PublishButton({ forceIsSaving }) {
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

  const showPriorityIssues = useCheckpoint(
    ({ actions: { showPriorityIssues } }) => showPriorityIssues
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
    setShowDialog(true);
  }, [showPriorityIssues]);

  const closeDialog = useCallback(() => setShowDialog(false), []);

  return (
    <>
      <ButtonWithChecklistWarning
        onClick={handlePublish}
        disabled={forceIsSaving}
        hasFutureDate={hasFutureDate}
      />
      <PublishModal
        isOpen={showDialog}
        onPublish={publish}
        onClose={closeDialog}
        hasFutureDate={hasFutureDate}
        publishButtonDisabled={forceIsSaving}
      />
    </>
  );
}

PublishButton.propTypes = {
  forceIsSaving: PropTypes.bool,
};

export default PublishButton;
