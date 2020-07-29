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
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import StoryPropTypes from '../../edit-story/types';
import generatePatternStyles from '../../edit-story/utils/generatePatternStyles';
import { STORY_ANIMATION_STATE } from '../constants';
import { PageSizePropType } from '../types';
import StoryAnimation, { useStoryAnimationContext } from './storyAnimation';
import PagePreviewElements from './previewPageElements';

/*
 * A quick note about how height works with the 9:16 aspect ratio (FULLBLEED_RATIO)
 * The unitProvider that sizes page previews still needs the 2:3 ratio,
 * this is passed in here as pageSize.height. It is the true height of the story
 * That said, we also need a height for the 9:16 that acts as the container for the story
 * to allow for fullBleed overflow.
 * So, you'll notice that containerHeight is getting used to wrap the PreviewSafeZone height
 * to make sure that the overflow has the proper size.
 * Reference edit-story/components/canvas/layout for more details
 *
 */

const FullBleedPreviewWrapper = styled.div`
  height: ${({ pageSize }) => `${pageSize.containerHeight}px`};
  width: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  background-color: white;
  ${({ background }) => generatePatternStyles(background)};
`;

const PreviewSafeZone = styled.div`
  width: 100%;
  height: ${({ pageSize }) => `${pageSize.height}px`};
  overflow: visible;
  position: absolute;
  margin: 0;
`;

function PreviewPageController({
  page,
  animationState,
  subscribeGlobalTime,
  pageSize,
}) {
  const {
    actions: { WAAPIAnimationMethods },
  } = useStoryAnimationContext();

  useEffect(() => {
    switch (animationState) {
      case STORY_ANIMATION_STATE.PLAYING:
        WAAPIAnimationMethods.play();
        return () => {};
      case STORY_ANIMATION_STATE.RESET:
        WAAPIAnimationMethods.reset();
        return () => {};
      case STORY_ANIMATION_STATE.SCRUBBING:
        WAAPIAnimationMethods.pause();
        return subscribeGlobalTime?.(WAAPIAnimationMethods.setCurrentTime);
      case STORY_ANIMATION_STATE.PAUSED:
        WAAPIAnimationMethods.pause();
        return () => {};
      default:
        return () => {};
    }
  }, [animationState, WAAPIAnimationMethods, subscribeGlobalTime]);

  /**
   * Reset everything on unmount;
   */
  useEffect(() => () => WAAPIAnimationMethods.reset(), [WAAPIAnimationMethods]);

  return (
    <FullBleedPreviewWrapper
      pageSize={pageSize}
      background={page.backgroundColor}
    >
      <PreviewSafeZone pageSize={pageSize}>
        <PagePreviewElements page={page} />
      </PreviewSafeZone>
    </FullBleedPreviewWrapper>
  );
}

function PreviewPage({
  page,
  pageSize,
  animationState = STORY_ANIMATION_STATE.RESET,
  onAnimationComplete,
  subscribeGlobalTime,
}) {
  return (
    <StoryAnimation.Provider
      animations={page.animations}
      onWAAPIFinish={onAnimationComplete}
    >
      <PreviewPageController
        page={page}
        pageSize={pageSize}
        animationState={animationState}
        onAnimationComplete={onAnimationComplete}
        subscribeGlobalTime={subscribeGlobalTime}
      />
    </StoryAnimation.Provider>
  );
}

PreviewPage.propTypes = {
  page: StoryPropTypes.page.isRequired,
  pageSize: PageSizePropType.isRequired,
  animationState: PropTypes.oneOf(Object.values(STORY_ANIMATION_STATE)),
  onAnimationComplete: PropTypes.func,
  subscribeGlobalTime: PropTypes.func,
};

PreviewPageController.propTypes = {
  page: StoryPropTypes.page.isRequired,
  pageSize: PageSizePropType.isRequired,
  animationState: PropTypes.oneOf(Object.values(STORY_ANIMATION_STATE)),
  subscribeGlobalTime: PropTypes.func,
};

export default PreviewPage;
