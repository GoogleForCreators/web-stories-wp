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
import { useCallback } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { STORY_ANIMATION_STATE } from '../../../../animation';
import { useStory } from '../../../app';
import { LayerPanel } from '../../panels/design';
import DesignPanels from './designPanels';

const Wrapper = styled.div`
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  display: flex;
`;

const TopPanels = styled.div`
  overflow: auto;
  flex: 1;
`;

const BottomPanels = styled.div``;

function DesignInspector() {
  const updateAnimationState = useStory(
    ({ actions }) => actions.updateAnimationState
  );

  const resetStoryAnimationState = useCallback(
    () => updateAnimationState({ animationState: STORY_ANIMATION_STATE.RESET }),
    [updateAnimationState]
  );

  return (
    <Wrapper>
      <TopPanels onFocus={resetStoryAnimationState}>
        <DesignPanels />
      </TopPanels>
      <BottomPanels>
        <LayerPanel />
      </BottomPanels>
    </Wrapper>
  );
}

export default DesignInspector;
