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

const WellbeingArrowDark = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 205 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      d="M.603516 6.49949L204.27 6.49947M199.464.875l4.806 5.8336-4.806 5.8336"
      stroke="#1F2A2E"
      strokeWidth="1.09867"
    />
  </svg>
);

WellbeingArrowDark.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 205 / 13,
  svg: WellbeingArrowDark,
  title,
};
