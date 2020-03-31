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
import PropTypes from 'prop-types';
import { useState, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { sprintf, __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import useLiveRegion from '../../utils/useLiveRegion';
import Context from './context';

const REORDER_MESSAGE = __(
  /* translators: d: new position. */
  'Reordering. Press Escape to abort. Release mouse to drop in position %d.',
  'web-stories'
);

const ReorderableContainer = styled.div.attrs({ role: 'listbox' })`
  display: flex;
`;

function Reorderable({ children, onPositionChange = () => {}, ...props }) {
  const [isReordering, setIsReordering] = useState(false);
  const [currentSeparator, setCurrentSeparator] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [dragTarget, setDragTarget] = useState(null);

  const speak = useLiveRegion('assertive');
  const handleStartReordering = useCallback(
    ({ position: currentPos, onStartReordering = () => {} }) => (evt) => {
      // Only allow reordering with non-modified click on non-background element.
      // Modified (shift+ or meta+) clicks are for selection.
      if (!evt.shiftKey && !evt.metaKey) {
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
      const position = children.length - currentSeparator;
      const message = sprintf(REORDER_MESSAGE, position);
      speak(message);
    }
  }, [
    isReordering,
    currentSeparator,
    children.length,
    onPositionChange,
    speak,
  ]);

  const state = {
    state: {
      isReordering,
      currentSeparator,
    },
    actions: {
      setCurrentSeparator,
      setIsReordering,
      handleStartReordering,
    },
  };

  return (
    <Context.Provider value={state}>
      <ReorderableContainer {...props}>{children}</ReorderableContainer>
    </Context.Provider>
  );
}

Reorderable.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  onPositionChange: PropTypes.func.isRequired,
};

export default Reorderable;
