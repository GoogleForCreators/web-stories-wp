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
import { action } from '@storybook/addon-actions';

/**
 * Internal dependencies
 */
import DeleteDialog from '../deleteDialog';
import ApiContext from '../../../../../../app/api/context';
import MediaContext from '../../../../../../app/media/context';
import SnackbarContext from '../../../../../../app/snackbar/context';

export default {
  title: 'Stories Editor/Components/Dialog/Delete Media',
  component: DeleteDialog,
};

export const _default = () => {
  const apiValue = {
    actions: {
      deleteMedia: action('delete from server'),
    },
  };
  const mediaValue = {
    local: {
      actions: { deleteMediaElement: action('delete from state') },
    },
  };
  const snackbarValue = { showSnackbar: action('show snackbar') };

  return (
    <SnackbarContext.Provider value={snackbarValue}>
      <MediaContext.Provider value={mediaValue}>
        <ApiContext.Provider value={apiValue}>
          <DeleteDialog
            mediaId={123}
            type={'image'}
            onClose={action('closed')}
          />
        </ApiContext.Provider>
      </MediaContext.Provider>
    </SnackbarContext.Provider>
  );
};
