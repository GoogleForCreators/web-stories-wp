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
import { __ } from '@web-stories-wp/i18n';
/**
 * Internal dependencies
 */
import { BEZIER } from '../../../../animation';
import { BUTTON_SIZES, BUTTON_TYPES, Icons } from '../../../../design-system';
import { TRANSITION_DURATION } from '../constants';
import { NavBar, NavButton } from './components';

const BottomNavBar = styled(NavBar)`
  position: absolute;
  bottom: 0;
  transition: transform ${TRANSITION_DURATION}ms ${BEZIER.default};
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
  isNextDisabled,
  isPrevDisabled,
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
          disabled={!hasBottomNavigation || isPrevDisabled}
        >
          {__('Previous', 'web-stories')}
        </NavButton>
        <NavButton
          onClick={onNext}
          type={BUTTON_TYPES.PLAIN}
          size={BUTTON_SIZES.SMALL}
          disabled={!hasBottomNavigation || isNextDisabled}
        >
          {__('Next', 'web-stories')}
        </NavButton>
      </BottomNavButtons>
    </BottomNavBar>
  );
}

BottomNavigation.propTypes = {
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  onAllTips: PropTypes.func.isRequired,
  hasBottomNavigation: PropTypes.bool,
  isNextDisabled: PropTypes.bool,
  isPrevDisabled: PropTypes.bool,
};
