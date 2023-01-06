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
import { useCallback, useMemo, useState } from '@googleforcreators/react';
import type { PropsWithChildren } from 'react';
/**
 * Internal dependencies
 */
import { useStory } from '../story/useStory';
import type {
  setHighlightProps,
  selectElementProps,
  HighlightState,
  Highlight,
  HighlightsState,
} from '../../types/highlightsProvider';
import Context from './context';
import { HighlightType, STATES } from './states';

function HighlightsProvider({ children }: PropsWithChildren<unknown>) {
  const [highlighted, setHighlighted] = useState<HighlightsState>({});
  const {
    actions: { setSelectedElementsById, setCurrentPage },
  } = useStory();

  const selectElement = useCallback(
    ({ elementId, elements, pageId }: selectElementProps) => {
      if (pageId) {
        setCurrentPage({ pageId });
      }
      if (elements?.length) {
        const elementIds = elements.map((element) => element.id);
        setSelectedElementsById({ elementIds });
      } else if (elementId) {
        const elementIds = [elementId];
        setSelectedElementsById({ elementIds });
      }
    },
    [setCurrentPage, setSelectedElementsById]
  );

  const setHighlights = useCallback(
    ({ elements, elementId, pageId, highlight }: setHighlightProps) => {
      if (elements || elementId || pageId) {
        selectElement({ elements, elementId, pageId });
      }

      if (highlight && STATES[highlight]) {
        const { tab, section, ...highlightState }: Highlight = STATES[
          highlight
        ] as Highlight;
        setHighlighted({
          [highlight]: { ...highlightState, showEffect: true },
          tab,
          section,
        });
      }
    },
    [selectElement]
  );

  const onFocusOut = useCallback(() => setHighlighted({}), [setHighlighted]);

  const cancelEffect = useCallback(
    (highlight: HighlightType) =>
      setHighlighted((state: HighlightState) => ({
        ...state,
        [highlight]: { ...state[highlight], showEffect: false },
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

export default HighlightsProvider;
