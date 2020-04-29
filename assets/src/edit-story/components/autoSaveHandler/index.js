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
import { useEffect, useState } from 'react';

/**
 * Internal dependencies
 */
import { useConfig, useHistory, useStory } from '../../app';

function AutoSaveHandler() {
  const { autoSaveInterval } = useConfig();
  const {
    state: { hasNewChanges },
  } = useHistory();
  const {
    state: {
      story: { status },
    },
    actions: { autoSave, saveStory },
  } = useStory();

  const [didAutoSave, setDidAutoSave] = useState(false);
  const isDraft = 'draft' === status;

  // If autoSaveInterval is set to 0 or not defined, don't.
  if (!autoSaveInterval) {
    return null;
  }

  useEffect(() => {
    // If there are new changes, mark autoSave as not done.
    if (hasNewChanges && didAutoSave) {
      setDidAutoSave(false);
    }
  }, [hasNewChanges, didAutoSave]);

  useEffect(() => {
    let timeout;

    // @todo The isDraft check is temporary to ensure only draft gets auto-saved,
    // until the logic for other statuses has been decided.
    if (isDraft && !didAutoSave && hasNewChanges) {
      timeout = setTimeout(() => {
        const update = isDraft ? saveStory : autoSave;
        update();
        setDidAutoSave(true);
      }, 2000);
    }

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [
    autoSave,
    autoSaveInterval,
    didAutoSave,
    isDraft,
    saveStory,
    status,
    hasNewChanges,
  ]);

  return null;
}

export default AutoSaveHandler;
