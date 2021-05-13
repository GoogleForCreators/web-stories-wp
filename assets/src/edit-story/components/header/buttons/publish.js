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
import { useCallback, useEffect, useState } from 'react';
import { toDate, isAfter, subMinutes, getOptions } from '@web-stories-wp/date';
import { __ } from '@web-stories-wp/i18n';
import { trackEvent } from '@web-stories-wp/tracking';

/**
 * Internal dependencies
 */
import { useStory, useLocalMedia, useConfig } from '../../../app';
import useRefreshPostEditURL from '../../../utils/useRefreshPostEditURL';
import {
  usePrepublishChecklist,
  ReviewChecklistDialog,
} from '../../inspector/prepublish';
import ButtonWithChecklistWarning from './buttonWithChecklistWarning';

const TRANSITION_DURATION = 300;

function Publish() {
  const { isSaving, date, storyId, saveStory, title } = useStory(
    ({
      state: {
        meta: { isSaving },
        story: { date, storyId, title },
      },
      actions: { saveStory },
    }) => ({ isSaving, date, storyId, saveStory, title })
  );
  const { isUploading } = useLocalMedia((state) => ({
    isUploading: state.state.isUploading,
  }));

  const {
    shouldReviewDialogBeSeen,
    focusChecklistTab,
  } = usePrepublishChecklist();

  const [showDialog, setShowDialog] = useState(false);
  const { capabilities } = useConfig();

  const refreshPostEditURL = useRefreshPostEditURL(storyId);
  // Offset the date by one minute to accommodate for network latency.
  const hasFutureDate = isAfter(
    subMinutes(toDate(date, getOptions()), 1),
    toDate(new Date(), getOptions())
  );

  useEffect(() => {
    if (showDialog) {
      trackEvent('review_prepublish_checklist');
    }
  }, [showDialog]);

  const publish = useCallback(() => {
    trackEvent('publish_story', {
      status: hasFutureDate ? 'future' : 'publish',
      title_length: title.length,
    });

    setShowDialog(false);
    saveStory({ status: 'publish' });
    refreshPostEditURL();
  }, [refreshPostEditURL, saveStory, hasFutureDate, title]);

  const handlePublish = useCallback(() => {
    if (shouldReviewDialogBeSeen) {
      setShowDialog(true);
      return;
    }

    publish();
  }, [shouldReviewDialogBeSeen, publish]);

  const handleReviewChecklist = useCallback(() => {
    setShowDialog(false);
    // Focus Checklist Tab
    // Disable reason: If component unmounts, nothing bad can happen
    // eslint-disable-next-line @wordpress/react-no-unsafe-timeout
    setTimeout(() => focusChecklistTab(), TRANSITION_DURATION);
  }, [focusChecklistTab]);

  const handleClose = useCallback(() => setShowDialog(false), []);

  const text = hasFutureDate
    ? __('Schedule', 'web-stories')
    : __('Publish', 'web-stories');

  return (
    <>
      <ButtonWithChecklistWarning
        onClick={handlePublish}
        disabled={!capabilities?.hasPublishAction || isSaving || isUploading}
        text={text}
      />
      <ReviewChecklistDialog
        isOpen={showDialog}
        onIgnore={publish}
        onReview={handleReviewChecklist}
        onClose={handleClose}
      />
    </>
  );
}

export default Publish;
