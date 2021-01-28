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
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
/**
 * Internal dependencies
 */
import { themeHelpers } from '../../../../design-system';
import { BottomNavigation } from './bottomNavigation';
import {
  NAVIGATION_GUTTER,
  NAVIGATION_HEIGHT,
  NAVIGATION_WIDTH,
} from './constants';
import { TopNavigation } from './topNavigation';
import {
  removeInnerElementFromLayoutFlow,
  syncOuterHeightWithInner,
} from './utils';

const Wrapper = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: ${NAVIGATION_WIDTH}px;
  color: ${({ theme }) => theme.colors.fg.primary};
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border: 1px solid ${({ theme }) => theme.colors.bg.tertiary};
  border-radius: ${({ theme }) => theme.borders.radius.small};
  overflow: hidden;
`;

const Container = styled.div`
  position: relative;
  width: 100%;
  padding: 0px ${NAVIGATION_GUTTER}px;
`;

const Layout = styled.div`
  ${themeHelpers.fullSizeRelative}
  contain: content;
`;

const Content = styled.div``;
const ContentInner = styled.div`
  padding-bottom: ${({ hasBottomPadding }) =>
    hasBottomPadding ? NAVIGATION_HEIGHT : 0}px;
`;

export function Navigator({
  children,
  onClose,
  onNext,
  onPrev,
  onAllTips,
  hasBottomNavigation,
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
  // them to the layout container to animate to those updates
  useEffect(
    () => syncOuterHeightWithInner(innerRef.current, layoutRef.current),
    []
  );

  return (
    <Wrapper>
      <TopNavigation onClose={onClose} />
      <Layout ref={layoutRef}>
        <Content ref={innerRef}>
          <ContentInner hasBottomPadding={hasBottomNavigation}>
            <Container>{children}</Container>
          </ContentInner>
        </Content>
      </Layout>
      <BottomNavigation
        onNext={onNext}
        onPrev={onPrev}
        onAllTips={onAllTips}
        hasBottomNavigation={hasBottomNavigation}
      />
    </Wrapper>
  );
}

Navigator.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func,
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
  onAllTips: PropTypes.func,
  hasBottomNavigation: PropTypes.func,
};
