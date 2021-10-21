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

export const GET_USER_OBJECT = (mergeBy = {}) => {
  const response = {
    id: 1,
    username: 'john',
    name: 'john',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@abc',
    url: 'https://stories.google/',
    description: '',
    link: `https://stories.google/author/john/`,
    locale: 'en_US',
    nickname: 'john',
    slug: 'john-doe',
    roles: ['administrator'],
    registered_date: '2021-09-25T10:42:57+00:00',
    capabilities: {},
    extra_capabilities: {
      administrator: true,
    },
    avatar_urls: {
      24: 'https://2.gravatar.com/avatar/john_web_stories?s=24&d=mm&r=g',
      48: 'https://2.gravatar.com/avatar/john_web_stories?s=48&d=mm&r=g',
      96: 'https://2.gravatar.com/avatar/john_web_stories?s=48&d=mm&r=g',
    },
    meta: {
      web_stories_tracking_optin: true,
      web_stories_media_optimization: false,
      web_stories_onboarding: {
        addBackgroundMedia: true,
        safeZone: true,
      },
    },
    _links: {
      self: [
        {
          href: 'https://stories.google/wp-json/web-stories/v1/users/1',
        },
      ],
      collection: [
        {
          href: 'https://stories.google/wp-json/web-stories/v1/users/1',
        },
      ],
    },
  };

  return Object.assign(response, mergeBy);
};
