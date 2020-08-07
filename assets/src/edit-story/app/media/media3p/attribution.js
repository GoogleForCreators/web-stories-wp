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
/**
 * External dependencies
 */
import React from 'react';
import styled, { css } from 'styled-components';
import { rgba } from 'polished';
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
  color: ${({ theme }) => theme.colors.fg.white};
  background-color: ${({ theme }) => rgba(theme.colors.bg.black, 0.7)};
  cursor: pointer;
`;

const logo = css`
  fill: ${({ theme }) => theme.colors.fg.white};
  margin-left: 6px;
  height: 14px;
`;

const UnsplashLogo = styled(UnsplashLogoFull)`
  ${logo}
`;

const CoverrLogoSpan = styled.span`
  ${logo}
`;

const unsplashUrl =
  'https://unsplash.com?utm_source=web_stories_wordpress&utm_medium=referral';
const coverrUrl = 'https://coverr.co';

export function UnsplashAttribution() {
  return (
    <a href={unsplashUrl} target={'_blank'} rel={'noreferrer'}>
      <AttributionPill>
        {__('Powered by', 'web-stories')}
        <UnsplashLogo />
      </AttributionPill>
    </a>
  );
}

export function CoverrAttribution() {
  return (
    <a href={coverrUrl} target={'_blank'} rel={'noreferrer'}>
      <AttributionPill>
        {__('Powered by', 'web-stories')}
        <CoverrLogoSpan>{'COVERR'}</CoverrLogoSpan>
      </AttributionPill>
    </a>
  );
}
