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
import { useEffect } from 'react';

/**
 * Internal dependencies
 */
import { useConfig, useHistory, useLocalMedia, useStory } from '../../app';

function AutoSaveHandler() {
  const { autoSaveInterval } = useConfig();
  const {
    state: { hasNewChanges },
  } = useHistory();
  const { status, saveStory } = useStory(
    ({
      state: {
        story: { status },
      },
      actions: { saveStory },
    }) => ({
      status,
      saveStory,
    })
  );
  const { isUploading } = useLocalMedia((state) => ({
    isUploading: state.state.isUploading,
  }));

  const isDraft = 'draft' === status;

  useEffect(() => {
    // @todo The isDraft check is temporary to ensure only draft gets auto-saved,
    // until the logic for other statuses has been decided.
    if (!isDraft || !hasNewChanges || !autoSaveInterval || isUploading) {
      return undefined;
    }
    let timeout = setTimeout(() => {
      saveStory();
    }, autoSaveInterval * 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [
    autoSaveInterval,
    isDraft,
    saveStory,
    status,
    hasNewChanges,
    isUploading,
  ]);

  return null;
}

export default AutoSaveHandler;
