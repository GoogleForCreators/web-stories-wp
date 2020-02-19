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
import { useState } from 'react';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../../types';
import Context from './context';
import useLayers from './useLayers';

function LayerProvider({ children }) {
  const layers = useLayers();
  const [isReordering, setIsReordering] = useState(false);
  const [currentSeparator, setCurrentSeparator] = useState(null);

  const state = {
    state: {
      layers,
      isReordering,
      currentSeparator,
    },
    actions: {
      setIsReordering,
      setCurrentSeparator,
    },
  };

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

LayerProvider.propTypes = {
  children: StoryPropTypes.children,
};

export default LayerProvider;
