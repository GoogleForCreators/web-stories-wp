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
import { text } from '@storybook/addon-knobs';

/**
 * Internal dependencies
 */
import CardGrid from '../';
import { CardGridItem, CardPreviewContainer, CardTitle } from '../../';

export default {
  title: 'Dashboard/Components/CardGrid',
  component: CardGrid,
};

const StorybookGridItem = (
  <CardGridItem>
    <CardPreviewContainer
      editUrl={'https://www.google.com'}
      onPreviewClick={() => {}}
    >
      <div> {text('Sample Story Content', 'Sample Story')}</div>
    </CardPreviewContainer>
    <CardTitle title="Story Title" modifiedDate="12 days" />
  </CardGridItem>
);

const itemArray = new Array(12).fill(StorybookGridItem);

export const _default = () => {
  return (
    <CardGrid>
      {itemArray.map((gridItem, index) => (
        <div key={index}>{gridItem}</div>
      ))}
    </CardGrid>
  );
};
