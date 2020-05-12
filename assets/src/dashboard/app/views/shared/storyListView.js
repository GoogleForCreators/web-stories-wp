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
  TableAuthorHeaderCell,
  TableBody,
  TableCell,
  TableDateHeaderCell,
  TableHeader,
  TableHeaderCell,
  TablePreviewCell,
  TablePreviewHeaderCell,
  TableRow,
  TableStatusCell,
  TableStatusHeaderCell,
  TableTitleHeaderCell,
} from '../../../components';
import {
  ICON_METRICS,
  ORDER_BY_SORT,
  SORT_DIRECTION,
  STORY_SORT_OPTIONS,
  STORY_STATUS,
} from '../../../constants';
import { PAGE_RATIO } from '../../../constants/pageStructure';
import PreviewErrorBoundary from '../../../components/previewErrorBoundary';
import { ReactComponent as ArrowIconSvg } from '../../../icons/download.svg';
import getFormattedDisplayDate from '../../../utils/getFormattedDisplayDate';

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

export default function StoryListView({
  stories,
  storySort,
  storyStatus,
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
            <TableTitleHeaderCell
              onClick={() => onSortTitleSelected(STORY_SORT_OPTIONS.NAME)}
            >
              <SelectableTitle>{__('Title', 'web-stories')}</SelectableTitle>
              <ArrowIcon
                active={storySort === STORY_SORT_OPTIONS.NAME}
                asc={sortDirection === SORT_DIRECTION.ASC}
              >
                <ArrowIconSvg {...ICON_METRICS.UP_DOWN_ARROW} />
              </ArrowIcon>
            </TableTitleHeaderCell>
            <TableAuthorHeaderCell>
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
            </TableAuthorHeaderCell>
            <TableHeaderCell>{__('Categories', 'web-stories')}</TableHeaderCell>
            <TableHeaderCell>{__('Tags', 'web-stories')}</TableHeaderCell>
            <TableDateHeaderCell>
              <SelectableTitle
                onClick={() =>
                  onSortTitleSelected(STORY_SORT_OPTIONS.DATE_CREATED)
                }
              >
                {__('Date Created', 'web-stories')}
                <ArrowIconWithTitle
                  active={storySort === STORY_SORT_OPTIONS.DATE_CREATED}
                  asc={sortDirection === SORT_DIRECTION.DESC}
                >
                  <ArrowIconSvg {...ICON_METRICS.UP_DOWN_ARROW} />
                </ArrowIconWithTitle>
              </SelectableTitle>
            </TableDateHeaderCell>
            <TableDateHeaderCell>
              <SelectableTitle
                onClick={() =>
                  onSortTitleSelected(STORY_SORT_OPTIONS.LAST_MODIFIED)
                }
              >
                {__('Last Modified', 'web-stories')}
                <ArrowIconWithTitle
                  active={storySort === STORY_SORT_OPTIONS.LAST_MODIFIED}
                  asc={sortDirection === SORT_DIRECTION.DESC}
                >
                  <ArrowIconSvg {...ICON_METRICS.UP_DOWN_ARROW} />
                </ArrowIconWithTitle>
              </SelectableTitle>
            </TableDateHeaderCell>
            {storyStatus !== STORY_STATUS.DRAFT && <TableStatusHeaderCell />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {stories.map((story) => (
            <TableRow key={`story-${story.id}`}>
              <TablePreviewCell>
                <PreviewContainer>
                  <PreviewErrorBoundary>
                    <PreviewPage page={story.pages[0]} />
                  </PreviewErrorBoundary>
                </PreviewContainer>
              </TablePreviewCell>
              <TableCell>{story.title}</TableCell>
              <TableCell>{users[story.author]?.name || '—'}</TableCell>
              <TableCell>
                {metadataStringForIds(categories, story.categories)}
              </TableCell>
              <TableCell>{metadataStringForIds(tags, story.tags)}</TableCell>
              <TableCell>{getFormattedDisplayDate(story.created)}</TableCell>
              <TableCell>{getFormattedDisplayDate(story.modified)}</TableCell>
              {storyStatus !== STORY_STATUS.DRAFT && (
                <TableStatusCell>
                  {story.status === STORY_STATUS.PUBLISHED &&
                    __('Published', 'web-stories')}
                </TableStatusCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ListView>
  );
}

StoryListView.propTypes = {
  stories: StoriesPropType,
  tags: TagsPropType,
  categories: CategoriesPropType,
  users: UsersPropType.isRequired,
  handleSortChange: PropTypes.func.isRequired,
  handleSortDirectionChange: PropTypes.func.isRequired,
  storySort: PropTypes.string.isRequired,
  storyStatus: PropTypes.oneOf(Object.values(STORY_STATUS)),
  sortDirection: PropTypes.string.isRequired,
};
