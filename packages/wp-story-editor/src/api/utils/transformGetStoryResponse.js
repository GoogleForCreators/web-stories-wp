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
function transformGetStoryResponse(post) {
  const { _embedded: embedded = {}, _links: links = {} } = post;

  post.author = {
    id: embedded?.author?.[0].id || 0,
    name: embedded?.author?.[0].name || '',
  };

  post.capabilities = {};

  for (const link of Object.keys(links)) {
    if (!link.startsWith('wp:action-')) {
      continue;
    }

    // Turn 'wp:action-assign-author' into 'assign-author'
    const capability = link.replace('wp:action-', '');
    post.capabilities[capability] = true;
  }

  post.lock_user = {
    id: embedded?.['wp:lockuser']?.[0].id || 0,
    name: embedded?.['wp:lockuser']?.[0].name || '',
    avatar: embedded?.['wp:lockuser']?.[0].avatar_urls?.['96'] || '',
  };

  post.featured_media = {
    id: embedded?.['wp:featuredmedia']?.[0].id || 0,
    height: embedded?.['wp:featuredmedia']?.[0]?.media_details?.height || 0,
    width: embedded?.['wp:featuredmedia']?.[0]?.media_details?.width || 0,
    url: embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
  };

  post.publisher_logo = {
    id: embedded?.['wp:publisherlogo']?.[0].id || 0,
    height: embedded?.['wp:publisherlogo']?.[0]?.media_details?.height || 0,
    width: embedded?.['wp:publisherlogo']?.[0]?.media_details?.width || 0,
    url: embedded?.['wp:publisherlogo']?.[0]?.source_url || '',
  };

  post.taxonomies = links?.['wp:term']?.map(({ taxonomy }) => taxonomy) || [];
  post.terms = embedded?.['wp:term'] || [];

  return post;
}

export default transformGetStoryResponse;
