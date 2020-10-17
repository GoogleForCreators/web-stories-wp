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
import { render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import Save from '../save';

const url =
  'https://preview.amp.dev/documentation/examples/introduction/stories_in_amp';
const title = 'Stories in AMP';
const poster = 'https://amp.dev/static/samples/img/story_dog2_portrait.jpg';

describe('save', () => {
  it('should add alignnone class by default', () => {
    const { container } = render(<Save attributes={{ url, title, poster }} />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div
        class="wp-block-web-stories-embed alignnone"
      >
        <a
          href="https://preview.amp.dev/documentation/examples/introduction/stories_in_amp"
        >
          <img
            alt="Stories in AMP"
            src="https://amp.dev/static/samples/img/story_dog2_portrait.jpg"
          />
        </a>
      </div>
    `);
  });

  it('should render nothing if poster is missing', () => {
    const { container } = render(<Save attributes={{ url, title }} />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <div
        class="wp-block-web-stories-embed alignnone"
      >
        <a
          href="https://preview.amp.dev/documentation/examples/introduction/stories_in_amp"
        >
          Stories in AMP
        </a>
      </div>
    `);
  });

  it('should render nothing if url is missing', () => {
    const { container } = render(<Save attributes={{ title, poster }} />);
    expect(container.firstChild).toMatchInlineSnapshot(`null`);
  });

  it('should render nothing if title is missing', () => {
    const { container } = render(<Save attributes={{ url, poster }} />);
    expect(container.firstChild).toMatchInlineSnapshot(`null`);
  });
});
