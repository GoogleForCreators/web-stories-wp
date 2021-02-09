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
import { KeyArrowUp } from '../../icons';
import { KEY_SIZE } from './constants';

export const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 625px;
  min-width: 300px;
  max-height: 675px;
  border-radius: 4px;
  padding: 24px;
  padding-bottom: 0;
  background-color: ${({ theme }) => theme.DEPRECATED_THEME.colors.bg.black};
  border: 1px solid
    ${({ theme }) => rgba(theme.DEPRECATED_THEME.colors.bg.white, 0.24)};
  overflow: auto;
`;

export const PanelsWrapper = styled.dl`
  margin: 0;
`;

export const Panel = styled.div`
  width: 100%;
  border: 1px solid
    ${({ theme }) => rgba(theme.DEPRECATED_THEME.colors.bg.white, 0.24)};
  border-radius: 4px;
  padding: 22px;
  margin-bottom: 24px;
`;

export const HeaderWrapper = styled.dl`
  margin: 0;
`;

export const HeaderRow = styled.div`
  display: flex;
  margin-bottom: 30px;
`;

export const MenuHeaderContainer = styled.dt`
  margin: 0;
`;

export const MenuHeader = styled.h1(
  ({ theme }) => `
    color: ${theme.DEPRECATED_THEME.colors.fg.primary};
    font-family: ${theme.DEPRECATED_THEME.fonts.title.family};
    font-size: ${theme.DEPRECATED_THEME.fonts.title.size};
    font-weight: 400;
    line-height: ${theme.DEPRECATED_THEME.fonts.title.lineHeight};
    margin: 0;
    margin-right: 20px;
  `
);

export const SectionHeader = styled.h2(
  ({ theme }) => `
    color: ${rgba(theme.DEPRECATED_THEME.colors.fg.white, 0.54)};
    font-family: ${theme.DEPRECATED_THEME.fonts.body2.family};
    font-size: ${theme.DEPRECATED_THEME.fonts.body2.size};
    font-weight: 500;
    line-height: ${theme.DEPRECATED_THEME.fonts.body2.lineHeight};
    margin: 0;
    margin-bottom: 12px;
  `
);

export const SectionWrapper = styled.div`
  width: 100%;
  margin-bottom: 60px;

  &:last-child {
    margin-bottom: 24px;
  }
`;

export const SectionContent = styled.dl`
  display: grid;
  grid-template-columns: 1fr 1fr;
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

export const Label = styled.dt(
  ({ theme }) => `
    color: ${theme.DEPRECATED_THEME.colors.fg.white};
    font-family: ${theme.DEPRECATED_THEME.fonts.body2.family};
    font-size: ${theme.DEPRECATED_THEME.fonts.body2.size};
    line-height: ${theme.DEPRECATED_THEME.fonts.body2.lineHeight};
    margin: 0;
  `
);

export const PanelLabel = styled.dt(
  ({ theme }) => `
    width: 100%;
    color: ${theme.DEPRECATED_THEME.colors.fg.secondary};
    font-family: ${theme.DEPRECATED_THEME.fonts.tab.family};
    font-size: ${theme.DEPRECATED_THEME.fonts.tab.size};
    font-weight: 500;
    line-height: ${theme.DEPRECATED_THEME.fonts.tab.lineHeight};
    margin: 0;
    margin-bottom: 16px;
    text-align: center;
  `
);

export const ShortcutKeyWrapper = styled.dd`
  display: flex;
  justify-content: ${({ alignment }) => alignment};
  align-items: center;
  margin: 0;
`;

export const ShortcutKeyLabel = styled.span(
  ({ theme }) => `
    color: ${theme.DEPRECATED_THEME.colors.fg.white};
    font-family: ${theme.DEPRECATED_THEME.fonts.body2.family};
    font-size: ${theme.DEPRECATED_THEME.fonts.body2.size};
    line-height: ${theme.DEPRECATED_THEME.fonts.body2.lineHeight};
    margin: 0 8px;
  `
);

export const ShortcutKey = styled.span(
  ({ theme, keySize = KEY_SIZE.NORMAL }) => `
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${keySize}px;
    height: 24px;
    color: ${theme.DEPRECATED_THEME.colors.fg.white};
    font-family: ${theme.DEPRECATED_THEME.fonts.body2.family};
    font-size: ${theme.DEPRECATED_THEME.fonts.body2.size};
    line-height: ${theme.DEPRECATED_THEME.fonts.body2.lineHeight};
    background-color: ${theme.DEPRECATED_THEME.colors.fg.gray24};
    border-radius: 4px;

    & + & {
      margin-left: 8px;
    }
  `
);

export const CloseButton = styled.button`
  background-color: transparent;
  border: 0;
  margin: 24px;
  position: absolute;
  top: 0;
  right: 0;
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.white};
  cursor: pointer;
`;

export const Up = styled(KeyArrowUp)`
  width: 12px;
  transform-origin: 50% 50%;
`;

export const Down = styled(Up)`
  transform: rotate(0.5turn);
`;
