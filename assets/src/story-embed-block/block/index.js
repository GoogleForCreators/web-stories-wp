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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ReactComponent as icon } from './icon.svg';
import metadata from './block.json';
import deprecated from './deprecated';
import edit from './edit';
import save from './save';
import transforms from './transforms';

const { name, category, attributes } = metadata;

const settings = {
  title: __('Web Stories', 'web-stories'),
  description: __('Embed a visual story.', 'web-stories'),
  category,
  icon,
  keywords: [
    /* translators: block keyword. */
    __('embed', 'web-stories'),
    /* translators: block keyword. */
    __('story', 'web-stories'),
  ],
  attributes,
  example: {
    // TODO: Replace with something custom.
    attributes: {
      url:
        'https://preview.amp.dev/documentation/examples/introduction/stories_in_amp',
      title: __('Stories in AMP', 'web-stories'),
      poster: 'https://amp.dev/static/samples/img/story_dog2_portrait.jpg',
    },
  },
  supports: {
    align: true,
    alignWide: false,
    reusable: false,
  },
  edit,
  save,
  deprecated,
  transforms,
};

export { metadata, name, icon, settings };
