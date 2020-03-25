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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
/**
 * External dependencies
 */
import styled from 'styled-components';
import { useState } from 'react';
import { ViewHeader, FloatingTab } from '../../../components';

const FilterContainer = styled.div`
  padding: 0 20px 20px;
  border-bottom: ${({ theme }) => theme.subNavigationBar.border};
`;

const storiesFilter = [
  { label: 'All Stories', value: 'all-stories ' },
  { label: 'Drafts', value: 'drafts' },
  { label: 'Active Stories', value: 'active-stories ' },
  { label: 'My Templates', value: 'my-templates ' },
];

function MyStories() {
  const [currentFilter, setFilter] = useState(storiesFilter[0].value);
  return (
    <div>
      <ViewHeader>{__('My Stories', 'web-stories')}</ViewHeader>
      <FilterContainer>
        {storiesFilter.map((filter) => (
          <FloatingTab
            key={filter.value}
            onClick={(_, value) => setFilter(value)}
            name="all-stories"
            value={filter.value}
            isSelected={currentFilter === filter.value}
          >
            {filter.label}
          </FloatingTab>
        ))}
      </FilterContainer>
    </div>
  );
}

export default MyStories;
