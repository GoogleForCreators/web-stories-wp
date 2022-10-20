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
import { getStoryMarkup } from '@googleforcreators/output';

export function getContent() {
  const story = {
    storyId: 1,
    title: 'Story!',
    author: {
      id: 1,
      name: 'John Doe',
    },
    slug: 'story',
    publisherLogo: {
      id: 1,
      url: 'https://example.com/logo.png',
      height: 0,
      width: 0,
    },
    defaultPageDuration: 7,
    status: 'publish',
    date: '2020-04-10T07:06:26',
    modified: '',
    excerpt: '',
    featuredMedia: {
      id: 123,
      url: 'https://example.com/image.png',
      width: 123,
      height: 456,
    },
    password: '',
    globalStoryStyles: '',
  };
  const pages = [
    {
      type: 'page',
      id: '2',
      elements: [],
    },
  ];
  const metadata = {
    publisher: 'Web Stories',
  };

  return getStoryMarkup(story, pages, metadata);
}
