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
import styled from 'styled-components';
import { SnackbarContext } from '@googleforcreators/design-system';
/**
 * Internal dependencies
 */
import MediaElement from '../mediaElement';
import { CanvasProvider } from '../../../../../../app/canvas';
import ApiContext from '../../../../../../app/api/context';
import MediaContext from '../../../../../../app/media/context';
import testImage from '../../local/stories/test-image.jpg';
import testPoster from './test-poster.png';
import testVideo from './test-video.mp4';

const Column = styled.div`
  width: 150px;
`;

export default {
  title: 'Stories Editor/Components/Media Element',
  component: MediaElement,
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
    onInsert: { action: 'insert into canvas' },
    showSnackbar: { action: 'show snackbar' },
    deleteMediaElement: { action: 'delete from state' },
    updateMediaElement: { action: 'update  state' },
    deleteMedia: { action: 'delete from server' },
    updateMedia: { action: 'update  server' },
    isCurrentResourceProcessing: { action: 'false' },
    isCurrentResourceUploading: { action: 'false' },
  },
  parameters: {
    controls: {
      exclude: [
        'providerType',
        'canEditMedia',
        'index',
        'width',
        'height',
        'margin',
      ],
    },
  },
};

export const _Image = {
  render: function Render(args) {
    const resource = args.resource;
    const snackbarValue = { showSnackbar: args.showSnackbar };
    const mediaValue = {
      local: {
        actions: {
          deleteMediaElement: args.deleteMediaElement,
          updateMediaElement: args.updateMediaElement,
        },
        state: {
          isCurrentResourceProcessing: args.isCurrentResourceProcessing,
          isCurrentResourceUploading: args.isCurrentResourceUploading,
        },
      },
    };
    const apiValue = {
      actions: {
        deleteMedia: args.deleteMedia,
        updateMedia: args.updateMedia,
      },
    };

    return (
      <SnackbarContext.Provider value={snackbarValue}>
        <MediaContext.Provider value={mediaValue}>
          <ApiContext.Provider value={apiValue}>
            <CanvasProvider>
              <Column>
                <MediaElement
                  index={0}
                  resource={resource}
                  width={150}
                  onInsert={args.onInsert}
                />
              </Column>
            </CanvasProvider>
          </ApiContext.Provider>
        </MediaContext.Provider>
      </SnackbarContext.Provider>
    );
  },
};

export const _Image_With_Attribution = {
  render: _Image,

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
      attribution: {
        author: {
          displayName: 'Some Author',
          url: 'http://www.google.com',
        },
      },
    },
  },
};

export const _Video = {
  render: _Image,

  args: {
    resource: {
      id: 456,
      type: 'video',
      mimeType: 'video/mp4',
      title: 'My Video :)',
      creationDate: '2019-11-13T18:15:52Z',
      src: testVideo,
      width: 640,
      height: 480,
      poster: testPoster,
      lengthFormatted: '0:26',
      alt: 'my video',
      sizes: {},
    },
  },
};

export const _Video_With_Attribution = {
  render: _Image,

  args: {
    resource: {
      id: 456,
      type: 'video',
      mimeType: 'video/mp4',
      title: 'My Video :)',
      creationDate: '2019-11-13T18:15:52Z',
      src: testVideo,
      width: 640,
      height: 480,
      poster: testPoster,
      lengthFormatted: '0:26',
      alt: 'my video',
      sizes: {},
      attribution: {
        author: {
          displayName: 'Some Author',
          url: 'http://www.google.com',
        },
      },
    },
  },
};
