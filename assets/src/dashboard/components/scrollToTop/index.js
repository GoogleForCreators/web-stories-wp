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
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { rgba } from 'polished';
import { useDebouncedCallback } from 'use-debounce';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { ChevronLeft } from '../../icons';
import { useLayoutContext } from '../layout';
import { KEYBOARD_USER_SELECTOR } from '../../constants';

const ScrollButton = styled.button`
  position: fixed;
  right: 40px;
  bottom: 40px;
  height: 50px;
  width: 50px;
  display: flex;
  align-self: center;
  justify-content: space-around;
  align-items: center;
  contain: content;
  padding: 8px;
  pointer-events: ${({ isVisible }) => (isVisible ? 'auto' : 'none')};
  cursor: pointer;
  border-radius: 50%;
  border: ${({ theme }) => theme.DEPRECATED_THEME.borders.transparent};
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.25);
  color: ${({ theme }) => theme.DEPRECATED_THEME.colors.gray900};
  background-color: ${({ theme }) => theme.DEPRECATED_THEME.colors.white};
  opacity: ${({ isVisible }) => Number(isVisible)};
  transition: opacity 300ms ease-in-out;

  ${KEYBOARD_USER_SELECTOR} &:focus {
    outline: ${({ theme }) =>
      `2px solid ${rgba(
        theme.DEPRECATED_THEME.colors.bluePrimary,
        0.85
      )} !important`};
  }
`;

const DropUpArrowIcon = styled(ChevronLeft)`
  top: -2px;
  position: relative;
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
`;

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const {
    actions: { scrollToTop },
  } = useLayoutContext();

  const [handleScroll] = useDebouncedCallback(
    () => setIsVisible(window.scrollY > 0),
    100
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return function () {
      window.removeEventListener('scroll', handleScroll, { passive: true });
    };
  }, [handleScroll]);

  return (
    <ScrollButton
      data-testid="scroll-to-top-button"
      isVisible={isVisible}
      onClick={scrollToTop}
      title={__('scroll back to top', 'web-stories')}
    >
      <DropUpArrowIcon aria-hidden={true} />
    </ScrollButton>
  );
};

export default ScrollToTop;
