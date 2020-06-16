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
import moment from 'moment';
import { text } from '@storybook/addon-knobs';

/**
 * Internal dependencies
 */
import CardGrid from '../';
import { CardGridItem, CardPreviewContainer, CardTitle } from '../../';
import { STORY_STATUS } from '../../../constants';

export default {
  title: 'Dashboard/Components/CardGrid',
  component: CardGrid,
};

const Card = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  padding: 20px;
  background-color: orange;
`;

const StorybookGridItem = (
  <CardGridItem>
    <CardPreviewContainer
      bottomAction={{
        targetAction: 'https://www.google.com',
        label: 'Open in Editor',
      }}
      centerAction={{
        targetAction: '',
        label: 'Preview',
      }}
      pageSize={{ width: 212, height: 377.9, fullBleedHeight: 58.94 }}
    >
      <Card>{text('Sample Story Content', 'Sample Story')}</Card>
    </CardPreviewContainer>
    <CardTitle
      title="Story Title"
      author={'Ron Weasley'}
      status={STORY_STATUS.DRAFT}
      displayDate={moment().subtract(2, 'minutes')}
      onEditCancel={() => {}}
      onEditComplete={() => {}}
    />
  </CardGridItem>
);

const itemArray = new Array(12).fill(StorybookGridItem);

export const _default = () => {
  return (
    <CardGrid pageSize={{ width: 212, height: 377.9, fullBleedHeight: 58.94 }}>
      {itemArray.map((gridItem, index) => (
        <div key={index}>{gridItem}</div>
      ))}
    </CardGrid>
  );
};
