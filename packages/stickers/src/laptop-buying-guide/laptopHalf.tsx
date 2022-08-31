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

const title = _x('Laptop Half', 'sticker name', 'web-stories');

function TechnologyLaptop03({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 43 27"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M34.4589 1H8.5459C6.88905 1 5.5459 2.34315 5.5459 4V22.1739H37.4589V4C37.4589 2.34315 36.1158 1 34.4589 1ZM8.5459 0C6.33676 0 4.5459 1.79087 4.5459 4V23.1739H38.4589V4C38.4589 1.79086 36.6681 0 34.4589 0H8.5459Z"
        fill="#0057FF"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M31.6329 3.82422H11.3721C9.71522 3.82422 8.37207 5.16736 8.37207 6.82422V22.172H34.6329V6.82422C34.6329 5.16737 33.2898 3.82422 31.6329 3.82422ZM11.3721 2.82422C9.16293 2.82422 7.37207 4.61508 7.37207 6.82422V23.172H35.6329V6.82422C35.6329 4.61508 33.8421 2.82422 31.6329 2.82422H11.3721Z"
        fill="#0057FF"
      />
      <path
        d="M7.58936 7C7.58936 4.79086 9.38022 3 11.5894 3H22.5894V23H7.58936V7Z"
        fill="#0057FF"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.5894 4H11.5894C9.9325 4 8.58936 5.34315 8.58936 7V22H21.5894V4ZM11.5894 3C9.38022 3 7.58936 4.79086 7.58936 7V23H22.5894V3H11.5894Z"
        fill="#0057FF"
      />
      <path
        d="M42.4155 22C42.4155 24.2091 40.6247 26 38.4155 26L4.58944 26C2.3803 26 0.58944 24.2091 0.58944 22L0.58944 20.913L42.4155 20.913L42.4155 22Z"
        fill="#E4E4E4"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.58944 25L38.4155 25C40.0724 25 41.4155 23.6569 41.4155 22L41.4155 21.913L1.58944 21.913L1.58944 22C1.58944 23.6568 2.93259 25 4.58944 25ZM38.4155 26C40.6247 26 42.4155 24.2091 42.4155 22L42.4155 20.913L0.58944 20.913L0.58944 22C0.58944 24.2091 2.3803 26 4.58944 26L38.4155 26Z"
        fill="#0057FF"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.7634 24.1758H19.2416C18.6023 24.1758 18.0396 24.5044 17.7134 25.0019H25.2915C24.9653 24.5044 24.4027 24.1758 23.7634 24.1758ZM26.4074 25.0019C26.0036 23.9346 24.9721 23.1758 23.7634 23.1758H19.2416C18.0329 23.1758 17.0014 23.9346 16.5975 25.0019C16.4799 25.3127 16.4155 25.6498 16.4155 26.0019H26.5894C26.5894 25.6498 26.5251 25.3127 26.4074 25.0019Z"
        fill="#0057FF"
      />
    </svg>
  );
}

TechnologyLaptop03.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 43 / 27,
  svg: TechnologyLaptop03,
  title,
};
