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
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { getRelativeDisplayDate } from '@web-stories-wp/date';
import { __ } from '@web-stories-wp/i18n';
/**
 * Internal dependencies
 */
import {
  StoriesPropType,
  RenameStoryPropType,
  StoryMenuPropType,
  PageSizePropType,
} from '../../../types';
import {
  Table,
  TableAuthorHeaderCell,
  TableBody,
  TableCell,
  TableDateHeaderCell,
  StickyTableHeader,
  TablePreviewCell,
  TablePreviewHeaderCell,
  TableRow,
  TableStatusCell,
  TableStatusHeaderCell,
  TableTitleHeaderCell,
  StoryMenu,
  MoreVerticalButton,
  InlineInputForm,
} from '../../../components';
import {
  ORDER_BY_SORT,
  SORT_DIRECTION,
  STORY_SORT_OPTIONS,
  STORY_STATUS,
} from '../../../constants';
import { FULLBLEED_RATIO } from '../../../constants/pageStructure';
import {
  PreviewPage,
  PreviewErrorBoundary,
} from '../../../../edit-story/components/previewPage';
import { generateStoryMenu } from '../../../components/popoverMenu/story-menu-generator';
import { titleFormatted } from '../../../utils';
import { Icons, Text, THEME_CONSTANTS } from '../../../../design-system';

const ListView = styled.div`
  width: 100%;
`;

const PreviewContainer = styled.div`
  display: inline-block;
  position: relative;
  overflow: hidden;
  width: 33px;
  height: ${33 / FULLBLEED_RATIO}px;
  vertical-align: middle;
  border-radius: ${({ theme }) => theme.borders.radius.small};
`;

const ArrowIcon = styled.div`
  width: 32px;
  height: 100%;
  display: inline-grid;
  color: ${({ theme }) => theme.colors.fg.primary};
  vertical-align: middle;

  svg {
    visibility: ${({ active }) => (active ? 'visible' : 'hidden')};
    transition: transform 0.15s;

    ${({ asc }) =>
      asc &&
      css`
        transform: rotate(180deg);
      `};
  }
`;

const EmptyIconSpace = styled.div`
  height: 32px;
  width: 32px;
`;

const ArrowIconWithTitle = styled(ArrowIcon)`
  display: ${({ active }) => !active && 'none'};
  position: absolute;
  top: 16px;

  @media ${({ theme }) => theme.breakpoint.mobile} {
    margin-left: 4px;
  }
`;

const SelectableTitle = styled(Text).attrs({ tabIndex: 0 })`
  color: ${({ theme }) => theme.colors.fg.linkNormal};
  cursor: pointer;
`;

