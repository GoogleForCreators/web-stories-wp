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
import { useCallback, useState } from 'react';
import { useFeatures } from 'flagged';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { trackEvent } from '../../../../tracking';
import { TRANSITION_DURATION } from '../../dialog';
import { useStory, useLocalMedia, useConfig } from '../../../app';
import useRefreshPostEditURL from '../../../utils/useRefreshPostEditURL';
import { Primary } from '../../button';
import WithTooltip from '../../tooltip';
import TitleMissingDialog from '../titleMissingDialog';
import useHeader from '../use';
import { usePrepublishChecklist } from '../../inspector/prepublish';
import { PRE_PUBLISH_MESSAGE_TYPES } from '../../../app/prepublish';

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

  const { checklist, refreshChecklist } = usePrepublishChecklist();
  const { showPrePublishTab } = useFeatures();

  const tooltip = showPrePublishTab
    ? checklist.some(({ type }) => PRE_PUBLISH_MESSAGE_TYPES.ERROR === type) &&
      __('There are items in the checklist to resolve', 'web-stories')
    : null;

  const refreshPostEditURL = useRefreshPostEditURL(storyId);
  const hasFutureDate = Date.now() < Date.parse(date);

  const publish = useCallback(() => {
    trackEvent('publish_story', 'editor', '', '', {
      status: hasFutureDate ? 'future' : 'publish',
    });

    setShowDialog(false);
    saveStory({ status: 'publish' });
    refreshPostEditURL();
  }, [refreshPostEditURL, saveStory, hasFutureDate]);

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

  const button = (
    <Primary
      onPointerEnter={refreshChecklist}
      onClick={handlePublish}
      isDisabled={!capabilities?.hasPublishAction || isSaving || isUploading}
    >
      {text}
    </Primary>
  );

  const wrappedWithTooltip = (
    <WithTooltip title={tooltip}>{button}</WithTooltip>
  );

  return (
    <>
      {tooltip ? wrappedWithTooltip : button}
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
