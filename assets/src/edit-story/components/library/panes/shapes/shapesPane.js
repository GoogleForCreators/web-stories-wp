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

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useFeatures } from 'flagged';
import { MASKS } from '../../../../masks';
import useLibrary from '../../useLibrary';
import createSolid from '../../../../utils/createSolid';
import { Section, SearchInput } from '../../common';
import { Pane } from '../shared';
import { PAGE_WIDTH } from '../../../../constants';
import paneId from './paneId';

// By default, the element should be 33% of the page.
const DEFAULT_ELEMENT_WIDTH = PAGE_WIDTH / 3;
const PREVIEW_SIZE = 36;

const SectionContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: -0.2em -1em 0.5em -1em;
`;

const ShapePreview = styled.div`
  position: relative;
  padding: 0.8em 0.5em;
  flex: 0 0 25%;
  display: flex;
  justify-content: center;
  cursor: pointer;
`;

const Path = styled.path`
  fill: ${({ theme }) => theme.colors.fg.v1};
`;

function ShapesPane(props) {
  const { insertElement } = useLibrary((state) => ({
    insertElement: state.actions.insertElement,
  }));
  const { showTextAndShapesSearchInput } = useFeatures();
  return (
    <Pane id={paneId} {...props}>
      {showTextAndShapesSearchInput && (
        <SearchInput
          value={''}
          placeholder={__('Search', 'web-stories')}
          onChange={() => {}}
          disabled
        />
      )}
      <Section title={__('Basic shapes', 'web-stories')}>
        <SectionContent>
          {/** Basic masks */}
          {MASKS.map((mask) => {
            return (
              <ShapePreview
                key={mask.type}
                onClick={() => {
                  insertElement('shape', {
                    backgroundColor: createSolid(51, 51, 51),
                    width: DEFAULT_ELEMENT_WIDTH * mask.ratio,
                    height: DEFAULT_ELEMENT_WIDTH,
                    mask: {
                      type: mask.type,
                    },
                  });
                }}
              >
                <svg
                  viewBox={`0 0 1 ${1 / mask.ratio}`}
                  width={PREVIEW_SIZE * mask.ratio}
                  height={PREVIEW_SIZE}
                >
                  <title>{mask.name}</title>
                  <Path d={mask.path} />
                </svg>
              </ShapePreview>
            );
          })}
        </SectionContent>
      </Section>
    </Pane>
  );
}

export default ShapesPane;
