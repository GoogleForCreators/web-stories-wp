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
import {
  NumericInput,
  CONTEXT_MENU_SKIP_ELEMENT,
} from '@googleforcreators/design-system';
import styled from 'styled-components';

const Input = styled(NumericInput).attrs({
  inputClassName: CONTEXT_MENU_SKIP_ELEMENT,
})`
  width: 70px;
  flex: 0 0 70px;
`;

export default Input;
