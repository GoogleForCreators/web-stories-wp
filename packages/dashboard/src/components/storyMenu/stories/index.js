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
import StoryMenu, { MoreVerticalButton } from '..';
import { STORY_CONTEXT_MENU_ITEMS } from '../../../constants';

const Container = styled.div`
  margin: 200px 0 0 50px;
  width: 300px;
  display: flex;
  justify-content: space-between;
  border: 1px solid gray;

  &:hover ${MoreVerticalButton}, &:active ${MoreVerticalButton} {
    opacity: 1;
  }
`;

export default {
  title: 'Dashboard/Components/StoryMenu',
  component: StoryMenu,
};

export const _default = () => {
  const [contextMenuId, setContextMenuId] = useState(-1);
  return (
    <Container>
      <p>{'Hover over me to see menu button'}</p>
      <StoryMenu
        onMoreButtonSelected={setContextMenuId}
        contextMenuId={contextMenuId}
        onMenuItemSelected={(item, story) => {
          actions('onClick ', item.label, story.id);
          setContextMenuId(-1);
        }}
        menuItems={STORY_CONTEXT_MENU_ITEMS}
        story={{ id: 1, status: 'publish', title: 'Sample Story' }}
      />
    </Container>
  );
};
