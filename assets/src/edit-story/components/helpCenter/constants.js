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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

export const TIPS = {
  addBackgroundMedia: {
    title: __('Add background media', 'web-stories'),
    description: [
      __(
        'Double click any image or video to enter edit mode. To scale, use the slider. To change the focal point, drag the image or video.',
        'web-stories'
      ),
    ],
  },
  cropSelectedElements: {
    title: __('Crop selected element', 'web-stories'),
    description: [
      __(
        'Double click any image or video element to enter edit mode. Then, use the slider to scale the element or move its focal point by dragging it.',
        'web-stories'
      ),
    ],
  },
  cropElementsWithShapes: {
    title: __('Crop elements using shapes', 'web-stories'),
    description: [
      __(
        'Select a shape from the Shape menu to create a frame.',
        'web-stories'
      ),
    ],
  },
  safeZone: {
    title: __('Stay within the safe zone', 'web-stories'),
    description: [
      __(
        'Elements work best when you keep them within the safe zone. Outside of the safe zone, elements like links and buttons may get cropped out or not function properly.',
        'web-stories'
      ),
    ],
  },
  previewStory: {
    title: __('Preview your Web Story', 'web-stories'),
    description: [
      __(
        'Use Preview Mode to view your Story before publishing.',
        'web-stories'
      ),
      __(
        'Make sure buttons, links, logos, and text aren’t too close to the edge of your screen and that no Story element overlaps with the navigation bar.',
        'web-stories'
      ),
    ],
  },
  addLinks: {
    title: __('Add links to design elements', 'web-stories'),
    description: [
      __(
        'Go to the Design tab. Scroll down to Links and enter a URL. To remove a link, select the “X” to the right of URL box.',
        'web-stories'
      ),
    ],
  },
  enableSwipe: {
    title: __('Enable swipe-up option', 'web-stories'),
    description: [
      __(
        'You’re caught up with quick tips. We’ll notify you when we add new tips, but feel free to come back whenever you need help.',
        'web-stories'
      ),
    ],
  },
};

export const DONE_TIP_ENTRY = [
  'done',
  {
    title: __('Done!', 'web-stories'),
    description: [
      __(
        'You’re caught up with quick tips. We’ll notify you when we add new tips, but feel free to come back whenever you need help.',
        'web-stories'
      ),
    ],
  },
];

export const GUTTER_WIDTH = 24;
