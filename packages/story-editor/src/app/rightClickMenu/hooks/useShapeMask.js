/**
 * External dependencies
 */
import { useCallback } from '@googleforcreators/react';
import { MaskTypes } from '@googleforcreators/masks';

/**
 * Internal dependencies
 */
import { useStory } from '../..';
import useInsertElement from '../../../components/canvas/useInsertElement';

const useShapeMask = () => {
    const {
        selectedElements,
        updateElementById,
        combineElements,
    } = useStory(({ state, actions }) => ({
        selectedElements: state.selectedElements,
        updateElementById: actions.updateElementById,
        combineElements: actions.combineElements,
    }));
    const insertElement = useInsertElement();
    const hasShapeMask = (element) => (element && element?.type === 'image' && element?.mask?.type !== MaskTypes.RECTANGLE);

    /**
    * Retrieve shape and image from selected elements.
    */
    const shapeMaskElements = useCallback(() => {
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
    const handleUseShapeAsMask = (shape, image) => {
        combineElements({
            firstElement: image,
            secondId: shape.id,
        });
    };


    const handleRemoveElementMask = useCallback(() => {

        const element = selectedElements?.[0];

        if (!element) {
            return;
        }

        const { x, y, width, height, scale, rotationAngle } = element;
        insertElement('shape', {
            x, y, width, height, scale, rotationAngle,
            mask: {
                type: element.mask.type,
            },
        });

        updateElementById({
            elementId: element.id,
            properties: { mask: { type: MaskTypes.RECTANGLE } },
        });
    }, [selectedElements, insertElement, updateElementById]);

    return { hasShapeMask, shapeMaskElements, handleUseShapeAsMask, handleRemoveElementMask }
}

export default useShapeMask;