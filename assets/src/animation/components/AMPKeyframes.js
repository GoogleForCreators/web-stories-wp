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
import { useMemo } from 'react';

/**
 * Internal dependencies
 */
import { KeyframesOutput } from '../outputs';
import useStoryAnimationContext from './useStoryAnimationContext';

export function generateKeyframesMap(targets, getAnimationParts) {
  return targets.reduce((acc, target) => {
    return {
      ...acc,
      ...getAnimationParts(target).reduce((a, part) => {
        const { generatedKeyframes } = part;
        return {
          ...a,
          ...generatedKeyframes,
        };
      }, acc),
    };
  }, {});
}

function AMPKeyframes() {
  const {
    state: { providerId, animationTargets },
    actions: { getAnimationParts },
  } = useStoryAnimationContext();

  const keyframesMap = useMemo(
    () => generateKeyframesMap(animationTargets, getAnimationParts),
    [animationTargets, getAnimationParts]
  );

  return Object.keys(keyframesMap).map((animationName) => (
    <KeyframesOutput
      key={animationName}
      id={`${providerId}-${animationName}`}
      keyframes={keyframesMap[animationName]}
    />
  ));
}

export default AMPKeyframes;
