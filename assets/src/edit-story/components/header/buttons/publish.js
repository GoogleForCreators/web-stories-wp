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
import { TRANSITION_DURATION } from '../../dialog';
import { useStory, useLocalMedia, useConfig } from '../../../app';
import useRefreshPostEditURL from '../../../utils/useRefreshPostEditURL';
import TitleMissingDialog from '../titleMissingDialog';
import useHeader from '../use';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
} from '../../../../design-system/components/button';

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
  const { titleInput } = useHeader();
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
      trackEvent('missing_title_dialog');
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
    if (!title) {
      setShowDialog(true);
      return;
    }

    publish();
  }, [title, publish]);

  const fixTitle = useCallback(() => {
    setShowDialog(false);
    // Focus title input when dialog is closed
    // Disable reason: If component unmounts, nothing bad can happen
    // eslint-disable-next-line @wordpress/react-no-unsafe-timeout
    setTimeout(() => titleInput?.focus(), TRANSITION_DURATION);
  }, [titleInput]);

  const handleClose = useCallback(() => setShowDialog(false), []);

  const text = hasFutureDate
    ? __('Schedule', 'web-stories')
    : __('Publish', 'web-stories');

  return (
    <>
      <Button
        variant={BUTTON_VARIANTS.RECTANGLE}
        type={BUTTON_TYPES.PRIMARY}
        size={BUTTON_SIZES.SMALL}
        onClick={handlePublish}
        disabled={!capabilities?.hasPublishAction || isSaving || isUploading}
      >
        {text}
      </Button>
      <TitleMissingDialog
        open={Boolean(showDialog)}
        onIgnore={publish}
        onFix={fixTitle}
        onClose={handleClose}
      />
    </>
  );
}

export default Publish;
