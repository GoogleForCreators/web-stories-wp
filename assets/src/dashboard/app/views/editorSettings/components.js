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
  TextInput as _TextInput,
} from '../../../components';

export const Wrapper = styled.div`
  margin: 0 107px;
`;
export const Header = styled.header`
  padding-top: 100px;
`;

export const Heading = styled.h1`
  ${TypographyPresets.ExtraExtraLarge};
  font-size: 50.67px;
  line-height: 140%;
  padding: 0;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.gray800};

  @media ${({ theme }) => theme.breakpoint.smallDisplayPhone} {
    font-size: 40.67px;
  }
`;

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  padding-top: 56px;
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

export const SettingLabel = styled.label`
  ${TypographyPresets.Large};
  font-size: 18.667px;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  line-height: 140%;
  color: ${({ theme }) => theme.colors.gray600};
`;
export const TextInput = styled(_TextInput)`
  width: 100%;
  height: 32px;
`;

export const TextInputHelperText = styled.p`
  ${TypographyPresets.Small};
  padding-top: 10px;
  color: ${({ theme }) => theme.colors.gray500};
`;

export const FileUploadHelperText = styled.p`
  ${TypographyPresets.Small};
  font-size: 15px;
  padding-bottom: 10px;
  color: ${({ theme }) => theme.colors.gray900};
`;

export const FinePrintHelperText = styled.p`
  ${TypographyPresets.ExtraSmall};
  padding-top: 10px;
  color: ${({ theme }) => theme.colors.gray500};
`;

export const UploadContainer = styled.div`
  width: 100%;
  height: 153px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.gray25};
`;
