/*
 * Copyright 2022 Google LLC
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

const formattedTaxonomiesArray = [
  {
    description: '',
    hierarchical: true,
    name: 'Categories',
    restBase: 'web_story_category',
    restNamespace: 'web-stories/v1',
    restPath: 'http://localhost:8899/wp-json/web-stories/v1/web_story_category',
    slug: 'web_story_category',
    types: ['web-story'],
  },
  {
    description: 'Story Colors',
    hierarchical: false,
    name: 'Colors',
    restBase: 'story-colors',
    restNamespace: 'wp/v2',
    restPath: 'http://localhost:8899/wp-json/wp/v2/story-colors',
    slug: 'story-color',
    types: ['web-story'],
  },
  {
    description: 'Story Verticals',
    hierarchical: true,
    name: 'Verticals',
    restBase: 'story-verticals',
    restNamespace: 'wp/v2',
    restPath: 'http://localhost:8899/wp-json/wp/v2/story-verticals',
    slug: 'story-vertical',
    types: ['web-story'],
  },
  {
    description: '',
    hierarchical: false,
    name: 'Tags',
    restBase: 'web_story_tag',
    restNamespace: 'web-stories/v1',
    restPath: 'http://localhost:8899/wp-json/web-stories/v1/web_story_tag',
    slug: 'web_story_tag',
    types: ['web-story'],
  },
];

export default formattedTaxonomiesArray;
