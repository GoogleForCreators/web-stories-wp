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

const title = _x('Heart', 'sticker name', 'web-stories');

function HeartCta({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <circle cx="30" cy="30" r="30" fill="#fff" fillOpacity=".5" />
      <path
        d="M44.5424 28.0704C43.0928 32.0251 29.9933 41.999 29.9933 41.999s-13.0994-9.9739-14.5491-13.9286c-1.4496-3.9548.7644-8.2826 4.9552-9.6506 3.7163-1.2187 7.7489.2985 9.6203 3.4076 1.845-3.1091 5.8776-4.6263 9.594-3.4076 4.1907 1.368 6.4047 5.6958 4.9287 9.6506z"
        fill="#F3D9E1"
        stroke="#28292B"
        strokeWidth="1.5"
        strokeMiterlimit="10"
      />
    </svg>
  );
}

HeartCta.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 60 / 60,
  svg: HeartCta,
  title,
};
