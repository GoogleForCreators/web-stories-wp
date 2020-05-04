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
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { useCallback } from 'react';
import {
  CategoriesPropType,
  StoriesPropType,
  TagsPropType,
  UsersPropType,
} from '../../../types';
import {
  PreviewPage,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TablePreviewCell,
  TablePreviewHeaderCell,
  TableRow,
  TableTitleHeaderCell,
} from '../../../components';
import {
  ICON_METRICS,
  ORDER_BY_SORT,
  PAGE_RATIO,
  SORT_DIRECTION,
  STORY_SORT_OPTIONS,
} from '../../../constants';
import PreviewErrorBoundary from '../../../components/previewErrorBoundary';
import { ReactComponent as ArrowIconSvg } from '../../../icons/download.svg';

const ListView = styled.div`
  width: 100%;
`;

const PreviewContainer = styled.div`
  position: relative;
  width: ${({ theme }) => theme.previewWidth.thumbnail}px;
  height: ${({ theme }) => theme.previewWidth.thumbnail / PAGE_RATIO}px;
  vertical-align: middle;
  display: inline-block;
`;

const ArrowIcon = styled.div`
  width: ${({ theme }) => theme.table.headerContentSize}px;
  height: ${({ theme }) => theme.table.headerContentSize}px;
  display: inline-block;
  color: ${({ theme }) => theme.colors.gray900};
  vertical-align: middle;

  svg {
    visibility: ${({ active }) => (active ? 'visible' : 'hidden')};
    ${({ asc }) => asc && { transform: 'rotate(180deg)' }};
  }
`;

const ArrowIconWithTitle = styled(ArrowIcon)`
  display: ${({ active }) => (active ? 'inline' : 'none')};
  margin-left: 15px;

  @media ${({ theme }) => theme.breakpoint.largeDisplayPhone} {
    margin-left: 5px;
  }
`;

const SelectableTitle = styled.span.attrs({ tabIndex: 0 })`
  color: ${({ theme }) => theme.colors.bluePrimary};
  font-weight: 500;
  cursor: pointer;
`;

const toggleSortLookup = {
  [SORT_DIRECTION.DESC]: SORT_DIRECTION.ASC,
  [SORT_DIRECTION.ASC]: SORT_DIRECTION.DESC,
};

const LastModifiedTableHeaderCell = styled(TableHeaderCell)`
  min-width: 160px;
`;

const AuthorTableHeaderCell = styled(TableHeaderCell)`
  min-width: 110px;
`;

export default function StoryListView({
  filteredStories,
  storySort,
  handleSortChange,
  handleSortDirectionChange,
  sortDirection,
  tags,
  categories,
  users,
}) {
  const metadataStringForIds = useCallback((metadata, ids) => {
    const metadataString = ids
      .reduce((memo, current) => [...memo, metadata[current]?.name], [])
      .filter(Boolean)
      .join(', ');
    return metadataString === '' ? '—' : metadataString;
  }, []);

  const onSortTitleSelected = useCallback(
    (newStorySort) => {
      if (newStorySort !== storySort) {
        handleSortChange(newStorySort);
        handleSortDirectionChange(ORDER_BY_SORT[newStorySort]);
      } else {
        handleSortDirectionChange(toggleSortLookup[sortDirection]);
      }
    },
    [handleSortDirectionChange, handleSortChange, storySort, sortDirection]
  );
  return (
    <ListView>
      <Table>
        <TableHeader>
          <TableRow>
            <TablePreviewHeaderCell
              onClick={() => onSortTitleSelected(STORY_SORT_OPTIONS.NAME)}
            >
              <SelectableTitle>{__('Title', 'web-stories')}</SelectableTitle>
            </TablePreviewHeaderCell>
            <TableTitleHeaderCell>
              <ArrowIcon
                active={storySort === STORY_SORT_OPTIONS.NAME}
                asc={sortDirection === SORT_DIRECTION.ASC}
              >
                <ArrowIconSvg {...ICON_METRICS.UP_DOWN_ARROW} />
              </ArrowIcon>
            </TableTitleHeaderCell>
            <AuthorTableHeaderCell>
              <SelectableTitle
                onClick={() =>
                  onSortTitleSelected(STORY_SORT_OPTIONS.CREATED_BY)
                }
              >
                {__('Author', 'web-stories')}
              </SelectableTitle>
              <ArrowIconWithTitle
                active={storySort === STORY_SORT_OPTIONS.CREATED_BY}
                asc={sortDirection === SORT_DIRECTION.ASC}
              >
                <ArrowIconSvg {...ICON_METRICS.UP_DOWN_ARROW} />
              </ArrowIconWithTitle>
            </AuthorTableHeaderCell>
            <TableHeaderCell>{__('Categories', 'web-stories')}</TableHeaderCell>
            <TableHeaderCell>{__('Tags', 'web-stories')}</TableHeaderCell>
            <LastModifiedTableHeaderCell>
              <SelectableTitle
                onClick={() =>
                  onSortTitleSelected(STORY_SORT_OPTIONS.LAST_MODIFIED)
                }
              >
                {__('Last Modified', 'web-stories')}
                <ArrowIconWithTitle
                  active={storySort === STORY_SORT_OPTIONS.LAST_MODIFIED}
                  asc={sortDirection === SORT_DIRECTION.ASC}
                >
                  <ArrowIconSvg {...ICON_METRICS.UP_DOWN_ARROW} />
                </ArrowIconWithTitle>
              </SelectableTitle>
            </LastModifiedTableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStories.map((story) => (
            <TableRow key={`story-${story.id}`}>
              <TablePreviewCell>
                <PreviewContainer>
                  <PreviewErrorBoundary>
                    <PreviewPage page={story.pages[0]} />
                  </PreviewErrorBoundary>
                </PreviewContainer>
              </TablePreviewCell>
              <TableCell>{story.title}</TableCell>
              <TableCell>{users[story.author].name}</TableCell>
              <TableCell>
                {metadataStringForIds(categories, story.categories)}
              </TableCell>
              <TableCell>{metadataStringForIds(tags, story.tags)}</TableCell>
              <TableCell>{story.modified.startOf('day').fromNow()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ListView>
  );
}

StoryListView.propTypes = {
  filteredStories: StoriesPropType,
  tags: TagsPropType,
  categories: CategoriesPropType,
  users: UsersPropType,
  handleSortChange: PropTypes.func.isRequired,
  handleSortDirectionChange: PropTypes.func.isRequired,
  storySort: PropTypes.string.isRequired,
  sortDirection: PropTypes.string.isRequired,
};
