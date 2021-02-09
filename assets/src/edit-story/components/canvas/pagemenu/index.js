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
import PropTypes from 'prop-types';
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
  BUTTON_PIXELS,
} from '../../../../design-system';
import { STORY_ANIMATION_STATE } from '../../../../animation';
import { useStory, useHistory, useConfig, useCanvas } from '../../../app';
import { createPage, duplicatePage } from '../../../elements';
import WithTooltip from '../../tooltip';

const BUTTON_HEIGHT = BUTTON_PIXELS.SMALL_BUTTON;
const DIVIDER_HEIGHT = BUTTON_PIXELS.SMALL_ICON;

const Wrapper = styled.div`
  display: flex;
  align-items: flex-end;
  height: ${20 + BUTTON_HEIGHT}px;
`;

const Box = styled.div`
  background-color: transparent;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: ${BUTTON_HEIGHT}px;
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
  height: ${DIVIDER_HEIGHT}px;
  width: 1px;
`;

const Space = styled.div`
  width: ${({ isDouble }) => (isDouble ? 20 : 10)}px;
`;

function PageMenuButton({ children, ...rest }) {
  return (
    <Button
      variant={BUTTON_VARIANTS.SQUARE}
      type={BUTTON_TYPES.TERTIARY}
      size={BUTTON_SIZES.SMALL}
      {...rest}
    >
      {children}
    </Button>
  );
}

PageMenuButton.propTypes = {
  children: PropTypes.node,
};

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
            <PageMenuButton
              onClick={handleDeletePage}
              aria-label={__('Delete Page', 'web-stories')}
            >
              <Icons.Trash />
            </PageMenuButton>
          </WithTooltip>
          <Space />
          <WithTooltip title={__('Duplicate page', 'web-stories')}>
            <PageMenuButton
              onClick={handleDuplicatePage}
              aria-label={__('Duplicate Page', 'web-stories')}
            >
              <Icons.Duplicate />
            </PageMenuButton>
          </WithTooltip>
          <Space />
          <WithTooltip title={__('New page', 'web-stories')}>
            <PageMenuButton
              onClick={handleAddPage}
              aria-label={__('Add New Page', 'web-stories')}
            >
              <Icons.AddOutlined />
            </PageMenuButton>
          </WithTooltip>
          <Space />
          <Divider />
          <Space />
          <WithTooltip title={__('Undo', 'web-stories')} shortcut="mod+z">
            <PageMenuButton
              disabled={!canUndo}
              onClick={handleUndo}
              aria-label={__('Undo Changes', 'web-stories')}
            >
              {isRTL ? <Icons.Redo /> : <Icons.Undo />}
            </PageMenuButton>
          </WithTooltip>
          <Space />
          <WithTooltip title={__('Redo', 'web-stories')} shortcut="shift+mod+z">
            <PageMenuButton
              disabled={!canRedo}
              onClick={handleRedo}
              aria-label={__('Redo Changes', 'web-stories')}
            >
              {isRTL ? <Icons.Undo /> : <Icons.Redo />}
            </PageMenuButton>
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
              <PageMenuButton
                onClick={toggleAnimationState}
                disabled={!hasAnimations}
                aria-label={__('Stop Page Animations', 'web-stories')}
              >
                <Icons.StopAnimation />
              </PageMenuButton>
            </WithTooltip>
          ) : (
            <WithTooltip
              style={{ marginLeft: 'auto' }}
              title={__('Play', 'web-stories')}
            >
              <PageMenuButton
                onClick={toggleAnimationState}
                disabled={!hasAnimations}
                aria-label={__('Play Page Animations', 'web-stories')}
              >
                <Icons.PlayAnimation />
              </PageMenuButton>
            </WithTooltip>
          )}
        </Options>
      </Box>
    </Wrapper>
  );
}

export default PageMenu;
