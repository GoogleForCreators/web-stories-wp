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
 * Internal dependencies
 */
import { ColorType } from '../types';

const borderLookup = (color) => ({
  '#fff': `border: solid 1px ${color}`,
  '#ffffff': `border: solid 1px ${color}`,
  white: `border: solid 1px ${color}`,
});

const ColorContainer = styled.div`
  display: flex;
`;

const Color = styled.div`
  ${({ theme, color, size, spacing }) => `
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    background-color: ${color};
    ${borderLookup(theme.DEPRECATED_THEME.colors.gray50)[color] || ''};

    & + & {
      margin-left: ${spacing || 10}px;
    }
  `}
`;

function ColorList({ colors, size, spacing }) {
  return (
    <ColorContainer>
      {colors.map(({ label, color }) => (
        <Color
          key={color}
          size={size}
          spacing={spacing}
          color={color}
          title={label}
          ariaLabel={label}
        />
      ))}
    </ColorContainer>
  );
}

ColorList.propTypes = {
  colors: PropTypes.arrayOf(ColorType).isRequired,
  size: PropTypes.number.isRequired,
  spacing: PropTypes.number,
};

export default ColorList;
