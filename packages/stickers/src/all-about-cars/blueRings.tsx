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
import { _x } from '@googleforcreators/i18n';
import PropTypes from 'prop-types';

const title = _x('Blue Rings', 'sticker name', 'web-stories');

const BlueRings = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <g filter="url(#filter0_d)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30.377 44.528c7.816 0 14.151-6.335 14.151-14.15 0-7.816-6.335-14.152-14.15-14.152-7.816 0-14.152 6.336-14.152 14.151 0 7.816 6.336 14.151 14.151 14.151zm0 .566c8.128 0 14.717-6.589 14.717-14.717S38.505 15.66 30.377 15.66 15.66 22.25 15.66 30.377c0 8.128 6.59 14.717 14.717 14.717z"
        fill="#00F0FF"
      />
    </g>
    <g filter="url(#filter1_d)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30 49.434c10.733 0 19.434-8.7 19.434-19.434 0-10.733-8.7-19.434-19.434-19.434-10.733 0-19.434 8.7-19.434 19.434 0 10.733 8.7 19.434 19.434 19.434zM30 50c11.046 0 20-8.954 20-20s-8.954-20-20-20-20 8.954-20 20 8.954 20 20 20z"
        fill="#00F0FF"
        fillOpacity=".4"
      />
    </g>
    <defs>
      <filter
        id="filter0_d"
        x="5.66"
        y="5.66"
        width="49.434"
        height="49.434"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="5" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0.941176 0 0 0 0 1 0 0 0 1 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
      <filter
        id="filter1_d"
        x="0"
        y="0"
        width="60"
        height="60"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="5" />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0.941176 0 0 0 0 1 0 0 0 1 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
    </defs>
  </svg>
);

BlueRings.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 60 / 60,
  svg: BlueRings,
  title,
};
