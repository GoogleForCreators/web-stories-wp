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
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useCombinedRefs,
} from '@web-stories-wp/react';
import PropTypes from 'prop-types';
import { _x, __ } from '@web-stories-wp/i18n';
import {
  StoryAnimation,
  STORY_ANIMATION_STATE,
  useStoryAnimationContext,
} from '@web-stories-wp/animation';

/**
 * Internal dependencies
 */
import {
  useStory,
  useCanvas,
  useCanvasBoundingBoxRef,
  CANVAS_BOUNDING_BOX_IDS,
} from '../../app';
import StoryPropTypes from '../../types';
import DisplayElement from './displayElement';
import { Layer, PageArea } from './layout';
import PageAttachment from './pageAttachment';
import { VideoCaptionsLayer } from './videoCaptions';

const DisplayPageArea = styled(PageArea)`
  position: absolute;
`;

function DisplayPage({ page, editingElement }) {
  return page
    ? page.elements.map((element) => {
        if (editingElement === element.id) {
          return null;
        }
        return (
          <DisplayElement key={element.id} element={element} isAnimatable />
        );
      })
    : null;
}

DisplayPage.propTypes = {
  page: StoryPropTypes.page,
  editingElement: StoryPropTypes.element,
};

function DisplayPageAnimationController({
  animationState,
  resetAnimationState,
  page,
}) {
  const WAAPIAnimationMethods = useStoryAnimationContext(
    ({ actions }) => actions.WAAPIAnimationMethods
  );

  useEffect(() => {
    switch (animationState) {
      case STORY_ANIMATION_STATE.PLAYING_SELECTED:
      case STORY_ANIMATION_STATE.PLAYING:
        WAAPIAnimationMethods.play();
        return;

      case STORY_ANIMATION_STATE.RESET:
        WAAPIAnimationMethods.reset();
        return;

      case STORY_ANIMATION_STATE.SCRUBBING:
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

  return null;
}

DisplayPageAnimationController.propTypes = {
  page: StoryPropTypes.page,
  animationState: PropTypes.oneOf(Object.values(STORY_ANIMATION_STATE)),
  resetAnimationState: PropTypes.func,
};

function DisplayLayer() {
  const {
    currentPage,
    animationState,
    updateAnimationState,
    selectedElements,
  } = useStory(({ state, actions }) => {
    return {
      currentPage: state.currentPage,
      animationState: state.animationState,
      selectedElements: state.selectedElements,
      updateAnimationState: actions.updateAnimationState,
    };
  });

  const boundingBoxTrackingRef = useCanvasBoundingBoxRef(
    CANVAS_BOUNDING_BOX_IDS.PAGE_CONTAINER
  );
  const { editingElement, setPageContainer, setFullbleedContainer } = useCanvas(
    ({
      state: { editingElement },
      actions: { setPageContainer, setFullbleedContainer },
    }) => ({ editingElement, setPageContainer, setFullbleedContainer })
  );

  const isBackgroundSelected =
    selectedElements?.[0]?.id === currentPage?.elements?.[0]?.id;

  const resetAnimationState = useCallback(() => {
    updateAnimationState({ animationState: STORY_ANIMATION_STATE.RESET });
  }, [updateAnimationState]);

  const animatedElements = useMemo(
    () => selectedElements.map((el) => el.id),
    [selectedElements]
  );

  return (
    <StoryAnimation.Provider
      animations={currentPage?.animations}
      elements={currentPage?.elements}
      onWAAPIFinish={resetAnimationState}
      selectedElementIds={
        animationState === STORY_ANIMATION_STATE.PLAYING_SELECTED
          ? animatedElements
          : []
      }
    >
      <DisplayPageAnimationController
        page={currentPage}
        animationState={animationState}
        resetAnimationState={resetAnimationState}
      />
      <Layer
        data-testid="DisplayLayer"
        pointerEvents="none"
        aria-label={_x('Display layer', 'compound noun', 'web-stories')}
      >
        <DisplayPageArea
          ref={useCombinedRefs(setPageContainer, boundingBoxTrackingRef)}
          fullbleedRef={setFullbleedContainer}
          background={currentPage?.backgroundColor}
          isBackgroundSelected={isBackgroundSelected}
          fullBleedContainerLabel={__(
            'Fullbleed area (Display layer)',
            'web-stories'
          )}
          overlay={
            currentPage && (
              <PageAttachment pageAttachment={currentPage.pageAttachment} />
            )
          }
          isControlled
        >
          <DisplayPage page={currentPage} editingElement={editingElement} />
        </DisplayPageArea>
        <VideoCaptionsLayer />
      </Layer>
    </StoryAnimation.Provider>
  );
}

export default memo(DisplayLayer);
