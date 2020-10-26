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

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import { useUnits } from '../../units';
import { getBorderStyle, shouldDisplayBorder } from './utils';

const borderElementCSS = css`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  position: absolute;
`;

const Border = styled.div`
  ${borderElementCSS}
  &:after {
    content: ' ';
    ${({ color, left, top, right, bottom, position }) =>
      getBorderStyle({
        color,
        left,
        top,
        right,
        bottom,
        position,
      })}
  }
`;

export default function WithBorder({ element, previewMode = false, children }) {
  const { dataToEditorX } = useUnits((state) => ({
    dataToEditorX: state.actions.dataToEditorX,
    dataToEditorY: state.actions.dataToEditorY,
  }));
  if (!shouldDisplayBorder(element)) {
    return children;
  }
  let border = element.border;
  const { left, top, right, bottom } = border;

  // Border-width is not responsive but since preview is significantly smaller, we need it to be for that.
  if (previewMode) {
    border = {
      ...border,
      left: dataToEditorX(left),
      top: dataToEditorX(top),
      right: dataToEditorX(right),
      bottom: dataToEditorX(bottom),
    };
  }
  return (
    <Border {...border} previewMode={previewMode}>
      {children}
    </Border>
  );
}

WithBorder.propTypes = {
  element: StoryPropTypes.element.isRequired,
  children: PropTypes.node,
  previewMode: PropTypes.bool,
};
