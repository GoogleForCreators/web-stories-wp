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

const title = _x('Station Clock', 'sticker name', 'web-stories');

function StationClock({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 24 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 30L1.31134e-06 0L1.5 6.55673e-08L1.5 30H0Z"
        fill="#C89D4F"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 8V3H10.5V8H9Z"
        fill="#C89D4F"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 8V3H19.5V8H18Z"
        fill="#C89D4F"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 2H24V3.5H1V2Z"
        fill="#C89D4F"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14 24.5C18.6944 24.5 22.5 20.6944 22.5 16C22.5 11.3056 18.6944 7.5 14 7.5C9.30558 7.5 5.5 11.3056 5.5 16C5.5 20.6944 9.30558 24.5 14 24.5ZM14 26C19.5229 26 24 21.5228 24 16C24 10.4772 19.5229 6 14 6C8.47715 6 4 10.4772 4 16C4 21.5228 8.47715 26 14 26Z"
        fill="#C89D4F"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.4822 15.7904V11.5757C13.4822 11.2577 13.7352 11 14.0473 11C14.3594 11 14.6124 11.2577 14.6124 11.5757V15.7908C14.7392 15.8737 14.8471 15.9837 14.9286 16.1128H18.6884C19.0005 16.1128 19.2535 16.3705 19.2535 16.6885C19.2535 17.0064 19.0005 17.2642 18.6884 17.2642H14.9289C14.7428 17.5597 14.4174 17.7554 14.0471 17.7554C13.4687 17.7554 13 17.278 13 16.6888C13 16.3115 13.1921 15.9801 13.4822 15.7904ZM14.0471 16.7735C14.0012 16.7735 13.9639 16.7354 13.9639 16.6888C13.9639 16.6769 13.9663 16.6656 13.9706 16.6553C13.9957 16.6588 14.0213 16.6606 14.0473 16.6606C14.0566 16.6606 14.0658 16.6604 14.075 16.6599C14.0745 16.6694 14.0743 16.6789 14.0743 16.6885C14.0743 16.715 14.076 16.7412 14.0795 16.7668C14.0695 16.7711 14.0585 16.7735 14.0471 16.7735Z"
        fill="#C89D4F"
      />
    </svg>
  );
}

StationClock.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 24 / 30,
  svg: StationClock,
  title,
};
