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
import { _x } from '@googleforcreators/i18n';
import PropTypes from 'prop-types';

const title = _x('Train Tracks', 'sticker name', 'web-stories');

function TrainTracks({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 30 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M28.5 26.5V14.5C28.5 7.3203 22.6797 1.5 15.5 1.5C8.3203 1.5 2.5 7.3203 2.5 14.5V26.5H28.5ZM15.5 0C7.49187 0 1 6.49187 1 14.5V28H30V14.5C30 6.49187 23.5081 0 15.5 0Z"
        fill="#C89D4F"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.9377 17.391C13.2741 17.6327 13.3508 18.1014 13.109 18.4377L1.60901 34.4377C1.36726 34.7741 0.898621 34.8508 0.562273 34.609C0.225925 34.3673 0.149238 33.8986 0.390988 33.5623L11.891 17.5623C12.1327 17.2259 12.6014 17.1492 12.9377 17.391Z"
        fill="#C89D4F"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.5623 17.391C16.2259 17.6327 16.1492 18.1014 16.391 18.4377L27.891 34.4377C28.1327 34.7741 28.6014 34.8508 28.9377 34.609C29.2741 34.3673 29.3508 33.8986 29.109 33.5623L17.609 17.5623C17.3673 17.2259 16.8986 17.1492 16.5623 17.391Z"
        fill="#C89D4F"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 20.25C7 19.8358 7.33579 19.5 7.75 19.5H21.25C21.6642 19.5 22 19.8358 22 20.25C22 20.6642 21.6642 21 21.25 21H7.75C7.33579 21 7 20.6642 7 20.25Z"
        fill="#C89D4F"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 23.25C5 22.8358 5.33579 22.5 5.75 22.5H24.25C24.6642 22.5 25 22.8358 25 23.25C25 23.6642 24.6642 24 24.25 24H5.75C5.33579 24 5 23.6642 5 23.25Z"
        fill="#C89D4F"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 27.25C3 26.8358 3.33579 26.5 3.75 26.5H27.25C27.6642 26.5 28 26.8358 28 27.25C28 27.6642 27.6642 28 27.25 28H3.75C3.33579 28 3 27.6642 3 27.25Z"
        fill="#C89D4F"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 31.25C3.62117e-08 30.8358 0.335786 30.5 0.75 30.5L29.25 30.5C29.6642 30.5 30 30.8358 30 31.25C30 31.6642 29.6642 32 29.25 32H0.75C0.335786 32 -3.62117e-08 31.6642 0 31.25Z"
        fill="#C89D4F"
      />
    </svg>
  );
}

TrainTracks.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 30 / 35,
  svg: TrainTracks,
  title,
};
