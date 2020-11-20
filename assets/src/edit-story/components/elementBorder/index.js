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
import { useRef } from 'react';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../types';
import { useUnits } from '../../units';
import { useTransformHandler } from '../transform';
import {
  getBorderColor,
  getBorderStyle,
  isOutsideBorder,
  shouldDisplayBorder,
} from './utils';

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
  --element-border-color: ${({ color }) => getBorderColor({ color })};
  ${borderElementCSS}
  &:after {
    ${({ position }) =>
      !isOutsideBorder({ position }) &&
      `
      content: ' ';
    `}
    ${(props) => !isOutsideBorder(props) && getBorderStyle(props)}
    border-color: var(--element-border-color);
  }
}
`;

export default function WithBorder({ element, previewMode = false, children }) {
  const { dataToEditorX } = useUnits((state) => ({
    dataToEditorX: state.actions.dataToEditorX,
    dataToEditorY: state.actions.dataToEditorY,
  }));
  const ref = useRef(null);
  const { id } = element;

  useTransformHandler(id, (transform) => {
    const target = ref.current;
    if (target) {
      if (transform === null) {
        target.style.cssText = '';
      } else {
        const { color, style } = transform;
        if (color && style) {
          const {
            color: { r, g, b, a },
          } = color;
          target.style.setProperty(
            '--element-border-color',
            `rgba(${r}, ${g}, ${b}, ${a !== undefined ? a : 1})`
          );
        }
      }
    }
  });

  if (!shouldDisplayBorder(element)) {
    return children;
  }
  const { borderRadius, opacity } = element;
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
    <Border
      ref={ref}
      {...border}
      borderRadius={borderRadius}
      previewMode={previewMode}
      opacity={opacity}
    >
      {children}
    </Border>
  );
}

WithBorder.propTypes = {
  element: StoryPropTypes.element.isRequired,
  children: PropTypes.node,
  previewMode: PropTypes.bool,
};
