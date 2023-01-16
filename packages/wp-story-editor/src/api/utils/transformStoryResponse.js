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

function transformStoryResponse(post) {
  const {
    _embedded: embedded = {},
    story_poster: storyPoster,
    _links: links = {},
    ...rest
  } = post;

  const terms = (embedded?.['wp:term'] || []).flat();

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
        id: embedded?.['wp:lock']?.[0].user.id || 0,
        name: embedded?.['wp:lock']?.[0].user.name || '',
        avatar: embedded?.['wp:lock']?.[0].user.avatar?.['96'] || '',
      },
    },
    featuredMedia: storyPoster
      ? {
          ...storyPoster,
          isExternal: !storyPoster.id,
        }
      : {
          id: 0,
          height: 0,
          width: 0,
          url: '',
          needsProxy: false,
          isExternal: false,
        },
    publisherLogo: {
      id: embedded?.['wp:publisherlogo']?.[0].id || 0,
      height: embedded?.['wp:publisherlogo']?.[0]?.media_details?.height || 0,
      width: embedded?.['wp:publisherlogo']?.[0]?.media_details?.width || 0,
      url: embedded?.['wp:publisherlogo']?.[0]?.source_url || '',
    },
    terms,
    revisions: {
      count: links?.['version-history']?.[0]?.count,
      id: links?.['predecessor-version']?.[0]?.id,
    },
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
