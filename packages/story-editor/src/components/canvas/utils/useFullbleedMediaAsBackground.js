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
/**
 * Internal dependencies
 */
import { __ } from '@googleforcreators/i18n';
import { MEDIA_ELEMENT_TYPES } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import isTargetCoveringContainer from '../../../utils/isTargetCoveringContainer';
import { useStory, useCanvas } from '../../../app';

function useFullbleedMediaAsBackground({ selectedElement }) {
  const DISMISS_BACKGROUND_AUTOSET_MESSAGE_STORAGE_KEY =
    'BACKGROUND_IS_SET_DIALOG_DISMISSED';
  const [
    isBackgroundSnackbarMessageDismissed,
    setIsBackgroundSnackbarMessageDismissed,
  ] = useState(
    localStore.getItemByKey(
      LOCAL_STORAGE_PREFIX[DISMISS_BACKGROUND_AUTOSET_MESSAGE_STORAGE_KEY]
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

  const handleFullbleedMediaAsBackground = (target) => {
    if (
      isDefaultBackground &&
      MEDIA_ELEMENT_TYPES.includes(selectedElement.type) &&
      isTargetCoveringContainer(target, fullbleedContainer)
    ) {
      setBackgroundElement({ elementId: selectedElement.id });

      if (!isBackgroundSnackbarMessageDismissed) {
        showSnackbar({
          message: __(
            'Full bleed images and videos are automatically set as background. Double click to scale and position at any time.',
            'web-stories'
          ),
          dismissible: true,
        });
        localStore.setItemByKey(
          LOCAL_STORAGE_PREFIX[DISMISS_BACKGROUND_AUTOSET_MESSAGE_STORAGE_KEY],
          !isBackgroundSnackbarMessageDismissed
        );
        setIsBackgroundSnackbarMessageDismissed(
          !isBackgroundSnackbarMessageDismissed
        );
      }
    }
  };

  return {
    handleFullbleedMediaAsBackground,
  };
}

export default useFullbleedMediaAsBackground;
