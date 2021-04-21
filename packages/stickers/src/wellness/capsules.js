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

function Capsules({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 63 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.0134 32.6401L31.4679 42.1401M56.1738 44.1335L44.9115 50.6358M41.7159 18.4844L51.7159 12.8208M14.3036 7.59499L21.3581 18.5199M22.2634 20.0827C24.8867 15.5389 30.6969 13.9821 35.2406 16.6055C39.7844 19.2288 41.3412 25.0389 38.7179 29.5827L22.7179 57.2955C20.0945 61.8393 14.2844 63.3961 9.74063 60.7728C5.19685 58.1494 3.64004 52.3393 6.26339 47.7955L22.2634 20.0827ZM60.9781 52.4548C62.7736 55.5648 61.7081 59.5415 58.5981 61.3371C55.4881 63.1326 51.5114 62.0671 49.7158 58.9571L38.7646 39.9891C36.969 36.8791 38.0346 32.9023 41.1446 31.1068C44.2546 29.3112 48.2313 30.3768 50.0269 33.4868L60.9781 52.4548ZM36.845 11.1025C35.005 8.01857 36.0134 4.02696 39.0973 2.18695C42.1812 0.346952 46.1728 1.35533 48.0128 4.43923L56.8465 19.2447C58.6865 22.3287 57.6781 26.3203 54.5942 28.1603C51.5103 30.0003 47.5187 28.9919 45.6787 25.908L36.845 11.1025ZM22.3757 2.38271C25.3925 0.434676 29.4173 1.30111 31.3653 4.31793C33.3133 7.33476 32.4469 11.3596 29.4301 13.3076L11.0303 25.1888C8.01345 27.1368 3.98864 26.2704 2.04061 23.2535C0.0925804 20.2367 0.959011 16.2119 3.97584 14.2639L22.3757 2.38271Z"
        stroke="#E53616"
        strokeWidth="2"
      />
    </svg>
  );
}

Capsules.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 63 / 64,
  svg: Capsules,
};
