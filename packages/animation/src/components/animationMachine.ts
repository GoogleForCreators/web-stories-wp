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
import { useCallback, useReducer } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { AnimationMachineState, AnimationMachineTransition } from './types';

const AnimationMachine: Record<
  AnimationMachineState,
  Partial<Record<AnimationMachineTransition, AnimationMachineState>>
> = {
  [AnimationMachineState.Idle]: {
    [AnimationMachineTransition.Complete]: AnimationMachineState.Complete,
  },
  [AnimationMachineState.Complete]: {
    [AnimationMachineTransition.Reset]: AnimationMachineState.Idle,
  },
};

const animationStateReducer = (
  state: AnimationMachineState,
  action: AnimationMachineTransition
) => {
  return AnimationMachine[state][action] || state;
};

function useAnimationMachine() {
  const [animationState, dispatchWAAPIAnimationState] = useReducer(
    animationStateReducer,
    AnimationMachineState.Idle
  );
  const reset = useCallback(
    () => dispatchWAAPIAnimationState(AnimationMachineTransition.Reset),
    []
  );
  const complete = useCallback(
    () => dispatchWAAPIAnimationState(AnimationMachineTransition.Complete),
    []
  );

  return { animationState, reset, complete };
}
export default useAnimationMachine;
