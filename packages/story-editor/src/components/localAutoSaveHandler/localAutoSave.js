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
import { useEffect, useState, useRef } from '@googleforcreators/react';
import {
  Button,
  BUTTON_TYPES,
  BUTTON_SIZES,
  TextSize,
  Text,
  sessionStore,
} from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { useConfig, useHistory, useStory } from '../../app';
import useIsUploadingToStory from '../../utils/useIsUploadingToStory';
import Dialog from '../dialog';
import getSessionStorageKey from '../../utils/getSessionStorageKey';

function LocalAutoSave() {
  const { localAutoSaveInterval = 15 } = useConfig();
  const {
    state: { hasNewChanges },
  } = useHistory();
  const isUploading = useIsUploadingToStory();
  const { isAutoSavingStory } = useStory(({ state }) => ({
    isAutoSavingStory: state.meta.isAutoSavingStory,
  }));

  const { story, pages, restoreLocalAutoSave } = useStory(
    ({ state, actions }) => ({
      story: state.story,
      pages: state.pages,
      restoreLocalAutoSave: actions.restoreLocalAutoSave,
    })
  );
  const { storyId, status } = story;
  const isNew = 'auto-draft' === status;

  const [backup, setBackup] = useState(null);

  // Store into ref for not triggering autosave display when these change.
  const storyRef = useRef();
  const pagesRef = useRef();
  useEffect(() => {
    storyRef.current = story;
    pagesRef.current = pages;
  }, [story, pages]);

  // Save the local autosave.
  useEffect(() => {
    if (
      !hasNewChanges ||
      !localAutoSaveInterval ||
      isUploading ||
      isAutoSavingStory
    ) {
      return undefined;
    }

    // This is only a timeout (and not an interval), as `hasNewChanges` will come
    // back false after the save.
    // This timeout will thus be re-started when some new change occurs after an autosave.
    const timeout = setTimeout(
      () =>
        sessionStore.setItemByKey(getSessionStorageKey(storyId, isNew), {
          story,
          pages,
        }),
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
    isAutoSavingStory,
  ]);

  const onClose = () => {
    sessionStore.deleteItemByKey(getSessionStorageKey(storyId, isNew));
    setBackup(null);
  };

  const didAutoSaveTracker = useRef(isAutoSavingStory);
  useEffect(() => {
    if (isAutoSavingStory) {
      didAutoSaveTracker.current = true;
      // If we auto-saved to DB before but are not auto-saving anymore, let's delete the local backup.
      // No need for both local and DB backup together.
    } else if (didAutoSaveTracker.current && !backup) {
      sessionStore.deleteItemByKey(getSessionStorageKey(storyId, false));
      didAutoSaveTracker.current = false;
    }
  }, [isAutoSavingStory, backup, storyId]);

  const hadNewChangesTracker = useRef(false);
  const wasNewTracker = useRef(isNew);
  useEffect(() => {
    // If we have new changes, track that we had new changes.
    if (hasNewChanges) {
      hadNewChangesTracker.current = true;
      // If we don't have new changes but had before, we are in a saved state. Delete existing storage.
      // Let's not delete the auto-draft if the restore message is currently displayed.
    } else if (hadNewChangesTracker.current && !backup) {
      if (wasNewTracker.current) {
        sessionStore.deleteItemByKey(getSessionStorageKey(null, true));
      } else {
        sessionStore.deleteItemByKey(getSessionStorageKey(storyId, false));
      }
      hadNewChangesTracker.current = false;
      wasNewTracker.current = isNew;
    }
  }, [hasNewChanges, backup, storyId, isNew]);

  // Display
  useEffect(() => {
    const existingAutoSave = sessionStore.getItemByKey(
      getSessionStorageKey(storyId, isNew)
    );
    if (!existingAutoSave) {
      return;
    }

    const autoSaveHasChanges =
      JSON.stringify(existingAutoSave.pages) !==
        JSON.stringify(pagesRef.current) &&
      JSON.stringify(existingAutoSave.story) !==
        JSON.stringify(storyRef.current);

    // If we have an autosave and it differs from the current state.
    if (autoSaveHasChanges) {
      setBackup(existingAutoSave);
      return;
    }

    // Otherwise, delete the autosave.
    sessionStore.deleteItemByKey(getSessionStorageKey(storyId, isNew));
  }, [setBackup, isNew, storyId]);

  if (!backup) {
    return null;
  }

  const restoreBackup = () => {
    restoreLocalAutoSave();
    sessionStore.deleteItemByKey(getSessionStorageKey(storyId, isNew));
    setBackup(null);
  };

  return (
    <Dialog
      isOpen
      secondaryText={__('Dismiss', 'web-stories')}
      onClose={onClose}
      actions={
        <>
          <Button
            type={BUTTON_TYPES.TERTIARY}
            size={BUTTON_SIZES.SMALL}
            onClick={onClose}
          >
            {__('Dismiss', 'web-stories')}
          </Button>
          <Button
            type={BUTTON_TYPES.PRIMARY}
            size={BUTTON_SIZES.SMALL}
            onClick={restoreBackup}
          >
            {__('Restore Backup', 'web-stories')}
          </Button>
        </>
      }
    >
      <Text.Paragraph size={TextSize.Small}>
        {__(
          'The backup of this story in your browser is different from the current version.',
          'web-stories'
        )}
      </Text.Paragraph>
    </Dialog>
  );
}

export default LocalAutoSave;
