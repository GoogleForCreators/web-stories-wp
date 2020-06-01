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

/**
 * Internal dependencies
 */
import MediaEditDialog from '../mediaEditDialog';
import testImage from './test-image.jpg';

export default {
  title: 'Stories Editor/Components/Media Edit Dialog',
  component: MediaEditDialog,
};

export const _default = () => {
  const resource = object('Image Resource', {
    type: 'image',
    mimeType: 'image/png',
    title: 'My Image :)',
    src: testImage,
    width: 910,
    height: 675,
    local: false,
    alt: 'my image',
    sizes: {},
  });

  return <MediaEditDialog resource={resource} onClose={() => {}} />;
};
