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
 * Internal dependencies
 */
import {
  TypographyPresets,
  StandardViewContentGutter,
} from '../../../components';
import { visuallyHiddenStyles } from '../../../utils/visuallyHiddenStyles';
import { Link } from '../../../components/link';

export const Wrapper = styled.div`
  margin: 0 107px;
`;

export const Main = styled(StandardViewContentGutter)`
  display: flex;
  flex-direction: column;
  padding-top: 36px;
  margin-top: 20px;
  max-width: 945px;
  width: 100%;
`;

export const SettingForm = styled.form`
  display: grid;
  grid-template-columns: 27% minmax(400px, 1fr);
  column-gap: 6.56%;
  padding-bottom: 52px;

  @media ${({ theme }) => theme.breakpoint.largeDisplayPhone} {
    grid-template-columns: 100%;
    row-gap: 20px;
  }
`;

export const SettingHeading = styled.h3`
  ${TypographyPresets.Small};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.colors.black};
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
  color: ${({ theme }) => theme.colors.gray200};
`;

export const TextInputHelperText = styled(HelperText)`
  padding-top: 10px;
`;

export const FinePrintHelperText = styled.p`
  ${TypographyPresets.ExtraSmall};
  padding-top: 10px;
  color: ${({ theme }) => theme.colors.gray200};
`;

export const Error = styled.p`
  ${TypographyPresets.ExtraSmall};
  padding-bottom: 10px;
  color: ${({ theme }) => theme.colors.danger};
`;

export const UploadedContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 56px);
  grid-auto-rows: 56px;
  grid-column-gap: 12px;
  grid-row-gap: 20px;
  padding-bottom: 24px;
`;

export const Logo = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
  border-radius: 4px;
`;

export const RemoveLogoButton = styled.button`
  position: relative;
  left: 2px;
  bottom: 30px;
  width: 24px;
  height: 24px;
  text-align: center;

  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.gray700};
  border-radius: 50%;
  border: ${({ theme }) => theme.borders.transparent};
  cursor: pointer;

  & > svg {
    width: 100%;
    height: 100%;
    display: block;
  }
`;

export const VisuallyHiddenDescription = styled.span(visuallyHiddenStyles);
