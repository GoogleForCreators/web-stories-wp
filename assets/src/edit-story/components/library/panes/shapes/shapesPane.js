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
import styled from 'styled-components';
import { __ } from '@web-stories-wp/i18n';
import { useRef } from 'react';
import STICKERS from '@web-stories-wp/stickers';

/**
 * Internal dependencies
 */
import { useFeatures } from 'flagged';
import { MASKS } from '../../../../masks';
import { Section, SearchInput } from '../../common';
import { Pane } from '../shared';
import useRovingTabIndex from '../../../../utils/useRovingTabIndex';
import ShapePreview from './shapePreview';
import StickerButton from './stickerButton';
import paneId from './paneId';

const SectionContent = styled.div`
  position: relative;

  display: grid;
  grid-column-gap: 12px;
  grid-row-gap: 24px;
  @media screen and (min-width: 1220px) {
    grid-template-columns: repeat(4, 1fr);
  }
  @media screen and (min-width: 1100px) and (max-width: 1220px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media screen and (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const STICKER_TYPES = Object.keys(STICKERS);

function ShapesPane(props) {
  const { showTextAndShapesSearchInput, enableStickers } = useFeatures();

  const ref = useRef();
  useRovingTabIndex({ ref });
  return (
    <Pane id={paneId} {...props} isOverflowScrollable={enableStickers}>
      {showTextAndShapesSearchInput && (
        <SearchInput
          initialValue={''}
          placeholder={__('Search', 'web-stories')}
          onSearch={() => {}}
          disabled
        />
      )}
      <Section title={__('Shapes', 'web-stories')}>
        <SectionContent ref={ref}>
          {MASKS.filter((mask) => mask.showInLibrary).map((mask, i) => (
            <ShapePreview mask={mask} key={mask.type} index={i} isPreview />
          ))}
        </SectionContent>
      </Section>
      {enableStickers && (
        <Section title={__('Stickers', 'web-stories')}>
          <SectionContent>
            {STICKER_TYPES.map((stickerType) => (
              <StickerButton key={stickerType} stickerType={stickerType} />
            ))}
          </SectionContent>
        </Section>
      )}
    </Pane>
  );
}

export default ShapesPane;
