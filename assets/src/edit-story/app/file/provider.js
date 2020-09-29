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
import { useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import Context from './context';

function FileProvider({ children }) {
  const getFonts = useCallback(
    () =>
      import(/* webpackChunkName: "chunk-fonts" */ '../../../fonts/fonts').then(
        (res) => res.default
      ),
    []
  );
  const state = {
    state: {},
    actions: {
      getFonts,
    },
  };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

FileProvider.propTypes = {
  children: PropTypes.node,
};

export default FileProvider;
