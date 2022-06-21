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
import styled from 'styled-components';
import {
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from '@googleforcreators/react';
import { PAGE_RATIO, useUnits } from '@googleforcreators/units';
import { withOverlay, InOverlay } from '@googleforcreators/moveable';

/**
 * Internal dependencies
 */
import { useStory, useCanvas } from '../../app';
import { STABLE_ARRAY } from '../../constants';

const LASSO_ACTIVE_THRESHOLD = 10;

const LassoMode = {
  OFF: 0,
  ON: 1,
  MAYBE: 2,
};

const Container = withOverlay(styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  user-select: none;
`);

const Lasso = styled.div`
  display: none;
  position: absolute;
  border: 1px dotted ${({ theme }) => theme.colors.border.selection};
  z-index: 1;
`;

function SelectionCanvas({ children }) {
  // Have page elements shallowly equaled for scenarios like animation
  // updates where elements don't change, but we get a new page elements
  // array
  const currentPageElements = useStory(
    ({ state }) => state.currentPage?.elements || STABLE_ARRAY
  );
  const { selectedElements, clearSelection } = useStory(
    ({ state: { selectedElements }, actions: { clearSelection } }) => ({
      selectedElements,
      clearSelection,
    })
  );

  const {
    fullbleedContainer,
    isEditing,
    nodesById,
    clearEditing,
    selectIntersection,
  } = useCanvas(
    ({
      state: { fullbleedContainer, isEditing, nodesById },
      actions: { clearEditing, selectIntersection },
    }) => {
      return {
        fullbleedContainer,
        isEditing,
        nodesById,
        clearEditing,
        selectIntersection,
      };
    }
  );

  const scrollContainer = useMemo(
    () => fullbleedContainer?.closest('[data-scroll-container]'),
    [fullbleedContainer]
  );

  const { editorToDataX, editorToDataY } = useUnits((state) => ({
    editorToDataX: state.actions.editorToDataX,
    editorToDataY: state.actions.editorToDataY,
  }));

  const overlayRef = useRef(null);
  const lassoRef = useRef(null);
  const offsetRef = useRef([0, 0]);
  const startRef = useRef([0, 0]);
  const endRef = useRef([0, 0]);
  const lassoModeRef = useRef(LassoMode.OFF);

  const getLassoBox = useCallback(() => {
    const [x1, y1] = startRef.current;
    const [x2, y2] = endRef.current;
    const x = Math.min(x1, x2);
    const y = Math.min(y1, y2);
    const w = Math.abs(x1 - x2);
    const h = Math.abs(y1 - y2);
    return [x, y, w, h];
  }, []);

  const updateLasso = useCallback(() => {
    const lasso = lassoRef.current;
    if (!lasso) {
      return;
    }
    const lassoMode = lassoModeRef.current;
    const [x, y, w, h] = getLassoBox();
    lasso.style.left = `${x}px`;
    lasso.style.top = `${y}px`;
    lasso.style.width = `${w}px`;
    lasso.style.height = `${h}px`;
    lasso.style.display = lassoMode === LassoMode.ON ? 'block' : 'none';
  }, [getLassoBox]);

  const onMouseDown = useCallback(
    (evt) => {
      // Selecting the background element should be handled at the frameElement level
      if (!nodesById[currentPageElements[0].id]?.contains(evt.target)) {
        if (selectedElements.length) {
          clearSelection();
        }
        if (isEditing) {
          clearEditing();
        }
      }
      const overlay = overlayRef.current;
      let offsetX = 0,
        offsetY = 0;
      for (
        let offsetNode = overlay;
        offsetNode;
        offsetNode = offsetNode.offsetParent
      ) {
        offsetX += offsetNode.offsetLeft;
        offsetY += offsetNode.offsetTop;
      }
      const x = evt.pageX - offsetX;
      const y = evt.pageY - offsetY;
      offsetRef.current = [offsetX, offsetY];
      startRef.current = [x, y];
      endRef.current = [x, y];
      lassoModeRef.current = LassoMode.MAYBE;
      updateLasso();
    },
    [
      clearEditing,
      clearSelection,
      currentPageElements,
      isEditing,
      nodesById,
      selectedElements.length,
      updateLasso,
    ]
  );

  const onMouseMove = useCallback(
    (evt) => {
      if (lassoModeRef.current === LassoMode.OFF) {
        return;
      }
      const [x1, y1] = startRef.current;
      const [offsetX, offsetY] = offsetRef.current;
      const x2 = evt.pageX - offsetX;
      const y2 = evt.pageY - offsetY;
      endRef.current[0] = x2;
      endRef.current[1] = y2;
      updateLasso();
      // Ignore clicks and unintentional selections
      if (Math.abs(x1 - x2) + Math.abs(y1 - y2) > LASSO_ACTIVE_THRESHOLD) {
        lassoModeRef.current = LassoMode.ON;
      }
    },
    [updateLasso]
  );

  const onMouseUp = useCallback(() => {
    if (lassoModeRef.current === LassoMode.ON) {
      const [lx, ly, lwidth, lheight] = getLassoBox();
      const { offsetLeft, offsetTop, offsetHeight, offsetWidth } =
        fullbleedContainer;
      const { offsetLeft: scrollLeft, offsetTop: scrollTop } = scrollContainer;
      // Offset from the fullbleed to the safe zone.
      const dx = offsetLeft + scrollLeft;
      const dy =
        offsetTop + scrollTop + (offsetHeight - offsetWidth / PAGE_RATIO) / 2;
      const x = editorToDataX(lx - dx);
      const y = editorToDataY(ly - dy);
      const width = editorToDataX(lwidth);
      const height = editorToDataY(lheight);
      clearSelection();
      clearEditing();
      selectIntersection({ x, y, width, height });
    }
    lassoModeRef.current = LassoMode.OFF;
    updateLasso();
  }, [
    clearEditing,
    clearSelection,
    editorToDataX,
    editorToDataY,
    fullbleedContainer,
    getLassoBox,
    scrollContainer,
    selectIntersection,
    updateLasso,
  ]);

  useEffect(() => {
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [onMouseUp]);

  useEffect(updateLasso);

  // data-fix-caret is for allowing caretRangeFromPoint to work in Safari.
  // See https://github.com/googleforcreators/web-stories-wp/issues/7745.
  return (
    <Container
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      data-fix-caret
    >
      {children}
      <InOverlay ref={overlayRef}>
        <Lasso ref={lassoRef} />
      </InOverlay>
    </Container>
  );
}

SelectionCanvas.propTypes = {
  children: PropTypes.node,
};

export default SelectionCanvas;
