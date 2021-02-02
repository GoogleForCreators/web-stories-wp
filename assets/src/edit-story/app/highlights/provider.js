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
import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { useStory } from '../story';
import Context from './context';
import { STATES } from './states';

function HighlightsProvider({ children }) {
  const [highlighted, setHighlighted] = useState({});
  const { setSelectedElementsById, setCurrentPage } = useStory(
    ({ actions }) => ({
      setSelectedElementsById: actions.setSelectedElementsById,
      setCurrentPage: actions.setCurrentPage,
    })
  );

  const selectElement = useCallback(
    ({ elementId, elements, pageId }) => {
      if (pageId) {
        setCurrentPage({ pageId });
      }
      if (Array.isArray(elements)) {
        setSelectedElementsById({
          elementIds: elements.map(({ id }) => id),
        });
      } else if (elementId) {
        setSelectedElementsById({ elementIds: [elementId] });
      }
    },
    [setCurrentPage, setSelectedElementsById]
  );

  const setHighlights = useCallback(
    ({ elements, elementId, pageId, highlight }) => {
      if (elements || elementId || pageId) {
        selectElement({ elements, elementId, pageId });
      }

      if (highlight) {
        const { tab, ...highlightState } = STATES[highlight];
        setHighlighted({
          [highlight]: { ...highlightState, showEffect: true },
          tab,
        });
      }
    },
    [selectElement]
  );

  const onFocusOut = useCallback(() => setHighlighted({}), [setHighlighted]);

  const cancelEffect = useCallback(
    (stateKey) =>
      setHighlighted((state) => ({
        [stateKey]: { ...state[stateKey], showEffect: false },
      })),
    []
  );

  const contextValue = useMemo(
    () => ({
      setHighlights,
      onFocusOut,
      cancelEffect,
      ...highlighted,
    }),
    [cancelEffect, onFocusOut, setHighlights, highlighted]
  );

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

HighlightsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default HighlightsProvider;
