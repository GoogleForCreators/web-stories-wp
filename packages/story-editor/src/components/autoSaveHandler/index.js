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

/**
 * Internal dependencies
 */
import { useConfig, useHistory, useStory } from '../../app';
import useIsUploadingToStory from '../../utils/useIsUploadingToStory';

function AutoSaveHandler() {
  const { autoSaveInterval } = useConfig();
  const {
    state: { hasNewChanges },
  } = useHistory();
  const { autoSave } = useStory(({ actions }) => ({
    autoSave: actions.autoSave,
  }));
  const isUploading = useIsUploadingToStory();

  // Cache it to make it stable in terms of the below timeout
  const cachedSaveStory = useRef(autoSave);
  useEffect(() => {
    cachedSaveStory.current = autoSave;
  }, [autoSave]);

  useEffect(() => {
    if (!hasNewChanges || !autoSaveInterval || isUploading) {
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
  }, [autoSaveInterval, hasNewChanges, isUploading]);

  return null;
}

export default AutoSaveHandler;
