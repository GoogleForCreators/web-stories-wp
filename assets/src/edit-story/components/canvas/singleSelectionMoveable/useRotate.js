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
import { useGlobalIsKeyPressed } from '../../../../design-system';
import { useStory } from '../../../app';
import useElementOutOfCanvas from '../utils/useElementOutOfCanvas';
import normalizeRotationDegrees from '../utils/normalizeRotationDegrees';

function useSingleSelectionRotate({
  selectedElement,
  isEditMode,
  pushTransform,
  frame,
  setTransformStyle,
  resetMoveable,
}) {
  const { updateSelectedElements } = useStory((state) => ({
    updateSelectedElements: state.actions.updateSelectedElements,
  }));
  // ⇧ key rotates the element 30 degrees at a time
  const throttleRotation = useGlobalIsKeyPressed('shift');

  const { handleElementOutOfCanvas } = useElementOutOfCanvas();

  const onRotateStart = ({ set }) => {
    if (isEditMode) {
      // In edit mode, we need to signal right away that the action started.
      pushTransform(selectedElement.id, frame);
    }
    set(frame.rotate);
  };
  const onRotate = ({ target, beforeRotate }) => {
    frame.rotate = normalizeRotationDegrees(beforeRotate);
    setTransformStyle(target, frame);
  };
  const onRotateEnd = ({ target }) => {
    if (handleElementOutOfCanvas(target)) {
      return;
    }
    const properties = { rotationAngle: Math.round(frame.rotate) };
    updateSelectedElements({ properties });
    resetMoveable(target);
  };

  return {
    throttleRotate: throttleRotation ? 30 : 0,
    onRotate,
    onRotateEnd,
    onRotateStart,
  };
}

export default useSingleSelectionRotate;
