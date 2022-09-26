/*
 * Copyright 2021 Google LLC
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
import { __ } from '@googleforcreators/i18n';
import {
  Text,
  THEME_CONSTANTS,
  LOCAL_STORAGE_PREFIX,
  localStore,
} from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import { useCurrentUser } from '../../../../../app/currentUser';
import { useLocalMedia } from '../../../../../app/media';
import Dialog from '../../../../dialog';

const storageKey = LOCAL_STORAGE_PREFIX.VIDEO_OPTIMIZATION_DIALOG_DISMISSED;

function VideoOptimizationDialog() {
  const { isTranscoding } = useLocalMedia(({ state: { isTranscoding } }) => ({
    isTranscoding,
  }));

  const [isDialogDismissed, setIsDialogDismissed] = useState(
    Boolean(localStore.getItemByKey(storageKey))
  );

  const { updateCurrentUser } = useCurrentUser(({ actions }) => ({
    updateCurrentUser: actions.updateCurrentUser,
  }));

  const setIsDialogDismissedValue = useCallback((value) => {
    setIsDialogDismissed(value);
    localStore.setItemByKey(storageKey, value);
  }, []);

  const onDisable = useCallback(() => {
    updateCurrentUser({
      mediaOptimization: false,
    });
    setIsDialogDismissedValue(true);
  }, [updateCurrentUser, setIsDialogDismissedValue]);

  const onClose = useCallback(() => {
    setIsDialogDismissedValue(true);
  }, [setIsDialogDismissedValue]);

  const dialogTitle = __('Video optimization in progress', 'web-stories');
  const dialogDescription = __(
    'This process can’t be stopped once it begins. Optimization is automatically enabled for all videos to ensure smooth playback. You can disable optimization any time in Settings.',
    'web-stories'
  );

  return (
    <Dialog
      isOpen={isTranscoding && !isDialogDismissed}
      onClose={onClose}
      title={dialogTitle}
      onSecondary={onDisable}
      secondaryText={__('Disable optimization', 'web-stories')}
      onPrimary={onClose}
      primaryText={__('Sounds good', 'web-stories')}
    >
      <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        {dialogDescription}
      </Text>
    </Dialog>
  );
}

export default VideoOptimizationDialog;
