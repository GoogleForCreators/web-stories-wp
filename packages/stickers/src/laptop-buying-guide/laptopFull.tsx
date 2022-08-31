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

const title = _x('Laptop Full', 'sticker name', 'web-stories');

function LaptopRatingsFull({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 42 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>

      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M33.9565 1H8.04346C6.3866 1 5.04346 2.34315 5.04346 4V22.1739H36.9565V4C36.9565 2.34315 35.6134 1 33.9565 1ZM8.04346 0C5.83432 0 4.04346 1.79087 4.04346 4V23.1739H37.9565V4C37.9565 1.79086 36.1656 0 33.9565 0H8.04346Z"
        fill="#0057FF"
      />
      <path
        d="M6.86963 6.82611C6.86963 4.61697 8.66049 2.82611 10.8696 2.82611H31.1305C33.3396 2.82611 35.1305 4.61697 35.1305 6.82611V23.1739H6.86963V6.82611Z"
        fill="#0057FF"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M31.1305 3.82611H10.8696C9.21277 3.82611 7.86963 5.16925 7.86963 6.82611V22.1739H34.1305V6.82611C34.1305 5.16926 32.7874 3.82611 31.1305 3.82611ZM10.8696 2.82611C8.66049 2.82611 6.86963 4.61697 6.86963 6.82611V23.1739H35.1305V6.82611C35.1305 4.61697 33.3396 2.82611 31.1305 2.82611H10.8696Z"
        fill="#0057FF"
      />
      <path
        d="M41.9131 22C41.9131 24.2091 40.1222 26 37.9131 26L4.087 26C1.87786 26 0.0869981 24.2091 0.0869983 22L0.0869984 20.913L41.9131 20.913L41.9131 22Z"
        fill="#E4E4E4"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.087 25L37.9131 25C39.5699 25 40.9131 23.6569 40.9131 22L40.9131 21.913L1.087 21.913L1.087 22C1.087 23.6568 2.43015 25 4.087 25ZM37.9131 26C40.1222 26 41.9131 24.2091 41.9131 22L41.9131 20.913L0.0869984 20.913L0.0869983 22C0.0869981 24.2091 1.87786 26 4.087 26L37.9131 26Z"
        fill="#0057FF"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.2609 24.1739H18.7392C18.0998 24.1739 17.5372 24.5025 17.211 25H24.7891C24.4629 24.5025 23.9003 24.1739 23.2609 24.1739ZM25.905 25C25.5011 23.9327 24.4696 23.1739 23.2609 23.1739H18.7392C17.5304 23.1739 16.499 23.9327 16.0951 25C15.9775 25.3109 15.9131 25.6479 15.9131 26H26.087C26.087 25.6479 26.0226 25.3109 25.905 25Z"
        fill="#0057FF"
      />
    </svg>
  );
}

LaptopRatingsFull.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 42 / 26,
  svg: LaptopRatingsFull,
  title,
};
