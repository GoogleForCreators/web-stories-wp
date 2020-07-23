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
import { useState } from 'react';

/**
 * Internal dependencies
 */
import { ArrowDownButton } from '../../../../button/index';
import CategoryPill from './categoryPill';
// TODO(#2360) Category should be collapsible and expandable.
const CategorySection = styled.div`
  background-color: ${({ theme }) => theme.colors.bg.v3};
  min-height: 94px;
  padding: 30px 24px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// This hides the category pills unless expanded
const CategoryPillContainer = styled.div`
  height: ${(props) => (props.isExpanded ? 'auto' : '36px')};
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
`;

// Flips the button upside down when expanded;
const ExpandButton = styled(ArrowDownButton)`
  ${(props) => props.isExpanded && 'transform: matrix(1, 0, 0, -1, 0, 0);'};
`;
// TODO(#2362) Wire up pill list to state and remove these fake pills.
const fakePillList = [
  'COVID-19',
  'Nature',
  'Wallpapers',
  'People',
  'Texture & Pattern',
  'Business & Work',
  'Travel',
  'Technology',
  'Animals',
  'Interiors',
  'Architecture',
  'Food & Drinks',
];

const Media3pCategories = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPill, setSelectedPill] = useState(-1);

  return (
    <CategorySection aria-expanded={isExpanded}>
      <CategoryPillContainer isExpanded={isExpanded} role="tablist">
        {
          // TODO(#2362) Wire up pill list to state and remove these fake pills.
          fakePillList.map((e, i) => (
            <CategoryPill
              isSelected={i == selectedPill}
              key={i}
              title={e}
              onClick={() =>
                i !== selectedPill ? setSelectedPill(i) : setSelectedPill(-1)
              }
            />
          ))
        }
      </CategoryPillContainer>
      <ExpandButton
        onClick={() => setIsExpanded(!isExpanded)}
        isExpanded={isExpanded}
      />
    </CategorySection>
  );
};

export default Media3pCategories;
