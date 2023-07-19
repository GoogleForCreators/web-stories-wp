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
import { SnackbarContext } from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import DeleteDialog from '../deleteDialog';
import ApiContext from '../../../../../../app/api/context';
import MediaContext from '../../../../../../app/media/context';
import StoryContext from '../../../../../../app/story/context';

export default {
  title: 'Stories Editor/Components/Dialog/Delete Media',
  component: DeleteDialog,
  argTypes: {
    deleteMedia: { action: 'delete from server' },
    deleteMediaElement: { action: 'delete from state' },
    deleteElementsByResourceId: { action: 'delete element by resource ID' },
    showSnackbar: { action: 'show snackbar' },
    onClose: { action: 'on close' },
  },
  parameters: {
    controls: {
      exclude: ['mediaId', 'type'],
      hideNoControlsWarning: true,
    },
  },
};

export const _default = {
  render: function Render(args) {
    const apiValue = {
      actions: {
        deleteMedia: args.deleteMedia,
      },
    };
    const mediaValue = {
      local: {
        actions: { deleteMediaElement: args.deleteMediaElement },
      },
    };
    const storyContext = {
      actions: {
        deleteElementsByResourceId: args.deleteElementsByResourceId,
      },
    };
    const snackbarValue = { showSnackbar: args.showSnackbar };

    return (
      <SnackbarContext.Provider value={snackbarValue}>
        <MediaContext.Provider value={mediaValue}>
          <ApiContext.Provider value={apiValue}>
            <StoryContext.Provider value={storyContext}>
              <DeleteDialog
                mediaId={123}
                type={'image'}
                onClose={args.onClose}
              />
            </StoryContext.Provider>
          </ApiContext.Provider>
        </MediaContext.Provider>
      </SnackbarContext.Provider>
    );
  },
};
