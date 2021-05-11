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

function Jar({ style }) {
  return (
    <svg
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 28 37"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.02875 2C3.02875 0.895434 3.92418 0 5.02875 0H23.1744C24.2789 0 25.1744 0.89543 25.1744 2V5.51187C26.6949 6.66731 27.6016 8.47432 27.6016 10.4057V31C27.6016 34.3137 24.9153 37 21.6016 37H6.60156C3.28785 37 0.601562 34.3137 0.601562 31V10.4057C0.601562 8.47432 1.50823 6.66731 3.02875 5.51187V2ZM4.33134 7.03597C3.25004 7.81144 2.60156 9.0641 2.60156 10.4057V31C2.60156 33.2091 4.39242 35 6.60156 35H21.6016C23.8107 35 25.6016 33.2091 25.6016 31V10.4057C25.6016 9.0641 24.9531 7.81144 23.8718 7.03597H4.33134ZM23.1744 5.03597V2L5.02875 2V5.03597H23.1744Z"
        fill="white"
      />
      <path d="M7.60156 13H20.6016V27H7.60156V13Z" fill="white" />
    </svg>
  );
}

Jar.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 28 / 37,
  svg: Jar,
};
