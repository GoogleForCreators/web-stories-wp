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
import { Button, BUTTON_TYPES } from '@googleforcreators/design-system';

const pictureCss = css`
  picture {
    display: block;
    & > img {
      display: block;
      height: 100%;
      width: 100%;
      object-fit: fill;
      border-radius: ${({ theme }) => theme.borders.radius.medium};
      border: ${({ theme }) =>
        `1px solid ${theme.colors.border.defaultNormal}`};
    }
  }
`;
export const GalleryContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: start;
`;

export const DisplayPage = styled.div`
  overflow: hidden;
  width: 38.6%;
  margin-left: 2.1%;

  ${pictureCss}

  @media screen and (min-width: 1600px) {
    width: 45.2%;
    margin-left: 2.4%;
  }
`;

DisplayPage.propTypes = {
  $isThreeRows: PropTypes.bool,
};

export const Thumbnails = styled.div`
  position: relative;
  display: grid;
  width: 52.3%;
  grid-template-columns: repeat(3, 1fr);
  column-gap: 8px;
  row-gap: 16px;
  margin-right: 16px;

  @media screen and (min-width: 1600px) {
    width: 59.3%;
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const ThumbnailButton = styled(Button).attrs({
  type: BUTTON_TYPES.PLAIN,
})`
  display: block;
  height: 100%;
  padding: 0;
  border: none;
  background-color: transparent;
  position: relative;
  &:active {
    background-color: transparent;
  }
  ${({ $isSelected, theme }) =>
    $isSelected &&
    css`
      &:after {
        content: '';
        position: absolute;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        display: block;
        top: 0;
        right: 0;
        border-radius: ${theme.borders.radius.medium};
        border: 4px solid ${theme.colors.interactiveBg.active};
      }
    `}
  ${pictureCss};
`;
ThumbnailButton.propTypes = {
  $isSelected: PropTypes.bool,
};
