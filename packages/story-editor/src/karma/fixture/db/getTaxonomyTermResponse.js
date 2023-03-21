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
import getTaxonomiesResponse from './getTaxonomiesResponse';

const defaultResponse = [
  {
    id: 4,
    count: 10,
    description: '',
    link: '',
    name: 'tag',
    slug: 'tag',
    taxonomy: 'web_story_tag',
    meta: [],
  },
  {
    id: 1,
    count: 3,
    description: '',
    link: '',
    name: 'pizza',
    slug: 'pizza',
    taxonomy: 'web_story_tag',
    meta: [],
  },
  {
    id: 2,
    count: 2,
    description: '',
    link: '',
    name: 'burger',
    slug: 'burger',
    taxonomy: 'web_story_tag',
    meta: [],
  },
  {
    id: 3,
    count: 3,
    description: '',
    link: '',
    name: 'frenchFry',
    slug: 'frenchFry',
    taxonomy: 'web_story_tag',
    meta: [],
  },
  {
    id: 11,
    count: 3,
    description: '',
    link: '',
    name: 'Booger',
    slug: 'booger',
    taxonomy: 'web_story_category',
    meta: [],
    parent: 0,
  },
  {
    id: 12,
    count: 3,
    description: '',
    link: '',
    name: 'Multiple words',
    slug: 'multiple-words',
    taxonomy: 'web_story_category',
    meta: [],
    parent: 0,
  },
  {
    id: 13,
    count: 3,
    description: '',
    link: '',
    name: 'gold',
    slug: 'gold',
    taxonomy: 'web_story_category',
    meta: [],
    parent: 0,
  },
];

const categoryRestPath = getTaxonomiesResponse.find(
  ({ slug }) => slug === 'web_story_category'
).restPath;

const tagRestPath = getTaxonomiesResponse.find(
  ({ slug }) => slug === 'web_story_tag'
).restPath;

export default function generateResponse(endpoint, _) {
  if (endpoint === categoryRestPath) {
    return defaultResponse.filter(
      ({ taxonomy }) => taxonomy === 'web_story_category'
    );
  } else if (endpoint === tagRestPath) {
    return defaultResponse.filter(
      ({ taxonomy }) => taxonomy === 'web_story_tag'
    );
  } else {
    return defaultResponse;
  }
}
