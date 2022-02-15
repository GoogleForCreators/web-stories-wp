/*
 * Copyright 2022 Google LLC
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
import MediaEditDialog from '../mediaEditDialog';
import ApiContext from '../../../../../../app/api/context';
import MediaContext from '../../../../../../app/media/context';
import testImage from './test-image.jpg';

export default {
  title: 'Stories Editor/Components/Dialog/Edit Media',
  component: MediaEditDialog,
  args: {
    resource: {
      id: 123,
      type: 'image',
      mimeType: 'image/png',
      creationDate: '2019-11-13T18:15:52Z',
      src: testImage,
      width: 910,
      height: 675,
      alt: 'my image',
      sizes: {},
    },
  },
  argTypes: {
    onClose: { action: 'closed' },
    updateMedia: { action: 'update server' },
    updateMediaElement: { action: 'update state' },
    showSnackbar: { action: 'show snackbar' },
  },
};

export const _default = (args) => {
  const apiValue = {
    actions: args.updateMedia,
  };
  const mediaValue = {
    local: {
      actions: args.updateMediaElement,
    },
  };
  const snackbarValue = { showSnackbar: args.showSnackbar };

  return (
    <SnackbarContext.Provider value={snackbarValue}>
      <MediaContext.Provider value={mediaValue}>
        <ApiContext.Provider value={apiValue}>
          <MediaEditDialog resource={args.resource} onClose={args.onClose} />
        </ApiContext.Provider>
      </MediaContext.Provider>
    </SnackbarContext.Provider>
  );
};
