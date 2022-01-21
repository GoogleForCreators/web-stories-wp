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
import { createSolidFromString } from '@googleforcreators/patterns';
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
  '#fef9f1': `border: solid 1px ${color}`,
  '#fff8f2': `border: solid 1px ${color}`,
  '#f9f9f9': `border: solid 1px ${color}`,
  '#fcfcfc': `border: solid 1px ${color}`,
});

const ColorContainer = styled.div`
  display: flex;
`;

const Color = styled.div`
  ${({ theme, $backgroundColor, color, size, spacing }) => `
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    background-color: rgb(${$backgroundColor});
    ${borderLookup(theme.colors.border.defaultNormal)[color] || ''};

    & + & {
      margin-left: ${spacing || 10}px;
    }
  `}
`;

function ColorList({ colors, size, spacing }) {
  return (
    <ColorContainer>
      {colors.map(({ label, color }) => {
        const { r, g, b } = createSolidFromString(color).color;
        const backgroundColor = `${r}, ${g}, ${b}`;
        return (
          <Color
            key={color}
            size={size}
            spacing={spacing}
            color={color}
            $backgroundColor={backgroundColor}
            title={label}
            ariaLabel={label}
            data-testid="detail-template-color"
          />
        );
      })}
    </ColorContainer>
  );
}

ColorList.propTypes = {
  colors: PropTypes.arrayOf(ColorType).isRequired,
  size: PropTypes.number.isRequired,
  spacing: PropTypes.number,
};

export default ColorList;
