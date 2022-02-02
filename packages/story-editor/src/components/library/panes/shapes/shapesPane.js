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
import { __ } from '@googleforcreators/i18n';
import { useRef } from '@googleforcreators/react';
import STICKERS from '@googleforcreators/stickers';
import { MASKS } from '@googleforcreators/masks';

/**
 * Internal dependencies
 */
import { Section } from '../../common';
import { Pane } from '../shared';
import useRovingTabIndex from '../../../../utils/useRovingTabIndex';
import ShapePreview from './shapePreview';
import StickerPreview from './stickerPreview';
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
  const ref = useRef();
  useRovingTabIndex({ ref });

  const stickersRef = useRef(null);
  useRovingTabIndex({ ref: stickersRef });
  return (
    <Pane id={paneId} {...props} isOverflowScrollable>
      <Section
        data-testid="shapes-library-pane"
        title={__('Shapes', 'web-stories')}
      >
        <SectionContent ref={ref}>
          {MASKS.filter((mask) => mask.showInLibrary).map((mask, i) => (
            <ShapePreview mask={mask} key={mask.type} index={i} isPreview />
          ))}
        </SectionContent>
      </Section>
      <Section
        data-testid="stickers-library-pane"
        title={__('Stickers', 'web-stories')}
      >
        <SectionContent ref={stickersRef}>
          {STICKER_TYPES.map((stickerType, i) => (
            <StickerPreview
              key={stickerType}
              index={i}
              stickerType={stickerType}
            />
          ))}
        </SectionContent>
      </Section>
    </Pane>
  );
}

export default ShapesPane;
