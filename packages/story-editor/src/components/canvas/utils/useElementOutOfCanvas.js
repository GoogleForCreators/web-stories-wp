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
import isTargetOutOfContainer from '../../../utils/isTargetOutOfContainer';
import { useStory, useCanvas, useTransform } from '../../../app';

function useElementOutOfCanvas() {
  const { deleteSelectedElements } = useStory((state) => ({
    deleteSelectedElements: state.actions.deleteSelectedElements,
  }));
  const { clearTransforms } = useTransform((state) => ({
    clearTransforms: state.actions.clearTransforms,
  }));
  const { fullbleedContainer } = useCanvas(
    ({ state: { fullbleedContainer } }) => ({
      fullbleedContainer,
    })
  );

  // Deletes elements that are out of canvas.
  const handleElementOutOfCanvas = (target) => {
    if (isTargetOutOfContainer(target, fullbleedContainer)) {
      deleteSelectedElements();
      clearTransforms();
      return true;
    }
    return false;
  };

  return {
    handleElementOutOfCanvas,
  };
}

export default useElementOutOfCanvas;
