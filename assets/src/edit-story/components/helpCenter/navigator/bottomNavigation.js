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
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import { BEZIER } from '../../../../animation';
import { BUTTON_SIZES, BUTTON_TYPES, Icons } from '../../../../design-system';
import { NavBar, NavButton } from './components';

const BottomNavBar = styled(NavBar)`
  position: absolute;
  bottom: 0;
  transition: 0.3s transform ${BEZIER.default};
  ${({ isHidden }) =>
    isHidden &&
    css`
      transform: translateY(100%);
    `}
`;

const BottomNavButtons = styled.div`
  display: flex;
  padding: 0 8px;
`;

export function BottomNavigation({
  onAllTips,
  onPrev,
  onNext,
  hasBottomNavigation,
}) {
  return (
    <BottomNavBar
      aria-hidden={hasBottomNavigation}
      isHidden={!hasBottomNavigation}
    >
      <BottomNavButtons>
        <NavButton
          onClick={onAllTips}
          type={BUTTON_TYPES.PLAIN}
          size={BUTTON_SIZES.SMALL}
          disabled={!hasBottomNavigation}
        >
          <Icons.Arrow />
          <span>{__('All Tips', 'web-stories')}</span>
        </NavButton>
      </BottomNavButtons>
      <BottomNavButtons>
        <NavButton
          onClick={onPrev}
          type={BUTTON_TYPES.PLAIN}
          size={BUTTON_SIZES.SMALL}
          disabled={!hasBottomNavigation || !onPrev}
        >
          {__('Previous', 'web-stories')}
        </NavButton>
        <NavButton
          onClick={onNext}
          type={BUTTON_TYPES.PLAIN}
          size={BUTTON_SIZES.SMALL}
          disabled={!hasBottomNavigation || !onNext}
        >
          {__('Next', 'web-stories')}
        </NavButton>
      </BottomNavButtons>
    </BottomNavBar>
  );
}

BottomNavigation.propTypes = {
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
  onAllTips: PropTypes.func,
  hasBottomNavigation: PropTypes.func,
};
