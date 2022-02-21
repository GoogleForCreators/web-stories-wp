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
import { useMemo, useCallback, useRef } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import { useVirtual } from 'react-virtual';
import { __ } from '@googleforcreators/i18n';
import { UnitsProvider } from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import {
  getVirtualizedItemIndex,
  useVirtualizedGridNavigation,
  VirtualizedContainer,
  PANEL_GRID_ROW_GAP,
  VirtualizedWrapper,
} from '../../shared/virtualizedPanelGrid';
import TextSet from './textSet';
import { TEXT_SET_PAGE_SIZE, TEXT_SET_SIZE } from './constants';

function TextSets({ paneRef, filteredTextSets }) {
  const containerRef = useRef();
  const textSetRefs = useRef({});

  const textSetIds = useMemo(
    () => filteredTextSets.map((textSet) => textSet.id),
    [filteredTextSets]
  );

  const rowVirtualizer = useVirtual({
    size: Math.ceil((filteredTextSets || []).length / 2),
    parentRef: paneRef,
    estimateSize: useCallback(() => TEXT_SET_SIZE + PANEL_GRID_ROW_GAP, []),
    overscan: 4,
  });

  const columnVirtualizer = useVirtual({
    horizontal: true,
    size: 2,
    parentRef: paneRef,
    estimateSize: useCallback(() => TEXT_SET_SIZE + PANEL_GRID_ROW_GAP, []),
    overscan: 0,
  });

  const {
    activeGridItemId,
    handleGridFocus,
    handleGridItemFocus,
    isGridFocused,
  } = useVirtualizedGridNavigation({
    rowVirtualizer,
    containerRef,
    gridItemRefs: textSetRefs,
    gridItemIds: textSetIds,
  });

  return (
    <UnitsProvider pageSize={TEXT_SET_PAGE_SIZE}>
      <VirtualizedWrapper height={rowVirtualizer.totalSize}>
        <VirtualizedContainer
          height={rowVirtualizer.totalSize}
          ref={containerRef}
          columnWidth={TEXT_SET_SIZE}
          rowHeight={TEXT_SET_SIZE}
          onFocus={handleGridFocus}
          role="group"
          aria-label={__('Text Set Options', 'web-stories')}
        >
          {rowVirtualizer.virtualItems.map((virtualRow) =>
            columnVirtualizer.virtualItems.map((virtualColumn) => {
              const gridIndex = getVirtualizedItemIndex({
                columnIndex: virtualColumn.index,
                rowIndex: virtualRow.index,
              });

              const textSet = filteredTextSets[gridIndex];

              if (!textSet?.elements) {
                return null;
              }

              const isActive = activeGridItemId === textSet.id && isGridFocused;

              return (
                <TextSet
                  key={gridIndex}
                  id={textSet.id}
                  data-testid={`text_set_${textSet.id}`}
                  ref={(el) => (textSetRefs.current[textSet.id] = el)}
                  translateY={virtualRow.start}
                  translateX={virtualColumn.start}
                  aria-label={textSet.title}
                  isActive={isActive}
                  onFocus={() => handleGridItemFocus(textSet.id)}
                  elements={textSet.elements}
                  index={gridIndex}
                />
              );
            })
          )}
        </VirtualizedContainer>
      </VirtualizedWrapper>
    </UnitsProvider>
  );
}

TextSets.propTypes = {
  paneRef: PropTypes.object,
  filteredTextSets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      elements: PropTypes.array,
      title: PropTypes.string,
    })
  ),
};

export default TextSets;
