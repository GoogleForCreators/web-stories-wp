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

import styled, { css } from 'styled-components';
import { NumericInput, themeHelpers } from '@web-stories-wp/design-system';
/**
 * Internal dependencies
 */

const inputContainerStyleOverride = css`
  position: relative;
  :focus-within {
    z-index: 1;
    ${({ theme }) =>
      themeHelpers.focusCSS(
        theme.colors.border.focus,
        theme.colors.bg.secondary
      )};
  }
`;

const iconCss = css`
  width: 29px;
  height: 29px;
`;

const StackableInput = styled(NumericInput)`
  svg {
    ${iconCss}
  }
  & > div {
    border-radius: 0;
    margin-left: -1px;
    padding: 2px 7px 2px 12px;
    ${inputContainerStyleOverride};
  }
`;

export default StackableInput;
