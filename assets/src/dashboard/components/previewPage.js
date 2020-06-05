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

/**
 * Internal dependencies
 */
import DisplayElement from '../../edit-story/components/canvas/displayElement';
import StoryPropTypes from '../../edit-story/types';
import { STORY_PAGE_STATE } from '../constants';
import StoryAnimation, { useStoryAnimationContext } from './storyAnimation';

function PreviewPageController({ page, animationState }) {
  const {
    actions: { WAAPIAnimationMethods },
  } = useStoryAnimationContext();

  useEffect(() => {
    if (STORY_PAGE_STATE.ANIMATE === animationState) {
      WAAPIAnimationMethods.play();
    }
    if (STORY_PAGE_STATE.IDLE === animationState) {
      WAAPIAnimationMethods.reset();
    }
  }, [animationState, WAAPIAnimationMethods]);

  /**
   * Reset everything on unmount;
   */
  useEffect(() => () => WAAPIAnimationMethods.reset(), [WAAPIAnimationMethods]);

  return page.elements.map(({ id, ...rest }) => (
    <DisplayElement
      key={id}
      page={page}
      element={{ id, ...rest }}
      isAnimatable
    />
  ));
}

function PreviewPage({
  page,
  animationState = STORY_PAGE_STATE.IDLE,
  onAnimationComplete,
}) {
  return (
    <StoryAnimation.Provider
      animations={page.animations}
      onWAAPIFinish={onAnimationComplete}
    >
      <PreviewPageController
        page={page}
        animationState={animationState}
        onAnimationComplete={onAnimationComplete}
      />
    </StoryAnimation.Provider>
  );
}

PreviewPage.propTypes = {
  page: StoryPropTypes.page.isRequired,
  animationState: PropTypes.oneOf(Object.values(STORY_PAGE_STATE)),
  onAnimationComplete: PropTypes.func,
};

export default PreviewPage;
