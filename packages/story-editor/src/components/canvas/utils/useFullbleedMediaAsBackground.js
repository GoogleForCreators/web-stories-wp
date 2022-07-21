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
import { useState } from '@googleforcreators/react';
import {
  useSnackbar,
  LOCAL_STORAGE_PREFIX,
  localStore,
} from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';
import { MEDIA_ELEMENT_TYPES } from '@googleforcreators/elements';
import SAT from 'sat';

/**
 * Internal dependencies
 */
import { useStory, useCanvas } from '../../../app';
import useElementPolygon from '../../../utils/useElementPolygon';

function useFullbleedMediaAsBackground() {
  const [
    isBackgroundSnackbarMessageDismissed,
    setIsBackgroundSnackbarMessageDismissed,
  ] = useState(
    localStore.getItemByKey(
      LOCAL_STORAGE_PREFIX.BACKGROUND_IS_SET_DIALOG_DISMISSED
    )
  );
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
  const getElementPolygon = useElementPolygon();

  const buffer = 2;

  const handleFullbleedMediaAsBackground = (selectedElement) => {
    if (
      isDefaultBackground &&
      MEDIA_ELEMENT_TYPES.includes(selectedElement.type)
    ) {
      const elPolygon = getElementPolygon(selectedElement);
      const fullbleedBox = fullbleedContainer.getBoundingClientRect();
      // We use 2 pixel buffer from each edge for setting the background media.
      const bgPolygon = new SAT.Box(
        new SAT.Vector(fullbleedBox.x + buffer, fullbleedBox.y + buffer),
        fullbleedBox.width - buffer * 2,
        fullbleedBox.height - buffer * 2
      ).toPolygon();
      const response = new SAT.Response();
      SAT.testPolygonPolygon(elPolygon, bgPolygon, response);
      if (response.bInA) {
        setBackgroundElement({ elementId: selectedElement.id });
      }

      if (!isBackgroundSnackbarMessageDismissed) {
        showSnackbar({
          message: __(
            'Full bleed images and videos are automatically set as background. Double click to scale and position at any time.',
            'web-stories'
          ),
          dismissible: true,
        });
        localStore.setItemByKey(
          LOCAL_STORAGE_PREFIX.BACKGROUND_IS_SET_DIALOG_DISMISSED,
          true
        );
        setIsBackgroundSnackbarMessageDismissed(true);
      }
    }
  };

  return {
    handleFullbleedMediaAsBackground,
  };
}

export default useFullbleedMediaAsBackground;
