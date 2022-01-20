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

const title = _x('Yellow Bridge', 'sticker name', 'web-stories');

function YellowBridge({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 37 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 0.75C7 0.335786 7.33579 -3.62108e-08 7.75 0L29.25 1.87959e-06C29.6642 1.9158e-06 30 0.335788 30 0.750002C30 1.16422 29.6642 1.5 29.25 1.5L7.75 1.5C7.33579 1.5 7 1.16421 7 0.75Z"
        fill="#C89D4F"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 10.75C-3.62108e-08 10.3358 0.335786 10 0.75 10L36.25 10C36.6642 10 37 10.3358 37 10.75C37 11.1642 36.6642 11.5 36.25 11.5L0.75 11.5C0.335786 11.5 3.62126e-08 11.1642 0 10.75Z"
        fill="#C89D4F"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.75 10.5C8.16421 10.5 8.5 10.8358 8.5 11.25L8.5 23.75C8.5 24.1642 8.16421 24.5 7.75 24.5C7.33579 24.5 7 24.1642 7 23.75L7 11.25C7 10.8358 7.33579 10.5 7.75 10.5Z"
        fill="#C89D4F"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M29.75 10.5C30.1642 10.5 30.5 10.8358 30.5 11.25V23.75C30.5 24.1642 30.1642 24.5 29.75 24.5C29.3358 24.5 29 24.1642 29 23.75V11.25C29 10.8358 29.3358 10.5 29.75 10.5Z"
        fill="#C89D4F"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 11.75C5 11.3358 5.33579 11 5.75 11H9.25C9.66421 11 10 11.3358 10 11.75C10 12.1642 9.66421 12.5 9.25 12.5H5.75C5.33579 12.5 5 12.1642 5 11.75Z"
        fill="#C89D4F"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27 11.75C27 11.3358 27.3358 11 27.75 11H31.25C31.6642 11 32 11.3358 32 11.75C32 12.1642 31.6642 12.5 31.25 12.5H27.75C27.3358 12.5 27 12.1642 27 11.75Z"
        fill="#C89D4F"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.5 0.5L1.87083 11H13.1292L7.5 0.5ZM7.5 3.67465L4.37697 9.5H10.623L7.5 3.67465Z"
        fill="#C89D4F"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.5 0.5L12.8708 11H24.1292L18.5 0.5ZM18.5 3.67465L15.377 9.5H21.623L18.5 3.67465Z"
        fill="#C89D4F"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M29.5 0.5L23.8708 11H35.1292L29.5 0.5ZM29.5 3.67465L26.377 9.5H32.623L29.5 3.67465Z"
        fill="#C89D4F"
      />
    </svg>
  );
}

YellowBridge.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 37 / 25,
  svg: YellowBridge,
  title,
};
