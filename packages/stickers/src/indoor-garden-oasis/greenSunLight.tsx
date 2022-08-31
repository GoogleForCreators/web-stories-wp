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

const title = _x('Green Sunlight', 'sticker name', 'web-stories');

function GreenSunlight({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 42 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.1056 22.6062C15.9341 20.7777 18.414 19.7505 20.9999 19.7505C23.5857 19.7505 26.0657 20.7777 27.8942 22.6062C29.7226 24.4347 30.7499 26.9146 30.7499 29.5005C30.7499 30.0528 30.3022 30.5005 29.7499 30.5005C29.1976 30.5005 28.7499 30.0528 28.7499 29.5005C28.7499 27.4451 27.9334 25.4738 26.48 24.0204C25.0265 22.567 23.0553 21.7505 20.9999 21.7505C18.9445 21.7505 16.9732 22.567 15.5198 24.0204C14.0664 25.4738 13.2499 27.4451 13.2499 29.5005C13.2499 30.0528 12.8022 30.5005 12.2499 30.5005C11.6976 30.5005 11.2499 30.0528 11.2499 29.5005C11.2499 26.9146 12.2771 24.4347 14.1056 22.6062Z"
        fill="#235524"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.0001 0.499512C21.5524 0.499512 22.0001 0.947227 22.0001 1.49951V13.7495C22.0001 14.3018 21.5524 14.7495 21.0001 14.7495C20.4478 14.7495 20.0001 14.3018 20.0001 13.7495V1.49951C20.0001 0.947227 20.4478 0.499512 21.0001 0.499512Z"
        fill="#235524"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.67803 15.1786C7.06855 14.7881 7.70171 14.7881 8.09224 15.1786L10.5772 17.6636C10.9678 18.0542 10.9678 18.6873 10.5772 19.0779C10.1867 19.4684 9.55355 19.4684 9.16302 19.0779L6.67803 16.5928C6.2875 16.2023 6.2875 15.5692 6.67803 15.1786Z"
        fill="#235524"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.749878 29.5C0.749878 28.9477 1.19759 28.5 1.74988 28.5H5.24988C5.80216 28.5 6.24988 28.9477 6.24988 29.5C6.24988 30.0523 5.80216 30.5 5.24988 30.5H1.74988C1.19759 30.5 0.749878 30.0523 0.749878 29.5Z"
        fill="#235524"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M35.7501 29.5C35.7501 28.9477 36.1978 28.5 36.7501 28.5H40.2501C40.8024 28.5 41.2501 28.9477 41.2501 29.5C41.2501 30.0523 40.8024 30.5 40.2501 30.5H36.7501C36.1978 30.5 35.7501 30.0523 35.7501 29.5Z"
        fill="#235524"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M35.3224 15.1786C35.7129 15.5692 35.7129 16.2023 35.3224 16.5928L32.8374 19.0779C32.4468 19.4684 31.8137 19.4684 31.4231 19.0779C31.0326 18.6873 31.0326 18.0542 31.4231 17.6636L33.9081 15.1786C34.2987 14.7881 34.9318 14.7881 35.3224 15.1786Z"
        fill="#235524"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.749878 36.5005C0.749878 35.9482 1.19759 35.5005 1.74988 35.5005H40.2499C40.8022 35.5005 41.2499 35.9482 41.2499 36.5005C41.2499 37.0528 40.8022 37.5005 40.2499 37.5005H1.74988C1.19759 37.5005 0.749878 37.0528 0.749878 36.5005Z"
        fill="#235524"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.2933 6.04241C13.6838 5.65188 14.3169 5.65188 14.7075 6.04241L21.0004 12.3353L27.2933 6.04241C27.6838 5.65188 28.3169 5.65188 28.7075 6.04241C29.098 6.43293 29.098 7.06609 28.7075 7.45662L21.7075 14.4566C21.3169 14.8471 20.6838 14.8471 20.2933 14.4566L13.2933 7.45662C12.9027 7.06609 12.9027 6.43293 13.2933 6.04241Z"
        fill="#235524"
      />
    </svg>
  );
}

GreenSunlight.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 42 / 38,
  svg: GreenSunlight,
  title,
};
