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

const FashionArrowDark = ({ style }) => (
  <svg
    style={style}
    viewBox="0 0 16 9"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>{title}</title>
    <path
      d="M15.8206 4.43678c.2145-.21453.2145-.56235 0-.77688L12.3246.163967c-.2145-.2145284-.5623-.2145284-.7769 0-.2145.214528-.2145.562346 0 .776874l3.1075 3.107499-3.1075 3.1075c-.2145.21453-.2145.56235 0 .77687.2146.21453.5624.21453.7769 0l3.496-3.49593zM.0507812 4.59767H15.4321V3.49901H.0507812v1.09866z"
      fill="#212121"
    />
  </svg>
);

FashionArrowDark.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 16 / 9,
  svg: FashionArrowDark,
  title,
};
