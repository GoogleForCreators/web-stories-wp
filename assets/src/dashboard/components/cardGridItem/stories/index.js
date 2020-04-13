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
import { actions } from '@storybook/addon-actions';

/**
 * Internal dependencies
 */
import { useState } from 'react';
import { text } from '@storybook/addon-knobs';
import {
  CardGridItem,
  CardItemMenu,
  CardPreviewContainer,
  CardTitle,
} from '../../';
import { DetailRow } from '../../../app/views/shared/storyGridView';

export default {
  title: 'Dashboard/Components/CardGridItem',
  component: CardGridItem,
};

const Container = styled.div`
  width: 250px;
`;

const Card = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  padding: 20px;
  background-color: orange;
`;

export const _default = () => {
  return (
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
      >
        <Card>{text('Sample Story Content', 'Sample Story')}</Card>
      </CardPreviewContainer>
      <CardTitle title="Story Title" modifiedDate="12 days" />
    </CardGridItem>
  );
};

export const _contextMenu = () => {
  const [contextMenuId, setContextMenuId] = useState(-1);
  return (
    <Container>
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
        >
          <Card>{text('Sample Story Content', 'Sample Story')}</Card>
        </CardPreviewContainer>
        <DetailRow>
          <CardTitle title="Story Title" modifiedDate="12 days" />
          <CardItemMenu
            onMoreButtonSelected={setContextMenuId}
            contextMenuId={contextMenuId}
            onMenuItemSelected={(item, story) => {
              actions('onClick ', item.label, story.id);
              setContextMenuId(-1);
            }}
            story={{ id: 1, status: 'publish', title: 'Sample Story' }}
          />
        </DetailRow>
      </CardGridItem>
    </Container>
  );
};
