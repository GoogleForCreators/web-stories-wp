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

const ICON_SIZE = 16;
const IconContainer = styled.div`
  height: ${ICON_SIZE}px;
  width: ${ICON_SIZE}px;
  position: absolute;
  top: calc(50% - ${ICON_SIZE / 2}px);
  left: calc(50% - ${ICON_SIZE / 2}px);
  color: ${({ theme }) => theme.colors.fg.primary};
  border-radius: ${({ theme }) => theme.borders.radius.round};
  pointer-events: none;
  svg {
    position: absolute;
    top: 0;
    left: 0;
  }
`;

const Scrim = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: ${({ theme }) => rgba(theme.colors.standard.black, 0.5)};
  pointer-events: none;
`;

function InsertionOverlay({ showIcon = true }) {
  // The icon looks like a button but is just representational.
  // The real interactive element is the containing element.
  // If the showIcon is `false`, we still display the scrim for shade.
  return (
    <Scrim>
      {showIcon && (
        <IconContainer role="presentation">
          <Icons.PlusFilledSmall />
        </IconContainer>
      )}
    </Scrim>
  );
}

InsertionOverlay.propTypes = {
  showIcon: PropTypes.bool,
};

export default InsertionOverlay;
