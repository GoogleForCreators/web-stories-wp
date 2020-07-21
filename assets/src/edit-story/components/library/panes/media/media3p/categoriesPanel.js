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

/**
 * Internal dependencies
 */
import CategoryPill from './categoryPill';

// TODO(#2360) Category should be collapsible and expandable.
const CategorySection = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.v3};
  min-height: 94px;
  padding: 30px 24px;
  display: flex;
  flex-wrap: wrap;
`;

// TODO(#2362) Wire up pill list to state and remove these fake pills.
const fakePillList = ['COVID-19', 'Nature', 'Wallpapers', 'People'];
const selectedPill = 'Nature';

const Media3pCategories = () => (
  <CategorySection>
    {
      // TODO(#2362) Wire up pill list to state and remove these fake pills.
      fakePillList.map((e, i) => (
        <CategoryPill isSelected={e == selectedPill} key={i} title={e} />
      ))
    }
  </CategorySection>
);

export default Media3pCategories;
