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
import { useCallback, useMemo, useState } from 'react';
import { useFeature } from 'flagged';

/**
 * Internal dependencies
 */
import { useConfig } from '../../../app';
import Context from './context';

function MetaBoxesProvider({ children }) {
  const { metaBoxes = {} } = useConfig();
  const isFeatureEnabled = useFeature('customMetaBoxes');

  const [metaBoxesVisible, setMetaBoxesVisible] = useState(false);
  const toggleMetaBoxesVisible = useCallback(
    () => setMetaBoxesVisible((visible) => !visible),
    [setMetaBoxesVisible]
  );

  const hasMetaBoxes =
    isFeatureEnabled &&
    Object.keys(metaBoxes).some((location) =>
      Boolean(metaBoxes[location]?.length)
    );

  const locations = Object.keys(metaBoxes);

  const state = useMemo(
    () => ({
      state: {
        metaBoxesVisible,
        metaBoxes,
        locations,
        hasMetaBoxes,
      },
      actions: {
        toggleMetaBoxesVisible,
      },
    }),
    [
      metaBoxesVisible,
      toggleMetaBoxesVisible,
      metaBoxes,
      locations,
      hasMetaBoxes,
    ]
  );

  return <Context.Provider value={state}>{children}</Context.Provider>;
}

MetaBoxesProvider.propTypes = {
  children: PropTypes.node,
};

export default MetaBoxesProvider;
