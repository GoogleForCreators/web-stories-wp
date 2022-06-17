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
import { sprintf, __ } from '@googleforcreators/i18n';
import {
  useState,
  useCallback,
  useRef,
  useEffect,
} from '@googleforcreators/react';
import { useLiveRegion } from '@googleforcreators/design-system';

function useReordering(onPositionChange, numChildren) {
  const [isReordering, setIsReordering] = useState(false);
  const [currentSeparator, setCurrentSeparator] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [dragTarget, setDragTarget] = useState(null);

  const speak = useLiveRegion('assertive');
  const handleStartReordering = useCallback(
    ({ position: currentPos, onStartReordering = () => {} }) =>
      (evt) => {
        // Only allow reordering with non-modified left-click.
        // Modified (shift, meta, alt, ctrl) clicks are for selection.
        const isModified =
          evt.shiftKey || evt.metaKey || evt.ctrlKey || evt.altKey;
        // Right-clicks (button===2) are for context menu.
        const isLeftButton = evt.button === 0;
        if (!isModified && isLeftButton) {
          onStartReordering();
          setCurrentPosition(currentPos);
          setDragTarget(evt.target);
        }
      },
    []
  );

  const separator = useRef(null);
  useEffect(() => {
    separator.current = currentSeparator;
  }, [currentSeparator]);

  useEffect(() => {
    if (!dragTarget) {
      return undefined;
    }

    const onRelease = (evt) => {
      evt.preventDefault();
      if (separator.current !== null) {
        const newPosition = separator.current;
        const position =
          newPosition > currentPosition ? newPosition - 1 : newPosition;
        onPositionChange(currentPosition, position);
      }
      setDragTarget(null);
    };

    // only mark as reordering when starting to drag
    const onMove = () => setIsReordering(true);

    // abort on esc
    // TODO: rewrite to useKeyDown() once either is merged.
    const onAbort = (evt) => {
      if (evt.key === 'Escape') {
        setDragTarget(null);
        evt.stopPropagation();
      }
    };

    dragTarget.ownerDocument.addEventListener('pointerup', onRelease);
    dragTarget.ownerDocument.addEventListener('keydown', onAbort, true);
    dragTarget.addEventListener('pointermove', onMove);

    return () => {
      setCurrentSeparator(null);
      setIsReordering(false);
      dragTarget.removeEventListener('pointermove', onMove);
      dragTarget.ownerDocument.removeEventListener('pointerup', onRelease);
      dragTarget.ownerDocument.removeEventListener('keydown', onAbort, true);
    };
  }, [
    dragTarget,
    currentPosition,
    setCurrentSeparator,
    setIsReordering,
    onPositionChange,
  ]);

  useEffect(() => {
    if (isReordering && currentSeparator) {
      const position = numChildren - currentSeparator;
      const message = sprintf(
        /* translators: %d: new position. */
        __(
          'Reordering. Press Escape to abort. Release mouse to drop in position %d.',
          'web-stories'
        ),
        position
      );
      speak(message);
    }
  }, [isReordering, currentSeparator, numChildren, speak]);

  return {
    isReordering,
    currentSeparator,
    setCurrentSeparator,
    handleStartReordering,
  };
}

export default useReordering;
