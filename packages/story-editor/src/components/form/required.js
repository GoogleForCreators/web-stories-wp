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
import { _x } from '@googleforcreators/i18n';
import { Text, THEME_CONSTANTS } from '@web-stories-wp/design-system';

const RequiredWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const StyledText = styled(Text).attrs({
  as: 'span',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.secondary};
  font-size: 12px;
`;

function Required() {
  return (
    <RequiredWrapper>
      <StyledText>
        {_x('Required', 'Required form input', 'web-stories')}
      </StyledText>
    </RequiredWrapper>
  );
}

export default Required;
