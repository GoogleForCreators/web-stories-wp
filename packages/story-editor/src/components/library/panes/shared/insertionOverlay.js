/*
 * Copyright 2022 Google LLC
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
import { Icons } from '@googleforcreators/design-system';
import { rgba } from 'polished';
import PropTypes from 'prop-types';

const IconContainer = styled.div`
  height: 32px;
  width: 32px;
  position: absolute;
  top: calc(50% - 16px);
  left: calc(50% - 16px);
  color: ${({ theme }) => theme.colors.fg.primary};
  border-radius: ${({ theme }) => theme.borders.radius.round};
`;

const Wrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: ${({ theme }) => rgba(theme.colors.standard.black, 0.5)};
`;

function InsertionOverlay({ showIcon = true }) {
  return (
    <Wrapper>
      {showIcon && (
        <IconContainer role="presentation">
          <Icons.PlusFilled />
        </IconContainer>
      )}
    </Wrapper>
  );
}

InsertionOverlay.propTypes = {
  showIcon: PropTypes.bool,
};

export default InsertionOverlay;
