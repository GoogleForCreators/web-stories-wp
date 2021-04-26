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

const FashionStarburstWithArrow = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 205 271"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M158.237.306641L140.648 16.1765 123.077.306641 110.121 19.9039 89.0119 8.75431 81.5149 30.842l-23.3165-5.7132-1.5668 23.1945-24.0746.0488 4.4645 22.8527-23.2997 5.8434 10.1926 21.0622L2.85542 109.378l15.29728 17.937L.648438 143.282 20.0732 156.987 7.23568 176.65l22.35622 8.61-7.3791 22.137 23.8556 2.962-1.4488 23.211 23.8893-2.865 4.5655 22.837 22.3899-8.513 10.2937 21.013 19.509-13.624 15.381 17.889 15.382-17.889 19.509 13.624 10.294-21.013 22.406 8.513 4.566-22.837 23.872 2.865-1.449-23.211 23.873-2.962-7.379-22.137 22.339-8.61-12.837-19.663 19.424-13.705-17.487-15.967 15.28-17.937-21.058-11.2476 10.192-21.0622-23.283-5.8434 4.448-22.8527-24.058-.0488-1.584-23.1945-23.316 5.7132-7.497-22.08769-21.109 11.14959L158.237.306641zM146.347 109.795c0 10.932 6.757 20.317 16.383 24.413h-57.199v2.197h57.199c-9.626 4.096-16.383 13.481-16.383 24.413h2.197c0-13.443 11.193-24.413 25.017-24.413v-2.197c-13.824 0-25.017-10.97-25.017-24.413h-2.197z"
      fill="#FF3000"
    />
  </svg>
);

FashionStarburstWithArrow.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 205 / 271,
  svg: FashionStarburstWithArrow,
};
