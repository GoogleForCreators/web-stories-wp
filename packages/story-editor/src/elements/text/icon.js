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
import { Icons } from '@web-stories-wp/design-system';

const IconContainer = styled.div`
  height: auto;
  width: 28px;
  overflow: hidden;
  /* icon is bigger than icon container, so we need to center manually. */
  margin-left: -1px;
`;

function TextIcon() {
  return (
    <IconContainer>
      <Icons.LetterT height="30px" width="30px" />
    </IconContainer>
  );
}

export default TextIcon;
