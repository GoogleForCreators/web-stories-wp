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

const title = _x('Arrow', 'sticker name', 'web-stories');
const WellbeingArrow = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 205 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      d="M.333008 6.49949L204 6.49947M199.193.875L204 6.7086l-4.807 5.8336"
      stroke="#fff"
      strokeWidth="1.09867"
    />
  </svg>
);

WellbeingArrow.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 205 / 13,
  svg: WellbeingArrow,
  title,
};
