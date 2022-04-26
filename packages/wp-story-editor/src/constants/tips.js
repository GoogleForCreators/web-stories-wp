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
import { __ } from '@googleforcreators/i18n';

const DOCS_URL = 'https://wp.stories.google/docs/';

const KEYS = {
  EMBED_WEB_STORIES: 'embedWebStories',
};

export const TIPS = {
  [KEYS.EMBED_WEB_STORIES]: {
    title: __('Embed Web Stories', 'web-stories'),
    /* TODO #7212 `figureSrcImg` and `figureAlt` are temporary until
    we get an animation. Once we have the animation then these
    attributes should be removed. */
    figureSrcImg: 'images/help-center/story_embed_module_1',
    figureAlt: __('Graphic showing embed functionality', 'web-stories'),
    description: [
      __(
        'When you create a new post in WordPress, you can embed any of your Stories. <a>Learn more</a>',
        'web-stories'
      ),
    ],
    href: DOCS_URL,
  },
};
