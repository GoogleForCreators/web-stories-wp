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

const title = _x('YouTube', 'sticker name', 'web-stories');

function YouTubeIcon({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 28 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M20.2878 0H7.17684C0 0 0 2.00053 0 6.92327V11.7335C0 16.4156 1.01677 18.6567 7.17684 18.6567H20.2898C25.8533 18.6567 27.4666 17.345 27.4666 11.7335V6.92327C27.4647 1.74246 27.1931 0 20.2878 0ZM10.9268 12.985V5.43306L18.3296 9.19739L10.9268 12.985Z"
        fill="#FAF4EA"
      />
    </svg>
  );
}

YouTubeIcon.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 28 / 19,
  svg: YouTubeIcon,
  title,
};
