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
import { useMemo } from 'react';

/**
 * Internal dependencies
 */
import getKeyboardShortcuts from './getKeyboardShortcuts';

function useKeyboardShortcuts() {
  const keyboardShortcuts = useMemo(() => getKeyboardShortcuts(), []);
  // Filter out disabled keyboard shortcuts for headers, panels, sections
  const { headers, landmarks, sections } = useMemo(
    () => ({
      header: keyboardShortcuts.headers,
      landmarks: keyboardShortcuts.landmarks.filter((o) => !o.disabled),
      sections: keyboardShortcuts.sections.map((section) => ({
        ...section,
        commands: section.commands.filter((o) => !o.disabled),
      })),
    }),
    [keyboardShortcuts]
  );

  return { headers, landmarks, sections };
}

export default useKeyboardShortcuts;
