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
      viewBox="0 0 46 21"
      fill="none"
    >
      <path
        d="M16.3333 6.87563C16.5 8.5 20 9.5 23 8.5M13.6667 20H33C37 20 45 18.95 45 14.7499C45 9.49975 37 2.28173 31 2.28173C25 2.28173 17 -0.999746 9 2.93842C4.78375 5.01396 1 10.1547 1 13.4361C1 16.7174 2.33333 20 13.6667 20Z"
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
  aspectRatio: 46 / 21,
  svg: Dough,
};
