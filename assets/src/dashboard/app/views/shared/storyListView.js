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
  RenameStoryPropType,
  StoryMenuPropType,
  PageSizePropType,
} from '../../../types';
import {
  PreviewPage,
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
  Paragraph2,
  useLayoutContext,
} from '../../../components';
import {
  ORDER_BY_SORT,
  SORT_DIRECTION,
  STORY_SORT_OPTIONS,
  STORY_STATUS,
} from '../../../constants';
import {
  FULLBLEED_RATIO,
  DASHBOARD_TOP_MARGIN,
  DEFAULT_DASHBOARD_TOP_SPACE,
} from '../../../constants/pageStructure';
import PreviewErrorBoundary from '../../../components/previewErrorBoundary';
import {
  ArrowAlphaAscending as ArrowAlphaAscendingSvg,
  ArrowAlphaDescending as ArrowAlphaDescendingSvg,
  ArrowDownward as ArrowIconSvg,
} from '../../../icons';
import { getRelativeDisplayDate } from '../../../../date';
import { generateStoryMenu } from '../../../components/popoverMenu/story-menu-generator';
import { titleFormatted } from '../../../utils';

const ListView = styled.div`
  width: 100%;
`;

const PreviewContainer = styled.div`
  display: inline-block;
  position: relative;
  overflow: hidden;
  width: ${({ theme }) => theme.DEPRECATED_THEME.previewWidth.thumbnail}px;
  height: ${({ theme }) =>
    theme.DEPRECATED_THEME.previewWidth.thumbnail / FULLBLEED_RATIO}px;
  vertical-align: middle;
  border-radius: ${({ theme }) =>
    theme.DEPRECATED_THEME.storyPreview.borderRadius}px;
  border: ${({ theme }) => theme.DEPRECATED_THEME.borders.gray75};
`;

const ArrowIcon = styled.div`
  width: ${({ theme }) => theme.DEPRECATED_THEME.table.headerContentSize}px;
  height: 100%;
  display: inline-grid;
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.gray900};
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

  @media ${({ theme }) => theme.DEPRECATED_THEME.breakpoint.largeDisplayPhone} {
    margin-left: 4px;
  }
`;

const SelectableTitle = styled.span.attrs({ tabIndex: 0 })`
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.bluePrimary};
  font-weight: 500;
  cursor: pointer;
`;

const SelectableParagraph = styled(Paragraph2).attrs({
  tabIndex: 0,
  onFocus: onFocusSelectAll,
  onBlur: onBlurDeselectAll,
})``;

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
  const {
    state: { squishContentHeight },
  } = useLayoutContext();

  // get sticky position from the squishContentHeight (header area),
  // subtract top margin of header which is only relevant until scrolling and the fixed table header is on scroll & add default top padding.
  const stickyTopPosition =
    squishContentHeight - DASHBOARD_TOP_MARGIN + DEFAULT_DASHBOARD_TOP_SPACE;

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
        <StickyTableHeader top={stickyTopPosition}>
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
              >
                {__('Title', 'web-stories')}
              </SelectableTitle>
            </TablePreviewHeaderCell>
            <TableTitleHeaderCell
              onClick={() => onSortTitleSelected(STORY_SORT_OPTIONS.NAME)}
              onKeyDown={(e) => onKeyDownSort(e, STORY_SORT_OPTIONS.NAME)}
            >
              <SelectableTitle aria-hidden="true">
                {__('Title', 'web-stories')}
              </SelectableTitle>
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
              >
                {__('Date Created', 'web-stories')}
              </SelectableTitle>
              <ArrowIconWithTitle
                aria-hidden={true}
                active={storySort === STORY_SORT_OPTIONS.DATE_CREATED}
                asc={sortDirection === SORT_DIRECTION.ASC}
              >
                <ArrowIconSvg />
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
              >
                {__('Last Modified', 'web-stories')}
              </SelectableTitle>
              <ArrowIconWithTitle
                aria-hidden={true}
                active={storySort === STORY_SORT_OPTIONS.LAST_MODIFIED}
                asc={sortDirection === SORT_DIRECTION.ASC}
              >
                <ArrowIconSvg />
              </ArrowIconWithTitle>
            </TableDateHeaderCell>
            {storyStatus !== STORY_STATUS.DRAFT && <TableStatusHeaderCell />}
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
                      <SelectableParagraph>
                        {titleFormatted(story.title)}
                      </SelectableParagraph>
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
              <TableCell>{story.author || '—'}</TableCell>
              <TableCell>{getRelativeDisplayDate(story.created)}</TableCell>
              <TableCell>{getRelativeDisplayDate(story.modified)}</TableCell>
              {storyStatus !== STORY_STATUS.DRAFT && (
                <TableStatusCell>
                  {story.status === STORY_STATUS.PUBLISH &&
                    __('Published', 'web-stories')}
                  {story.status === STORY_STATUS.FUTURE &&
                    __('Scheduled', 'web-stories')}
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
