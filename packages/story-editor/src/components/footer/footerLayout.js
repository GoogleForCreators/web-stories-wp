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
import Carousel from './carousel';
import PrimaryMenu from './primaryMenu';
import SecondaryMenu from './secondaryMenu';
import { MAX_MENU_WIDTH } from './constants';
import DirectionAware from '../directionAware';

const Wrapper = styled.section`
  position: relative;
  display: grid;
  grid:
    /* Note the two empty 1fr areas each side of the buttons - that's on purpose */
    'secondary carousel primary' auto /
    ${MAX_MENU_WIDTH}px
    minmax(auto, calc(100% - ${2 * MAX_MENU_WIDTH}px))
    ${MAX_MENU_WIDTH}px;
  width: 100%;
  max-width: 100%;
  height: 100%;
`;

const Area = styled.div`
  grid-area: ${({ area }) => area};
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

function FooterLayout({ footer }) {
  return (
    <DirectionAware>
      <Wrapper aria-label={__('Workspace Footer', 'web-stories')}>
        <Area area="carousel">
          <Carousel />
        </Area>
        <Area area="primary">
          <PrimaryMenu />
        </Area>
        <Area area="secondary">
          <SecondaryMenu menu={footer?.secondaryMenu} />
        </Area>
      </Wrapper>
    </DirectionAware>
  );
}

FooterLayout.propTypes = {
  footer: PropTypes.object,
};

export default FooterLayout;
