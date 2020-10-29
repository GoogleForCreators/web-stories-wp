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
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { TypographyPresets, Paragraph2 } from '../../../components';

export const ColumnContainer = styled.section`
  ${({ theme }) => `
    display: flex;
    margin-bottom: 40px;

    @media ${theme.internalTheme.breakpoint.largeDisplayPhone} {
      display: block;
    }
  `}
`;

export const DetailContainer = styled.section.attrs({
  'aria-label': __('Template Details', 'web-stories'),
})`
  width: 100%;
  padding: 40px 20px 0;
`;

export const Column = styled.div`
  ${({ theme }) => `
    display: flex;
    width: 50%;

    & + & {
      padding-left: ${theme.internalTheme.standardViewContentGutter.desktop}px;
    }

    @media ${theme.internalTheme.breakpoint.tablet} {
      & + & {
        padding-left: ${theme.internalTheme.standardViewContentGutter.min}px;
      }
    }

    @media ${theme.internalTheme.breakpoint.largeDisplayPhone} {
      width: 100%;
    }
  `}
`;

export const Title = styled.h1.attrs({
  'aria-label': __('Template Title', 'web-stories'),
})`
  ${TypographyPresets.ExtraLarge};
  color: ${({ theme }) => theme.internalTheme.colors.gray900};
`;

export const ByLine = styled(Paragraph2)(
  ({ theme }) => `
    margin: 0 0 20px;
    color: ${theme.internalTheme.colors.gray400};
  `
);

export const Text = styled(Paragraph2)`
  ${({ theme }) => `
    margin: 0 0 20px;
    color: ${theme.internalTheme.colors.gray900};
  `}
`;

export const MetadataContainer = styled.fieldset`
  border: 0;
  > label {
    margin: 0 10px 14px 0;

    > span {
      display: flex;
      align-items: center;
      opacity: 1 !important;
    }
  }
`;

export const RowContainer = styled.section.attrs({
  'aria-label': __('Related Templates', 'web-stories'),
})`
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 40px;
  margin: 0 20px 0;

  & > div {
    width: 100%;
  }
`;

export const SubHeading = styled.h2`
  ${TypographyPresets.Large};
  font-weight: ${({ theme }) => theme.internalTheme.typography.weight.bold};
  margin-bottom: 20px;
`;

export const LargeDisplayPagination = styled.div(
  ({ theme }) => `
    display: flex;
    @media ${theme.internalTheme.breakpoint.largeDisplayPhone} {
      display: none;
    }
  `
);

export const SmallDisplayPagination = styled.div(
  ({ theme }) => `
    display: none;
    @media ${theme.internalTheme.breakpoint.largeDisplayPhone} {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      margin: 0 10px 10px 0;
    }
  `
);
