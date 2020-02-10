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

const Spacer = styled.div`
  display: flex;
  height: 100%;

  ${({ theme, dotted = false }) =>
    dotted && `border-left: 1px dashed ${theme.colors.bg.v2};`}
  ${({ expand = true }) => expand && `flex: 1;`}
`;

export default Spacer;
