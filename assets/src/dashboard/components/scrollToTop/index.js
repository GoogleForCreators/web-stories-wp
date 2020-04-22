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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
/**
 * External dependencies
 */
import { useRef, useReducer, useLayoutEffect } from 'react';
import styled from 'styled-components';
import { useDebouncedCallback } from 'use-debounce';
/**
 * Internal dependencies
 */
import { BEZIER } from '../../constants/animation';
import { ReactComponent as DropUpArrowSvg } from '../../icons/dropUpArrow.svg';

const ScrollButton = styled.button`
  position: fixed;
  right: 40px;
  bottom: 40px;
  height: 60px;
  width: 60px;
  display: flex;
  justify-content: center;
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
  cursor: pointer;
  border-radius: 50%;
  border: none;
  box-shadow: '0px 2px 8px rgba(0, 0, 0, 0.17)';
  color: ${({ theme }) => theme.colors.gray900};
  background-color: ${({ theme, isVisible }) =>
    isVisible ? theme.colors.white : 'transparent'};
  transition: background-color 0.25s ${BEZIER.outSine};
`;

// TODO needs actual SVG
const DropUpArrowIcon = styled(DropUpArrowSvg).attrs({ width: 25, height: 35 })`
  margin: auto;
`;

const STATE = {
  hidden: 'hidden',
  visible: 'visible',
};

const ACTION = {
  ON_Y_AXIS_SCROLLED: 'y axis is not 0',
  ON_PAGE_TOP: 'y axis is 0',
};

const machine = {
  [STATE.hidden]: {
    [ACTION.ON_Y_AXIS_SCROLLED]: STATE.visible,
  },
  [STATE.visible]: {
    [ACTION.ON_PAGE_TOP]: STATE.hidden,
  },
};

const showButtonReducer = (state, action) => {
  return machine[state][action] || state;
};

const ScrollToTop = () => {
  const getCurrentYAxis = () => {
    const isBrowserWindow = typeof window !== 'undefined';
    if (!isBrowserWindow) {
      return 0;
    }

    return window.scrollY;
  };
  const targetRef = useRef(null);
  const position = useRef(getCurrentYAxis);
  position.current = getCurrentYAxis;

  const [showButtonState, dispatch] = useReducer(
    showButtonReducer,
    STATE.hidden
  );

  const [handleScroll] = useDebouncedCallback(() => {
    const hasScrolledDown = position.current();
    if (hasScrolledDown) {
      dispatch(ACTION.ON_Y_AXIS_SCROLLED);
    } else {
      dispatch(ACTION.ON_PAGE_TOP);
    }
  }, 100);

  useLayoutEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  });

  const handleScrollBackToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <ScrollButton
      ref={targetRef}
      isVisible={showButtonState === STATE.visible}
      onClick={handleScrollBackToTop}
      title={__('scroll back to top', 'web-stories')}
    >
      <DropUpArrowIcon aria-hidden={true} />
    </ScrollButton>
  );
};

export default ScrollToTop;
