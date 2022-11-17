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
import { produce } from 'immer';

/**
 * Internal dependencies
 */
import type {
  ReducerState,
  UpdateAnimationStateProps,
} from '../../../../types/storyProvider';

/**
 * Update the story animation state to play, pause, scrub or reset
 * active pages animations.
 */
export const updateAnimationState = (
  draft: ReducerState,
  { animationState }: UpdateAnimationStateProps
) => {
  draft.animationState = animationState;
};

export default produce(updateAnimationState);
