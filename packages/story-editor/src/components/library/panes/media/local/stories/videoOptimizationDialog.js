/*
 * Copyright 2021 Google LLC
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
import {
  localStore,
  LOCAL_STORAGE_PREFIX,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import VideoOptimizationDialog from '../videoOptimizationDialog';
import MediaContext from '../../../../../../app/media/context';
import CurrentUserContext from '../../../../../../app/currentUser/context';

export default {
  title: 'Stories Editor/Components/Dialog/Video Optimization',
  component: VideoOptimizationDialog,
  argTypes: {
    updateCurrentUser: { action: 'close dialog' },
  },
};

export const _default = {
  render: function Render(args) {
    // Reset local storage for improved testablity.
    const storageKey = LOCAL_STORAGE_PREFIX.VIDEO_OPTIMIZATION_DIALOG_DISMISSED;
    localStore.setItemByKey(storageKey, false);

    const mediaValue = {
      local: {
        state: { isTranscoding: true },
      },
    };

    const userValue = {
      actions: { updateCurrentUser: args.updateCurrentUser },
    };

    return (
      <CurrentUserContext.Provider value={userValue}>
        <MediaContext.Provider value={mediaValue}>
          <VideoOptimizationDialog />
        </MediaContext.Provider>
      </CurrentUserContext.Provider>
    );
  },
};
