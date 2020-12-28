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

/**
 * WordPress dependencies
 */
import { Circle, Path, Rect, SVG } from '@wordpress/components';

// Icons for block types.
export const LATESTS_STORIES_BLOCK_ICON = (
  <SVG
    width="31"
    height="42"
    viewBox="0 0 31 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Rect
      x="1"
      y="1"
      width="29"
      height="40"
      rx="1"
      stroke="#347BB5"
      strokeWidth="2"
    />
    <Rect x="6" y="27" width="19" height="2" fill="#347BB5" />
    <Rect x="6" y="31" width="4" height="2" fill="#347BB5" />
  </SVG>
);

export const SELECTED_STORIES_BLOCK_ICON = (
  <SVG
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Circle cx="16" cy="16" r="15" stroke="#347BB5" strokeWidth="2" />
    <Path
      d="M16 9.26315V16M16 22.7368V16M16 16H9.26315M16 16H22.7368"
      stroke="#347BB5"
      strokeWidth="2"
    />
  </SVG>
);

export const EMBED_STORY_BLOCK_ICON = (
  <SVG
    width="32"
    height="16"
    viewBox="0 0 32 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      d="M14 1H8C4.13401 1 1 4.13401 1 8V8C1 11.866 4.13401 15 8 15H14"
      stroke="#347BB5"
      strokeWidth="2"
    />
    <Path
      d="M18 1H24C27.866 1 31 4.13401 31 8V8C31 11.866 27.866 15 24 15H18"
      stroke="#347BB5"
      strokeWidth="2"
    />
    <Path d="M9 8H22.5" stroke="#347BB5" strokeWidth="2" />
  </SVG>
);

const Icon = styled.svg`
  .is-pressed & circle {
    stroke: black;
  }
`;

// Icons for view types.
export const CAROUSEL_VIEW_TYPE_ICON = (
  <Icon
    width="18"
    height="14"
    viewBox="0 0 18 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="10" height="14" transform="matrix(1 0 0 -1 4 14)" />
    <rect width="2" height="10" transform="matrix(1 0 0 -1 16 12)" />
    <rect width="2" height="10" transform="matrix(1 0 0 -1 0 12)" />
  </Icon>
);

export const CIRCLES_VIEW_TYPE_ICON = (
  <Icon
    width="23"
    height="18"
    viewBox="0 0 23 18"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Circle r="3" transform="matrix(1 0 0 -1 20 9)" />
    <Circle r="3" transform="matrix(1 0 0 -1 3 9)" />
    <Circle
      r="7.1"
      transform="matrix(1 0 0 -1 12 9)"
      stroke="white"
      strokeWidth="2.2"
    />
  </Icon>
);

export const GRID_VIEW_TYPE_ICON = (
  <Icon
    width="12"
    height="14"
    viewBox="0 0 12 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="5" height="6" />
    <rect y="8" width="5" height="6" />
    <rect x="7" width="5" height="6" />
    <rect x="7" y="8" width="5" height="6" />
  </Icon>
);

export const LIST_VIEW_TYPE_ICON = (
  <Icon
    width="12"
    height="13"
    viewBox="0 0 12 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="12" height="3" />
    <rect y="5" width="12" height="3" />
    <rect y="10" width="12" height="3" />
  </Icon>
);

// Configuration panel view type icons.
export const BOX_CAROUSEL_CONFIG_ICON = (
  <SVG
    width="26"
    height="20"
    viewBox="0 0 26 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Rect x="7" y="1" width="12" height="18" stroke="#347BB5" strokeWidth="2" />
    <Rect x="24" y="2" width="2" height="16" fill="#347BB5" />
    <Rect y="2" width="2" height="16" fill="#347BB5" />
  </SVG>
);

export const LIST_VIEW_CONFIG_ICON = (
  <SVG
    width="22"
    height="26"
    viewBox="0 0 22 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Rect x="1" y="1" width="20" height="4" stroke="#347BB5" strokeWidth="2" />
    <Rect x="1" y="11" width="20" height="4" stroke="#347BB5" strokeWidth="2" />
    <Rect x="1" y="21" width="20" height="4" stroke="#347BB5" strokeWidth="2" />
  </SVG>
);

