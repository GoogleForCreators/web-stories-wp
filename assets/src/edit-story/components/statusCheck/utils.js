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
 * Internal dependencies
 */
import getStoryMarkup from '../../output/utils/getStoryMarkup';

export function getContent() {
  const story = {
    storyId: 1,
    title: 'Story!',
    author: {
      id: 1,
      name: 'John Doe',
    },
    slug: 'story',
    publisherLogo: 1,
    defaultPageDuration: 7,
    status: 'publish',
    date: '2020-04-10T07:06:26',
    modified: '',
    excerpt: '',
    featuredMedia: 0,
    password: '',
    stylePresets: '',
  };
  const pages = [
    {
      type: 'page',
      id: '2',
      elements: [],
    },
  ];
  const metadata = {
    publisher: {
      name: 'Web Stories',
      logo: 'https://example.com/logo.png',
    },
  };

  return getStoryMarkup(story, pages, metadata, {});
}
