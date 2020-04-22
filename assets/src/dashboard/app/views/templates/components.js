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

export const ContentContainer = styled.div`
  ${({ theme }) => `
    padding: 0 ${theme.pageGutter.large.desktop}px;

    @media ${theme.breakpoint.tablet} {
      padding: 0 ${theme.pageGutter.large.tablet}px;
    }

    @media ${theme.breakpoint.largeDisplayPhone} {
      padding: 0;
    }
  `}
`;

export const ColumnContainer = styled.section`
  ${({ theme }) => `
    display: flex;
    margin-bottom: 40px;

    @media ${theme.breakpoint.largeDisplayPhone} {
      display: block;
    }
  `}
`;

export const DetailContainer = styled.div`
  padding: 40px 20px 0;
`;

export const Column = styled.div`
  ${({ theme }) => `
    width: 50%;

    & + & {
      padding-left: ${theme.pageGutter.small.desktop}px;
    }

    @media ${theme.breakpoint.tablet} {
      & + & {
        padding-left: ${theme.pageGutter.small.min}px;
      }
    }

    @media ${theme.breakpoint.largeDisplayPhone} {
      width: 100%;
    }
  `}
`;

export const Title = styled.h2`
  ${({ theme }) => `
    margin: 0;
    font-family: ${theme.fonts.heading4.family};
    font-size: ${theme.fonts.heading4.size};
    font-weight: ${theme.fonts.heading4.weight};
    line-height: ${theme.fonts.heading4.lineHeight};
    color: ${theme.colors.gray900};
  `}
`;

export const ByLine = styled.p`
  ${({ theme }) => `
    margin: 0 0 20px;
    font-family: ${theme.fonts.body2.family};
    font-size: ${theme.fonts.body2.size};
    line-height: ${theme.fonts.body2.lineHeight};
    color: ${theme.colors.gray400};
  `}
`;

export const Text = styled.p`
  ${({ theme }) => `
    margin: 0 0 20px;
    font-family: ${theme.fonts.body2.family};
    font-size: ${theme.fonts.body2.size};
    line-height: ${theme.fonts.body2.lineHeight};
    letter-spacing: 0.015em;
    color: ${theme.colors.gray900};
  `}
`;

export const MetadataContainer = styled.fieldset`
  > label {
    margin: 0 10px 14px 0;

    > span {
      display: flex;
      align-items: center;
      opacity: 1 !important;
    }
  }
`;
