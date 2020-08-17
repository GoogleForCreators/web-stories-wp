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
import { object } from '@storybook/addon-knobs';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import MediaElement from '../mediaElement';
import ApiContext from '../../../../../../app/api/context';
import MediaContext from '../../../../../../app/media/context';
import SnackbarContext from '../../../../../../app/snackbar/context';
import testImage from '../../local/stories/test-image.jpg';
import testPoster from './test-poster.png';
import testVideo from './test-video.mp4';

const Column = styled.div`
  width: 150px;
`;

const snackbarValue = { showSnackbar: action('snow snackbar') };
const mediaValue = {
  local: {
    actions: {
      deleteMediaElement: action('delete from state'),
      updateMediaElement: action('update state'),
    },
  },
};
const apiValue = {
  actions: {
    deleteMedia: action('delete from server'),
    updateMedia: action('update server'),
  },
};

export default {
  title: 'Stories Editor/Components/Media Element',
  component: MediaElement,
};

export const _Image = () => {
  const resource = object('Image Resource', {
    id: 123,
    type: 'image',
    mimeType: 'image/png',
    title: 'My Image :)',
    uploadDate: Date.now(),
    src: testImage,
    width: 910,
    height: 675,
    local: false,
    alt: 'my image',
    sizes: {},
  });

  return (
    <SnackbarContext.Provider value={snackbarValue}>
      <MediaContext.Provider value={mediaValue}>
        <ApiContext.Provider value={apiValue}>
          <Column>
            <MediaElement
              resource={resource}
              width={150}
              onInsert={action('insert into canvas')}
            />
          </Column>
        </ApiContext.Provider>
      </MediaContext.Provider>
    </SnackbarContext.Provider>
  );
};

export const _Image_With_Attribution = () => {
  const resource = object('Image Resource', {
    id: 123,
    type: 'image',
    mimeType: 'image/png',
    title: 'My Image :)',
    uploadDate: Date.now(),
    src: testImage,
    width: 910,
    height: 675,
    local: false,
    alt: 'my image',
    sizes: {},
    attribution: {
      author: {
        displayName: 'Some Author',
        url: 'http://www.google.com',
      },
    },
  });

  return (
    <SnackbarContext.Provider value={snackbarValue}>
      <MediaContext.Provider value={mediaValue}>
        <ApiContext.Provider value={apiValue}>
          <Column>
            <MediaElement
              resource={resource}
              width={150}
              onInsert={action('insert into canvas')}
            />
          </Column>
        </ApiContext.Provider>
      </MediaContext.Provider>
    </SnackbarContext.Provider>
  );
};

export const _Video = () => {
  const resource = object('Video Resource', {
    id: 456,
    type: 'video',
    mimeType: 'video/mp4',
    title: 'My Video :)',
    uploadDate: Date.now(),
    src: testVideo,
    width: 640,
    height: 480,
    poster: testPoster,
    lengthFormatted: '0:26',
    local: false,
    alt: 'my video',
    sizes: {},
  });

  return (
    <SnackbarContext.Provider value={snackbarValue}>
      <MediaContext.Provider value={mediaValue}>
        <ApiContext.Provider value={apiValue}>
          <Column>
            <MediaElement
              resource={resource}
              width={150}
              onInsert={action('insert into canvas')}
            />
          </Column>
        </ApiContext.Provider>
      </MediaContext.Provider>
    </SnackbarContext.Provider>
  );
};

export const _Video_With_Attribution = () => {
  const resource = object('Video Resource', {
    id: 456,
    type: 'video',
    mimeType: 'video/mp4',
    title: 'My Video :)',
    uploadDate: Date.now(),
    src: testVideo,
    width: 640,
    height: 480,
    poster: testPoster,
    lengthFormatted: '0:26',
    local: false,
    alt: 'my video',
    sizes: {},
    attribution: {
      author: {
        displayName: 'Some Author',
        url: 'http://www.google.com',
      },
    },
  });

  return (
    <SnackbarContext.Provider value={snackbarValue}>
      <MediaContext.Provider value={mediaValue}>
        <ApiContext.Provider value={apiValue}>
          <Column>
            <MediaElement
              resource={resource}
              width={150}
              onInsert={action('insert into canvas')}
            />
          </Column>
        </ApiContext.Provider>
      </MediaContext.Provider>
    </SnackbarContext.Provider>
  );
};
