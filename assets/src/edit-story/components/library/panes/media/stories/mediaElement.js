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
import { object } from '@storybook/addon-knobs';
import { FlagsProvider } from 'flagged';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import MediaElement from '../mediaElement';
import testImage from './test-image.jpg';
import testPoster from './test-poster.png';
import testVideo from './test-video.mp4';

const Column = styled.div`
  width: 150px;
`;

export default {
  title: 'Stories Editor/Components/Media Element',
  component: MediaElement,
};

export const _Image = () => {
  const resource = object('Image Resource', {
    type: 'image',
    mimeType: 'image/png',
    src: testImage,
    width: 910,
    height: 675,
    local: false,
    alt: 'my image',
    sizes: {},
  });

  return (
    <FlagsProvider features={{ mediaDropdownMenu: true }}>
      <Column>
        <MediaElement resource={resource} width={150} onInsert={() => {}} />
      </Column>
    </FlagsProvider>
  );
};

export const _Video = () => {
  const resource = object('Video Resource', {
    type: 'video',
    mimeType: 'video/mp4',
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
    <FlagsProvider features={{ mediaDropdownMenu: true }}>
      <Column>
        <MediaElement resource={resource} width={150} onInsert={() => {}} />
      </Column>
    </FlagsProvider>
  );
};
