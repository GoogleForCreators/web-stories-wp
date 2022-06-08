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
import { useCallback } from '@googleforcreators/react';
import { MaskTypes } from '@googleforcreators/masks';

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

    /**
     * Retrieve shape and image from selected elements.
     */
    const getShapeMaskElements = useCallback(() => {
        if (selectedElements?.length > 2) {
            return {};
        }

        let image, shape;

        selectedElements.forEach((element) => {
            element.type === 'shape' && (shape = element);
            element.type === 'image' && (image = element);
        });

        if (shape && image) {
            return { shape, image };
        }

        return {};
    }, [selectedElements]);

    /**
     * Apply shape mask to element.
     *
     * @param {Object} shape Element to use for the mask.
     * @param {Object} image Element that the mask will be applied to.
     */
    const addShapeMask = (shape, image) => {
        combineElements({
            firstElement: image,
            secondId: shape.id,
        });
    };

    return {
        getShapeMaskElements,
        addShapeMask
    };
};

export default useShapeMaskElements;
