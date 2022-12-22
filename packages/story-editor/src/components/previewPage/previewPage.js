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
import { useEffect, memo, forwardRef } from '@googleforcreators/react';
import styled, { StyleSheetManager } from 'styled-components';
import { generatePatternStyles } from '@googleforcreators/patterns';
import {
  AnimationProvider,
  useStoryAnimationContext,
  StoryAnimationState,
} from '@googleforcreators/animation';

/**
 * Internal dependencies
 */
import { StoryPropTypes, PageSizePropType } from '../../propTypes';
import { noop } from '../../utils/noop';
import PagePreviewElements from './previewPageElements';

/*
 * A quick note about how height works with the 9:16 aspect ratio (FULLBLEED_RATIO)
 * The unitProvider that sizes page previews still needs the 2:3 ratio,
 * this is passed in here as pageSize.height. It is the true height of the story
 * That said, we also need a height for the 9:16 that acts as the container for the story
 * to allow for fullBleed overflow.
 * So, you'll notice that containerHeight is getting used to wrap the PreviewSafeZone height
 * to make sure that the overflow has the proper size.
 * Reference story-editor/components/canvas/layout for more details
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

function PreviewPageAnimationController({ animationState }) {
  const WAAPIAnimationMethods = useStoryAnimationContext(
    ({ actions }) => actions.WAAPIAnimationMethods
  );

  useEffect(() => {
    switch (animationState) {
      case StoryAnimationState.Playing:
        WAAPIAnimationMethods.play();
        return noop;
      case StoryAnimationState.Reset:
        WAAPIAnimationMethods.reset();
        return noop;
      case StoryAnimationState.Scrubbing:
      case StoryAnimationState.Paused:
        WAAPIAnimationMethods.pause();
        return noop;
      default:
        return noop;
    }
  }, [animationState, WAAPIAnimationMethods]);

  /**
   * Reset everything on unmount;
   */
  useEffect(() => () => WAAPIAnimationMethods.reset(), [WAAPIAnimationMethods]);

  return null;
}

const PreviewPageDisplay = memo(
  forwardRef(function PreviewPageDisplay({ page, pageSize }, ref) {
    return (
      <FullBleedPreviewWrapper
        ref={ref}
        pageSize={pageSize}
        background={page.backgroundColor}
      >
        <PreviewSafeZone pageSize={pageSize}>
          <PagePreviewElements page={page} />
        </PreviewSafeZone>
      </FullBleedPreviewWrapper>
    );
  })
);

const PreviewPage = forwardRef(function PreviewPage(
  {
    page,
    pageSize,
    animationState = StoryAnimationState.Reset,
    onAnimationComplete,
  },
  ref
) {
  // Preview is wrapped in StyleSheetManager w/ stylisPlugins={[]} in order to prevent
  // elements from shifting when in RTL mode since these aren't relevant for story previews
  return (
    <StyleSheetManager stylisPlugins={[]}>
      <AnimationProvider
        animations={page.animations}
        elements={page.elements}
        onWAAPIFinish={onAnimationComplete}
      >
        <PreviewPageDisplay ref={ref} page={page} pageSize={pageSize} />
        <PreviewPageAnimationController animationState={animationState} />
      </AnimationProvider>
    </StyleSheetManager>
  );
});

PreviewPage.propTypes = {
  page: StoryPropTypes.page.isRequired,
  pageSize: PageSizePropType.isRequired,
  animationState: PropTypes.oneOf(Object.values(StoryAnimationState)),
  onAnimationComplete: PropTypes.func,
};

PreviewPageDisplay.propTypes = {
  page: StoryPropTypes.page.isRequired,
  pageSize: PageSizePropType.isRequired,
};

PreviewPageAnimationController.propTypes = {
  animationState: PropTypes.oneOf(Object.values(StoryAnimationState)),
};

export default PreviewPage;
