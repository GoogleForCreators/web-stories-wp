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
import { useEffect, useState, useRef } from 'react';
/**
 * Internal dependencies
 */
import { BEZIER } from '../../../../animation';
import { BUTTON_SIZES, BUTTON_TYPES, Icons } from '../../../../design-system';
import { useConfig } from '../../../app/config';
import { TRANSITION_DURATION } from '../constants';
import { forceFocusCompanion } from '../utils';
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

const ArrowWrap = styled.div`
  transform-origin: 50% 50%;
  transform: ${({ isRTL }) => (isRTL ? 'rotate(180deg)' : 'none')};
`;

const onCondition = (condition) => (fn) => {
  if (condition) {
    fn();
  }
};

export function BottomNavigation({
  onAllTips,
  onPrev,
  onNext,
  hasBottomNavigation,
  isNextDisabled,
  isPrevDisabled,
}) {
  const { isRTL } = useConfig();
  // If either the prev or next has focus and become disabled,
  // we want to force focus to the companion instead of losing
  // it to the canvas.
  const prevButtonRef = useRef(null);
  const nextButtonRef = useRef(null);
  const [local, setLocal] = useState({
    isPrevDisabled,
    isNextDisabled,
  });
  // We want to force focus one render before we disable the actual
  // DOM elements so we can see if they're currently focused.
  useEffect(() => {
    [
      isPrevDisabled && document.activeElement === prevButtonRef.current,
      isNextDisabled && document.activeElement === nextButtonRef.current,
    ].forEach((condition) => onCondition(condition)(forceFocusCompanion));
    setLocal({ isPrevDisabled, isNextDisabled });
  }, [isPrevDisabled, isNextDisabled]);

  return (
    <BottomNavBar
      aria-hidden={hasBottomNavigation}
      isHidden={!hasBottomNavigation}
    >
      <BottomNavButtons>
        <NavButton
          aria-label={__('Navigate to Help Center Main Menu', 'web-stories')}
          onClick={() => {
            forceFocusCompanion();
            onAllTips();
          }}
          type={BUTTON_TYPES.PLAIN}
          size={BUTTON_SIZES.SMALL}
          disabled={!hasBottomNavigation}
        >
          <ArrowWrap isRTL={isRTL}>
            <Icons.Arrow />
          </ArrowWrap>
          <span>{__('All Tips', 'web-stories')}</span>
        </NavButton>
      </BottomNavButtons>
      <BottomNavButtons>
        <NavButton
          ref={prevButtonRef}
          aria-label={__('Navigate to Previous Tip', 'web-stories')}
          onClick={onPrev}
          type={BUTTON_TYPES.PLAIN}
          size={BUTTON_SIZES.SMALL}
          disabled={!hasBottomNavigation || local.isPrevDisabled}
        >
          {__('Previous', 'web-stories')}
        </NavButton>
        <NavButton
          ref={nextButtonRef}
          aria-label={__('Navigate to Next Tip', 'web-stories')}
          onClick={onNext}
          type={BUTTON_TYPES.PLAIN}
          size={BUTTON_SIZES.SMALL}
          disabled={!hasBottomNavigation || local.isNextDisabled}
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
