/*
 * Copyright 2021 Google LLC
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
import styled, { css } from 'styled-components';

/**
 * Internal dependencies
 */
import {
  THUMBNAIL_DIMENSIONS,
  THUMBNAIL_SCRIM_CLASSNAME,
  THUMBNAIL_SHOW_ON_HOVER_FOCUS,
} from './constants';

/**
 * Set Scrim styles on button state here with the THUMBNAIL_SCRIM_CLASSNAME
 * since the Container is the only interactive element here.
 * The Scrim is separated from the Container button because sometimes there
 * are nested icons that need to be on top of the main content of a thumbnail.
 * And the contents of the button may not be able to be a background image
 * depending on the thumbnail type.
 */
export const Container = styled.button(
  ({ theme, $isError, $isOverflow }) => css`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${THUMBNAIL_DIMENSIONS.WIDTH}px;
    height: ${THUMBNAIL_DIMENSIONS.HEIGHT}px;
    padding: 0;
    outline: none;
    border: none;
    border-radius: ${theme.borders.radius.small};
    background-color: ${$isOverflow
      ? theme.colors.interactiveBg.secondaryNormal
      : 'transparent'};
    cursor: pointer;

    .${THUMBNAIL_SHOW_ON_HOVER_FOCUS} {
      display: none;
    }

    &:hover {
      .${THUMBNAIL_SHOW_ON_HOVER_FOCUS} {
        display: flex;
      }
    }
    ${$isError &&
    css`
      .${THUMBNAIL_SCRIM_CLASSNAME} {
        border: 1px solid ${theme.colors.border.negativeNormal};
        background-color: ${theme.colors.opacity.black24};
      }
      &:hover .${THUMBNAIL_SCRIM_CLASSNAME} {
        background-color: ${theme.colors.opacity.black24};
      }
    `}

    &:focus,
      &:focus-within {
      .${THUMBNAIL_SHOW_ON_HOVER_FOCUS} {
        display: flex;
      }
      .${THUMBNAIL_SCRIM_CLASSNAME} {
        background-color: ${theme.colors.opacity.black64};
        border: 1px solid
          ${theme.colors.border[$isError ? 'negativeNormal' : 'focus']};
      }
    }
  `
);
Container.propTypes = {
  $isError: PropTypes.bool,
};

/**
 * Backgrounds can be a few different things based on thumbnail types
 * all of which require some overriding in specific ways:
 * - video and image are going to be 1 <img> tag.
 * - shape is going to be 2 divs then an svg, the shape is a clipPath.
 * - text is going to be 1 div and an svg with a traditional path.
 * - page is going to harness the `PagePreview` component as a div rather than the default button. This requires 2 nested divs.
 * - page and shape, since they have some fun nesting going on have their own props to help legibility and why the styles are nested.
 */
export const Background = styled.div(
  ({ theme, $isShape, $isPage }) => css`
    width: 100%;
    height: 100%;
    display: flex;
    border-radius: ${theme.borders.radius.small};

    /*
    Only reach one level deep so that images and videos
    in stories are not affected.
    */
    & > img,
    & > video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: ${theme.borders.radius.small};
    }

    & > div {
      display: flex;
      height: 100%;
      margin: 0 auto;
      align-items: center;
      justify-content: center;
      align-self: center;
      color: ${theme.colors.fg.primary};
    }

    ${$isShape &&
    css`
      /* stylelint-disable-next-line */
      & > div {
        width: ${THUMBNAIL_DIMENSIONS.THUMBNAIL_SHAPE}px;
        height: ${THUMBNAIL_DIMENSIONS.THUMBNAIL_SHAPE}px;

        & > div {
          width: 100%;
          height: 100%;
        }
      }
    `}

    ${$isPage &&
    css`
      /* Specific overrides for PagePreview that is borrowed for checklist's thumbnails */
      .pagePreviewOverrides {
        border-color: none;

        &::after {
          content: none;
          border: none;
        }
      }
      /* stylelint-disable-next-line */
      & > div > div {
        width: 100%;
      }
    `}
  `
);
Background.propTypes = {
  $isPage: PropTypes.bool,
  $isShape: PropTypes.bool,
};

// The nested div here is to center a tooltip if one is present.
export const NestedIconContainer = styled.div(
  ({ theme, $isError }) => css`
    display: flex;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    z-index: 5;

    & > div {
      margin: auto;
      width: ${THUMBNAIL_DIMENSIONS.NESTED_ICON}px;
    }

    svg {
      width: 100%;
      height: auto;
      ${$isError &&
      css`
        color: ${theme.colors.fg.negative};
      `}
    }
  `
);
NestedIconContainer.propTypes = {
  $isError: PropTypes.bool,
};

// Keep scrim above intended background - PagePreviews have a z-index of 1.
export const Scrim = styled.div(
  ({ theme, $showDefaultBackground }) => css`
    position: absolute;
    box-sizing: border-box;
    top: 0;
    width: 100%;
    height: 100%;
    border: 1px solid transparent;
    border-radius: ${theme.borders.radius.small};
    z-index: 2;
    ${$showDefaultBackground &&
    css`
      background-color: ${theme.colors.opacity.black24};
    `};

    &:hover {
      background-color: ${theme.colors.opacity.black64};
    }
  `
);
Scrim.propTypes = {
  $showDefaultBackground: PropTypes.bool,
};
