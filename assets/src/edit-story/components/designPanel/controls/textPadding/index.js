/*
 * Copyright 2020 Google LLC
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
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import Lock from './lock';
import Label from './label';
import Horizontal from './horizontal';
import HasVertical from './hasVertical';
import Vertical from './vertical';

import useSetup from './useSetup';

function TextPadding({ children }) {
  useSetup();

  return children;
}

TextPadding.propTypes = {
  children: PropTypes.node.isRequired,
};

TextPadding.HasVertical = HasVertical;
TextPadding.Horizontal = Horizontal;
TextPadding.Lock = Lock;
TextPadding.Label = Label;
TextPadding.Vertical = Vertical;

export default TextPadding;
