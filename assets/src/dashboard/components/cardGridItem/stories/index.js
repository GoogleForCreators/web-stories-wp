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
import { text } from '@storybook/addon-knobs';

/**
 * Internal dependencies
 */
import { STORY_STATUS } from '../../../constants';
import { STORYBOOK_PAGE_SIZE } from '../../../storybookUtils';
import {
  CardGrid,
  CardGridItem,
  CardPreviewContainer,
  CardTitle,
} from '../../';

export default {
  title: 'Dashboard/Components/CardGridItem',
  component: CardGridItem,
};

const Card = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  padding: 20px;
  background-color: orange;
`;

export const _default = () => {
  return (
    <CardGrid pageSize={STORYBOOK_PAGE_SIZE}>
      <CardGridItem>
        <CardPreviewContainer
          ariaLabel="Preview aria label"
          bottomAction={{
            targetAction: 'https://www.google.com',
            label: 'Open in Editor',
          }}
          centerAction={{
            targetAction: '',
            label: 'Preview',
          }}
          pageSize={STORYBOOK_PAGE_SIZE}
          story={{}}
        >
          <Card>{text('Sample Story Content', 'Sample Story')}</Card>
        </CardPreviewContainer>
        <CardTitle
          title="How to be a leader in the apocalpyse"
          author="Rick Grimes"
          displayDate="2020-01-30"
          status={STORY_STATUS.DRAFT}
          onEditCancel={() => {}}
          onEditComplete={() => {}}
          tabIndex={0}
        />
      </CardGridItem>
    </CardGrid>
  );
};

export const _publishedStory = () => {
  return (
    <CardGrid pageSize={STORYBOOK_PAGE_SIZE}>
      <CardGridItem>
        <CardPreviewContainer
          ariaLabel="Preview aria label"
          bottomAction={{
            targetAction: 'https://www.google.com',
            label: 'Open in Editor',
          }}
          centerAction={{
            targetAction: '',
            label: 'Preview',
          }}
          pageSize={STORYBOOK_PAGE_SIZE}
          story={{}}
        >
          <Card>{text('Sample Story Content', 'Sample Story')}</Card>
        </CardPreviewContainer>
        <CardTitle
          title="The 6 fingered man"
          author="Inigo Moñtoya"
          displayDate="2020-01-30"
          status={STORY_STATUS.PUBLISH}
          onEditCancel={() => {}}
          onEditComplete={() => {}}
          tabIndex={0}
        />
      </CardGridItem>
    </CardGrid>
  );
};
