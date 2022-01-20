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

const title = _x('Orange Lightning', 'sticker name', 'web-stories');

function OrangeLightning({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 56 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.4068 32.1319L55.0627 0L30.8949 19.8735L28.528 13.3109L0 46L25.6004 24.8264L27.4068 32.1319ZM1.2141 44.8176L25.6813 24.5813L27.4762 31.8407L53.9192 1.11813L30.8318 20.1032L28.478 13.577L1.2141 44.8176Z"
        fill="#F8754C"
      />
    </svg>
  );
}

OrangeLightning.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 56 / 46,
  svg: OrangeLightning,
  title,
};
