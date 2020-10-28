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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
  CoverrAttribution,
  TenorAttribution,
  UnsplashAttribution,
} from './attribution';

const ContentType = {
  IMAGE: 'image',
  VIDEO: 'video',
  GIF: 'gif',
};

const ProviderType = {
  UNSPLASH: 'unsplash',
  COVERR: 'coverr',
  TENOR: 'tenor',
};

/** @typedef {import('react').React.Component} ReactComponent */

/**
 * @typedef ProviderConfiguration
 * @property {string} displayName The display name of the provider.
 * @property {?string} featureName An optional feature that must be turned on
 * for the provider tab to be displayed.
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
 *
 * @type {Object.<string, ProviderConfiguration>}
 */
export const PROVIDERS = {
  [ProviderType.UNSPLASH]: {
    displayName: __('Images', 'web-stories'),
    supportsCategories: true,
    requiresAuthorAttribution: true,
    attributionComponent: UnsplashAttribution,
    fetchMediaErrorMessage: __(
      'Error loading media from Unsplash',
      'web-stories'
    ),
    fetchCategoriesErrorMessage: __(
      'Error loading categories from Unsplash',
      'web-stories'
    ),
  },
  [ProviderType.COVERR]: {
    displayName: __('Video', 'web-stories'),
    supportsCategories: false,
    requiresAuthorAttribution: false,
    attributionComponent: CoverrAttribution,
    fetchMediaErrorMessage: __(
      'Error loading media from Coverr',
      'web-stories'
    ),
    defaultPreviewWidth: 640,
  },
  [ProviderType.TENOR]: {
    displayName: __('GIFs', 'web-stories'),
    contentTypeFilter: ContentType.GIF,
    supportsCategories: true,
    requiresAuthorAttribution: false,
    attributionComponent: TenorAttribution,
    fetchMediaErrorMessage: __('Error loading media from Tenor', 'web-stories'),
  },
};
