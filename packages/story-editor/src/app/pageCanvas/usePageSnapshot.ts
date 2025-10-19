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
import {
  useState,
  useCallback,
  useRef,
  shallowEqual,
} from '@googleforcreators/react';
import type { Element, Page } from '@googleforcreators/elements';
import type { Pattern } from '@googleforcreators/patterns';

/**
 * @typedef {import('@googleforcreators/elements').Page} Page
 */

interface SnapShot {
  elements: Element[];
  backgroundColor: Pattern;
  canvas: HTMLCanvasElement;
}
/**
 * Cache that holds 1 generated canvas for a page partial.
 */
function usePageSnapshot() {
  // limit exclusion canvas cache to 1 entry so that our memory doesn't
  // explode from all possible element exclusion combinations
  const [snapShot, _setSnapshot] = useState<SnapShot | null>(null);
  const snapshotRef = useRef(snapShot);
  // eslint-disable-next-line react-hooks/refs -- FIXME
  snapshotRef.current = snapShot;

  /**
   * Takes a story page and returns a canvas from the cache if
   * the requested page matches the cache, returns null if there's
   * a mismatch with the existing cache.
   *
   * This function maintains a stable reference throughout the life of this hook.
   *
   * @param {Page} page - requested page
   * @return {HTMLCanvasElement | null}
   */
  const getSnapshotCanvas = useCallback((page: Page) => {
    if (
      page.backgroundColor === snapshotRef.current?.backgroundColor &&
      shallowEqual(page.elements, snapshotRef.current?.elements)
    ) {
      return snapshotRef.current.canvas;
    }

    return null;
  }, []);

  /**
   * Sets the snapshots canvas relative to the supplied page.
   *
   * This function maintains a stable reference throughout the life of this hook.
   *
   * @param {Object} args
   * @param {Page} args.page - story page
   * @param {HTMLCanvasElement} args.canvas - generated canvas from the story page
   * @return {void}
   */
  const setSnapshot = useCallback(
    ({ page, canvas }: { page: Page; canvas: HTMLCanvasElement }) => {
      _setSnapshot({
        elements: page.elements,
        backgroundColor: page.backgroundColor,
        canvas,
      });
    },
    []
  );

  return {
    setSnapshot,
    getSnapshotCanvas,
  };
}

export default usePageSnapshot;
