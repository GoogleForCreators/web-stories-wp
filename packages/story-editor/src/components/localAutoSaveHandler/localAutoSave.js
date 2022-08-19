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
  THEME_CONSTANTS,
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

  const { story, pages, restoreLocalAutoSave } = useStory(
    ({ state, actions }) => ({
      story: state.story,
      pages: state.pages,
      restoreLocalAutoSave: actions.restoreLocalAutoSave,
    })
  );
  const { storyId, isNew } = story;

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
    if (!hasNewChanges || !localAutoSaveInterval || isUploading) {
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
  ]);

  const onClose = () => {
    sessionStore.deleteItemByKey(getSessionStorageKey(storyId, isNew));
    setBackup(null);
  };

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

    // @todo Should we also check for DB autosave once it's implemented in #1402?
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
