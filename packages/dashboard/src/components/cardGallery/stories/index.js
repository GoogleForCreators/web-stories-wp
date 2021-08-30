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
import { boolean, text } from '@storybook/addon-knobs';
/**
 * Internal dependencies
 */
import CardGallery from '..';

const demoPosterGroup = [
  {
    id: 0,
    webp: 'https://placekitten.com/g/200/300',
    png: 'https://placekitten.com/g/200/300',
  },
  {
    id: 1,
    webp: 'https://placekitten.com/g/200/300',
    png: 'https://placekitten.com/g/200/300',
  },
  {
    id: 2,
    webp: 'https://placekitten.com/g/200/300',
    png: 'https://placekitten.com/g/200/300',
  },
  {
    id: 3,
    webp: 'https://placekitten.com/g/200/300',
    png: 'https://placekitten.com/g/200/300',
  },
];
export default {
  title: 'Dashboard/Components/CardGallery',
  component: CardGallery,
};

const CardGalleryContainer = styled.div`
  padding: 20px;
`;
export const _default = () => {
  return (
    <CardGalleryContainer>
      <CardGallery
        galleryPosters={demoPosterGroup}
        isRTL={boolean('isRTL')}
        galleryLabel={text('galleryLabel', 'my aria label text')}
      />
    </CardGalleryContainer>
  );
};
