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
import { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { themeHelpers } from '@web-stories-wp/design-system';

export const GalleryContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: start;
`;

export const MiniCardButton = styled.button(
  ({ theme }) => css`
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    display: block;
    overflow: hidden;
    cursor: pointer;
    padding: 0;
    background-color: transparent;
    border: 1px solid ${theme.colors.border.defaultNormal};
    border-radius: ${theme.borders.radius.small};
    ${themeHelpers.focusableOutlineCSS(theme.colors.border.focus)};
  `
);
MiniCardButton.propTypes = {
  isSelected: PropTypes.bool,
};

export const DisplayPage = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border.defaultNormal};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  overflow: hidden;
  ${({ theme }) =>
    theme.numRows === 3
      ? css`
          width: 45.2%;
          margin-left: 2.4%;
        `
      : css`
          width: 38.6%;
          margin-left: 2.1%;
        `}
`;

const AspectSetter = styled.div`
  position: relative;
  height: 0;
  padding-bottom: ${({ aspect }) => aspect * 100}%;
`;
const AspectInner = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export const AspectRatio = forwardRef(function AspectRatio(
  { aspect = 1, children },
  ref
) {
  return (
    <AspectSetter aspect={aspect}>
      <AspectInner ref={ref}>{children}</AspectInner>
    </AspectSetter>
  );
});

AspectRatio.propTypes = {
  aspect: PropTypes.number,
  children: PropTypes.node,
};

export const Thumbnails = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: start;
  ${({ theme }) =>
    theme.numRows === 3
      ? css`
          width: 52.3%;
        `
      : css`
          width: 59.3%;
        `}
`;

export const Thumbnail = styled.div`
  position: relative;

  ${({ theme }) =>
    theme.numRows === 3
      ? css`
          width: 26%;
          margin: 0 7.1% 7.1% 0;
        `
      : css`
          width: 19.74%;
          margin: 0 5.26% 5.26% 0;
        `}

  :nth-last-child(-n + ${({ theme }) => theme.numRows}) {
    margin-bottom: 0;
  }
`;
