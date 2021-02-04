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

/**
 * Internal dependencies
 */
import { StandardViewContentGutter } from '../../../components';
import { visuallyHiddenStyles } from '../../../utils/visuallyHiddenStyles';
import {
  Button,
  Headline,
  Input,
  Link,
  Text,
  THEME_CONSTANTS,
  themeHelpers,
} from '../../../../design-system';

export const Wrapper = styled.div``;

export const Main = styled(StandardViewContentGutter)`
  display: flex;
  flex-direction: column;
  padding-top: 36px;
  margin-top: 20px;
  margin-bottom: 56px;
  max-width: 945px;
`;

export const SettingForm = styled.form`
  display: grid;
  grid-template-columns: 27% minmax(400px, 1fr);
  column-gap: 6.56%;
  padding-bottom: 52px;

  @media ${({ theme }) => theme.breakpoint.mobile} {
    grid-template-columns: 100%;
    row-gap: 20px;
  }
`;

export const SettingHeading = styled(Headline).attrs({
  as: 'h3',
})`
  ${({ theme }) =>
    themeHelpers.expandPresetStyles({
      preset: {
        ...theme.typography.presets.label[
          THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.LARGE
        ],
      },
      theme,
    })};
  margin: 8px 0;
`;

export const InlineLink = styled(Link)`
  display: inline-block;
`;

export const HelperText = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.tertiary};
`;

export const CenterMutedText = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.tertiary};
  text-align: center;
`;

export const SettingSubheading = styled(HelperText)`
  padding: 8px 0;
`;

export const TextInputHelperText = styled(HelperText)`
  padding-top: 12px;
`;

export const CheckboxLabel = styled(Text)`
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
`;

export const CheckboxLabelText = styled(HelperText)`
  margin-left: 8px;
`;

export const Error = styled(CenterMutedText)`
  padding-bottom: 10px;
  color: ${({ theme }) => theme.colors.fg.negative};
`;

export const UploadedContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 56px);
  grid-auto-rows: 56px;
  grid-column-gap: 12px;
  grid-row-gap: 20px;
  padding-bottom: 20px;
  margin-bottom: 4px;
  border: 1px solid transparent;
  border-width: 2px;

  ${themeHelpers.focusableOutlineCSS};
`;

export const GridItemContainer = styled.div`
  position: relative;
  ${({ active, theme }) =>
    active &&
    css`
      border: 1px solid ${theme.colors.border.defaultActive};
      border-radius: ${theme.borders.radius.small};
    `};

  &:hover,
  &:focus-within {
    button {
      opacity: 1 !important;
    }
  }
`;

export const GridItemButton = styled.button`
  display: block;
  background-color: transparent;
  border: 1px solid transparent;
  width: 100%;
  height: 100%;
  border-radius: 4px;
  border-width: 2px;
  padding: 0;

  ${themeHelpers.focusableOutlineCSS};
`;

export const Logo = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
  border-radius: 4px;
`;

export const MenuContainer = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
`;

export const LogoMenuButton = styled.button`
  opacity: ${({ isActive, menuOpen }) => (menuOpen || isActive ? 1 : 0)};
  position: absolute;
  display: flex;
  align-items: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  text-align: center;
  padding: 0;
  color: ${({ theme }) => theme.colors.standard.white};
  background: ${({ theme }) => theme.colors.fg.secondary};
  border-radius: 50%;
  border: 1px solid transparent;
  cursor: pointer;

  & > svg {
    margin: auto;
    padding: 2px 2px 3px 3px;
    width: 90%;
    height: auto;
    display: block;
  }

  ${themeHelpers.focusableOutlineCSS};
`;

export const SaveButton = styled(Button)`
  height: 36px;
`;

export const InlineForm = styled.div`
  display: flex;
  align-items: flex-start;
`;

export const VisuallyHiddenLabel = styled.label(visuallyHiddenStyles);

export const SettingsTextInput = styled(Input)`
  margin-right: 8px;
`;

export const VisuallyHiddenDescription = styled.span(visuallyHiddenStyles);
