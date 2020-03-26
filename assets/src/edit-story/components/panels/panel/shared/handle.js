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
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { rgba } from 'polished';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import useDragHandlers from '../useDragHandlers';
import useKeyboardHandlers from '../useKeyboardHandlers';

const Handle = styled.div`
  background-color: ${({ theme }) => rgba(theme.colors.bg.v0, 0.07)};
  border: 0;
  padding: 0;
  height: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: row-resize;
  user-select: none;
`;

const Bar = styled.div.attrs({
  tabIndex: 0,
})`
  background-color: ${({ theme }) => rgba(theme.colors.fg.v1, 0.1)};
  width: 36px;
  height: 4px;
  border-radius: 2px;
`;

function DragHandle({
  height,
  minHeight,
  maxHeight,
  handleHeightChange,
  handleExpandToHeightChange,
  handleDoubleClick,
}) {
  const handle = useRef();
  useDragHandlers(handle, handleHeightChange, handleExpandToHeightChange);
  useKeyboardHandlers(handle, handleHeightChange);

  return (
    <Handle ref={handle} onDoubleClick={handleDoubleClick}>
      <Bar
        role="slider"
        aria-orientation="vertical"
        aria-valuenow={height}
        aria-valuemin={minHeight}
        aria-valuemax={maxHeight}
        aria-label={__('Set panel height', 'web-stories')}
      />
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
};

export default DragHandle;
