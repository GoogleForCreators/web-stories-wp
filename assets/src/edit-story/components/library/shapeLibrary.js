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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { MASKS } from '../../masks';
import { Section, Title, SearchInput, Header } from './common';

const PREVIEW_SIZE = 36;

const ShapePreview = styled.div`
  position: relative;
  display: inline-block;
  margin-left: 24px;
  margin-right: 24px;
`;

const Square = styled.div`
  width: ${PREVIEW_SIZE}px;
  height: ${PREVIEW_SIZE}px;
  background-color: ${({ theme }) => theme.colors.fg.v1};
`;

const Path = styled.path`
  fill: ${({ theme }) => theme.colors.fg.v1};
`;

function MediaLibrary({ onInsert }) {
  return (
    <>
      <Header>
        <Title>{__('Shapes', 'web-stories')}</Title>
      </Header>
      <SearchInput
        value={''}
        placeholder={__('Search shapes...', 'web-stories')}
        onChange={() => {}}
      />
      <Section title={__('Basic shapes', 'web-stories')}>
        {/** Square shape */}
        <ShapePreview
          key={'square'}
          onClick={() => {
            onInsert('square', {
              backgroundColor: '#333',
              width: 200,
              height: 200,
              x: 5,
              y: 5,
              rotationAngle: 0,
            });
          }}
          alt={__('Square', 'web-stories')}
        >
          <Square />
        </ShapePreview>
        {/** Basic masks */}
        {MASKS.map((mask) => (
          <ShapePreview
            key={mask.type}
            onClick={() => {
              onInsert('square', {
                backgroundColor: '#333',
                width: 200,
                height: 200,
                x: 5,
                y: 5,
                rotationAngle: 0,
                mask: {
                  type: mask.type,
                },
              });
            }}
            alt={mask.name}
          >
            <svg viewBox={'0 0 1 1'} width={PREVIEW_SIZE} height={PREVIEW_SIZE}>
              <Path d={mask.path} />
            </svg>
          </ShapePreview>
        ))}
      </Section>
    </>
  );
}

MediaLibrary.propTypes = {
  onInsert: PropTypes.func.isRequired,
};

export default MediaLibrary;
