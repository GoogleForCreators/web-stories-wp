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
import PropTypes from 'prop-types';

/* Recursive Shape Type from: https://github.com/facebook/react/issues/5676#issuecomment-739092902 */
export const RecursiveShapeType = (
  propsTypes = {},
  recursiveKey = 'children'
) => {
  propsTypes[recursiveKey] = PropTypes.arrayOf(Type);

  function Type(...args) {
    // eslint-disable-next-line prefer-spread
    return PropTypes.shape(propsTypes).apply(null, args);
  }

  return Type;
};
