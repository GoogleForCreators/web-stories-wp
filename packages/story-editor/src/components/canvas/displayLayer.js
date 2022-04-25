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
} from '@googleforcreators/react';
import PropTypes from 'prop-types';
import { _x, __ } from '@googleforcreators/i18n';
import {
  StoryAnimation,
  STORY_ANIMATION_STATE,
  useStoryAnimationContext,
} from '@googleforcreators/animation';

/**
 * Internal dependencies
 */
import {
  useStory,
  useCanvas,
  useCanvasBoundingBoxRef,
  CANVAS_BOUNDING_BOX_IDS,
} from '../../app';
import { STABLE_ARRAY } from '../../constants';
import StoryPropTypes from '../../types';
import DisplayElement from './displayElement';
import { Layer, PageArea } from './layout';
import PageAttachment from './pageAttachment';
import ShoppingPageAttachment from './shoppingPageAttachment';
import { MediaCaptionsLayer } from './mediaCaptions';

const DisplayPageArea = styled(PageArea)`
  position: absolute;
`;

function DisplayPage({ pageElements, editingElement }) {
  return pageElements
    ? pageElements.map((element) => {
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
  pageElements: PropTypes.arrayOf(StoryPropTypes.element),
  editingElement: PropTypes.string,
};

function DisplayPageAnimationController({ resetAnimationState }) {
  const { animationState, pageId } = useStory(({ state }) => ({
    animationState: state.animationState,
    pageId: state.currentPage?.id,
  }));

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
  useEffect(() => resetAnimationState, [resetAnimationState, pageId]);

  return null;
}

DisplayPageAnimationController.propTypes = {
  resetAnimationState: PropTypes.func,
};

function StoryAnimations({ children }) {
  const {
    isAnimationPlaying,
    currentPageAnimations,
    currentPageElements,
    selectedElements,
    updateAnimationState,
  } = useStory(({ state, actions }) => {
    return {
      isAnimationPlaying:
        state.animationState === STORY_ANIMATION_STATE.PLAYING_SELECTED,
      currentPageAnimations: state.currentPage?.animations || STABLE_ARRAY,
      currentPageElements: state.currentPage?.elements || STABLE_ARRAY,
      selectedElements: state.selectedElements,
      updateAnimationState: actions.updateAnimationState,
    };
  });

  const resetAnimationState = useCallback(() => {
    updateAnimationState({ animationState: STORY_ANIMATION_STATE.RESET });
  }, [updateAnimationState]);

  const animatedElements = useMemo(
    () => selectedElements.map((el) => el.id),
    [selectedElements]
  );

  return (
    <StoryAnimation.Provider
      animations={currentPageAnimations}
      elements={currentPageElements}
      onWAAPIFinish={resetAnimationState}
      selectedElementIds={isAnimationPlaying ? animatedElements : STABLE_ARRAY}
    >
      <DisplayPageAnimationController
        resetAnimationState={resetAnimationState}
      />
      {children}
    </StoryAnimation.Provider>
  );
}

StoryAnimations.propTypes = {
  children: PropTypes.node,
};

function DisplayLayer() {
  const { backgroundColor, isBackgroundSelected, pageAttachment, hasProducts } =
    useStory(({ state }) => {
      return {
        hasCurrentPage: Boolean(state.currentPage),
        backgroundColor: state.currentPage?.backgroundColor,
        isBackgroundSelected: state.selectedElements?.[0]?.isBackground,
        pageAttachment: state.currentPage?.pageAttachment || {},
        hasProducts: state.currentPage.elements?.some(
          ({ type, product }) => type === 'product' && product?.productId
        ),
      };
    });
  // Have page elements shallowly equaled for scenarios like animation
  // updates where elements don't change, but we get a new page elements
  // array
  const currentPageElements = useStory(
    ({ state }) => state.currentPage?.elements || STABLE_ARRAY
  );

  const boundingBoxTrackingRef = useCanvasBoundingBoxRef(
    CANVAS_BOUNDING_BOX_IDS.PAGE_CONTAINER
  );
  const { editingElement, setPageContainer, setFullbleedContainer } = useCanvas(
    ({
      state: { editingElement },
      actions: { setPageContainer, setFullbleedContainer },
    }) => ({ editingElement, setPageContainer, setFullbleedContainer })
  );

  const Overlay = useMemo(() => {
    if (hasProducts) {
      return <ShoppingPageAttachment pageAttachment={pageAttachment} />;
    }

    // Always render <PageAttachment> because the pageAttachmentContainer ref
    // is needed in the page attachment panel and the useElementsWithLinks hook.
    return <PageAttachment pageAttachment={pageAttachment} />;
  }, [pageAttachment, hasProducts]);

  return (
    <StoryAnimations>
      <Layer
        data-testid="DisplayLayer"
        pointerEvents="none"
        aria-label={_x('Display layer', 'compound noun', 'web-stories')}
      >
        <DisplayPageArea
          ref={useCombinedRefs(setPageContainer, boundingBoxTrackingRef)}
          fullbleedRef={setFullbleedContainer}
          background={backgroundColor}
          isBackgroundSelected={isBackgroundSelected}
          fullBleedContainerLabel={__(
            'Fullbleed area (Display layer)',
            'web-stories'
          )}
          overlay={Overlay}
          isControlled
        >
          <DisplayPage
            pageElements={currentPageElements}
            editingElement={editingElement}
          />
        </DisplayPageArea>
        <MediaCaptionsLayer />
      </Layer>
    </StoryAnimations>
  );
}

export default memo(DisplayLayer);
