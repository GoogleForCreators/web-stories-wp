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

const Test = ({ height = 55, width = 55 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 55 55"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_d)">
      <mask
        id="mask0"
        mask-type="alpha"
        maskUnits="userSpaceOnUse"
        x="4"
        y="0"
        width="47"
        height="47"
      >
        <circle cx="27.5" cy="23.5" r="23.5" fill="#C4C4C4" />
      </mask>
      <g mask="url(#mask0)">
        <circle cx="27.5" cy="23.5" r="23.5" fill="#D4E3FC" />
        <path
          d="M13 21.5762C13 21.5466 13.0243 21.5225 13.0542 21.5225H40.9458C40.9757 21.5225 41 21.5466 41 21.5762C41 28.99 34.9353 35 27.4542 35H26.5458C19.0647 35 13 28.99 13 21.5762Z"
          fill="#265ECD"
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0 60 70"
            to="10 10 10"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10 23.9009C10 23.5725 10.2686 23.3063 10.6 23.3063H43.4C43.7314 23.3063 44 23.5725 44 23.9009C44 24.2293 43.7314 24.4955 43.4 24.4955H10.6C10.2686 24.4955 10 24.2293 10 23.9009Z"
          fill="#265ECD"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M26.6 20.5315C26.2686 20.5315 26 20.2653 26 19.9369V13.5946C26 13.2662 26.2686 13 26.6 13C26.9314 13 27.2 13.2662 27.2 13.5946V19.9369C27.2 20.2653 26.9314 20.5315 26.6 20.5315Z"
          fill="#265ECD"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M23.4 19.7387C23.0686 19.7387 22.8 19.4725 22.8 19.1441V15.1802C22.8 14.8518 23.0686 14.5856 23.4 14.5856C23.7314 14.5856 24 14.8518 24 15.1802V19.1441C24 19.4725 23.7314 19.7387 23.4 19.7387Z"
          fill="#265ECD"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M30.6 19.7387C30.2686 19.7387 30 19.4725 30 19.1441V15.1802C30 14.8518 30.2686 14.5856 30.6 14.5856C30.9314 14.5856 31.2 14.8518 31.2 15.1802V19.1441C31.2 19.4725 30.9314 19.7387 30.6 19.7387Z"
          fill="#265ECD"
        />
        <circle cx="27.5" cy="23.5" r="22.5" stroke="white" strokeWidth="2" />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_d"
        x="0"
        y="0"
        width="55"
        height="55"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

Test.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
};

export default Test;
