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
import { useMemo, useState } from 'react';

/**
 * Internal dependencies
 */
import { PAGE_WIDTH, PAGE_RATIO } from '../../constants';
import Context from './context';

function LayoutProvider({ children }) {
  const [canvasPageSize, setCanvasPageSize] = useState({
    width: PAGE_WIDTH,
    height: PAGE_WIDTH / PAGE_RATIO,
  });

  const state = useMemo(
    () => ({
      state: {
        canvasPageSize,
      },
      actions: {
        setCanvasPageSize,
      },
    }),
    [canvasPageSize]
  );

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

LayoutProvider.propTypes = {
  children: PropTypes.node,
};

export default LayoutProvider;
