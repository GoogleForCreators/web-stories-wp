/*
 * Copyright 2021 Google LLC
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
import { css } from 'styled-components';

/*
 * CSS for custom gray scrollbars for Chromium, Safari, Edge, & Opera.
 *
 * NOTE: Firefox does not yet support webkit scrollbar styling
 */
export const scrollbarCSS = () => css`
  /* Firefox compatible css */
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.interactiveBg.secondaryNormal}
    ${({ theme }) => theme.colors.inverted.divider.secondary};
  /* end Firefox compatible css */

  ::-webkit-scrollbar {
    width: 11px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.inverted.divider.secondary};
  }

  ::-webkit-scrollbar-thumb {
    background-clip: content-box;
    background-color: ${({ theme }) =>
      theme.colors.interactiveBg.secondaryNormal};
    border: 2px solid transparent;
    border-radius: 10px;
  }
`;
