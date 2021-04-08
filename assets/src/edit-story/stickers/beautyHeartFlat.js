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

function BeautyHeartFlat({ style }) {
  return (
    <svg
      style={style}
      width="32"
      height="26"
      viewBox="0 0 32 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30.5424 11.0704C29.0928 15.0251 15.9933 24.999 15.9933 24.999C15.9933 24.999 2.89388 15.0251 1.44424 11.0704C-0.00539374 7.11564 2.2086 2.78781 6.39937 1.41982C10.1157 0.201059 14.1483 1.71829 16.0197 4.82736C17.8647 1.71829 21.8973 0.201059 25.6137 1.41982C29.8044 2.78781 32.0184 7.11564 30.5424 11.0704Z"
        fill="#F3D9E1"
        stroke="#28292B"
        strokeWidth="1.49999"
        strokeMiterlimit="10"
      />
    </svg>
  );
}

BeautyHeartFlat.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 32 / 26,
  svg: BeautyHeartFlat,
};
