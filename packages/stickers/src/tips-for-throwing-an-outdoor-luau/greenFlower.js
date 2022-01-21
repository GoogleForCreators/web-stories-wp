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

const title = _x('Green Flower', 'sticker name', 'web-stories');

const GreenFlower = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 44 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      d="M20.7281 0.148751C20.1361 0.0248252 19.4925 -0.0279067 18.8989 0.192749C18.2777 0.425236 17.8132 0.951121 17.3764 1.46518C16.2566 2.76215 15.188 4.10278 14.1391 5.45138C13.6623 6.06437 13.1973 6.70512 12.9688 7.44138C12.7164 8.237 12.7836 9.09266 12.8589 9.92852C13.1502 12.7848 13.7341 15.5981 14.6067 18.3208C14.7352 18.7409 14.8791 19.2362 14.6522 19.6279C14.258 20.3203 13.236 20.0688 12.5146 19.7545C10.721 18.9153 8.86032 18.072 6.88198 17.9177C4.90365 17.7634 2.72403 18.4484 1.63416 20.1256C0.536294 21.8227 0.869125 24.2354 2.12199 25.8459C3.37486 27.4564 5.41299 28.3713 7.43024 28.6564C9.34093 28.9215 11.2814 28.7153 13.1867 28.4259C13.6976 28.1259 14.5373 28.4879 14.7756 29.0904C15.0687 29.7841 14.9111 30.572 14.8367 31.3244C14.6521 33.7124 15.6329 36.1105 17.2683 37.8525C18.9037 39.5944 21.1465 40.684 23.459 41.2033C24.4495 41.4191 25.5274 41.5321 26.4261 41.0665C27.2615 40.6443 27.8065 39.8056 28.1303 38.9468C29.1571 36.3466 28.6095 33.3868 27.6692 30.7749C27.4001 30.0218 27.0915 29.2528 27.0951 28.4488C27.0987 27.6448 27.5173 26.7782 28.2691 26.5063C28.7241 26.3448 29.2255 26.4091 29.6832 26.5249C32.0745 27.0761 34.3631 28.5064 36.7937 28.2219C37.9952 28.0856 39.1236 27.5056 40.1497 26.8382C42.1741 25.5152 44.06 23.3999 43.7943 20.9912C43.5739 19.0381 41.9929 17.5023 40.3186 16.4811C37.5728 14.8202 34.3807 14.0378 31.1859 13.8296C30.2737 13.7605 29.2784 13.7269 28.6017 13.1315C28.0075 12.6154 27.7623 11.803 27.588 11.0422C26.945 8.20505 26.7021 5.11519 24.927 2.81056C23.9059 1.47778 22.3894 0.520308 20.7281 0.148751ZM25.8825 22.2518C25.4351 23.36 24.1608 23.9041 23.0567 23.4583C21.9527 23.0126 21.4133 21.7362 21.8607 20.6281C22.3081 19.5199 23.5825 18.9758 24.6865 19.4215C25.7905 19.8673 26.3299 21.1437 25.8825 22.2518Z"
      fill="#3F4F3E"
    />
  </svg>
);

GreenFlower.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 44 / 42,
  svg: GreenFlower,
  title,
};
