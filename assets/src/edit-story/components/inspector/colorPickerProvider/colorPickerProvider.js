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

/**
 * WordPress dependencies
 */
import { useState, useCallback, useRef } from '@wordpress/element';

/**
 * Internal dependencies
 */
import ColorPicker from '../../colorPicker';
import Context from './context';

const Outer = styled.div`
  height: 100%;
  position: relative;
`;

const ColorPickerWrapper = styled.div`
  position: absolute;
  right: 100%;
  top: ${({ top }) => `${top}px`};
`;

function ColorPickerProvider({ children }) {
  const [colorPickerState, setColorPickerState] = useState(null);

  const hasColorPicker = colorPickerState !== null;
  const colorPickerOffset = hasColorPicker && colorPickerState.offset;
  const colorPickerProps = hasColorPicker && colorPickerState.props;

  const ref = useRef();

  const showColorPickerAt = useCallback((node, props) => {
    const offset =
      node.getBoundingClientRect().y - ref.current.getBoundingClientRect().y;
    setColorPickerState({ offset, props });
  }, []);

  const hideColorPicker = useCallback(() => {
    setColorPickerState(null);
  }, []);

  const value = {
    state: {},
    actions: {
      showColorPickerAt,
      hideColorPicker,
    },
  };

  return (
    /* Any node is needed here to get proper offsets */
    <Outer ref={ref}>
      <Context.Provider value={value}>
        {hasColorPicker && (
          <ColorPickerWrapper top={colorPickerOffset}>
            <ColorPicker
              color={{ color: { r: 255, g: 255, b: 255 } }}
              onChange={() => {}}
              {...colorPickerProps}
            />
          </ColorPickerWrapper>
        )}
        {children}
      </Context.Provider>
    </Outer>
  );
}

ColorPickerProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default ColorPickerProvider;
