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
import { memo, useCallback, useEffect } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
  StoryAnimation,
  STORY_ANIMATION_STATE,
  useStoryAnimationContext,
} from '../../../animation';
import { useStory } from '../../app';
import DisplayElement from './displayElement';
import { Layer, PageArea } from './layout';
import useCanvas from './useCanvas';
import PageAttachment from './pageAttachment';

function DisplayPage({
  page,
  animationState,
  editingElement,
  resetAnimationState,
}) {
  const {
    actions: { WAAPIAnimationMethods },
  } = useStoryAnimationContext();

  useEffect(() => {
    switch (animationState) {
      case STORY_ANIMATION_STATE.PLAYING:
        WAAPIAnimationMethods.play();
        return;

      case STORY_ANIMATION_STATE.RESET:
        WAAPIAnimationMethods.reset();
        return;

      case STORY_ANIMATION_STATE.SCRUBBING:
        /*
         * See `../../../dashboard/components/previewPage: 82` for reference
         *
         * @todo
         * - have WAAPIAnimationMethods.setCurrentTime(time) subscribe to time setter
         * - return an unsubscribe function when state changes.
         */
        WAAPIAnimationMethods.pause();
        return;

      case STORY_ANIMATION_STATE.PAUSED:
        WAAPIAnimationMethods.pause();
        return;
      default:
        return;
    }
  }, [animationState, WAAPIAnimationMethods]);

  /*
   * Reset animation state if user changes page
   */
  useEffect(() => resetAnimationState, [resetAnimationState, page]);

  return page
    ? page.elements.map(({ id, ...rest }) => {
        if (editingElement === id) {
          return null;
        }
        return (
          <DisplayElement
            key={id}
            element={{ id, ...rest }}
            page={page}
            isAnimatable
          />
        );
      })
    : null;
}

function DisplayLayer() {
  const { currentPage, animationState, updateAnimationState } = useStory(
    ({ state, actions }) => {
      return {
        currentPage: state.currentPage,
        animationState: state.animationState,
        updateAnimationState: actions.updateAnimationState,
      };
    }
  );
  const {
    editingElement,
    setPageContainer,
    setFullbleedContainer,
  } = useCanvas(
    ({
      state: { editingElement },
      actions: { setPageContainer, setFullbleedContainer },
    }) => ({ editingElement, setPageContainer, setFullbleedContainer })
  );

  const resetAnimationState = useCallback(
    () => updateAnimationState({ animationState: STORY_ANIMATION_STATE.RESET }),
    [updateAnimationState]
  );

  return (
    <StoryAnimation.Provider
      animations={currentPage?.animations}
      elements={currentPage?.elements}
      onWAAPIFinish={resetAnimationState}
    >
      <Layer
        data-testid="DisplayLayer"
        pointerEvents="none"
        aria-label={__('Display layer', 'web-stories')}
      >
        <PageArea
          ref={setPageContainer}
          fullbleedRef={setFullbleedContainer}
          background={currentPage?.backgroundColor}
          overlay={
            currentPage && (
              <PageAttachment pageAttachment={currentPage.pageAttachment} />
            )
          }
        >
          <DisplayPage
            page={currentPage}
            editingElement={editingElement}
            animationState={animationState}
            resetAnimationState={resetAnimationState}
          />
        </PageArea>
      </Layer>
    </StoryAnimation.Provider>
  );
}

export default memo(DisplayLayer);
