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
 * WordPress dependencies
 */
import { Path, Rect, SVG } from '@wordpress/components';

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

// Icons for view types.
export const CAROUSEL_VIEW_TYPE_ICON = (
  /* From https://material.io/tools/icons */
  <SVG
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <Path d="M0 0h24v24H0z" fill="none" />
    <Path d="M7 19h10V4H7v15zm-5-2h4V6H2v11zM18 6v11h4V6h-4z" />
  </SVG>
);
