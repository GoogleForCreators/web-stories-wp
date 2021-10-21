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
import { APP_ROUTES, ROUTE_TITLES } from '@web-stories-wp/dashboard';
import { __ } from '@web-stories-wp/i18n';

export const LEFT_RAIL_SECONDARY_NAVIGATION = [
  {
    value: APP_ROUTES.EDITOR_SETTINGS,
    label: ROUTE_TITLES[APP_ROUTES.EDITOR_SETTINGS],
  },
  {
    value: __(
      'https://wordpress.org/support/plugin/web-stories/',
      'web-stories'
    ),
    label: __('Support', 'web-stories'),
    isExternal: true,
    trackingEvent: 'click_support_page',
  },
];
