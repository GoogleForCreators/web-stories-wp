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
import { useCallback } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import { trackEvent } from '@googleforcreators/tracking';
import { Icons } from '@googleforcreators/design-system';
import { STORY_ANIMATION_STATE } from '@googleforcreators/animation';
/**
 * Internal dependencies
 */
import { useStory } from '../../../app';
import PageMenuButton from './pageMenuButton';

function AnimationToggle() {
  const { animationState, updateAnimationState, isFirstPage } = useStory(
    ({
      state: { animationState, currentPageNumber },
      actions: { updateAnimationState },
    }) => {
      const _isFirstPage = currentPageNumber === 1;
      return {
        animationState,
        updateAnimationState,
        isFirstPage: _isFirstPage,
      };
    }
  );
  const isPlaying = [
    STORY_ANIMATION_STATE.PLAYING,
    STORY_ANIMATION_STATE.PLAYING_SELECTED,
  ].includes(animationState);

  const tooltip = isFirstPage
    ? __('Animations Disabled', 'web-stories')
    : isPlaying
    ? __('Stop', 'web-stories')
    : __('Play', 'web-stories');
  const label = isFirstPage
    ? __('Page Animations Disabled', 'web-stories')
    : isPlaying
    ? __('Stop Page Animations', 'web-stories')
    : __('Play Page Animations', 'web-stories');
  const shortcut = isFirstPage ? null : 'mod + Enter';
  const Icon = isPlaying ? Icons.StopOutline : Icons.PlayOutline;

  const toggleAnimationState = useCallback(() => {
    updateAnimationState({
      animationState: isPlaying
        ? STORY_ANIMATION_STATE.RESET
        : STORY_ANIMATION_STATE.PLAYING,
    });

    trackEvent('canvas_play_animations', {
      status: isPlaying ? 'stop' : 'play',
    });
  }, [isPlaying, updateAnimationState]);

  return (
    <PageMenuButton
      title={tooltip}
      shortcut={shortcut}
      onClick={toggleAnimationState}
      aria-label={label}
      disabled={isFirstPage}
    >
      <Icon />
    </PageMenuButton>
  );
}

export default AnimationToggle;
