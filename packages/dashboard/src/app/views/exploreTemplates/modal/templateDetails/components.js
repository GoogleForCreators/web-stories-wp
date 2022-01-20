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
import { __ } from '@googleforcreators/i18n';

export const Panel = styled.section`
  padding: 16vh 0 14vh 0;
`;

export const Container = styled.div`
  position: relative;
  width: 76%;
  max-width: ${0.76 * 1920}px;
  margin: 0 auto;
`;

export const Inner = styled.div`
  display: flex;
  align-items: start;
`;

export const DetailContainer = styled.section.attrs({
  'aria-label': __('Template Details', 'web-stories'),
})`
  padding: 0 0 0 60px;
  margin-right: auto;
`;

export const TemplateDetails = styled.div`
  position: relative;
  display: flex;
  width: 500px;
`;

export const RowContainer = styled.section.attrs({
  'aria-label': __('Related Templates', 'web-stories'),
})`
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 40px;
  margin: 0 80px 0;
  & > h3 {
    padding-bottom: 32px;
  }
  & > div {
    width: 100%;
  }
`;
