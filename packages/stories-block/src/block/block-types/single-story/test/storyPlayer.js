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
 * Internal dependencies
 */
import StoryPlayer from '../storyPlayer';

const url = 'https://wp.stories.google/stories/intro-to-web-stories-storytime';
const title = 'Stories in AMP';
const poster = 'https://amp.dev/static/samples/img/story_dog2_portrait.jpg';

describe('StoryPlayer', () => {
  it('should render an <amp-story-player> element', () => {
    const { container } = render(<StoryPlayer url={url} title={title} />);

    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toMatchInlineSnapshot(`
      <amp-story-player
        data-testid="amp-story-player"
      >
        <a
          href="https://wp.stories.google/stories/intro-to-web-stories-storytime"
        >
          Stories in AMP
        </a>
      </amp-story-player>
    `);
  });

  it('should set poster if provided', () => {
    const { container } = render(
      <StoryPlayer url={url} title={title} poster={poster} />
    );

    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toMatchInlineSnapshot(`
      <amp-story-player
        data-testid="amp-story-player"
      >
        <a
          href="https://wp.stories.google/stories/intro-to-web-stories-storytime"
        >
          <img
            alt="Stories in AMP"
            data-amp-story-player-poster-img="true"
            src="https://amp.dev/static/samples/img/story_dog2_portrait.jpg"
          />
        </a>
      </amp-story-player>
    `);
  });
});
