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
import { useCallback } from 'react';
import { useFeatures } from 'flagged';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useStory, useHistory, useConfig } from '../../../app';
import { createPage, duplicatePage } from '../../../elements';
import {
  Delete,
  Duplicate,
  UndoAlt as LeftArrow,
  RedoAlt as RightArrow,
  AddPage,
  LayoutHelper,
  Text,
} from '../../../icons';
import WithTooltip from '../../tooltip';
import useCanvas from '../useCanvas';

const HEIGHT = 28;

const Wrapper = styled.div`
  display: flex;
  align-items: flex-end;
  height: ${20 + HEIGHT}px;
`;

const Box = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: ${HEIGHT}px;
  width: 100%;
`;

const PageCount = styled.div`
  color: ${({ theme }) => theme.colors.fg.v1};
  width: 62px;
  font-family: ${({ theme }) => theme.fonts.body1.family};
  font-size: ${({ theme }) => theme.fonts.body1.size};
  line-height: 24px;
`;

const Options = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.fg.v2};
`;

const Divider = styled.span`
  background-color: ${({ theme }) => theme.colors.fg.v1};
  opacity: 0.3;
  height: ${HEIGHT}px;
  width: 1px;
`;

const Space = styled.div`
  width: ${({ isDouble }) => (isDouble ? 20 : 10)}px;
`;

const Icon = styled.button`
  cursor: pointer;
  background: transparent;
  border: 0;
  padding: 0;
  display: block;
  color: ${({ theme }) => theme.colors.fg.v1};

  ${({ disabled }) =>
    disabled &&
    `
	opacity: .3;
	pointer-events: none;
	`}

  svg {
    width: 28px;
    height: 28px;
    display: block;
  }
`;

function PageMenu() {
  const {
    state: { canUndo, canRedo },
    actions: { undo, redo },
  } = useHistory();
  const {
    currentPageNumber,
    currentPage,
    deleteCurrentPage,
    addPage,
  } = useStory(
    ({
      state: { currentPageNumber, currentPage },
      actions: { deleteCurrentPage, addPage },
    }) => {
      return {
        currentPageNumber,
        currentPage,
        deleteCurrentPage,
        addPage,
      };
    }
  );
  const { pageSize } = useCanvas((state) => ({
    pageSize: state.state.pageSize,
  }));
  const { isRTL } = useConfig();
  const { showTextMagicAndHelperMode } = useFeatures();

  const handleDeletePage = useCallback(() => deleteCurrentPage(), [
    deleteCurrentPage,
  ]);

  const handleAddPage = useCallback(() => addPage({ page: createPage() }), [
    addPage,
  ]);

  const handleDuplicatePage = useCallback(
    () => addPage({ page: duplicatePage(currentPage) }),
    [addPage, currentPage]
  );

  const handleUndo = useCallback(() => undo(), [undo]);

  const handleRedo = useCallback(() => redo(), [redo]);

  if (!currentPage) {
    return null;
  }

  return (
    <Wrapper>
      <Box>
        <Options>
          {pageSize.width > 280 && (
            <>
              <PageCount>
                {sprintf(
                  /* translators: %s: Page number. */
                  __('Page %s', 'web-stories'),
                  currentPageNumber
                )}
              </PageCount>
              <Space />
            </>
          )}
          <WithTooltip title={__('Delete page', 'web-stories')}>
            <Icon
              onClick={handleDeletePage}
              aria-label={__('Delete Page', 'web-stories')}
            >
              <Delete />
            </Icon>
          </WithTooltip>
          <Space />
          <WithTooltip title={__('Duplicate page', 'web-stories')}>
            <Icon
              onClick={handleDuplicatePage}
              aria-label={__('Duplicate Page', 'web-stories')}
            >
              <Duplicate />
            </Icon>
          </WithTooltip>
          <Space />
          <WithTooltip title={__('New page', 'web-stories')}>
            <Icon
              onClick={handleAddPage}
              aria-label={__('Add New Page', 'web-stories')}
            >
              <AddPage />
            </Icon>
          </WithTooltip>
          <Space />
          <Divider />
          <Space />
          <WithTooltip title={__('Undo', 'web-stories')} shortcut="mod+z">
            <Icon
              disabled={!canUndo}
              onClick={handleUndo}
              aria-label={__('Undo Changes', 'web-stories')}
            >
              {isRTL ? <RightArrow /> : <LeftArrow />}
            </Icon>
          </WithTooltip>
          <Space />
          <WithTooltip title={__('Redo', 'web-stories')} shortcut="shift+mod+z">
            <Icon
              disabled={!canRedo}
              onClick={handleRedo}
              aria-label={__('Redo Changes', 'web-stories')}
            >
              {isRTL ? <LeftArrow /> : <RightArrow />}
            </Icon>
          </WithTooltip>
        </Options>
        {showTextMagicAndHelperMode && (
          <Options>
            <Icon disabled>
              <LayoutHelper />
            </Icon>
            <Space isDouble />
            <Icon disabled>
              <Text />
            </Icon>
          </Options>
        )}
      </Box>
    </Wrapper>
  );
}

export default PageMenu;
