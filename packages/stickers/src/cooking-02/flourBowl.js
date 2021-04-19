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

function FlourBowl({ style }) {
  return (
    <svg
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 42 31"
      fill="none"
    >
      <path
        d="M20.3884 1C9.78719 1 5.3373 6.72597 4.4375 9.58896H37.0755C35.9303 6.72597 30.9896 1 20.3884 1Z"
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M39.3218 9.83398H2.76276C1.82882 9.83398 1.10812 10.6557 1.22996 11.5817C1.88064 16.5268 3.87213 21.2756 7.62431 24.5618C8.76714 25.5627 10.0181 26.5662 11.3012 27.4377C14.0377 29.2964 17.9098 29.7113 21.2178 29.7113C24.7388 29.7113 27.8091 29.2103 30.6821 27.175C31.9866 26.2509 33.271 25.1991 34.445 24.1629C38.102 20.9352 40.1221 16.3308 40.7753 11.4971C40.8942 10.617 40.2099 9.83398 39.3218 9.83398Z"
        stroke="white"
        strokeWidth="2"
      />
      <path
        d="M5.66406 14.9883C5.82766 16.9515 7.67633 21.4668 13.7622 23.8226"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

FlourBowl.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 42 / 31,
  svg: FlourBowl,
};