export const CIRCLE_CAROUSEL_CONFIG_ICON = (
  <SVG
    width="42"
    height="24"
    viewBox="0 0 42 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="21"
      cy="12"
      r="11"
      fill="white"
      stroke="#347BB5"
      strokeWidth="2"
    />
    <mask id="path-2-inside-1" fill="white">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M34.8033 17.8807C35.5736 16.0749 36 14.0872 36 12C36 9.91277 35.5736 7.9251 34.8033 6.11933C35.19 6.04108 35.5902 6 36 6C39.3137 6 42 8.68629 42 12C42 15.3137 39.3137 18 36 18C35.5902 18 35.19 17.9589 34.8033 17.8807Z"
      />
    </mask>
    <path
      d="M34.8033 17.8807L32.9637 17.0959L32.0005 19.354L34.4066 19.8409L34.8033 17.8807ZM34.8033 6.11933L34.4066 4.15908L32.0005 4.64604L32.9637 6.90407L34.8033 6.11933ZM34 12C34 13.8126 33.6301 15.5337 32.9637 17.0959L36.643 18.6654C37.5172 16.6161 38 14.3618 38 12H34ZM32.9637 6.90407C33.6301 8.46629 34 10.1874 34 12H38C38 9.63816 37.5172 7.38392 36.643 5.3346L32.9637 6.90407ZM35.2001 8.07959C35.4569 8.02761 35.7242 8 36 8V4C35.4562 4 34.9232 4.05454 34.4066 4.15908L35.2001 8.07959ZM36 8C38.2091 8 40 9.79086 40 12H44C44 7.58172 40.4182 4 36 4V8ZM40 12C40 14.2091 38.2091 16 36 16V20C40.4182 20 44 16.4183 44 12H40ZM36 16C35.7242 16 35.4569 15.9724 35.2001 15.9204L34.4066 19.8409C34.9231 19.9455 35.4562 20 36 20V16Z"
      fill="#347BB5"
      mask="url(#path-2-inside-1)"
    />
    <mask id="path-4-inside-2" fill="white">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.19661 6.11934C6.80993 6.04108 6.40976 6 6 6C2.68629 6 0 8.68629 0 12C0 15.3137 2.68629 18 6 18C6.40976 18 6.80993 17.9589 7.19661 17.8807C6.42631 16.0749 6 14.0872 6 12C6 9.91277 6.42631 7.92511 7.19661 6.11934Z"
      />
    </mask>
    <path
      d="M7.19661 6.11934L9.03623 6.90407L9.99945 4.64604L7.59334 4.15908L7.19661 6.11934ZM7.19661 17.8807L7.59334 19.8409L9.99945 19.354L9.03623 17.0959L7.19661 17.8807ZM6 8C6.27577 8 6.54305 8.02761 6.79988 8.07959L7.59334 4.15908C7.07681 4.05454 6.54375 4 6 4V8ZM2 12C2 9.79086 3.79086 8 6 8V4C1.58172 4 -2 7.58172 -2 12H2ZM6 16C3.79086 16 2 14.2091 2 12H-2C-2 16.4183 1.58172 20 6 20V16ZM6.79988 15.9204C6.54305 15.9724 6.27577 16 6 16V20C6.54375 20 7.07681 19.9455 7.59334 19.8409L6.79988 15.9204ZM9.03623 17.0959C8.36982 15.5337 8 13.8126 8 12H4C4 14.3618 4.4828 16.6161 5.35699 18.6654L9.03623 17.0959ZM8 12C8 10.1874 8.36982 8.46629 9.03623 6.90407L5.35699 5.3346C4.4828 7.38392 4 9.63816 4 12H8Z"
      fill="#347BB5"
      mask="url(#path-4-inside-2)"
    />
  </SVG>
);

export const GRID_VIEW_CONFIG_ICON = (
  <SVG
    width="20"
    height="27"
    viewBox="0 0 20 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="1"
      y="1"
      width="6.46154"
      height="9.53846"
      stroke="#347BB5"
      strokeWidth="2"
    />
    <rect
      x="1"
      y="15.6154"
      width="6.46154"
      height="9.53846"
      stroke="#347BB5"
      strokeWidth="2"
    />
    <rect
      x="12.5385"
      y="1"
      width="6.46154"
      height="9.53846"
      stroke="#347BB5"
      strokeWidth="2"
    />
    <rect
      x="12.5385"
      y="15.6154"
      width="6.46154"
      height="9.53846"
      stroke="#347BB5"
      strokeWidth="2"
    />
  </SVG>
);
