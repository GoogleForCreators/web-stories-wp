/*
 * Copyright 2022 Google LLC
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
import { useState, useEffect } from '@googleforcreators/react';
import { getDefinitionForType } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import { useStory } from '../app';

const useShapeMaskElements = () => {
  const { selectedElements, combineElements } = useStory(
    ({ state, actions }) => ({
      selectedElements: state.selectedElements,
      combineElements: actions.combineElements,
    })
  );

  const [shapeMaskElements, setShapeMaskElements] = useState({});
  const [canMergeIntoMask, setCanMergeIntoMask] = useState(false);

  /**
   * Get shape and image from selected elements.
   */
  useEffect(() => {
    if (selectedElements?.length > 2) {
      setCanMergeIntoMask(false);
      return;
    }

    let target, shape;

    selectedElements.forEach((element) => {
      const { isMedia } = getDefinitionForType(element.type);
      element.type === 'shape' && (shape = element);
      isMedia && (target = element);
    });

    if (shape && target) {
      setCanMergeIntoMask(true);
      setShapeMaskElements({ shape, target });
      return;
    }

    setCanMergeIntoMask(false);
  }, [selectedElements]);

  /**
   * Apply shape mask to element.
   */
  const mergeIntoMask = () => {
    const { target, shape } = shapeMaskElements;

    if (target && shape) {
      combineElements({
        firstElement: target,
        secondId: shape.id,
      });
    }
  };

  return {
    canMergeIntoMask,
    mergeIntoMask,
  };
};

export default useShapeMaskElements;
