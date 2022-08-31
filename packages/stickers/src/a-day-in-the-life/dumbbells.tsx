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

const title = _x('Dumbbells', 'sticker name', 'web-stories');

function Dumbells({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 52 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 10.5C0 8.567 1.567 7 3.5 7C5.433 7 7 8.567 7 10.5V19.5C7 21.433 5.433 23 3.5 23C1.567 23 0 21.433 0 19.5V10.5ZM3.5 9C2.67157 9 2 9.67157 2 10.5V19.5C2 20.3284 2.67157 21 3.5 21C4.32843 21 5 20.3284 5 19.5V10.5C5 9.67157 4.32843 9 3.5 9Z"
        fill="#FFC864"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M52 10.5C52 8.567 50.433 7 48.5 7C46.567 7 45 8.567 45 10.5V19.5C45 21.433 46.567 23 48.5 23C50.433 23 52 21.433 52 19.5V10.5ZM48.5 9C49.3284 9 50 9.67157 50 10.5V19.5C50 20.3284 49.3284 21 48.5 21C47.6716 21 47 20.3284 47 19.5V10.5C47 9.67157 47.6716 9 48.5 9Z"
        fill="#FFC864"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 6.5C5 4.567 6.567 3 8.5 3C10.433 3 12 4.567 12 6.5V22.5C12 24.433 10.433 26 8.5 26C6.567 26 5 24.433 5 22.5V6.5ZM8.5 5C7.67157 5 7 5.67157 7 6.5V22.5C7 23.3284 7.67157 24 8.5 24C9.32843 24 10 23.3284 10 22.5V6.5C10 5.67157 9.32843 5 8.5 5Z"
        fill="#FFC864"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M47 6.5C47 4.567 45.433 3 43.5 3C41.567 3 40 4.567 40 6.5V22.5C40 24.433 41.567 26 43.5 26C45.433 26 47 24.433 47 22.5V6.5ZM43.5 5C44.3284 5 45 5.67157 45 6.5V22.5C45 23.3284 44.3284 24 43.5 24C42.6716 24 42 23.3284 42 22.5V6.5C42 5.67157 42.6716 5 43.5 5Z"
        fill="#FFC864"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 3.5C10 1.567 11.567 0 13.5 0C15.433 0 17 1.567 17 3.5V26.5C17 28.433 15.433 30 13.5 30C11.567 30 10 28.433 10 26.5V3.5ZM13.5 2C12.6716 2 12 2.67157 12 3.5V26.5C12 27.3284 12.6716 28 13.5 28C14.3284 28 15 27.3284 15 26.5V3.5C15 2.67157 14.3284 2 13.5 2Z"
        fill="#FFC864"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M42 3.5C42 1.567 40.433 0 38.5 0C36.567 0 35 1.567 35 3.5V26.5C35 28.433 36.567 30 38.5 30C40.433 30 42 28.433 42 26.5V3.5ZM38.5 2C39.3284 2 40 2.67157 40 3.5V26.5C40 27.3284 39.3284 28 38.5 28C37.6716 28 37 27.3284 37 26.5V3.5C37 2.67157 37.6716 2 38.5 2Z"
        fill="#FFC864"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15 11H37V18H15V11ZM17 13V16H35V13H17Z"
        fill="#FFC864"
      />
    </svg>
  );
}

Dumbells.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 52 / 30,
  svg: Dumbells,
  title,
};
