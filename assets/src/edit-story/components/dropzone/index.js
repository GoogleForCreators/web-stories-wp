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
import { useRef, useState, useLayoutEffect } from 'react';

/**
 * Internal dependencies
 */
import { isDragType } from '../../utils/dragEvent';
import useDropZone from './useDropZone';

const DropZoneComponent = styled.div`
  position: relative;
  margin: 0;
  ${({ borderPosition, theme, highlightWidth, dragIndicatorOffset }) =>
    borderPosition &&
    `
		:after {
			height: 100%;
			top: 0;
			display: block;
			position: absolute;
			width: ${highlightWidth}px;
			background: ${theme.colors.action};
			content: '';
			${borderPosition}: -${highlightWidth / 2 + dragIndicatorOffset}px;
		}
	`}
`;

function DropZone({ children, onDrop, pageIndex, dragIndicatorOffset }) {
  const dropZoneElement = useRef(null);
  const [dropZone, setDropZone] = useState(null);
  const {
    actions: { registerDropZone, unregisterDropZone, resetHoverState },
    state: { hoveredDropZone },
  } = useDropZone();

  useLayoutEffect(() => {
    setDropZone({
      node: dropZoneElement.current,
    });
  }, [dropZoneElement]);

  useLayoutEffect(() => {
    registerDropZone(dropZone);
    return () => {
      unregisterDropZone(dropZone);
      setDropZone(null);
    };
  }, [dropZone, registerDropZone, unregisterDropZone]);

  const onDropHandler = (evt) => {
    resetHoverState();
    if (dropZoneElement.current) {
      const rect = dropZoneElement.current.getBoundingClientRect();
      // Get the relative position of the dropping point based on the dropzone.
      const relativePosition = {
        x:
          evt.clientX - rect.left < rect.right - evt.clientX ? 'left' : 'right',
        y:
          evt.clientY - rect.top < rect.bottom - evt.clientY ? 'top' : 'bottom',
      };
      if (isDragType(evt, 'page')) {
        onDrop(evt, { position: relativePosition, pageIndex });
      }
      // @todo Support for files when it becomes necessary.
    }
    evt.preventDefault();
  };

  const isDropZoneActive =
    dropZoneElement.current &&
    hoveredDropZone &&
    hoveredDropZone.node === dropZoneElement.current;
  // @todo Currently static, can be adjusted for other use cases.
  const highlightWidth = 4;
  return (
    <DropZoneComponent
      highlightWidth={highlightWidth}
      borderPosition={isDropZoneActive ? hoveredDropZone.position.x : null}
      ref={dropZoneElement}
      dragIndicatorOffset={dragIndicatorOffset || 0}
      onDrop={onDropHandler}
    >
      {children}
    </DropZoneComponent>
  );
}

DropZone.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  onDrop: PropTypes.func,
  pageIndex: PropTypes.number,
  dragIndicatorOffset: PropTypes.number,
};

export default DropZone;
