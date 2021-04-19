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

function CapsuleBox({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 58 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="6"
        y="8"
        width="33"
        height="44"
        rx="3"
        fill="#F9FCF4"
        stroke="#E53616"
        strokeWidth="2"
      />
      <rect
        x="14"
        y="19"
        width="25"
        height="23"
        rx="3"
        fill="#F9FCF4"
        stroke="#E53616"
        strokeWidth="2"
      />
      <rect
        x="47.7655"
        y="28.4132"
        width="11.0045"
        height="32.9069"
        rx="5.50227"
        transform="rotate(42.7875 47.7655 28.4132)"
        fill="#F9FCF4"
        stroke="#E53616"
        strokeWidth="2"
      />
      <line
        x1="36.7652"
        y1="38.8228"
        x2="46.309"
        y2="47.6565"
        stroke="#E53616"
        strokeWidth="2"
      />
      <rect
        x="52.8573"
        y="53.7423"
        width="11.0045"
        height="32.9069"
        rx="5.50227"
        transform="rotate(105 52.8573 53.7423)"
        fill="#F9FCF4"
        stroke="#E53616"
        strokeWidth="2"
      />
      <line
        x1="38.5206"
        y1="48.8662"
        x2="35.1548"
        y2="61.4277"
        stroke="#E53616"
        strokeWidth="2"
      />
      <rect
        x="1"
        y="1"
        width="43"
        height="9"
        rx="1"
        fill="#F9FCF4"
        stroke="#E53616"
        strokeWidth="2"
      />
      <line x1="25" y1="11" x2="25" y2="4" stroke="#E53616" strokeWidth="2" />
    </svg>
  );
}

CapsuleBox.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 58 / 66,
  svg: CapsuleBox,
};
