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
import { ThemeProvider } from 'styled-components';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';

/**
 * Internal dependencies
 */
import { theme } from '../../..';
import { TabGroup } from '..';

export default {
  title: 'DesignSystem/Components/TabGroup',
};
export const _default = () => {
  const [currentTabId, setCurrentTabId] = useState();
  return (
    <ThemeProvider theme={theme}>
      <TabGroup
        activeTabId={currentTabId}
        tabs={[
          { id: '1', title: 'tab one' },
          { id: '2', title: 'tab two' },
          { id: '3', title: 'tab three' },
        ]}
        label={'tab group label'}
        handleTabClicked={(e, id, tabRefs) => {
          action('tab clicked')(tabRefs.current[id]);
          setCurrentTabId(id);
        }}
      />
    </ThemeProvider>
  );
};
