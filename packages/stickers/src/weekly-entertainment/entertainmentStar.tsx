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

const title = _x('Star', 'sticker name', 'web-stories');

function Star({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 17 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M8.39453 0.000610352L10.1906 5.52848L16.003 5.52848L11.3007 8.94489L13.0968 14.4728L8.39453 11.0563L3.69225 14.4728L5.48836 8.94489L0.786079 5.52848L6.59842 5.52848L8.39453 0.000610352Z"
        fill="#fff"
      />
    </svg>
  );
}

Star.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 17 / 15,
  svg: Star,
  title,
};
