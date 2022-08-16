/*
 * Copyright 2022 Google LLC
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
import { useEffect, useCallback, useState } from '@googleforcreators/react';
import {
  Button,
  BUTTON_TYPES,
  BUTTON_SIZES,
  THEME_CONSTANTS,
  Dialog,
  Text,
} from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { useConfig, useHistory, useStory } from '../../app';
import useIsUploadingToStory from '../../utils/useIsUploadingToStory';
import {deleteLocalAutosave, getLocalAutoSave, setLocalAutoSave} from './utils';

function LocalAutoSave() {
  const { localAutoSaveInterval = 15 } = useConfig();
  const {
    state: { hasNewChanges },
    actions: { stateToHistory },
  } = useHistory();
  const isUploading = useIsUploadingToStory();

  const { story, pages, capabilities } = useStory(({ state }) => ({
    story: state.story,
    capabilities: state.capabilities,
    pages: state.pages,
  }));
  const { storyId, isNew } = story;

  const [backup, setBackup] = useState(false);

  // Save the local autosave
  useEffect(() => {
    if (!hasNewChanges || !localAutoSaveInterval || isUploading) {
      return undefined;
    }

    // This is only a timeout (and not an interval), as `hasNewChanges` will come
    // back false after the save.
    // This timeout will thus be re-started when some new change occurs after an autosave.
    const timeout = setTimeout(
      //() => setLocalAutoSave(storyId, isNew, story, pages),
      () => {
        setLocalAutoSave(storyId, isNew, story, pages);
        console.log('saving');
      },
      localAutoSaveInterval * 1000
    );

    return () => clearTimeout(timeout);
  }, [
    localAutoSaveInterval,
    hasNewChanges,
    isUploading,
    pages,
    story,
    storyId,
    isNew,
  ]);

  const onClose = () => {
    deleteLocalAutosave(storyId, isNew);
    setBackup(false);
  };

  const autoSaveHasChanges = useCallback(
    (existingAutoSave) => {
      return (
        JSON.stringify(existingAutoSave.pages) !== JSON.stringify(pages) &&
        JSON.stringify(existingAutoSave.story) !== JSON.stringify(story)
      );
    },
    [pages, story]
  );

  // Display
  useEffect(() => {
    const existingAutoSave = getLocalAutoSave(storyId, isNew);
    if (!existingAutoSave) {
      return;
    }

    // If we have an autosave and it differs from the current state.
    if (autoSaveHasChanges(existingAutoSave)) {
      setBackup(existingAutoSave);
      return;
    }

    // Otherwise, delete the autosave.
    console.log('deleting');
    deleteLocalAutosave(storyId, isNew);
  }, [autoSaveHasChanges, isNew, setBackup, storyId]);

  if (!backup) {
    return null;
  }

  const restoreBackup = () => {
    console.log('restoring');
    stateToHistory({
      story,
      current: pages[0],
      selection: [],
      pages,
      capabilities,
    });
    deleteLocalAutosave(storyId, isNew);
    setBackup(false);
  };

  return (
    <Dialog
      isOpen
      title={__('AutoSave', 'web-stories')}
      secondaryText={__('Dismiss', 'web-stories')}
      onClose={onClose}
      actions={
        <>
          <Button
            type={BUTTON_TYPES.TERTIARY}
            size={BUTTON_SIZES.SMALL}
            onClick={() => onClose()}
          >
            {__('Dismiss', 'web-stories')}
          </Button>
          <Button
            type={BUTTON_TYPES.PRIMARY}
            size={BUTTON_SIZES.SMALL}
            onClick={() => restoreBackup()}
          >
            {__('Restore Backup', 'web-stories')}
          </Button>
        </>
      }
    >
      <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        {__(
          'The backup of this story in your browser is different from the current version.',
          'web-stories'
        )}
      </Text>
    </Dialog>
  );
}

export default LocalAutoSave;
