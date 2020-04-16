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

    @media ${theme.breakpoint.largeDisplayPhone} {
      display: block;
    }
  `}
`;

export const Column = styled.div`
  ${({ theme }) => `
    width: 50%;

    & + & {
      padding-left: ${theme.pageGutter.large.desktop}px;
    }

    @media ${theme.breakpoint.tablet} {
      & + & {
        padding-left: ${theme.pageGutter.large.tablet}px;
      }
    }

    @media ${theme.breakpoint.largeDisplayPhone} {
      width: 100%;
    }
  `}
`;

export const DetailContainer = styled.div`
  padding: 40px 20px;
`;

export const Title = styled.h2`
  ${({ theme }) => `
    margin: 0 0 5px;
    font-family: ${theme.fonts.heading2.family};
    font-size: ${theme.fonts.heading2.size};
    font-weight: ${theme.fonts.heading2.weight};
    line-height: ${theme.fonts.heading2.lineHeight};
    color: ${theme.colors.gray900};
  `}
`;

export const ByLine = styled.p`
  ${({ theme }) => `
    margin: 0 0 20px;
    font-family: ${theme.fonts.body1.family};
    font-size: ${theme.fonts.body1.size};
    font-weight: ${theme.fonts.body1.weight};
    line-height: ${theme.fonts.body1.lineHeight};
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
    color: ${theme.colors.gray600};
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

const borderLookup = (color) => ({
  '#fff': `border: solid 1px ${color}`,
  '#ffffff': `border: solid 1px ${color}`,
  white: `border: solid 1px ${color}`,
});

export const ColorBadge = styled.span`
  ${({ theme, color }) => `
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 14px;
    margin-right: 8px;
    background-color: ${color};
    ${borderLookup(theme.colors.gray50)[color] || ''}
  `}
`;
