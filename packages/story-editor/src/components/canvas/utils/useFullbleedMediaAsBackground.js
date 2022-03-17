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
/**
 * External dependencies
 */
import { useSnackbar } from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';
import isTargetCoveringContainer from '../../../utils/isTargetCoveringContainer';
import { useStory, useCanvas } from '../../../app';
import { MEDIA_ELEMENT_TYPES } from '../../../elements';

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
  const { showSnackbar } = useSnackbar();

  const handleFullbleedMediaAsBackground = (target) => {
    let isBackgroundMessageShown = localStorage.getItem('web_stories_is_background_message_shown');

    if (
      isDefaultBackground &&
      MEDIA_ELEMENT_TYPES.includes(selectedElement.type) &&
      isTargetCoveringContainer(target, fullbleedContainer)
    ) {
      setBackgroundElement({ elementId: selectedElement.id });

      if (!isBackgroundMessageShown) {
        showSnackbar({ 
          message: __(
            'Full bleed images and videos are automatically set as background. Double click to scale and position at any time.',
            'web-stories'
          ),
          dismissible: true,
        });
        isBackgroundMessageShown = true;
        localStorage.setItem('web_stories_is_background_message_shown', isBackgroundMessageShown);
      }
    }
  };

  return {
    handleFullbleedMediaAsBackground,
  };
}

export default useFullbleedMediaAsBackground;
