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
import styled, { css } from 'styled-components';
import { rgba } from 'polished';
import {
  Text as DefaultText,
  THEME_CONSTANTS,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { TenorLogoFull, UnsplashLogoFull } from '../../../icons';
import CoverrLogoFull from '../../../images/coverr_logo.svg';

const AttributionPill = styled.div`
  position: absolute;
  left: 24px;
  bottom: 10px;
  border-radius: 100px;
  padding: 2px 8px;
  height: 24px;
  display: flex;
  flex-wrap: nowrap;
  background-color: ${({ theme }) => rgba(theme.colors.standard.black, 0.7)};
  cursor: pointer;
  align-items: center;
  z-index: 9999;
`;

const Text = styled(DefaultText)`
  color: ${({ theme }) => theme.colors.fg.primary};
`;

const logo = css`
  color: ${({ theme }) => theme.colors.standard.white};
  fill: ${({ theme }) => theme.colors.standard.white};
  margin-left: 6px;
  line-height: 14px;
`;

const UnsplashLogo = styled(UnsplashLogoFull)`
  height: 14px;
  ${logo}
`;

const CoverrLogo = styled(CoverrLogoFull)`
  ${logo}
  height: 12px;
  margin-top: 2px;
`;

const TenorLogo = styled(TenorLogoFull)`
  height: 14px;
  ${logo}
  margin: 0 2px 2px 6px;
`;

const unsplashUrl =
  'https://unsplash.com?utm_source=web_stories_wordpress&utm_medium=referral';
const coverrUrl =
  'https://coverr.co?utm_source=web_stories_wordpress&utm_medium=referral&utm_campaign=api_powered_by';
const tenorUrl =
  'https://tenor.com?utm_source=web_stories_wordpress&utm_medium=referral';

const MEDIA_PROVIDER = {
  coverr: 'Coverr',
  tenor: 'Tenor',
  unsplash: 'Unsplash',
};
const getAriaLabel = (provider) =>
  sprintf(
    /* translators: %s: media provider name. */
    __('Powered by %s', 'web-stories'),
    provider
  );

export function UnsplashAttribution() {
  return (
    <a
      href={unsplashUrl}
      target={'_blank'}
      rel={'noreferrer'}
      aria-label={getAriaLabel(MEDIA_PROVIDER.unsplash)}
    >
      <AttributionPill aria-hidden>
        <Text
          forwardedAs="span"
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
        >
          {__('Powered by', 'web-stories')}
        </Text>
        <UnsplashLogo />
      </AttributionPill>
    </a>
  );
}

export function CoverrAttribution() {
  return (
    <a
      href={coverrUrl}
      target={'_blank'}
      rel={'noreferrer'}
      aria-label={getAriaLabel(MEDIA_PROVIDER.coverr)}
    >
      <AttributionPill aria-hidden>
        <Text
          forwardedAs="span"
          size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}
        >
          {__('Powered by', 'web-stories')}
        </Text>
        <CoverrLogo />
      </AttributionPill>
    </a>
  );
}

export function TenorAttribution() {
  return (
    <a
      href={tenorUrl}
      target={'_blank'}
      rel={'noreferrer'}
      aria-label={getAriaLabel(MEDIA_PROVIDER.tenor)}
    >
      <AttributionPill aria-hidden>
        <TenorLogo />
      </AttributionPill>
    </a>
  );
}
