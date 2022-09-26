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
import { useEffect, useRef, useCallback } from '@googleforcreators/react';
import { withOverlay, InOverlay } from '@googleforcreators/moveable';
import SAT from 'sat';

/**
 * Internal dependencies
 */
import { useStory, useCanvas } from '../../app';
import { STABLE_ARRAY } from '../../constants';
import useElementPolygon from '../../utils/useElementPolygon';

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
  const { selectedElements, clearSelection, setSelectedElementsById } =
    useStory(
      ({
        state: { selectedElements },
        actions: { clearSelection, setSelectedElementsById },
      }) => ({
        selectedElements,
        clearSelection,
        setSelectedElementsById,
      })
    );

  const { isEditing, nodesById, clearEditing } = useCanvas(
    ({ state: { isEditing, nodesById }, actions: { clearEditing } }) => {
      return {
        isEditing,
        nodesById,
        clearEditing,
      };
    }
  );

  const overlayRef = useRef(null);
  const lassoRef = useRef(null);
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
    const relativeX = x - offsetX;
    const relativeY = y - offsetY;

    lasso.style.left = `${relativeX}px`;
    lasso.style.top = `${relativeY}px`;
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
      startRef.current = [evt.pageX, evt.pageY];
      endRef.current = [evt.pageX, evt.pageY];
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
      const x2 = evt.pageX;
      const y2 = evt.pageY;
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

  const getElementPolygon = useElementPolygon();
  const selectIntersection = useCallback(
    ({ x: lx, y: ly, width: lw, height: lh }) => {
      const lassoP = new SAT.Box(new SAT.Vector(lx, ly), lw, lh).toPolygon();
      const newSelectedElementIds = currentPageElements
        // Skip background and locked elements
        .filter(({ isBackground, isLocked }) => !isBackground && !isLocked)
        .map(({ id, ...rest }) => {
          const elementP = getElementPolygon({ id, ...rest });
          return SAT.testPolygonPolygon(lassoP, elementP) ? id : null;
        })
        .filter((id) => id);
      setSelectedElementsById({
        elementIds: newSelectedElementIds,
        withLinked: true,
      });
    },
    [currentPageElements, setSelectedElementsById, getElementPolygon]
  );

  const onMouseUp = useCallback(() => {
    if (lassoModeRef.current === LassoMode.ON) {
      const [lx, ly, lwidth, lheight] = getLassoBox();
      clearSelection();
      clearEditing();
      selectIntersection({ x: lx, y: ly, width: lwidth, height: lheight });
    }
    lassoModeRef.current = LassoMode.OFF;
    updateLasso();
  }, [
    clearEditing,
    clearSelection,
    getLassoBox,
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
