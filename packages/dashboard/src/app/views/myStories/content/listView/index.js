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
import PropTypes from 'prop-types';
import { useCallback, useMemo } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import { Icons, Text, THEME_CONSTANTS } from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import {
  StoriesPropType,
  RenameStoryPropType,
  StoryMenuPropType,
} from '../../../../../types';
import {
  Table,
  TableAuthorHeaderCell,
  TableBody,
  TableDateHeaderCell,
  StickyTableHeader,
  TablePreviewHeaderCell,
  TableRow,
  TableStatusHeaderCell,
  TableTitleHeaderCell,
} from '../../../../../components';
import {
  ORDER_BY_SORT,
  SORT_DIRECTION,
  STORY_SORT_OPTIONS,
  STORY_STATUS,
} from '../../../../../constants';
import { useConfig } from '../../../../config';
import { StoryListItem } from '../storyListItem';
import {
  ArrowIcon,
  ArrowIconWithTitle,
  EmptyIconSpace,
  ListView,
  SelectableTitle,
} from './components';

const toggleSortLookup = {
  [SORT_DIRECTION.DESC]: SORT_DIRECTION.ASC,
  [SORT_DIRECTION.ASC]: SORT_DIRECTION.DESC,
};

export default function StoryListView({
  handleSortChange,
  handleSortDirectionChange,
  hideStoryList,
  renameStory,
  sortDirection,
  stories,
  storyMenu,
  storySort,
  storyStatus,
}) {
  const {
    userId,
    styleConstants: { topOffset },
  } = useConfig();

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

  const tableContents = useMemo(() => {
    return (
      !hideStoryList &&
      stories.map((story) => (
        <StoryListItem
          key={`story-${story.id}`}
          story={story}
          userId={userId}
          renameStory={renameStory}
          storyStatus={storyStatus}
          storyMenu={storyMenu}
        />
      ))
    );
  }, [hideStoryList, renameStory, stories, storyStatus, storyMenu, userId]);

  return (
    <ListView data-testid="story-list-view">
      <Table aria-label={__('List view of created stories', 'web-stories')}>
        <StickyTableHeader topOffset={topOffset}>
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
                forwardedAs="span"
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
                aria-hidden
                active={storySort === STORY_SORT_OPTIONS.NAME}
                forwardedAs="span"
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
                forwardedAs="span"
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
                forwardedAs="span"
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
                forwardedAs="span"
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
                  isBold
                  size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
                >
                  {__('Publish State', 'web-stories')}
                </Text>
              </TableStatusHeaderCell>
            )}
          </TableRow>
        </StickyTableHeader>
        <TableBody>{tableContents}</TableBody>
      </Table>
    </ListView>
  );
}

StoryListView.propTypes = {
  handleSortChange: PropTypes.func.isRequired,
  handleSortDirectionChange: PropTypes.func.isRequired,
  hideStoryList: PropTypes.bool,
  renameStory: RenameStoryPropType,
  sortDirection: PropTypes.string.isRequired,
  storyMenu: StoryMenuPropType.isRequired,
  storySort: PropTypes.string.isRequired,
  storyStatus: PropTypes.oneOf(Object.values(STORY_STATUS)),
  stories: StoriesPropType,
};
