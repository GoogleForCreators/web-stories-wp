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
import { __ } from '@web-stories-wp/i18n';
import PropTypes from 'prop-types';
import { memo, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { themeHelpers, useResizeEffect } from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import { POPUP_ID } from '../constants';
import {
  DISTANCE_FROM_TOP,
  DISTANCE_FROM_BOTTOM,
} from '../../checklist/styles';
import { BottomNavigation } from './bottomNavigation';
import { NAVIGATION_WIDTH } from './constants';
import { TopNavigation } from './topNavigation';
import { removeInnerElementFromLayoutFlow } from './utils';

export const NavigationWrapper = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  max-height: calc(100vh - ${DISTANCE_FROM_TOP + DISTANCE_FROM_BOTTOM}px);
  width: ${NAVIGATION_WIDTH + 2}px; /* account for border width */
  color: ${({ theme }) => theme.colors.fg.primary};
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border: 1px solid ${({ theme }) => theme.colors.bg.tertiary};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  overflow: hidden;

  ${({ isOpen }) =>
    !isOpen &&
    css`
      &,
      * {
        height: 0;
        visibility: hidden;
      }
    `}
`;

const Layout = styled.div`
  ${themeHelpers.fullSizeRelative}
  contain: content;
`;

const Content = styled.div``;
const ContentInner = styled.div`
  position: relative;
`;

function Navigator({
  children,
  isOpen,
  onClose,
  onNext,
  onPrev,
  onAllTips,
  hasBottomNavigation,
  isNextDisabled,
  isPrevDisabled,
}) {
  const innerRef = useRef(null);
  const layoutRef = useRef(null);

  // After first mount, make layout height independent
  // of inner content height without disrupting layout.
  useEffect(
    () => removeInnerElementFromLayoutFlow(innerRef.current, layoutRef.current),
    []
  );

  // Listen to changes in inner content height and apply
  // them to the layout container to animate to those updates.
  useResizeEffect(
    innerRef,
    ({ height }) => {
      if (layoutRef.current) {
        layoutRef.current.style.height = `${height}px`;
      }
    },
    []
  );

  return (
    <NavigationWrapper isOpen={isOpen}>
      <TopNavigation
        onClose={onClose}
        label={__('Quick Tips', 'web-stories')}
        popupId={POPUP_ID}
      />
      <Layout ref={layoutRef}>
        <Content ref={innerRef}>
          <ContentInner>{children}</ContentInner>
        </Content>
      </Layout>
      <BottomNavigation
        onNext={onNext}
        onPrev={onPrev}
        onAllTips={onAllTips}
        hasBottomNavigation={hasBottomNavigation}
        isNextDisabled={isNextDisabled}
        isPrevDisabled={isPrevDisabled}
      />
    </NavigationWrapper>
  );
}

Navigator.propTypes = {
  isOpen: PropTypes.bool,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  onAllTips: PropTypes.func.isRequired,
  hasBottomNavigation: PropTypes.bool,
  isNextDisabled: PropTypes.bool,
  isPrevDisabled: PropTypes.bool,
};

export default memo(Navigator);
