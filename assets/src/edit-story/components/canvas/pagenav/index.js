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
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { useCallback } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { PAGE_NAV_BUTTON_SIZE } from '../../../constants';
import { useConfig, useStory } from '../../../app';
import { LeftArrow, RightArrow } from '../../button';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.fg.white};
  width: ${PAGE_NAV_BUTTON_SIZE}px;
  height: ${PAGE_NAV_BUTTON_SIZE}px;

  & > * {
    pointer-events: initial;
  }
`;

const pageNavButtonsStyle = css`
  &:focus {
    opacity: 0.3;

    &:hover {
      opacity: 1;
    }
  }
`;

const LeftNavButton = styled(LeftArrow)`
  ${pageNavButtonsStyle}
`;

const RightNavButton = styled(RightArrow)`
  ${pageNavButtonsStyle}
`;

function PageNav({ isNext }) {
  const { pages, currentPageIndex, setCurrentPage } = useStory(
    ({ state: { pages, currentPageIndex }, actions: { setCurrentPage } }) => ({
      pages,
      currentPageIndex,
      setCurrentPage,
    })
  );
  const { isRTL } = useConfig();
  const handleClick = useCallback(() => {
    const newPage = isNext
      ? pages[currentPageIndex + 1]
      : pages[currentPageIndex - 1];
    if (newPage) {
      setCurrentPage({ pageId: newPage.id });
    }
  }, [setCurrentPage, currentPageIndex, isNext, pages]);
  const displayNav =
    (isNext && currentPageIndex < pages.length - 1) ||
    (!isNext && currentPageIndex > 0);
  const buttonProps = {
    isDisabled: !displayNav,
    isHidden: !displayNav,
    'aria-label': isNext
      ? __('Next Page', 'web-stories')
      : __('Previous Page', 'web-stories'),
    onClick: handleClick,
    // Cancel lasso.
    onMouseDown: (evt) => evt.stopPropagation(),
    width: PAGE_NAV_BUTTON_SIZE,
    height: PAGE_NAV_BUTTON_SIZE,
  };

  const PrevButton = isRTL ? RightNavButton : LeftNavButton;
  const NextButton = isRTL ? LeftNavButton : RightNavButton;

  if (isNext) {
    return (
      <Wrapper>
        <NextButton {...buttonProps} />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <PrevButton {...buttonProps} />
    </Wrapper>
  );
}

PageNav.propTypes = {
  isNext: PropTypes.bool,
};

PageNav.defaultProps = {
  isNext: true,
};

export default PageNav;
