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
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
/**
 * External dependencies
 */
import React from 'react';
import styled from 'styled-components';
import { rgba } from 'polished';
import theme from '../../../theme';
import { ProviderType } from '../providerType';
import { ReactComponent as UnsplashLogoFull } from '../../../icons/unsplash_logo_full.svg';

const AttributionPill = styled.div`
  position: absolute;
  left: 24px;
  bottom: 10px;
  border-radius: 100px;
  padding: 5px 8px;
  line-height: 16px;
  display: flex;
  flex-wrap: nowrap;
  font-size: 12px;
  color: ${theme.colors.fg.v1};
  background-color: ${rgba(theme.colors.bg.v0, 0.7)};
  cursor: pointer;
`;

const ContentType = {
  IMAGE: 'image',
  VIDEO: 'video',
};

const LOGO_STYLE = {
  fill: theme.colors.fg.v1,
  marginLeft: '6px',
  height: '14px',
};

/**
 * @typedef ProviderConfiguration
 * @property {string} displayName The display name of the provider.
 * @property {ContentType[]} supportedContentTypes The supported content types by the provider.
 * @property {boolean} supportsCategories Whether this provider supports filtering media by category.
 * @property {boolean} requiresAuthorAttribution Whether this provider requires showing author
 * attribution on each media element.
 * @property {function(): React.Component} attributionBuilder A function that constructs an attribution
 * React Component for this provider.
 */

function UnsplashAttribution() {
  return (
    <a
      href={
        'https://unsplash.com?utm_source=web_stories_wordpress&utm_medium=referral'
      }
      target={'_blank'}
      rel={'noreferrer'}
    >
      <AttributionPill>
        {__('Powered by', 'web-stories')}
        <UnsplashLogoFull style={LOGO_STYLE} />
      </AttributionPill>
    </a>
  );
}

function CoverrAttribution() {
  return (
    <a href={'https://coverr.co'} target={'_blank'} rel={'noreferrer'}>
      <AttributionPill>
        {__('Powered by', 'web-stories')}
        <span style={LOGO_STYLE}>{'COVERR'}</span>
      </AttributionPill>
    </a>
  );
}

const showCoverrTab = false;

/**
 *
 * @type {Object.<string, ProviderConfiguration>}
 */
export const Providers = Object.fromEntries(
  new Map(
    [
      [
        ProviderType.UNSPLASH,
        {
          displayName: 'Unsplash',
          supportedContentTypes: [ContentType.IMAGE],
          supportsCategories: true,
          requiresAuthorAttribution: true,
          attributionBuilder: UnsplashAttribution,
        },
      ],
      showCoverrTab
        ? [
            ProviderType.COVERR,
            {
              displayName: 'Coverr',
              supportedContentTypes: [ContentType.VIDEO],
              supportsCategories: false,
              requiresAuthorAttribution: false,
              attributionBuilder: CoverrAttribution,
            },
          ]
        : null,
    ].filter((e) => e != null)
  )
);
