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
import { useMemo, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useVirtual } from 'react-virtual';

/**
 * Internal dependencies
 */
import { UnitsProvider } from '../../../../../units';
import { PAGE_RATIO, TEXT_SET_SIZE } from '../../../../../constants';
import {
  getVirtualizedPageIndex,
  useVirtualizedGridNavigation,
  VirtualizedContainer,
} from '../../shared/virtualizedPanelGrid';
import TextSet from './textSet';
import { TEXT_SET_ROW_GAP } from './constants';

const TextSetContainer = styled.div`
  height: ${({ height }) => `${height}px`};
  width: 100%;
  position: relative;
`;

function TextSets({ paneRef, filteredTextSets }) {
  const containerRef = useRef();
  const pageRefs = useRef({});

  const pageIds = useMemo(() => filteredTextSets.map((textSet) => textSet.id), [
    filteredTextSets,
  ]);

  const rowVirtualizer = useVirtual({
    size: Math.ceil((filteredTextSets || []).length / 2),
    parentRef: paneRef,
    estimateSize: useCallback(() => TEXT_SET_SIZE + TEXT_SET_ROW_GAP, []),
    overscan: 4,
  });

  const columnVirtualizer = useVirtual({
    horizontal: true,
    size: 2,
    parentRef: paneRef,
    estimateSize: useCallback(() => TEXT_SET_SIZE + TEXT_SET_ROW_GAP, []),
    overscan: 0,
  });

  const {
    activePageId,
    handlePageLayoutFocus,
    handlePageFocus,
    isPageLayoutsFocused,
  } = useVirtualizedGridNavigation({
    rowVirtualizer,
    containerRef,
    pageRefs,
    pageIds,
  });

  return (
    <UnitsProvider
      pageSize={{
        width: TEXT_SET_SIZE,
        height: TEXT_SET_SIZE / PAGE_RATIO,
      }}
    >
      <TextSetContainer height={rowVirtualizer.totalSize}>
        <VirtualizedContainer
          height={rowVirtualizer.totalSize}
          ref={containerRef}
          columnWidth={TEXT_SET_SIZE}
          rowHeight={TEXT_SET_SIZE}
          tab={0}
          onFocus={handlePageLayoutFocus}
        >
          {rowVirtualizer.virtualItems.map((virtualRow) =>
            columnVirtualizer.virtualItems.map((virtualColumn) => {
              const gridIndex = getVirtualizedPageIndex({
                virtualColumn,
                virtualRow,
              });

              const textSet = filteredTextSets[gridIndex];

              if (!textSet?.elements) {
                return null;
              }

              const isActive =
                activePageId === textSet.id && isPageLayoutsFocused;

              return (
                <TextSet
                  key={gridIndex}
                  ref={(el) => (pageRefs.current[textSet.id] = el)}
                  translateY={virtualRow.start}
                  translateX={virtualColumn.start}
                  isActive={isActive}
                  onFocus={() => handlePageFocus(textSet.id)}
                  elements={textSet.elements}
                />
              );
            })
          )}
        </VirtualizedContainer>
      </TextSetContainer>
    </UnitsProvider>
  );
}

TextSets.propTypes = {
  paneRef: PropTypes.object,
  filteredTextSets: PropTypes.shape([
    {
      id: PropTypes.string,
      elements: PropTypes.array,
    },
  ]),
};

export default TextSets;
