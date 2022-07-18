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
 * External dependencies
 */
import { __, sprintf } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import {
  CoverrAttribution,
  TenorAttribution,
  UnsplashAttribution,
} from './attribution';
import { ContentType, ProviderType } from './constants';

/** @typedef {import('react').React.Component} ReactComponent */

/**
 * @typedef ProviderConfiguration
 * @property {string} displayName The display name of the provider.
 * @property {?ContentType} contentTypeFilter Optional. The content type to filter by.
 * @property {boolean} supportsCategories Whether this provider supports
 * filtering media by category.
 * @property {boolean} requiresAuthorAttribution Whether this provider
 * requires showing author
 * attribution on each media element.
 * @property {function(): ReactComponent} attributionComponent A function that
 * constructs an attribution React Component for this provider.
 * @property {string} fetchMediaErrorMessage An error message to show if
 * fetching media from this provider fails.
 * @property {?string} fetchCategoriesErrorMessage An error message to show if
 * fetching categories from this provider fails. Only needs to be specified if
 * the `supportsCategories` is true.
 */

/**
 * @type {Object.<string, ProviderConfiguration>}
 */
export const PROVIDERS = {
  [ProviderType.UNSPLASH]: {
    provider: ProviderType.UNSPLASH,
    displayName: __('Images', 'web-stories'),
    supportsCategories: true,
    requiresAuthorAttribution: true,
    attributionComponent: UnsplashAttribution,
    fetchMediaErrorMessage: sprintf(
      /* translators: %s: media provider name. */
      __('Error loading media from %s', 'web-stories'),
      'Unsplash'
    ),
    fetchCategoriesErrorMessage: sprintf(
      /* translators: %s: media provider name. */
      __('Error loading categories from %s', 'web-stories'),
      'Unsplash'
    ),
  },
  [ProviderType.COVERR]: {
    provider: ProviderType.COVERR,
    displayName: __('Video', 'web-stories'),
    supportsCategories: false,
    requiresAuthorAttribution: false,
    attributionComponent: CoverrAttribution,
    fetchMediaErrorMessage: sprintf(
      /* translators: %s: media provider name. */
      __('Error loading media from %s', 'web-stories'),
      'Coverr'
    ),
    defaultPreviewWidth: 640,
  },
  [ProviderType.TENOR]: {
    provider: ProviderType.TENOR,
    displayName: __('GIFs', 'web-stories'),
    contentTypeFilter: ContentType.GIF,
    supportsCategories: true,
    requiresAuthorAttribution: false,
    attributionComponent: TenorAttribution,
    fetchMediaErrorMessage: sprintf(
      /* translators: %s: media provider name. */
      __('Error loading media from %s', 'web-stories'),
      'Tenor'
    ),
  },
  [ProviderType.TENOR_STICKERS]: {
    provider: ProviderType.TENOR,
    displayName: __('Stickers', 'web-stories'),
    contentTypeFilter: ContentType.STICKER,
    supportsCategories: true,
    requiresAuthorAttribution: false,
    attributionComponent: TenorAttribution,
    fetchMediaErrorMessage: sprintf(
      /* translators: %s: media provider name. */
      __('Error loading media from %s', 'web-stories'),
      'Tenor'
    ),
    featureName: 'tenorStickers',
  },
};
