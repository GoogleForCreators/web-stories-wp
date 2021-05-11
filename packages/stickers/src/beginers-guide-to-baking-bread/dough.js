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

function Dough({ style }) {
  return (
    <svg
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 47 21"
      fill="none"
    >
      <path
        d="M16.6458 6.87563C16.8125 8.5 20.3125 9.5 23.3125 8.5M13.9792 20H33.3125C37.3125 20 45.3125 18.95 45.3125 14.7499C45.3125 9.49975 37.3125 2.28173 31.3125 2.28173C25.3125 2.28173 17.3125 -0.999746 9.3125 2.93842C5.09625 5.01396 1.3125 10.1547 1.3125 13.4361C1.3125 16.7174 2.64583 20 13.9792 20Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

Dough.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 47 / 21,
  svg: Dough,
};
