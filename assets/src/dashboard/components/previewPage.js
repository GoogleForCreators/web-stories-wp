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
import DisplayElement from '../../edit-story/components/canvas/displayElement';
import StoryPropTypes from '../../edit-story/types';
import generatePatternStyles from '../../edit-story/utils/generatePatternStyles';
import { STORY_PAGE_STATE } from '../constants';
import { PageSizePropType } from '../types';
import StoryAnimation, { useStoryAnimationContext } from './storyAnimation';

const PreviewWrapper = styled.div`
  overflow: initial;
  position: relative;
  width: 100%;
  height: 100%;
  background-color: white;
  ${({ background }) => generatePatternStyles(background)};
`;

const PageContainerSafeZone = styled.div`
  width: 100%;
  height: ${({ pageSize }) =>
    `${pageSize.height - pageSize.dangerZoneHeight}px`};
  overflow: visible;
  position: absolute;
  margin: 0;
  top: ${({ pageSize }) => `${pageSize.dangerZoneHeight / 2}px`};
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
      case STORY_PAGE_STATE.PLAYING:
        WAAPIAnimationMethods.play();
        return () => {};
      case STORY_PAGE_STATE.RESET:
        WAAPIAnimationMethods.reset();
        return () => {};
      case STORY_PAGE_STATE.SCRUBBING:
        WAAPIAnimationMethods.pause();
        return subscribeGlobalTime?.(WAAPIAnimationMethods.setCurrentTime);
      case STORY_PAGE_STATE.PAUSED:
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
    <PreviewWrapper background={page.backgroundColor}>
      <PageContainerSafeZone pageSize={pageSize}>
        {page.elements.map(({ id, ...rest }) => (
          <DisplayElement
            previewMode
            key={id}
            page={page}
            element={{ id, ...rest }}
            isAnimatable
          />
        ))}
      </PageContainerSafeZone>
    </PreviewWrapper>
  );
}

function PreviewPage({
  page,
  pageSize,
  animationState = STORY_PAGE_STATE.RESET,
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
  animationState: PropTypes.oneOf(Object.values(STORY_PAGE_STATE)),
  onAnimationComplete: PropTypes.func,
  subscribeGlobalTime: PropTypes.func,
};

PreviewPageController.propTypes = {
  page: StoryPropTypes.page.isRequired,
  pageSize: PageSizePropType.isRequired,
  animationState: PropTypes.oneOf(Object.values(STORY_PAGE_STATE)),
  subscribeGlobalTime: PropTypes.func,
};

export default PreviewPage;
