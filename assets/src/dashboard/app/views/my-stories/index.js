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
import { useContext, useEffect, useState } from 'react';

/**
 * Internal dependencies
 */
import {
  ViewHeader,
  FloatingTab,
  CardGrid,
  CardGridItem,
  CardTitle,
} from '../../../components';
import { STORY_STATUSES } from '../../../constants';
import { ApiContext } from '../../api/api-provider';

const FilterContainer = styled.div`
  padding: 0 20px 20px;
  border-bottom: ${({ theme }) => theme.subNavigationBar.border};
`;

function MyStories() {
  const [status, setStatus] = useState(STORY_STATUSES[0].value);
  const { actions } = useContext(ApiContext);
  const [stories, setStories] = useState([]);

  useEffect(() => {
    actions.fetchStories({ status }).then(setStories);
  }, [actions, status]);

  return (
    <div>
      <ViewHeader>{__('My Stories', 'web-stories')}</ViewHeader>
      <FilterContainer>
        {STORY_STATUSES.map((currentStatus) => (
          <FloatingTab
            key={currentStatus.value}
            onClick={(_, value) => setStatus(value)}
            name="all-stories"
            value={currentStatus.value}
            isSelected={status === currentStatus.value}
          >
            {currentStatus.label}
          </FloatingTab>
        ))}
      </FilterContainer>
      <CardGrid>
        {stories.map((story) => (
          <CardGridItem key={story.id}>
            <CardTitle
              title={story.title}
              modifiedDate={story.modified.startOf('day').fromNow()}
            />
          </CardGridItem>
        ))}
      </CardGrid>
    </div>
  );
}

export default MyStories;
