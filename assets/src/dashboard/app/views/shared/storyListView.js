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
  StoriesPropType,
  UsersPropType,
  RenameStoryPropType,
  StoryMenuPropType,
} from '../../../types';
import {
  PreviewPage,
  Table,
  TableAuthorHeaderCell,
  TableBody,
  TableCell,
  TableDateHeaderCell,
  TableHeader,
  TablePreviewCell,
  TablePreviewHeaderCell,
  TableRow,
  TableStatusCell,
  TableStatusHeaderCell,
  TableTitleHeaderCell,
  StoryMenu,
  MoreVerticalButton,
  InlineInputForm,
  Paragraph2,
} from '../../../components';
import {
  ORDER_BY_SORT,
  SORT_DIRECTION,
  STORY_SORT_OPTIONS,
  STORY_STATUS,
} from '../../../constants';
import { PAGE_RATIO } from '../../../constants/pageStructure';
import PreviewErrorBoundary from '../../../components/previewErrorBoundary';
import {
  ArrowAlphaAscending as ArrowAlphaAscendingSvg,
  ArrowAlphaDescending as ArrowAlphaDescendingSvg,
  ArrowDownward as ArrowIconSvg,
} from '../../../icons';
import getFormattedDisplayDate from '../../../utils/getFormattedDisplayDate';

const ListView = styled.div`
  width: 100%;
`;

const PreviewContainer = styled.div`
  display: inline-block;
  position: relative;
  overflow: hidden;
  width: ${({ theme }) => theme.previewWidth.thumbnail}px;
  height: ${({ theme }) => theme.previewWidth.thumbnail / PAGE_RATIO}px;
  vertical-align: middle;
  border-radius: ${({ theme }) => theme.storyPreview.borderRadius}px;
  border: ${({ theme }) => theme.storyPreview.border};
`;

const ArrowIcon = styled.div`
  width: ${({ theme }) => theme.table.headerContentSize}px;
  height: 100%;
  display: inline-grid;
  color: ${({ theme }) => theme.colors.gray900};
  vertical-align: middle;

  svg {
    visibility: ${({ active }) => (active ? 'visible' : 'hidden')};
    ${({ asc }) => asc && { transform: 'rotate(180deg)' }};
  }
`;

const ArrowIconWithTitle = styled(ArrowIcon)`
  display: ${({ active }) => (active ? 'inline-grid' : 'none')};
  margin-left: 6px;
  margin-top: -2px;

  @media ${({ theme }) => theme.breakpoint.largeDisplayPhone} {
    margin-left: 4px;
  }
`;

const SelectableTitle = styled.span.attrs({ tabIndex: 0 })`
  color: ${({ theme }) => theme.colors.bluePrimary};
  font-weight: 500;
  cursor: pointer;
`;

const TitleTableCellContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;

  ${MoreVerticalButton} {
    margin: 10px auto;
  }

  &:hover ${MoreVerticalButton}, &:active ${MoreVerticalButton} {
    opacity: 1;
  }
`;

const toggleSortLookup = {
  [SORT_DIRECTION.DESC]: SORT_DIRECTION.ASC,
  [SORT_DIRECTION.ASC]: SORT_DIRECTION.DESC,
};

export default function StoryListView({
  handleSortChange,
  handleSortDirectionChange,
  renameStory,
  sortDirection,
  stories,
  storyMenu,
  storySort,
  storyStatus,
  users,
}) {
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
              <ArrowIcon active={storySort === STORY_SORT_OPTIONS.NAME}>
                {sortDirection === SORT_DIRECTION.DESC ? (
                  <ArrowAlphaDescendingSvg />
                ) : (
                  <ArrowAlphaAscendingSvg />
                )}
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
              >
                {sortDirection === SORT_DIRECTION.DESC ? (
                  <ArrowAlphaDescendingSvg />
                ) : (
                  <ArrowAlphaAscendingSvg />
                )}
              </ArrowIconWithTitle>
            </TableAuthorHeaderCell>
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
                  <ArrowIconSvg />
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
                  <ArrowIconSvg />
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
              <TableCell>
                <TitleTableCellContainer>
                  {renameStory.id === story.id ? (
                    <InlineInputForm
                      onEditComplete={(newTitle) =>
                        renameStory.handleOnRenameStory(story, newTitle)
                      }
                      onEditCancel={renameStory.handleCancelRename}
                      value={story.title}
                      id={story.id}
                      label={__('Rename story', 'web-stories')}
                    />
                  ) : (
                    <>
                      <Paragraph2>{story.title}</Paragraph2>
                      <StoryMenu
                        onMoreButtonSelected={storyMenu.handleMenuToggle}
                        contextMenuId={storyMenu.contextMenuId}
                        onMenuItemSelected={storyMenu.handleMenuItemSelected}
                        story={story}
                        menuItems={storyMenu.menuItems}
                        verticalAlign="center"
                      />
                    </>
                  )}
                </TitleTableCellContainer>
              </TableCell>
              <TableCell>{users[story.author]?.name || '—'}</TableCell>
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
  handleSortChange: PropTypes.func.isRequired,
  handleSortDirectionChange: PropTypes.func.isRequired,
  renameStory: RenameStoryPropType,
  sortDirection: PropTypes.string.isRequired,
  storyMenu: StoryMenuPropType.isRequired,
  storySort: PropTypes.string.isRequired,
  storyStatus: PropTypes.oneOf(Object.values(STORY_STATUS)),
  stories: StoriesPropType,
  users: UsersPropType.isRequired,
};
