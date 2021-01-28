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
import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import ResizeObserver from 'resize-observer-polyfill';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { BEZIER } from '../../../../animation';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
  themeHelpers,
} from '../../../../design-system';

const Wrapper = styled.div`
  position: absolute;
  overflow: hidden;
  left: 0;
  bottom: 0;
  width: 343px;
  color: ${({ theme }) => theme.colors.fg.primary};
  background-color: ${({ theme }) => theme.colors.bg.primary};
  border: 1px solid ${({ theme }) => theme.colors.bg.tertiary};
  border-radius: ${({ theme }) => theme.borders.radius.small};
`;

const Container = styled.div`
  width: 100%;
  padding: 0px 24px;
`;

const NavBar = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
  background-color: ${({ theme }) => theme.colors.bg.secondary};
  ${themeHelpers.expandTextPreset(({ label }, { MEDIUM }) => label[MEDIUM])}
`;

const NavBarInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const BottomNavBar = styled(NavBar)`
  position: absolute;
  bottom: 0;
  transition: 0.3s transform ${BEZIER.default};
  ${({ isHidden }) =>
    isHidden &&
    css`
      transform: translateY(100%);
    `}
`;

const Layout = styled.div`
  ${themeHelpers.fullSizeRelative}
  contain: content;
`;

const Content = styled.div``;
const ContentInner = styled.div`
  padding-bottom: ${({ hasBottomPadding }) => (hasBottomPadding ? 48 : 0)}px;
`;

const BottomNavButtons = styled.div`
  display: flex;
  padding: 0 8px;
`;

const TopNavButtons = styled.div`
  padding-right: 15px;
`;

const Label = styled.div`
  padding-left: 24px;
`;

const NavButton = styled(Button)`
  ${themeHelpers.expandTextPreset(({ label }, { MEDIUM }) => label[MEDIUM])}
  svg {
    width: 14px;
  }

  * + * {
    margin-left: 12px;
  }
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
  useEffect(() => {
    const innerEl = innerRef.current;
    const layoutEl = layoutRef.current;
    if (!innerEl || !layoutEl) {
      return () => {};
    }

    // Explicitly set height of container, and disconnect
    // inner content from layout flow.
    const { height } = innerEl.getBoundingClientRect();
    layoutEl.style.height = `${height}px`;
    innerEl.style.position = 'absolute';
    innerEl.style.bottom = 0;

    // Applying transition on separate frame as
    // animate property prevents any content flash.
    // Only way to guarentee frame after styles get
    // applied is to do 2 frames from now.
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(() => {
        layoutEl.style.transition = `0.3s height ${BEZIER.default}`;
      });
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // Listen to changes in inner content height and apply
  // them to the layout container to animate to those updates
  useEffect(() => {
    const innerEl = innerRef.current;
    if (!innerEl) {
      return () => {};
    }
    const observer = new ResizeObserver((entries) => {
      const measureEl = entries?.[0];
      const layoutEl = layoutRef.current;
      if (!measureEl || !layoutEl) {
        return;
      }
      layoutEl.style.height = `${measureEl.contentRect.height}px`;
    });
    observer.observe(innerEl);
    return () => observer.unobserve(innerEl);
  }, []);

  return (
    <Wrapper>
      <NavBar>
        <NavBarInner>
          <Label>{__('Quick Tips', 'web-stories')}</Label>
          <TopNavButtons>
            <NavButton
              onClick={onClose}
              type={BUTTON_TYPES.PLAIN}
              size={BUTTON_SIZES.SMALL}
              variant={BUTTON_VARIANTS.CIRCLE}
            >
              <Icons.Close />
            </NavButton>
          </TopNavButtons>
        </NavBarInner>
      </NavBar>
      <Layout ref={layoutRef}>
        <Content ref={innerRef}>
          <ContentInner hasBottomPadding={hasBottomNavigation}>
            <Container>{children}</Container>
          </ContentInner>
        </Content>
      </Layout>
      <BottomNavBar
        aria-hidden={hasBottomNavigation}
        isHidden={!hasBottomNavigation}
      >
        <NavBarInner>
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
            {Boolean(onPrev) && (
              <NavButton
                onClick={onPrev}
                type={BUTTON_TYPES.PLAIN}
                size={BUTTON_SIZES.SMALL}
                disabled={!hasBottomNavigation}
              >
                {__('Previous', 'web-stories')}
              </NavButton>
            )}
            {Boolean(onNext) && (
              <NavButton
                onClick={onNext}
                type={BUTTON_TYPES.PLAIN}
                size={BUTTON_SIZES.SMALL}
                disabled={!hasBottomNavigation}
              >
                {__('Next', 'web-stories')}
              </NavButton>
            )}
          </BottomNavButtons>
        </NavBarInner>
      </BottomNavBar>
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
