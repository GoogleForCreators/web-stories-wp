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
 * Internal dependencies
 */
import { KeyframesOutput } from '../../animations/animationOutputs';
import { AnimationPart } from '../../animations/animationParts';
import useStoryAnimationContext from './useStoryAnimationContext';

function AMPKeyframes() {
  const {
    state: { providerId, animationTypes },
  } = useStoryAnimationContext();

  return animationTypes.map((type) => {
    const { keyframes } = AnimationPart(type);

    return (
      <KeyframesOutput
        key={type}
        id={`${providerId}-${type}`}
        keyframes={keyframes}
      />
    );
  });
}

export default AMPKeyframes;
