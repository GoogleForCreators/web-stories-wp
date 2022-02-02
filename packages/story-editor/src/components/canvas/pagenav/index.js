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
import PropTypes from 'prop-types';
import { useCallback, useRef } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import {
  Button,
  Icons,
  BUTTON_VARIANTS,
  BUTTON_TYPES,
  BUTTON_SIZES,
  TRACKING_EVENTS,
  usePerformanceTracking,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useConfig, useStory, useLayout } from '../../../app';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.fg.white};

  & > * {
    pointer-events: initial;
  }
`;

const FlippableArrow = styled(Icons.ArrowLeftLarge)`
  transform: rotate(${({ $isLeft }) => ($isLeft ? 0 : 0.5)}turn);
`;

function PageNav({ isNext = true }) {
  const { pages, currentPageIndex, setCurrentPage } = useStory(
    ({ state: { pages, currentPageIndex }, actions: { setCurrentPage } }) => ({
      pages,
      currentPageIndex,
      setCurrentPage,
    })
  );
  const { isRTL } = useConfig();
  const buttonRef = useRef(null);

  // Cancel lasso on mouse down
  const cancelMouseDown = useCallback((evt) => evt.stopPropagation(), []);
  const handleClick = useCallback(() => {
    const newPage = isNext
      ? pages[currentPageIndex + 1]
      : pages[currentPageIndex - 1];
    if (newPage) {
      setCurrentPage({ pageId: newPage.id });
    }
  }, [setCurrentPage, currentPageIndex, isNext, pages]);

  const { hasPageNavigation } = useLayout(
    ({ state: { hasPageNavigation } }) => ({
      hasPageNavigation,
    })
  );

  usePerformanceTracking({
    node: buttonRef.current,
    eventData: TRACKING_EVENTS.PAGE_NAVIGATION,
  });

  // Buttons are completely missing if there's no room for them
  if (!hasPageNavigation) {
    return false;
  }

  // If there's room, but it's inactive, just disable
  const displayNav =
    (isNext && currentPageIndex < pages.length - 1) ||
    (!isNext && currentPageIndex > 0);

  // If reading direction is RTL and this is next button, it's pointing left.
  // If reading direction is !RTL and this is !next button, it's pointing left.
  // Otherwise it's a right.
  // Thus, if the two bools are equal, it's a left button.
  const isLeft = isRTL === isNext;

  return (
    <Wrapper>
      <Button
        ref={buttonRef}
        variant={BUTTON_VARIANTS.SQUARE}
        type={BUTTON_TYPES.TERTIARY}
        size={BUTTON_SIZES.MEDIUM}
        aria-disabled={!displayNav}
        aria-label={
          isNext
            ? __('Next Page', 'web-stories')
            : __('Previous Page', 'web-stories')
        }
        onClick={handleClick}
        onMouseDown={cancelMouseDown}
      >
        <FlippableArrow $isLeft={isLeft} />
      </Button>
    </Wrapper>
  );
}

PageNav.propTypes = {
  isNext: PropTypes.bool,
};

export default PageNav;
