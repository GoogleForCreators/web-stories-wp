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
import {
  TypographyPresets,
  StandardViewContentGutter,
  Button,
  TextInput,
} from '../../../components';
import { visuallyHiddenStyles } from '../../../utils/visuallyHiddenStyles';
import { Link } from '../../../components/link';
import { BUTTON_TYPES, KEYBOARD_USER_SELECTOR } from '../../../constants';

export const Wrapper = styled.div`
  margin: 0 107px;
`;

export const Main = styled(StandardViewContentGutter)`
  display: flex;
  flex-direction: column;
  padding-top: 36px;
  margin-top: 20px;
  max-width: 945px;
`;

export const SettingForm = styled.form`
  display: grid;
  grid-template-columns: 27% minmax(400px, 1fr);
  column-gap: 6.56%;
  padding-bottom: 52px;

  @media ${({ theme }) => theme.internalTheme.breakpoint.largeDisplayPhone} {
    grid-template-columns: 100%;
    row-gap: 20px;
  }
`;

export const SettingHeading = styled.h3`
  ${TypographyPresets.Small};
  font-weight: ${({ theme }) => theme.internalTheme.typography.weight.bold};
  color: ${({ theme }) => theme.internalTheme.colors.black};
  padding-bottom: 8px;
`;

export const FormContainer = styled.div`
  input {
    width: 100%;
    height: 32px;
  }
`;

export const InlineLink = styled(Link)`
  margin-left: 0.25em;
`;

export const HelperText = styled.p`
  ${TypographyPresets.Small};
  color: ${({ theme }) => theme.internalTheme.colors.gray200};
`;

export const DefaultLogoText = styled.p`
  ${TypographyPresets.ExtraSmall};
  margin: 0;
  color: ${({ theme }) => theme.internalTheme.colors.gray200};
  width: 100%;
  text-align: center;
`;
export const TextInputHelperText = styled(HelperText)`
  padding-top: 10px;
`;

export const FinePrintHelperText = styled.p`
  ${TypographyPresets.ExtraSmall};
  padding-top: 10px;
  color: ${({ theme }) => theme.internalTheme.colors.gray200};
`;

export const FormLabel = styled.span`
  ${TypographyPresets.ExtraSmall};
  color: ${({ theme }) => theme.internalTheme.colors.gray400};
`;

export const Error = styled.p`
  ${TypographyPresets.ExtraSmall};
  padding-bottom: 10px;
  color: ${({ theme }) => theme.internalTheme.colors.danger};
`;

export const UploadedContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 56px);
  grid-auto-rows: 56px;
  grid-column-gap: 12px;
  grid-row-gap: 20px;
  padding-bottom: 24px;
  border: ${({ theme }) => theme.internalTheme.borders.transparent};
  border-width: 2px;

  ${KEYBOARD_USER_SELECTOR} &:focus {
    outline: none;
    border-color: ${({ theme }) =>
      rgba(theme.internalTheme.colors.bluePrimary, 0.85)};
  }
`;

export const GridItemContainer = styled.div`
  position: relative;

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
  border: ${({ theme }) => theme.internalTheme.borders.transparent};
  width: 100%;
  height: 100%;
  border-radius: 4px;
  border-width: 2px;
  padding: 0;

  ${KEYBOARD_USER_SELECTOR} &:focus {
    border-color: ${({ theme }) =>
      rgba(theme.internalTheme.colors.bluePrimary, 0.85)};
    border-width: 2px;
    outline: none;
  }
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
  color: ${({ theme }) => theme.internalTheme.colors.white};
  background: ${({ theme }) => theme.internalTheme.colors.gray700};
  border-radius: 50%;
  border: ${({ theme }) => theme.internalTheme.borders.transparent};
  cursor: pointer;

  & > svg {
    margin: auto;
    padding: 2px 2px 3px 3px;
    width: 90%;
    height: auto;
    display: block;
  }

  ${KEYBOARD_USER_SELECTOR} &:focus {
    border-color: ${({ theme }) =>
      rgba(theme.internalTheme.colors.bluePrimary, 0.85)};
    border-width: 2px;
    outline: none;
  }
`;

export const SaveButton = styled(Button).attrs({
  type: BUTTON_TYPES.PRIMARY,
})``;

export const ErrorText = styled.p`
  ${TypographyPresets.ExtraSmall};
  color: ${({ theme }) => theme.internalTheme.colors.danger};
  margin-left: 1em;
  padding-top: 0.25em;
`;

export const InlineForm = styled.div`
  display: flex;
`;
export const VisuallyHiddenLabel = styled.label(visuallyHiddenStyles);
export const GoogleAnalyticsTextInput = styled(TextInput)`
  flex: 3;
  width: auto;
  display: inline-block;
  margin-right: 5px;
`;

export const VisuallyHiddenDescription = styled.span(visuallyHiddenStyles);
