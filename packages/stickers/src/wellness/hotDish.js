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

function HotDish({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 34 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 8.57622C3 8.54656 3.02426 8.52252 3.05418 8.52252H30.9458C30.9757 8.52252 31 8.54656 31 8.57622C31 15.99 24.9353 22 17.4542 22H16.5458C9.06467 22 3 15.99 3 8.57622Z"
        fill="#265ECD"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 10.9009C0 10.5725 0.268629 10.3063 0.6 10.3063H33.4C33.7314 10.3063 34 10.5725 34 10.9009C34 11.2293 33.7314 11.4955 33.4 11.4955H0.6C0.268629 11.4955 0 11.2293 0 10.9009Z"
        fill="#265ECD"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.6 7.53153C16.2686 7.53153 16 7.26532 16 6.93694V0.594595C16 0.266209 16.2686 1.43542e-08 16.6 0C16.9314 -1.43542e-08 17.2 0.266209 17.2 0.594595V6.93694C17.2 7.26532 16.9314 7.53153 16.6 7.53153Z"
        fill="#265ECD"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.4 6.73874C13.0686 6.73874 12.8 6.47253 12.8 6.14414V2.18018C12.8 1.85179 13.0686 1.58559 13.4 1.58559C13.7314 1.58559 14 1.85179 14 2.18018V6.14414C14 6.47253 13.7314 6.73874 13.4 6.73874Z"
        fill="#265ECD"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.6 6.73874C20.2686 6.73874 20 6.47253 20 6.14414V2.18018C20 1.85179 20.2686 1.58559 20.6 1.58559C20.9314 1.58559 21.2 1.85179 21.2 2.18018V6.14414C21.2 6.47253 20.9314 6.73874 20.6 6.73874Z"
        fill="#265ECD"
      />
    </svg>
  );
}

HotDish.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 34 / 22,
  svg: HotDish,
};
