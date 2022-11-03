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
import { REST_LINKS } from '../constants';

export default function reshapeStoryObject(originalStoryData) {
  const {
    id,
    title,
    status,
    date,
    date_gmt,
    modified,
    modified_gmt,
    link,
    preview_link: previewLink,
    edit_link: editStoryLink,
    story_poster: storyPoster,
    _embedded: { author, 'wp:lock': lock } = {},
    _links: links = {},
  } = originalStoryData;
  if (!id) {
    return null;
  }

  const { locked = false, user: lockUser = { id: 0, name: '' } } =
    lock?.[0] || {};
  const storyAuthor = author?.[0] || { id: 0, name: '' };
  const capabilities = {
    hasEditAction: Object.prototype.hasOwnProperty.call(links, REST_LINKS.EDIT),
    hasDeleteAction: Object.prototype.hasOwnProperty.call(
      links,
      REST_LINKS.DELETE
    ),
  };

  return {
    id,
    status,
    title: title.raw,
    created: date,
    createdGmt: `${date_gmt}Z`,
    modified,
    modifiedGmt: `${modified_gmt}Z`,
    author: {
      id: storyAuthor.id,
      name: storyAuthor.name,
    },
    locked,
    lockUser: {
      ...lockUser,
      avatar: lockUser?.avatar?.['96'] || null,
    },
    bottomTargetAction: editStoryLink,
    featuredMediaUrl: storyPoster?.url,
    editStoryLink,
    previewLink,
    link,
    capabilities,
  };
}
