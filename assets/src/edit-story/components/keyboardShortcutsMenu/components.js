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
import { rgba } from 'polished';

/**
 * Internal dependencies
 */
import { KEY_SIZE } from './constants';

export const Container = styled.div.attrs({ tabIndex: 0 })`
  width: 100%;
  max-width: 625px;
  min-width: 300px;
  max-height: 625px;
  border-radius: 4px;
  padding: 24px;
  padding-bottom: 0;
  background-color: ${({ theme }) => theme.colors.bg.black};
  border: 1px solid ${({ theme }) => rgba(theme.colors.bg.white, 0.24)};
  overflow: auto;
`;

export const Panel = styled.div`
  width: 100%;
  border: 1px solid ${({ theme }) => rgba(theme.colors.bg.white, 0.24)};
  border-radius: 4px;
  padding: 22px;
  margin-bottom: 24px;
`;

export const HeaderRow = styled.div`
  display: flex;
  margin-bottom: 30px;
`;

export const MenuHeader = styled.h1(
  ({ theme }) => `
    color: ${theme.colors.fg.primary};
    font-family: ${theme.fonts.title.family};
    font-size: ${theme.fonts.title.size};
    font-weight: 400;
    line-height: ${theme.fonts.title.lineHeight};
    margin: 0;
    margin-right: 20px;
  `
);

export const SectionHeader = styled.h2(
  ({ theme }) => `
    color: ${rgba(theme.colors.fg.white, 0.54)};
    font-family: ${theme.fonts.body2.family};
    font-size: ${theme.fonts.body2.size};
    font-weight: 500;
    line-height: ${theme.fonts.body2.lineHeight};
    margin: 0;
    margin-bottom: 12px;
  `
);

export const SectionWrapper = styled.div`
  width: 100%;
  margin-bottom: 60px;
`;

export const SectionContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 0.75fr;
  row-gap: 12px;
  column-gap: 5px;
  align-items: center;
`;

export const ContentWrapper = styled.div`
  display: flex;
`;

export const Column = styled.div`
  width: 50%;

  & + & {
    padding-left: 10px;
  }
`;

export const Label = styled.span(
  ({ theme }) => `
    color: ${theme.colors.fg.white};
    font-family: ${theme.fonts.body2.family};
    font-size: ${theme.fonts.body2.size};
    line-height: ${theme.fonts.body2.lineHeight};
  `
);

export const Note = styled.p(
  ({ theme }) => `
    width: 100%;
    color: ${theme.colors.fg.secondary};
    font-family: ${theme.fonts.tab.family};
    font-size: ${theme.fonts.tab.size};
    font-weight: 500;
    line-height: ${theme.fonts.tab.lineHeight};
    margin: 0;
    margin-bottom: 16px;
    text-align: center;
  `
);

export const ShortcutKeyWrapper = styled.div`
  display: flex;
  justify-content: ${({ alignment }) => alignment};
  align-items: center;
`;

export const ShortcutKey = styled.div(
  ({ theme, keySize = KEY_SIZE.NORMAL }) => `
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${keySize}px;
    height: 24px;
    color: ${theme.colors.fg.white};
    font-family: ${theme.fonts.body2.family};
    font-size: ${theme.fonts.body2.size};
    line-height: ${theme.fonts.body2.lineHeight};
    background-color: ${theme.colors.fg.gray24};
    border-radius: 4px;

    & + & {
      margin-left: 8px;
    }
  `
);
