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
import { useRef, useState, useLayoutEffect } from 'react';
import styled from 'styled-components';
import { useDebouncedCallback } from 'use-debounce';
/**
 * Internal dependencies
 */
import { ReactComponent as DropUpArrowSvg } from '../../icons/dropUpArrow.svg';
import getCurrentYAxis from '../../utils/getCurrentYAxis';

const ScrollButton = styled.button`
  position: fixed;
  right: 40px;
  bottom: 40px;
  height: 50px;
  width: 50px;
  visibility: ${({ isVisible }) => (isVisible ? 'visible' : 'hidden')};
  cursor: pointer;
  border-radius: 50%;
  border: 1px solid transparent;
  box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.25);
  color: ${({ theme }) => theme.colors.gray900};
  background-color: ${({ theme }) => theme.colors.white};
  opacity: ${({ isVisible }) => (isVisible ? 1.0 : 0)};
  transition: opacity 0.5s linear;
`;

// TODO needs actual SVG
const DropUpArrowIcon = styled(DropUpArrowSvg).attrs({ width: 30, height: 40 })`
  margin: auto;
`;

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef(null);

  const [handleScroll] = useDebouncedCallback(() => {
    const hasScrolledDown = getCurrentYAxis();
    setIsVisible(hasScrolledDown > 0);
  }, 100);

  useLayoutEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  });

  const handleScrollBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <ScrollButton
      data-testid="scroll-to-top-button"
      ref={targetRef}
      isVisible={isVisible}
      onClick={handleScrollBackToTop}
      title={__('scroll back to top', 'web-stories')}
    >
      <DropUpArrowIcon aria-hidden={true} />
    </ScrollButton>
  );
};

export default ScrollToTop;
