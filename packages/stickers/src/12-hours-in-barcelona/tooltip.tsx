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

const title = _x('Tooltip', 'sticker name', 'web-stories');

const ToolTip = ({ style }) => (
  <svg
    style={style}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 80 33.6"
    fill="none"
  >
    <title>{title}</title>
    <path
      d="M80,2v23c0,1.1-0.9,2-2,2H45.7l-5,6.2c-0.4,0.5-1.2,0.5-1.6,0l-5-6.2H2c-1.1,0-2-0.9-2-2V2c0-1.1,0.9-2,2-2h76 C79.1,0,80,0.9,80,2z"
      fill="#fff"
    />
  </svg>
);

ToolTip.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 80 / 33.6,
  svg: ToolTip,
  title,
};
