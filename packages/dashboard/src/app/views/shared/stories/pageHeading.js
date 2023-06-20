/*
 * Copyright 2022 Google LLC
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

/**
 * Internal dependencies
 */
import { PageHeading } from '..';
import { NavProvider, LeftRail } from '../../../../components';

export default {
  title: 'Dashboard/Views/Shared/PageHeading',
  component: PageHeading,
  args: {
    showSearch: false,
    searchValue: 'value',
    heading: 'Dashboard',
    searchPlaceholder: 'Find Stories',
  },
  argTypes: {
    handleSearchChange: {
      action: 'Search with value',
    },
  },
  parameters: {
    controls: {
      exclude: ['searchOptions', 'children', 'onClear'],
    },
  },
};

const InnerContent = styled.div`
  background-color: red;
  width: 100%;
  height: 50%;
`;

export const _default = {
  render: function Render(args) {
    return (
      <NavProvider>
        <LeftRail />
        <PageHeading
          searchOptions={[]}
          handleSearchChange={(value) => args.handleSearchChange(value)}
          {...args}
        >
          <InnerContent />
        </PageHeading>
      </NavProvider>
    );
  },
};
