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
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { useRef } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import useDragHandlers from '../useDragHandlers';
import useKeyboardHandlers from '../useKeyboardHandlers';

const HEIGHT = 8;

const Handle = styled.div`
  border: 0;
  padding: 0;
  height: ${HEIGHT}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: row-resize;
  user-select: none;
  position: absolute;
  ${({ $position }) => 'top' === $position && `top: 0`};
  ${({ $position }) => 'bottom' === $position && `bottom: 0`};
  left: 0;
  right: 0;
  width: 100%;

  ${({ $showFocusStyles }) =>
    $showFocusStyles &&
    css`
      border-bottom: 1px solid transparent;

      &:focus {
        border-color: ${({ theme }) => theme.colors.border.focus};
      }
    `};
`;

const DragBar = styled.div`
  position: absolute;
  width: 35px;
  height: 3px;
  top: ${HEIGHT - 4}px;
  background: ${({ theme }) => theme.colors.bg.quaternary};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  cursor: inherit;
`;

function DragHandle({
  height,
  minHeight,
  maxHeight,
  handleHeightChange,
  handleExpandToHeightChange,
  handleDoubleClick,
  position,
  showDragHandle,
  showFocusStyles = true,
  ...rest
}) {
  const handle = useRef();
  useDragHandlers(handle, handleHeightChange, handleExpandToHeightChange);
  useKeyboardHandlers(handle, handleHeightChange);

  return (
    // eslint-disable-next-line styled-components-a11y/click-events-have-key-events -- handled via useKeyboardHandlers.
    <Handle
      ref={handle}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={handleDoubleClick}
      tabIndex={0}
      $position={position}
      role="slider"
      aria-orientation="vertical"
      aria-valuenow={height}
      aria-valuemin={minHeight}
      aria-valuemax={maxHeight}
      aria-label={__('Set panel height', 'web-stories')}
      $showFocusStyles={showFocusStyles}
      {...rest}
    >
      {showDragHandle && <DragBar />}
    </Handle>
  );
}

DragHandle.propTypes = {
  handleHeightChange: PropTypes.func.isRequired,
  handleExpandToHeightChange: PropTypes.func.isRequired,
  handleDoubleClick: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired,
  minHeight: PropTypes.number.isRequired,
  maxHeight: PropTypes.number.isRequired,
  position: PropTypes.oneOf(['top', 'bottom']),
  showDragHandle: PropTypes.bool,
  showFocusStyles: PropTypes.bool,
};

DragHandle.defaultProps = {
  position: 'top',
};

export default DragHandle;
