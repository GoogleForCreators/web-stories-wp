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
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Icons } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { CAROUSEL_STATE } from '../../../constants';

const iconCss = css`
  width: 32px;
  margin: -8px;
`;

const IconDown = styled(Icons.ChevronDownSmall)`
  ${iconCss}
`;

const IconUp = styled(Icons.ChevronUpSmall)`
  ${iconCss}
`;

function CarouselDrawerIcon({ state }) {
  // If open or going from open to closed, show down arrow
  if ([CAROUSEL_STATE.OPEN, CAROUSEL_STATE.CLOSING].includes(state)) {
    return <IconDown />;
  }
  // Otherwise if closed or going from closed to open, show up arrow
  return <IconUp />;
}

CarouselDrawerIcon.propTypes = {
  state: PropTypes.string.isRequired,
};

export default CarouselDrawerIcon;
