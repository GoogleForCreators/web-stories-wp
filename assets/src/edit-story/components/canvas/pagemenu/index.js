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
import { __, sprintf } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import {
  Button,
  Icons,
  BUTTON_VARIANTS,
  BUTTON_TYPES,
  BUTTON_SIZES,
} from '../../../../design-system';
import { STORY_ANIMATION_STATE } from '../../../../animation';
import { useStory, useHistory, useConfig, useCanvas } from '../../../app';
import { createPage, duplicatePage } from '../../../elements';
import WithTooltip from '../../tooltip';

const HEIGHT = 32;

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
  color: ${({ theme }) => theme.colors.fg.white};
  width: 62px;
  font-family: ${({ theme }) => theme.fonts.body1.family};
  font-size: ${({ theme }) => theme.fonts.body1.size};
  line-height: 24px;
`;

const Options = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  color: ${({ theme }) => theme.colors.fg.v2};
`;

const Divider = styled.span`
  background-color: ${({ theme }) => theme.colors.fg.white};
  opacity: 0.3;
  height: ${HEIGHT / 2}px;
  width: 1px;
`;

const Space = styled.div`
  width: ${({ isDouble }) => (isDouble ? 20 : 10)}px;
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
    animationState,
    updateAnimationState,
    hasAnimations,
  } = useStory(
    ({
      state: { currentPageNumber, currentPage, animationState },
      actions: { deleteCurrentPage, addPage, updateAnimationState },
    }) => {
      return {
        currentPageNumber,
        currentPage,
        deleteCurrentPage,
        addPage,
        animationState,
        updateAnimationState,
        hasAnimations: currentPage?.animations?.length > 0,
      };
    }
  );
  const { pageSize } = useCanvas((state) => ({
    pageSize: state.state.pageSize,
  }));
  const { isRTL } = useConfig();

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

  const toggleAnimationState = useCallback(
    () =>
      updateAnimationState({
        animationState: [
          STORY_ANIMATION_STATE.PLAYING,
          STORY_ANIMATION_STATE.PLAYING_SELECTED,
        ].includes(animationState)
          ? STORY_ANIMATION_STATE.RESET
          : STORY_ANIMATION_STATE.PLAYING,
      }),
    [animationState, updateAnimationState]
  );

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
                  /* translators: %s: page number. */
                  __('Page %s', 'web-stories'),
                  currentPageNumber
                )}
              </PageCount>
              <Space />
            </>
          )}
          <WithTooltip title={__('Delete page', 'web-stories')}>
            <Button
              variant={BUTTON_VARIANTS.CIRCLE}
              type={BUTTON_TYPES.TERTIARY}
              size={BUTTON_SIZES.SMALL}
              onClick={handleDeletePage}
              aria-label={__('Delete Page', 'web-stories')}
            >
              <Icons.Trash />
            </Button>
          </WithTooltip>
          <Space />
          <WithTooltip title={__('Duplicate page', 'web-stories')}>
            <Button
              variant={BUTTON_VARIANTS.CIRCLE}
              type={BUTTON_TYPES.TERTIARY}
              size={BUTTON_SIZES.SMALL}
              onClick={handleDuplicatePage}
              aria-label={__('Duplicate Page', 'web-stories')}
            >
              <Icons.Duplicate />
            </Button>
          </WithTooltip>
          <Space />
          <WithTooltip title={__('New page', 'web-stories')}>
            <Button
              variant={BUTTON_VARIANTS.CIRCLE}
              type={BUTTON_TYPES.TERTIARY}
              size={BUTTON_SIZES.SMALL}
              onClick={handleAddPage}
              aria-label={__('Add New Page', 'web-stories')}
            >
              <Icons.AddOutlined />
            </Button>
          </WithTooltip>
          <Space />
          <Divider />
          <Space />
          <WithTooltip title={__('Undo', 'web-stories')} shortcut="mod+z">
            <Button
              variant={BUTTON_VARIANTS.CIRCLE}
              type={BUTTON_TYPES.TERTIARY}
              size={BUTTON_SIZES.SMALL}
              disabled={!canUndo}
              onClick={handleUndo}
              aria-label={__('Undo Changes', 'web-stories')}
            >
              {isRTL ? <Icons.Redo /> : <Icons.Undo />}
            </Button>
          </WithTooltip>
          <Space />
          <WithTooltip title={__('Redo', 'web-stories')} shortcut="shift+mod+z">
            <Button
              variant={BUTTON_VARIANTS.CIRCLE}
              type={BUTTON_TYPES.TERTIARY}
              size={BUTTON_SIZES.SMALL}
              disabled={!canRedo}
              onClick={handleRedo}
              aria-label={__('Redo Changes', 'web-stories')}
            >
              {isRTL ? <Icons.Undo /> : <Icons.Redo />}
            </Button>
          </WithTooltip>
          <Space />
          {[
            STORY_ANIMATION_STATE.PLAYING,
            STORY_ANIMATION_STATE.PLAYING_SELECTED,
          ].includes(animationState) ? (
            <WithTooltip
              style={{ marginLeft: 'auto' }}
              title={__('Stop', 'web-stories')}
            >
              <Button
                variant={BUTTON_VARIANTS.CIRCLE}
                type={BUTTON_TYPES.TERTIARY}
                size={BUTTON_SIZES.SMALL}
                onClick={toggleAnimationState}
                disabled={!hasAnimations}
                aria-label={__('Stop Page Animations', 'web-stories')}
              >
                <Icons.StopAnimation />
              </Button>
            </WithTooltip>
          ) : (
            <WithTooltip
              style={{ marginLeft: 'auto' }}
              title={__('Play', 'web-stories')}
            >
              <Button
                variant={BUTTON_VARIANTS.CIRCLE}
                type={BUTTON_TYPES.TERTIARY}
                size={BUTTON_SIZES.SMALL}
                onClick={toggleAnimationState}
                disabled={!hasAnimations}
                aria-label={__('Play Page Animations', 'web-stories')}
              >
                <Icons.PlayAnimation />
              </Button>
            </WithTooltip>
          )}
        </Options>
      </Box>
    </Wrapper>
  );
}

export default PageMenu;
