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

const title = _x('Yellow Leaves', 'sticker name', 'web-stories');

function YellowLeaves({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 42 51"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M35.5389 25.2094C35.7056 25.4353 35.9086 25.733 36.1353 26.097C36.7325 27.0561 37.4508 28.4062 38.0667 29.9801C39.3186 33.1793 40.0397 37.0215 38.8366 40.3756C36.196 47.737 30.9779 50.2347 27.0656 48.8313C23.1533 47.4279 20.7126 42.183 23.3532 34.8216C24.5563 31.4675 27.5551 28.9597 30.5551 27.2856C32.031 26.462 33.4437 25.8764 34.5143 25.5156C34.9207 25.3786 35.2667 25.2778 35.5389 25.2094ZM40.3426 40.9158C43.1319 33.1398 36.8567 23.774 36.1453 23.5189C35.434 23.2637 24.6364 26.5053 21.8471 34.2813C19.0578 42.0573 21.418 48.5053 26.5254 50.3373C31.6328 52.1694 37.5533 48.6918 40.3426 40.9158Z"
        fill="#FFC864"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M34.7474 30.3245L27.4495 50.6695L25.9435 50.1293L33.2414 29.7843L34.7474 30.3245Z"
        fill="#FFC864"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M36.2648 37.1311L30.0335 43.4652L28.8929 42.3431L35.1242 36.009L36.2648 37.1311Z"
        fill="#FFC864"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.1382 36.9886L30.0267 44.245L28.5401 44.8367L25.6517 37.5803L27.1382 36.9886Z"
        fill="#FFC864"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.42387 22.2959C5.69665 22.3622 6.04337 22.4602 6.45088 22.594C7.52433 22.9463 8.94163 23.5207 10.424 24.3325C13.4372 25.9828 16.4558 28.4667 17.6855 31.8111C20.3844 39.1514 17.9854 44.4155 14.0843 45.8498C10.1833 47.2842 4.94557 44.828 2.24666 37.4878C1.01698 34.1434 1.70752 30.2956 2.934 27.0865C3.53739 25.5077 4.245 24.152 4.83456 23.1883C5.05838 22.8224 5.25902 22.5231 5.42387 22.2959ZM19.1872 31.259C16.3363 23.5053 5.5134 20.3495 4.80408 20.6103C4.09477 20.8711 -2.10594 30.2863 0.744955 38.0399C3.59585 45.7935 9.54378 49.2241 14.6365 47.3516C19.7292 45.479 22.0381 39.0126 19.1872 31.259Z"
        fill="#FFC864"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.09984 26.7268L15.5589 47.0133L14.0572 47.5654L6.59813 27.2789L8.09984 26.7268Z"
        fill="#FFC864"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.6315 30.9726L12.9173 39.8292L11.3225 39.7006L12.0367 30.844L13.6315 30.9726Z"
        fill="#FFC864"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.54052 36.7204L13.4124 40.432L12.6521 41.8398L5.78017 38.1282L6.54052 36.7204Z"
        fill="#FFC864"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M26.4497 1.74726C26.6376 1.95586 26.8686 2.23236 27.1297 2.57262C27.8175 3.46893 28.6639 4.74261 29.4302 6.24905C30.9877 9.31116 32.0796 13.0649 31.2089 16.5201C29.2979 24.1038 24.3479 27.0978 20.3176 26.0822C16.2872 25.0666 13.3471 20.0843 15.2582 12.5007C16.1288 9.04543 18.8692 6.2574 21.6918 4.29907C23.0805 3.33564 24.4294 2.61517 25.4598 2.15182C25.851 1.97592 26.1854 1.84193 26.4497 1.74726ZM32.7604 16.9111C34.779 8.90038 27.6214 0.190406 26.8886 0.00573779C26.1557 -0.17893 15.7253 4.09902 13.7067 12.1097C11.688 20.1204 14.665 26.3078 19.9266 27.6337C25.1881 28.9595 30.7418 24.9218 32.7604 16.9111Z"
        fill="#FFC864"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M26.1607 6.91352L20.8792 27.8727L19.3277 27.4817L24.6092 6.52256L26.1607 6.91352Z"
        fill="#FFC864"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M28.334 13.5409L22.7493 20.4518L21.5049 19.4461L27.0896 12.5352L28.334 13.5409Z"
        fill="#FFC864"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.2371 14.2883L22.8187 21.2289L21.3968 21.9626L17.8153 15.022L19.2371 14.2883Z"
        fill="#FFC864"
      />
    </svg>
  );
}

YellowLeaves.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 42 / 51,
  svg: YellowLeaves,
  title,
};
