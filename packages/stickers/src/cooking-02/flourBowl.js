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
      viewBox="0 0 43 31"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.50086 8.73349H35.9135C34.0836 6.03019 29.4915 2.14453 20.9045 2.14453C12.2733 2.14453 8.05412 6.06523 6.50086 8.73349ZM3.99963 9.43366C5.04078 6.12089 9.90224 0.144531 20.9045 0.144531C31.8977 0.144531 37.2169 6.10393 38.5201 9.3621L39.0687 10.7335H3.59111L3.99963 9.43366Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.756545 11.857C0.5559 10.3321 1.74276 8.97889 3.2808 8.97889H39.8398C41.3334 8.97889 42.4843 10.2958 42.2843 11.7759C41.6071 16.7874 39.5029 21.6347 35.6248 25.0576C34.4329 26.1096 33.1199 27.1854 31.7782 28.1359C28.6647 30.3416 25.3545 30.8562 21.7359 30.8562C18.4001 30.8562 14.2604 30.4496 11.2573 28.4098C9.93125 27.5091 8.64744 26.4784 7.48349 25.459C3.49921 21.9695 1.42914 16.9687 0.756545 11.857ZM3.2808 10.9789C2.95096 10.9789 2.69642 11.2691 2.73945 11.5961C3.36822 16.3748 5.28112 20.8715 8.8012 23.9544C9.9229 24.9368 11.141 25.9131 12.3811 26.7554C14.851 28.433 18.4556 28.8562 21.7359 28.8562C25.1591 28.8562 27.9895 28.3689 30.6221 26.5039C31.8893 25.6062 33.1453 24.5784 34.3013 23.5581C37.7371 20.5256 39.6731 16.164 40.3023 11.5081C40.3401 11.228 40.1224 10.9789 39.8398 10.9789H3.2808Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.09757 14.1357C6.64795 14.0899 7.1313 14.4988 7.17716 15.0492C7.30922 16.634 8.91372 20.8175 14.6398 23.034C15.1548 23.2334 15.4107 23.8126 15.2113 24.3276C15.012 24.8427 14.4328 25.0986 13.9178 24.8992C7.47205 22.4041 5.3792 17.5569 5.18407 15.2153C5.1382 14.6649 5.54719 14.1816 6.09757 14.1357Z"
        fill="white"
      />
    </svg>
  );
}

FlourBowl.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 43 / 31,
  svg: FlourBowl,
};
