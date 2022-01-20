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
import {
  useEffect,
  useState,
  useDebouncedCallback,
} from '@googleforcreators/react';
import styled, { css } from 'styled-components';
import { __ } from '@googleforcreators/i18n';
import {
  Button,
  BUTTON_VARIANTS,
  Icons,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useLayoutContext } from '../layout';

const StyledButton = styled(Button)(
  ({ $isVisible, theme }) => css`
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
    background-color: ${theme.colors.opacity.white64};
    pointer-events: ${$isVisible ? 'auto' : 'none'};
    box-shadow: 0px 4px 14px rgba(0, 0, 0, 0.25);
    opacity: ${Number($isVisible)};
    transition: opacity 300ms ease-in-out;
  `
);

const DropUpArrowIcon = styled(Icons.ChevronUp)`
  position: relative;
  transform: scale(2.4);
`;

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const {
    actions: { scrollToTop },
  } = useLayoutContext();

  const handleScroll = useDebouncedCallback(
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
    <StyledButton
      disabled={!isVisible}
      aria-label={__('Scroll back to top', 'web-stories')}
      data-testid="scroll-to-top-button"
      $isVisible={isVisible}
      onClick={scrollToTop}
      variant={BUTTON_VARIANTS.CIRCLE}
    >
      <DropUpArrowIcon aria-hidden />
    </StyledButton>
  );
};

export default ScrollToTop;
