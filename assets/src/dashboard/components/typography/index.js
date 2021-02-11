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
import styled, { css } from 'styled-components';

const ExtraExtraLarge = ({ theme }) => css`
  font-size: ${theme.DEPRECATED_THEME.typography.presets.xxl.size}px;
  font-family: ${theme.DEPRECATED_THEME.typography.presets.xxl.family};
  font-weight: ${theme.DEPRECATED_THEME.typography.weight.normal};
  line-height: ${theme.DEPRECATED_THEME.typography.presets.xxl.lineHeight}px;
  letter-spacing: ${theme.DEPRECATED_THEME.typography.presets.xxl
    .letterSpacing}em;

  @media ${theme.DEPRECATED_THEME.breakpoint.smallDisplayPhone} {
    font-size: ${theme.DEPRECATED_THEME.typography.presets.xxl.minSize}px;
    line-height: ${theme.DEPRECATED_THEME.typography.presets.xxl
      .minLineHeight}px;
    letter-spacing: ${theme.DEPRECATED_THEME.typography.presets.xxl
      .minLetterSpacing}em;
  }
`;

const ExtraLarge = ({ theme }) => css`
  font-size: ${theme.DEPRECATED_THEME.typography.presets.xl.size}px;
  font-family: ${theme.DEPRECATED_THEME.typography.presets.xl.family};
  font-weight: ${theme.DEPRECATED_THEME.typography.weight.normal};
  line-height: ${theme.DEPRECATED_THEME.typography.presets.xl.lineHeight}px;
  letter-spacing: ${theme.DEPRECATED_THEME.typography.presets.xl
    .letterSpacing}em;
`;

const Large = ({ theme }) => css`
  font-size: ${theme.DEPRECATED_THEME.typography.presets.l.size}px;
  font-family: ${theme.DEPRECATED_THEME.typography.presets.l.family};
  font-weight: ${theme.DEPRECATED_THEME.typography.weight.normal};
  line-height: ${theme.DEPRECATED_THEME.typography.presets.l.lineHeight}px;
  letter-spacing: ${theme.DEPRECATED_THEME.typography.presets.l
    .letterSpacing}em;
`;

const Medium = ({ theme }) => css`
  font-size: ${theme.DEPRECATED_THEME.typography.presets.m.size}px;
  font-family: ${theme.DEPRECATED_THEME.typography.presets.m.family};
  font-weight: ${theme.DEPRECATED_THEME.typography.weight.normal};
  line-height: ${theme.DEPRECATED_THEME.typography.presets.m.lineHeight}px;
  letter-spacing: ${theme.DEPRECATED_THEME.typography.presets.m
    .letterSpacing}em;

  @media ${theme.DEPRECATED_THEME.breakpoint.smallDisplayPhone} {
    font-size: ${theme.DEPRECATED_THEME.typography.presets.m.minSize}px;
  }
`;

const Small = ({ theme }) => css`
  font-size: ${theme.DEPRECATED_THEME.typography.presets.s.size}px;
  font-family: ${theme.DEPRECATED_THEME.typography.presets.s.family};
  font-weight: ${theme.DEPRECATED_THEME.typography.weight.normal};
  line-height: ${theme.DEPRECATED_THEME.typography.presets.s.lineHeight}px;
  letter-spacing: ${theme.DEPRECATED_THEME.typography.presets.s
    .letterSpacing}em;
`;

const ExtraSmall = ({ theme }) => css`
  font-size: ${theme.DEPRECATED_THEME.typography.presets.xs.size}px;
  font-family: ${theme.DEPRECATED_THEME.typography.presets.xs.family};
  font-weight: ${theme.DEPRECATED_THEME.typography.weight.normal};
  line-height: ${theme.DEPRECATED_THEME.typography.presets.xs.lineHeight}px;
  letter-spacing: ${theme.DEPRECATED_THEME.typography.presets.xs
    .letterSpacing}em;
`;

export const Heading1 = styled.h1`
  ${ExtraExtraLarge}
  font-weight: ${({ theme }) => theme.DEPRECATED_THEME.typography.weight.bold};
`;

export const Heading2 = styled.h2`
  ${ExtraLarge}
  font-weight: ${({ theme }) => theme.DEPRECATED_THEME.typography.weight.bold};
`;

export const Paragraph1 = styled.p(Medium);

export const DefaultParagraph1 = styled(Paragraph1)`
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.gray200};
`;

export const Paragraph2 = styled.p(Small);

export const TypographyPresets = {
  ExtraExtraLarge,
  ExtraLarge,
  Large,
  Medium,
  Small,
  ExtraSmall,
};