const StyledTableRow = styled(TableRow)`
  &:hover ${MoreVerticalButton}, &:focus-within ${MoreVerticalButton} {
    opacity: 1;
  }
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

function onFocusSelectAll(e) {
  window.getSelection().selectAllChildren(e.target);
}

function onBlurDeselectAll() {
  window.getSelection().removeAllRanges();
}

export default function StoryListView({
  handleSortChange,
  handleSortDirectionChange,
  pageSize,
  renameStory,
  sortDirection,
  stories,
  storyMenu,
  storySort,
  storyStatus,
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

  const onKeyDownSort = useCallback(
    ({ key }, sortBy) => {
      if (key === 'Enter') {
        onSortTitleSelected(sortBy);
      }
    },
    [onSortTitleSelected]
  );

  return (
    <ListView data-testid="story-list-view">
      <Table aria-label={__('List view of created stories', 'web-stories')}>
        <StickyTableHeader>
          <TableRow>
            <TablePreviewHeaderCell
              onClick={() => onSortTitleSelected(STORY_SORT_OPTIONS.NAME)}
              onKeyDown={(e) => onKeyDownSort(e, STORY_SORT_OPTIONS.NAME)}
            >
              <SelectableTitle
                aria-label={__(
                  'Title, select to sort table by story title',
                  'web-stories'
                )}
                as="span"
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                isBold
              >
                {__('Title', 'web-stories')}
              </SelectableTitle>
            </TablePreviewHeaderCell>
            <TableTitleHeaderCell
              onClick={() => onSortTitleSelected(STORY_SORT_OPTIONS.NAME)}
              onKeyDown={(e) => onKeyDownSort(e, STORY_SORT_OPTIONS.NAME)}
            >
              <SelectableTitle
                aria-hidden="true"
                active={storySort === STORY_SORT_OPTIONS.NAME}
                as="span"
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                isBold
              >
                {__('Title', 'web-stories')}
              </SelectableTitle>
              <ArrowIcon
                active={storySort === STORY_SORT_OPTIONS.NAME}
                asc={sortDirection === SORT_DIRECTION.ASC}
              >
                {<Icons.ArrowDown />}
              </ArrowIcon>
            </TableTitleHeaderCell>
            <TableAuthorHeaderCell>
              <SelectableTitle
                aria-label={__(
                  'Author, select to sort table by story author',
                  'web-stories'
                )}
                onClick={() =>
                  onSortTitleSelected(STORY_SORT_OPTIONS.CREATED_BY)
                }
                onKeyDown={(e) =>
                  onKeyDownSort(e, STORY_SORT_OPTIONS.CREATED_BY)
                }
                active={storySort === STORY_SORT_OPTIONS.CREATED_BY}
                as="span"
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                isBold
              >
                {__('Author', 'web-stories')}
              </SelectableTitle>
              <ArrowIconWithTitle
                aria-hidden
                active={storySort === STORY_SORT_OPTIONS.CREATED_BY}
                asc={sortDirection === SORT_DIRECTION.ASC}
              >
                {storySort === STORY_SORT_OPTIONS.CREATED_BY ? (
                  <Icons.ArrowDown />
                ) : (
                  <EmptyIconSpace />
                )}
              </ArrowIconWithTitle>
            </TableAuthorHeaderCell>
            <TableDateHeaderCell>
              <SelectableTitle
                aria-label={__(
                  'Creation date, select to sort table by date story was created',
                  'web-stories'
                )}
                onClick={() =>
                  onSortTitleSelected(STORY_SORT_OPTIONS.DATE_CREATED)
                }
                onKeyDown={(e) =>
                  onKeyDownSort(e, STORY_SORT_OPTIONS.DATE_CREATED)
                }
                active={storySort === STORY_SORT_OPTIONS.DATE_CREATED}
                as="span"
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                isBold
              >
                {__('Date Created', 'web-stories')}
              </SelectableTitle>
              <ArrowIconWithTitle
                aria-hidden
                active={storySort === STORY_SORT_OPTIONS.DATE_CREATED}
                asc={sortDirection === SORT_DIRECTION.ASC}
              >
                <Icons.ArrowDown />
              </ArrowIconWithTitle>
            </TableDateHeaderCell>
            <TableDateHeaderCell>
              <SelectableTitle
                aria-label={__(
                  'Modification date, select to sort table by date story was last modified',
                  'web-stories'
                )}
                onClick={() =>
                  onSortTitleSelected(STORY_SORT_OPTIONS.LAST_MODIFIED)
                }
                onKeyDown={(e) =>
                  onKeyDownSort(e, STORY_SORT_OPTIONS.LAST_MODIFIED)
                }
                active={storySort === STORY_SORT_OPTIONS.LAST_MODIFIED}
                as="span"
                size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                isBold
              >
                {__('Last Modified', 'web-stories')}
              </SelectableTitle>
              <ArrowIconWithTitle
                aria-hidden
                active={storySort === STORY_SORT_OPTIONS.LAST_MODIFIED}
                asc={sortDirection === SORT_DIRECTION.ASC}
              >
                <Icons.ArrowDown />
              </ArrowIconWithTitle>
            </TableDateHeaderCell>
            {storyStatus !== STORY_STATUS.DRAFT && (
              <TableStatusHeaderCell>
                <Text
                  as="span"
                  size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                  isBold
                >
                  {__('Publish State', 'web-stories')}
                </Text>
              </TableStatusHeaderCell>
            )}
          </TableRow>
        </StickyTableHeader>
        <TableBody>
          {stories.map((story) => (
            <StyledTableRow key={`story-${story.id}`}>
              <TablePreviewCell>
                <PreviewContainer>
                  <PreviewErrorBoundary>
                    <PreviewPage page={story.pages[0]} pageSize={pageSize} />
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
                      <Text
                        tabIndex={0}
                        onFocus={onFocusSelectAll}
                        onBlur={onBlurDeselectAll}
                        size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                      >
                        {titleFormatted(story.title)}
                      </Text>
                      <StoryMenu
                        onMoreButtonSelected={storyMenu.handleMenuToggle}
                        contextMenuId={storyMenu.contextMenuId}
                        onMenuItemSelected={storyMenu.handleMenuItemSelected}
                        story={story}
                        menuItems={generateStoryMenu({
                          menuItems: storyMenu.menuItems,
                          story,
                        })}
                        verticalAlign="center"
                      />
                    </>
                  )}
                </TitleTableCellContainer>
              </TableCell>
              <TableCell>
                <Text
                  as="span"
                  size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                >
                  {story.author || '—'}
                </Text>
              </TableCell>
              <TableCell>
                <Text
                  as="span"
                  size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                >
                  {getRelativeDisplayDate(story.created)}
                </Text>
              </TableCell>
              <TableCell>
                <Text
                  as="span"
                  size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                >
                  {getRelativeDisplayDate(story.modified)}
                </Text>
              </TableCell>
              {storyStatus !== STORY_STATUS.DRAFT && (
                <TableStatusCell>
                  <Text
                    as="span"
                    size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                  >
                    {story.status === STORY_STATUS.PUBLISH &&
                      __('Published', 'web-stories')}
                    {story.status === STORY_STATUS.FUTURE &&
                      __('Scheduled', 'web-stories')}
                    {story.status === STORY_STATUS.DRAFT &&
                      __('Draft', 'web-stories')}
                    {story.status === STORY_STATUS.PRIVATE &&
                      __('Private', 'web-stories')}
                  </Text>
                </TableStatusCell>
              )}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </ListView>
  );
}

StoryListView.propTypes = {
  handleSortChange: PropTypes.func.isRequired,
  handleSortDirectionChange: PropTypes.func.isRequired,
  pageSize: PageSizePropType,
  renameStory: RenameStoryPropType,
  sortDirection: PropTypes.string.isRequired,
  storyMenu: StoryMenuPropType.isRequired,
  storySort: PropTypes.string.isRequired,
  storyStatus: PropTypes.oneOf(Object.values(STORY_STATUS)),
  stories: StoriesPropType,
};
