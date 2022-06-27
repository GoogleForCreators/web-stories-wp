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
import { useCallback, useEffect, useRef } from '@googleforcreators/react';

/**
 * Add messages to an ARIA live region.
 *
 * It’s possible that all the region content will be announced after an update
 * if the ARIA live region is too large.
 *
 * Please only provide users with just a simple, concise message.
 *
 * @param {?string} politeness Optional. Politeness. Either 'polite', or 'assertive'. Default 'polite'.
 * @return {Function} Function to speak a message.
 */
function useLiveRegion(politeness = 'polite') {
  const elementRef = useRef();

  const ensureContainerExists = useCallback(() => {
    if (elementRef.current) {
      return () => {
        document.body.removeChild(elementRef.current);
        elementRef.current = null;
      };
    }

    const containerId = 'web-stories-aria-live-region-' + politeness;

    const existingContainer =
      globalThis?.document?.getElementById(containerId) || null;

    if (existingContainer) {
      elementRef.current = existingContainer;
      return () => {
        elementRef.current = null;
      };
    }

    const container = globalThis?.document?.createElement('div') || null;
    container.id = containerId;
    container.className = 'web-stories-aria-live-region';

    container.setAttribute(
      'style',
      'position: absolute;' +
        'margin: -1px;' +
        'padding: 0;' +
        'height: 1px;' +
        'width: 1px;' +
        'overflow: hidden;' +
        'clip: rect(1px, 1px, 1px, 1px);' +
        '-webkit-clip-path: inset(50%);' +
        'clip-path: inset(50%);' +
        'border: 0;' +
        'word-wrap: normal !important;'
    );
    container.setAttribute('aria-live', politeness);
    container.setAttribute('aria-relevant', 'additions text');
    container.setAttribute('aria-atomic', 'true');

    globalThis?.document?.body?.appendChild(container);

    elementRef.current = container;

    return () => {
      globalThis?.document?.body?.removeChild(container);
      elementRef.current = null;
    };
  }, [politeness]);

  useEffect(ensureContainerExists, [ensureContainerExists]);

  /**
   * Add message to aria live region so it can be announced by
   * a screen reader.
   */
  const speak = useCallback(
    (message) => {
      ensureContainerExists();

      // Clear any existing messages.
      const regions = document.querySelectorAll(
        '.web-stories-aria-live-region'
      );
      for (const region of regions) {
        region.textContent = '';
      }

      elementRef.current.textContent = message;
    },
    [ensureContainerExists]
  );

  return speak;
}

export default useLiveRegion;
