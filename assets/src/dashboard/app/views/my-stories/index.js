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
 * External dependencies
 */
import styled from 'styled-components';
import { useState } from 'react';

/**
 * Internal dependencies
 */
import { ViewHeader, FloatingTab } from '../../../components';
import { storiesFilters } from '../../../constants';

const FilterContainer = styled.div`
  padding: 0 20px 20px;
  border-bottom: ${({ theme }) => theme.subNavigationBar.border};
`;

function MyStories() {
  const [currentFilter, setFilter] = useState(storiesFilters[0].value);
  return (
    <div>
      <ViewHeader>{__('My Stories', 'web-stories')}</ViewHeader>
      <FilterContainer>
        {storiesFilters.map((filter) => (
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
