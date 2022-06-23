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
import { snakeToCamelCaseObjectKeys } from '@web-stories-wp/wp-utils';

// eslint-disable-next-line complexity -- Transform function is complex.
function transformStoryResponse(post) {
  const { _embedded: embedded = {}, meta, _links: links = {}, ...rest } = post;

  const poster = meta['web_stories_poster'];
  const featuredmedia = embedded?.['wp:featuredmedia']?.[0];
  // TODO: Make author, lockUser, etc. null if absent, instead of these "empty" objects.
  const story = {
    ...snakeToCamelCaseObjectKeys(rest, ['story_data']),
    author: {
      id: embedded?.author?.[0].id || 0,
      name: embedded?.author?.[0].name || '',
    },
    capabilities: {},
    extras: {
      lockUser: {
        id: embedded?.['wp:lockuser']?.[0].id || 0,
        name: embedded?.['wp:lockuser']?.[0].name || '',
        avatar: embedded?.['wp:lockuser']?.[0].avatar_urls?.['96'] || '',
      },
    },
    featuredMedia: {
      id: featuredmedia?.id || 0,
      height: poster?.height || featuredmedia?.media_details?.height || 0,
      width: poster?.width || featuredmedia?.media_details?.width || 0,
      url: poster?.url || featuredmedia?.source_url || '',
      isExternal: Boolean(poster),
    },
    publisherLogo: {
      id: embedded?.['wp:publisherlogo']?.[0].id || 0,
      height: embedded?.['wp:publisherlogo']?.[0]?.media_details?.height || 0,
      width: embedded?.['wp:publisherlogo']?.[0]?.media_details?.width || 0,
      url: embedded?.['wp:publisherlogo']?.[0]?.source_url || '',
    },
    taxonomies: links?.['wp:term']?.map(({ taxonomy }) => taxonomy) || [],
    terms: embedded?.['wp:term'] || [],
  };

  for (const link of Object.keys(links)) {
    if (!link.startsWith('wp:action-')) {
      continue;
    }

    // Turn 'wp:action-assign-author' into 'assign-author'
    const capability = link.replace('wp:action-', '');
    story.capabilities[capability] = true;
  }

  return story;
}

export default transformStoryResponse;
