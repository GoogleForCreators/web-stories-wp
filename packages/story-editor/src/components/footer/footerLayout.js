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
import { __ } from '@googleforcreators/i18n';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import DirectionAware from '../directionAware';
import Carousel from './carousel';
import PrimaryMenu from './primaryMenu';
import SecondaryMenu from './secondaryMenu';
import { MAX_MENU_WIDTH } from './constants';

const Wrapper = styled.section`
  position: relative;
  display: grid;
  grid:
    /* Note the two empty 1fr areas each side of the buttons - that's on purpose */
    'secondary carousel primary' auto /
    1fr
    minmax(auto, calc(100% - ${3 * MAX_MENU_WIDTH}px))
    1fr;
  width: 100%;
  max-width: 100%;
  height: 100%;
`;

const Area = styled.div`
  grid-area: ${({ area }) => area};
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: ${({ zIndex = 'auto' }) => zIndex};
`;

function FooterLayout({ footer, zIndex }) {
  return (
    <DirectionAware>
      <Wrapper aria-label={__('Workspace Footer', 'web-stories')}>
        <Area area="carousel">
          <Carousel />
        </Area>
        <Area area="primary" zIndex={zIndex}>
          <PrimaryMenu />
        </Area>
        <Area area="secondary" zIndex={zIndex}>
          <SecondaryMenu menu={footer?.secondaryMenu} />
        </Area>
      </Wrapper>
    </DirectionAware>
  );
}

FooterLayout.propTypes = {
  footer: PropTypes.object,
  zIndex: PropTypes.number,
};

export default FooterLayout;
