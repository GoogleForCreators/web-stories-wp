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
import HotlinkModal from '../hotlink/hotlinkModal';
import LibraryContext from '../../../../context';
import ConfigContext from '../../../../../../app/config/context';

export default {
  title: 'Stories Editor/Components/Dialog/Insert Media By Link',
  component: HotlinkModal,
};

export const _default = () => {
  const libraryContext = {
    actions: {
      insertElement: action('Insert media by link'),
    },
  };
  const configContext = {
    allowedMimeTypes: {
      image: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
      audio: [],
      video: ['video/mp4'],
    },
    allowedFileTypes: ['png', 'jpeg', 'jpg', 'gif', 'mp4', 'webp', 'webm'],
    capabilities: { hasUploadMediaAction: true },
  };
  return (
    <ConfigContext.Provider value={configContext}>
      <LibraryContext.Provider value={libraryContext}>
        <HotlinkModal isOpen onClose={action('closed')} />
      </LibraryContext.Provider>
    </ConfigContext.Provider>
  );
};
