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
import { useRef, useState, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import { useVirtual } from 'react-virtual';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SectionWithRef as Section } from '../../../common';
import { UnitsProvider } from '../../../../../units';
import { PAGE_RATIO, TEXT_SET_SIZE } from '../../../../../constants';
import PillGroup from '../../shared/pillGroup';
import { PANE_PADDING } from '../../shared';
import useRovingTabIndex from '../../../../../utils/useRovingTabIndex';
import useLibrary from '../../../useLibrary';
import TextSet from './textSet';

const TextSetContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 12px;
  column-gap: 12px;
  margin-top: 28px;
`;

/* Undo the -1.5em set by the Pane */
const CategoryWrapper = styled.div`
  margin-left: -${PANE_PADDING};
  margin-right: -${PANE_PADDING};
`;

const CATEGORIES = {
  contact: __('Contact', 'web-stories'),
  editorial: __('Editorial', 'web-stories'),
  list: __('List', 'web-stories'),
  cover: __('Cover', 'web-stories'),
  section_header: __('Header', 'web-stories'),
  step: __('Steps', 'web-stories'),
  table: __('Table', 'web-stories'),
  quote: __('Quote', 'web-stories'),
};

function TextSets({ paneRef }) {
  const [selectedCat, setSelectedCat] = useState(null);
  // const ref = useRef();
  // const sectionRef = useRef();
  const { textSets } = useLibrary(({ state: { textSets } }) => ({ textSets }));

  const allTextSets = useMemo(() => Object.values(textSets).flat(), [textSets]);
  const filteredTextSets = useMemo(
    () => (selectedCat ? textSets[selectedCat] : allTextSets),
    [selectedCat, textSets, allTextSets]
  );
  const categories = useMemo(
    () =>
      Object.keys(textSets).map((cat) => ({
        id: cat,
        label: CATEGORIES[cat] ?? cat,
      })),
    [textSets]
  );
  // debugger;

  const rowVirtualizer = useVirtual({
    size: Math.ceil(filteredTextSets.length / 2),
    parentRef: paneRef,
    estimateSize: useCallback(() => TEXT_SET_SIZE + 12, []),
    overscan: 5,
  });

  // console.log(rowVirtualizer);

  // useRovingTabIndex({ ref });

  const sectionId = `section-${uuidv4()}`;
  const title = __('Text Sets', 'web-stories');
  return (
    <Section id={sectionId} title={title}>
      <CategoryWrapper>
        <PillGroup
          items={categories}
          selectedItemId={selectedCat}
          selectItem={setSelectedCat}
          deselectItem={() => setSelectedCat(null)}
        />
      </CategoryWrapper>
      <UnitsProvider
        pageSize={{
          width: TEXT_SET_SIZE,
          height: TEXT_SET_SIZE / PAGE_RATIO,
        }}
      >
        <div
          id="outer"
          style={{
            height: `${rowVirtualizer.totalSize}px`,
            width: '100%',
            position: 'relative',
            marginTop: '28px',
          }}
        >
          {rowVirtualizer.virtualItems.map((virtualRow) => (
            <div
              id={`row-${virtualRow.index}`}
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                columnGap: '12px',
              }}
            >
              {filteredTextSets[virtualRow.index * 2].length > 0 && (
                <TextSet
                  key={virtualRow.index * 2}
                  elements={filteredTextSets[virtualRow.index * 2]}
                />
              )}
              {filteredTextSets[virtualRow.index * 2 + 1] &&
                filteredTextSets[virtualRow.index * 2 + 1].length > 0 && (
                  <TextSet
                    key={virtualRow.index * 2 + 1}
                    elements={filteredTextSets[virtualRow.index * 2 + 1]}
                  />
                )}
            </div>
          ))}
        </div>
      </UnitsProvider>
      {/* <TextSetContainer ref={ref} role="list" aria-labelledby={sectionId}>
        <UnitsProvider
          pageSize={{
            width: TEXT_SET_SIZE,
            height: TEXT_SET_SIZE / PAGE_RATIO,
          }}
        >
          {filteredTextSets.map(
            (elements, index) =>
              elements.length > 0 && <TextSet key={index} elements={elements} />
          )}
        </UnitsProvider>
      </TextSetContainer> */}
    </Section>
  );
}

export default TextSets;
