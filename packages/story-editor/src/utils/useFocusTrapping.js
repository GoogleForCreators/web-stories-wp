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
import { useKeyDownEffect } from '@googleforcreators/design-system';

const getFocusableElements = (node) => {
  if (!node) {
    return [];
  }
  return [
    ...node.querySelectorAll(
      'a[href], button, textarea, input[type]:not([type="hidden"]), select'
    ),
  ].filter(
    (el) => !el.hasAttribute('disabled') && el.getAttribute('tabindex') !== '-1'
  );
};

function useFocusTrapping({ ref }) {
  const handleTab = (e) => {
    const focusableElements = getFocusableElements(ref.current);
    const firstEl = focusableElements[0];
    const lastEl = focusableElements[focusableElements.length - 1];

    if (!e.shiftKey && globalThis.document?.activeElement === lastEl) {
      firstEl.focus();
      e.preventDefault();
    } else if (e.shiftKey && globalThis.document?.activeElement === firstEl) {
      lastEl.focus();
      e.preventDefault();
    }
  };

  useKeyDownEffect(
    ref,
    { key: ['tab'], allowDefault: true, editable: true, shift: true },
    handleTab
  );
  useKeyDownEffect(
    ref,
    { key: ['tab'], allowDefault: true, editable: true },
    handleTab
  );
}

export default useFocusTrapping;
