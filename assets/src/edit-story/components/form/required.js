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
import { _x } from '@web-stories-wp/i18n';

const RequiredWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const Text = styled.span`
  font-size: 12px;
  line-height: 14px;
  font-style: italic;
  color: ${({ theme }) => rgba(theme.old.colors.required, 0.55)};
`;

function Required() {
  return (
    <RequiredWrapper>
      <Text>{_x('required', 'required form input', 'web-stories')}</Text>
    </RequiredWrapper>
  );
}

export default Required;
