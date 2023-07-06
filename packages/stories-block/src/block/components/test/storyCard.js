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
import StoryCard from '../storyCard';

jest.mock('@wordpress/date', () => ({
  /* eslint-disable no-unused-vars */
  format: (format, dateTo) => date,
  dateI18n: (format, dateTo) => 'November 18, 2020',
  getSettings: () => ({
    formats: {
      date: 'F j, Y',
    },
  }),
  /* eslint-enable no-unused-vars */
}));

const title = 'Stories in AMP';
const poster = 'https://amp.dev/static/samples/img/story_dog2_portrait.jpg';
const date = '2020-11-18T13:36:35';
const author = 'Admin';
const excerpt =
  'Ullamcorper integer senectus netus dapibus consectetur orci imperdiet gravida volutpat nulla, aliquet penatibus elit sollicitudin turpis aenean suscipit vel a, at et congue nullam tincidunt semper eget auctor vehicula. Netus commodo mauris pharetra non diam fusce convallis nibh tempor nisi fringilla, lorem bibendum aenean nostra dis congue mus primis sapien vivamus tortor proin, metus leo quam arcu et augue lacinia integer suscipit ridiculus. Nulla diam viverra fringilla nostra, neque augue cubilia blandit felis, habitant leo aliquam. Fusce dictumst cursus nibh penatibus interdum duis natoque sed, lacinia ut convallis nam scelerisque lorem cubilia curabitur vel, mollis aliquam mattis commodo litora pretium suscipit.';

/* eslint-disable testing-library/no-node-access */

describe('StoryCard', () => {
  it('should render only empty div elements when nothing is provided', () => {
    const { container } = render(<StoryCard />);

    expect(container.firstChild).toMatchInlineSnapshot(`
      <div
        class="web-stories-list__story"
      >
        <div
          class="web-stories-list__story-poster"
        >
          <div
            class="web-stories-list__story-poster-placeholder"
          >
            <span />
          </div>
        </div>
      </div>
    `);
  });

  it('should set poster if only url and poster are provided', () => {
    const { container } = render(<StoryCard poster={poster} />);

    expect(container.firstChild).toMatchInlineSnapshot(`
      <div
        class="web-stories-list__story"
      >
        <div
          class="web-stories-list__story-poster"
        >
          <img
            src="https://amp.dev/static/samples/img/story_dog2_portrait.jpg"
          />
        </div>
      </div>
    `);
  });

  it('should show title, date and author if they are provided and enabled', () => {
    const { container } = render(
      <StoryCard
        title={title}
        isShowingTitle
        date={date}
        isShowingDate
        author={author}
        isShowingAuthor
        poster={poster}
        isShowingExcerpt
        excerpt={excerpt}
      />
    );

    expect(container.firstChild).toMatchInlineSnapshot(`
      <div
        class="web-stories-list__story"
      >
        <div
          class="web-stories-list__story-poster"
        >
          <img
            alt="Stories in AMP"
            src="https://amp.dev/static/samples/img/story_dog2_portrait.jpg"
          />
        </div>
        <div
          class="story-content-overlay web-stories-list__story-content-overlay"
        >
          <div
            class="story-content-overlay__title"
          >
            Stories in AMP
          </div>
          <div
            class="story-content-overlay__excerpt"
          >
            Ullamcorper integer senectus netus dapibus consectetur orci imperdiet gravida volutpat nulla, aliquet penatibus elit sollicitudin turpis aenean suscipit vel a, at et congue nullam tincidunt semper eget auctor vehicula. Netus commodo mauris pharetra non diam fusce convallis nibh tempor nisi fringilla, lorem bibendum aenean nostra dis congue mus primis sapien vivamus tortor proin, metus leo quam arcu et augue lacinia integer suscipit ridiculus. Nulla diam viverra fringilla nostra, neque augue cubilia blandit felis, habitant leo aliquam. Fusce dictumst cursus nibh penatibus interdum duis natoque sed, lacinia ut convallis nam scelerisque lorem cubilia curabitur vel, mollis aliquam mattis commodo litora pretium suscipit.
          </div>
          <div
            class="story-content-overlay__author"
          >
            By Admin
          </div>
          <time
            class="story-content-overlay__date"
            datetime="2020-11-18T13:36:35"
          >
            On November 18, 2020
          </time>
        </div>
      </div>
    `);
  });

  it('should not show title, date and author if they are provided but disabled', () => {
    const { container } = render(
      <StoryCard
        title={title}
        isShowingTitle={false}
        date={date}
        isShowingDate={false}
        author={author}
        isShowingAuthor={false}
        poster={poster}
        isShowingExcerpt
        excerpt={excerpt}
      />
    );

    expect(container.firstChild).toMatchInlineSnapshot(`
      <div
        class="web-stories-list__story"
      >
        <div
          class="web-stories-list__story-poster"
        >
          <img
            alt="Stories in AMP"
            src="https://amp.dev/static/samples/img/story_dog2_portrait.jpg"
          />
        </div>
      </div>
    `);
  });
});

/* eslint-enable testing-library/no-node-access */
