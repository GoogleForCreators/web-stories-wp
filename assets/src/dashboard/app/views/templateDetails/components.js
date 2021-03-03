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
import { __ } from '@web-stories-wp/i18n';

export const ColumnContainer = styled.section`
  display: grid;
  column-gap: 24px;
  grid-template-columns: minmax(50%, auto) 1fr;
  width: calc(100% - 300px);
  margin: 124px auto 154px;
`;

export const DetailContainer = styled.section.attrs({
  'aria-label': __('Template Details', 'web-stories'),
})`
  width: 100%;
  padding: 40px 20px 0;
`;

export const Column = styled.div`
  display: flex;
`;

export const RowContainer = styled.section.attrs({
  'aria-label': __('Related Templates', 'web-stories'),
})`
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 40px;
  margin: 0 80px 0;
  & > h2 {
    padding-bottom: 32px;
  }
  & > div {
    width: 100%;
  }
`;
