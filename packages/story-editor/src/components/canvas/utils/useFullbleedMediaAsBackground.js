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
import isTargetCoveringContainer from '../../../utils/isTargetCoveringContainer';
import { useStory, useCanvas } from '../../../app';

function useFullbleedMediaAsBackground({ selectedElement }) {
  const { setBackgroundElement, isDefaultBackground } = useStory((state) => ({
    setBackgroundElement: state.actions.setBackgroundElement,
    isDefaultBackground:
      state.state.currentPage?.elements[0]?.isDefaultBackground,
  }));
  const { fullbleedContainer } = useCanvas(
    ({ state: { fullbleedContainer } }) => ({
      fullbleedContainer,
    })
  );

  const handleFullbleedMediaAsBackground = (target) => {
    if (!isDefaultBackground) {
      return false;
    }
    if (selectedElement.type !== 'image' && selectedElement.type !== 'video') {
      return false;
    }
    if (isTargetCoveringContainer(target, fullbleedContainer)) {
      setBackgroundElement({ elementId: selectedElement.id });
      return true;
    }
    return false;
  };

  return {
    handleFullbleedMediaAsBackground,
  };
}

export default useFullbleedMediaAsBackground;
