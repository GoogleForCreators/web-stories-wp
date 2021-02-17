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
import { useState } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { Icons } from '../../../../design-system';
import TabView from '../';

const TabWrapper = styled.div`
  background: ${({ theme }) => theme.DEPRECATED_THEME.colors.bg.workspace};
`;

const TabContent = styled.div`
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.white};
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body1.family};
  padding: 16px;
`;

export default {
  title: 'Stories Editor/Components/TabView',
  component: TabView,
};

export const _default = () => {
  const [tab, setTab] = useState('design');
  const tabs = [
    {
      id: 'design',
      title: 'Design',
      icon: function Warning() {
        return <Icons.Magnifier className="alert" />;
      },
    },
    {
      id: 'document',
      title: 'Document',
      icon: function Warning() {
        return <Icons.ExclamationTriangle className="alert warning" />;
      },
    },
    {
      id: 'pre-publish',
      title: 'Pre-publish',
      icon: function Error() {
        return <Icons.ExclamationOutline className="alert error" />;
      },
    },
  ];

  return (
    <TabWrapper>
      <TabView onTabChange={(id) => setTab(id)} tabs={tabs} />
      <TabContent>{`Tab content: ${
        tabs.find(({ id }) => id === tab).title
      }`}</TabContent>
    </TabWrapper>
  );
};

_default.parameters = {
  backgrounds: {
    default: 'Dark',
  },
};
