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

const title = _x('Multiple Blue Rings', 'sticker name', 'web-stories');

const MultipleBlueRings = ({ style }) => (
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
        d="M30 38.115a8.115 8.115 0 100-16.23 8.115 8.115 0 000 16.23zm0 .245a8.36 8.36 0 100-16.72 8.36 8.36 0 000 16.72z"
        fill="#00F0FF"
      />
    </g>
    <g opacity=".5" filter="url(#filter1_d)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30 43.36c7.379 0 13.36-5.981 13.36-13.36S37.38 16.64 30 16.64 16.64 22.62 16.64 30 22.62 43.36 30 43.36zm0 .247c7.515 0 13.606-6.092 13.606-13.607S37.515 16.394 30 16.394 16.393 22.485 16.393 30 22.485 43.607 30 43.607z"
        fill="#00F0FF"
      />
    </g>
    <g opacity=".2" filter="url(#filter2_d)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30 49.754c10.91 0 19.754-8.844 19.754-19.754 0-10.91-8.844-19.754-19.754-19.754-10.91 0-19.754 8.844-19.754 19.754 0 10.91 8.844 19.754 19.754 19.754zM30 50c11.046 0 20-8.954 20-20s-8.954-20-20-20-20 8.954-20 20 8.954 20 20 20z"
        fill="#00F0FF"
      />
    </g>
    <defs>
      <filter
        id="filter0_d"
        x="11.639"
        y="11.639"
        width="36.721"
        height="36.721"
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
        x="6.393"
        y="6.394"
        width="47.213"
        height="47.213"
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
        id="filter2_d"
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

MultipleBlueRings.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 60 / 60,
  svg: MultipleBlueRings,
  title,
};
