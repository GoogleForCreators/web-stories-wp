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
import { useState } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icons, Text } from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import TabView from '..';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 40%);
  column-gap: 32px;
`;

const TabWrapper = styled.div`
  background: ${({ theme }) => theme.colors.bg.primary};
`;

const TabContent = styled.section`
  padding: 16px;
`;
const UnjustifiedTabView = styled(TabView)`
  justify-content: center;
`;

export default {
  title: 'Stories Editor/Components/TabView',
  component: TabView,
};

const ICON_TABS = [
  {
    id: 'media',
    content: 'Media',
    icon: Icons.ArrowCloud,
  },
  {
    id: 'thirdparty',
    content: 'Thirdparty',
    icon: Icons.Picture,
  },
  {
    id: 'text',
    content: 'Text',
    icon: Icons.LetterT,
  },
  {
    id: 'shapes',
    content: 'Shapes',
    icon: Icons.Shapes,
  },
  {
    id: 'layouts',
    content: 'Layouts',
    icon: Icons.Box4Alternate,
  },
];

const TEXT_TABS = [
  {
    id: 'design',
    title: 'Design',
  },
  {
    id: 'document',
    title: 'Document',
  },
  {
    id: 'pre-publish',
    title: 'Pre-publish',
    icon: function Error() {
      return <Icons.ExclamationOutline className="alert error" />;
    },
  },
];

function TabDisplay({ TabsComponent, tabs }) {
  const [tab, setTab] = useState(tabs[0].id);
  const activeTab = tabs.find(({ id }) => id === tab);
  return (
    <TabWrapper>
      <TabsComponent onTabChange={(id) => setTab(id)} tabs={tabs} />
      <TabContent>
        <Text.Paragraph>{`Tab content: ${
          activeTab.content || activeTab.title
        }`}</Text.Paragraph>
      </TabContent>
    </TabWrapper>
  );
}

TabDisplay.propTypes = {
  TabsComponent: PropTypes.func.isRequired,
  tabs: PropTypes.array.isRequired,
};

export const _default = {
  render: () => {
    return (
      <Wrapper>
        <TabDisplay TabsComponent={TabView} tabs={ICON_TABS} />
        <TabDisplay TabsComponent={UnjustifiedTabView} tabs={TEXT_TABS} />
      </Wrapper>
    );
  },

  parameters: {
    backgrounds: {
      default: 'Dark',
    },
  },
};
