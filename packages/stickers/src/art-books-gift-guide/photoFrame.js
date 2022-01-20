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

const title = _x('Photo Frame', 'sticker name', 'web-stories');

function PhotoFrame({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 42 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M11.0345 8.1033C11.0345 9.53162 10.031 10.6895 8.79314 10.6895C7.55526 10.6895 6.55176 9.53162 6.55176 8.1033C6.55176 6.67497 7.55526 5.51709 8.79314 5.51709C10.031 5.51709 11.0345 6.67497 11.0345 8.1033Z"
        fill="#CE635E"
      />
      <path
        d="M8.79312 17.627C6.0345 15.0408 3.62071 27.4546 3.27588 27.9719H38.2759L37.5862 22.7998C37.2414 20.2136 36.7242 21.9377 34.8276 23.6619C32.9311 25.386 33.1035 20.2136 30.5173 19.0067C27.9311 17.7998 27.2414 21.4204 25.5173 21.9377C23.7931 22.4551 23.1035 17.627 21.5517 12.9721C20 8.31715 18.1035 14.6962 14.6552 21.4204C11.2069 28.1445 11.5517 20.2133 8.79312 17.627Z"
        fill="#AD3E3C"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M38.9655 2.41379H2.41379V27.5862H38.9655V2.41379ZM0 0V30H41.3793V0H0Z"
        fill="#573C5F"
      />
    </svg>
  );
}

PhotoFrame.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 42 / 30,
  svg: PhotoFrame,
  title,
};
