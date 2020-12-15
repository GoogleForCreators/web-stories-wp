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
import { Left, Center, Right, Justified } from './toggles';

import useSetup from './useSetup';

function TextAlignment({ children }) {
  useSetup();

  return children;
}

TextAlignment.propTypes = {
  children: PropTypes.node.isRequired,
};

TextAlignment.Left = Left;
TextAlignment.Center = Center;
TextAlignment.Right = Right;
TextAlignment.Justified = Justified;

export default TextAlignment;
