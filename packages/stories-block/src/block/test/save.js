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
import { render } from '@testing-library/react';

/**
 * WordPress dependencies
 */
import { getSaveElement, registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { metadata, settings } from '..';
import Save from '../save';

const url = 'https://wp.stories.google/stories/intro-to-web-stories-storytime';
const title = 'Stories in AMP';
const poster = 'https://amp.dev/static/samples/img/story_dog2_portrait.jpg';

/* eslint-disable testing-library/no-node-access */

describe('save', () => {
  beforeAll(() => {
    registerBlockType(metadata, settings);
  });

  const renderSave = (attributes) => {
    getSaveElement(metadata.name, attributes);
    return render(<Save attributes={attributes} />);
  };

  it('should add alignnone class by default', () => {
    const { container } = renderSave({ url, title, poster });
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div
        class="wp-block-web-stories-embed alignnone"
      >
        <a
          href="https://wp.stories.google/stories/intro-to-web-stories-storytime"
        >
          <img
            alt="Stories in AMP"
            decoding="async"
            loading="lazy"
            src="https://amp.dev/static/samples/img/story_dog2_portrait.jpg"
          />
        </a>
      </div>
    `);
  });

  it('should render nothing if poster is missing', () => {
    const { container } = renderSave({ url, title });
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div
        class="wp-block-web-stories-embed alignnone"
      >
        <a
          href="https://wp.stories.google/stories/intro-to-web-stories-storytime"
        >
          Stories in AMP
        </a>
      </div>
    `);
  });

  it('should render nothing if url is missing', () => {
    const { container } = renderSave({ title, poster });
    expect(container.firstChild).toMatchInlineSnapshot(`null`);
  });

  it('should render nothing if title is missing', () => {
    const { container } = renderSave({ url, poster });
    expect(container.firstChild).toMatchInlineSnapshot(`null`);
  });
});

/* eslint-enable testing-library/no-node-access */
