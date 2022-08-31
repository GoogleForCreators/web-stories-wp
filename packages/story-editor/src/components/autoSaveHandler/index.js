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
import { useEffect, useRef } from '@googleforcreators/react';
import { useFeature } from 'flagged';

/**
 * Internal dependencies
 */
import { useConfig, useHistory, useStory } from '../../app';
import useIsUploadingToStory from '../../utils/useIsUploadingToStory';

function AutoSaveHandler() {
  const improvedAutosaves = useFeature('improvedAutosaves');
  const { autoSaveInterval } = useConfig();
  const {
    state: { hasNewChanges },
  } = useHistory();
  const { status, saveStory, autoSave } = useStory(({ state, actions }) => ({
    autoSave: actions.autoSave,
    saveStory: actions.saveStory,
    isDraft: state.status,
  }));
  const isUploading = useIsUploadingToStory();

  const isDraft = 'draft' === status || !status;

  const save = improvedAutosaves ? autoSave : saveStory;

  // Cache it to make it stable in terms of the below timeout
  const cachedSaveStory = useRef(save);
  useEffect(() => {
    cachedSaveStory.current = save;
  }, [save]);

  useEffect(() => {
    // TODO: Remove isDraft check when improvedAutosaves gets enabled by default.
    if (
      (!isDraft && !improvedAutosaves) ||
      !hasNewChanges ||
      !autoSaveInterval ||
      isUploading
    ) {
      return undefined;
    }
    // This is only a timeout (and not an interval), as `hasNewChanges` will come
    // back false after the save.
    // This timeout will thus be re-started when some new change occurs after an autosave.
    const timeout = setTimeout(
      () => cachedSaveStory.current(),
      autoSaveInterval * 1000
    );

    return () => clearTimeout(timeout);
  }, [
    autoSaveInterval,
    isDraft,
    improvedAutosaves,
    hasNewChanges,
    isUploading,
  ]);

  return null;
}

export default AutoSaveHandler;
