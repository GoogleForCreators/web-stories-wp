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

const title = _x('White Lightning', 'sticker name', 'web-stories');

function WhiteLightning({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 56 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M55.5 0L27.8756 32.1319L26.0713 24.8264L0.5 46L28.9955 13.3109L31.3597 19.8735L55.5 0Z"
        fill="white"
      />
    </svg>
  );
}

WhiteLightning.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 56 / 46,
  svg: WhiteLightning,
  title,
};
