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
import { useEffect, useRef } from 'react';

/**
 * Internal dependencies
 */
import { useStory } from '../../app';
import withOverlay from '../overlay/withOverlay';
import InOverlay from '../overlay';
import { useUnits } from '../../units';
import useCanvas from './useCanvas';

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
  border: 1px dotted ${({ theme }) => theme.colors.selection};
  z-index: 1;
`;

function SelectionCanvas({ children }) {
  const {
    actions: { clearSelection },
    state: { selectedElements, currentPage },
  } = useStory();
  const {
    state: { pageContainer, isEditing, nodesById },
    actions: { clearEditing, selectIntersection },
  } = useCanvas();
  const {
    actions: { editorToDataX, editorToDataY },
  } = useUnits();

  const overlayRef = useRef(null);
  const lassoRef = useRef(null);
  const offsetRef = useRef([0, 0]);
  const startRef = useRef([0, 0]);
  const endRef = useRef([0, 0]);
  const lassoModeRef = useRef(LassoMode.OFF);

  const getLassoBox = () => {
    const [x1, y1] = startRef.current;
    const [x2, y2] = endRef.current;
    const x = Math.min(x1, x2);
    const y = Math.min(y1, y2);
    const w = Math.abs(x1 - x2);
    const h = Math.abs(y1 - y2);
    return [x, y, w, h];
  };

  const updateLasso = () => {
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
  };

  const onMouseDown = (evt) => {
    // Selecting the background element should be handeled at the frameElement level
    if (!nodesById[currentPage.backgroundElementId].contains(evt.target)) {
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
  };

  const onMouseMove = (evt) => {
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
  };

  const onMouseUp = () => {
    if (lassoModeRef.current === LassoMode.ON) {
      const [lx, ly, lwidth, lheight] = getLassoBox();
      const x = editorToDataX(lx - pageContainer.offsetLeft);
      const y = editorToDataY(ly - pageContainer.offsetTop);
      const width = editorToDataX(lwidth);
      const height = editorToDataY(lheight);
      clearSelection();
      clearEditing();
      selectIntersection({ x, y, width, height });
    }
    lassoModeRef.current = LassoMode.OFF;
    updateLasso();
  };

  useEffect(updateLasso);

  return (
    <Container
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {children}
      <InOverlay ref={overlayRef}>
        <Lasso ref={lassoRef} />
      </InOverlay>
    </Container>
  );
}

SelectionCanvas.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default SelectionCanvas;
