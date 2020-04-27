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

import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { useCallback, useRef } from 'react';
import Button from '../button';
import { useRouteHistory } from '../../app/router';
import { useConfig } from '../../app/config';
import { BUTTON_TYPES, primaryPaths, secondaryPaths } from '../../constants';
import useFocusOut from '../../utils/useFocusOut';
import {
  AppInfo,
  Content,
  LogoPlaceholder,
  NavLink,
  Rule,
} from './navigationComponents';
import { useNavContext } from './navProvider';

export const AppFrame = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export const PageContent = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: max(15%, 190px);
`;

export const LeftRailContainer = styled.nav`
  position: absolute;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  top: 0;
  bottom: 0;
  width: max(15%, 190px);
  background: ${({ theme }) => theme.colors.white};
  border-right: ${({ theme }) => theme.leftRail.border};
  z-index: 2;
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
    visibility 0.25s linear;

  @media ${({ theme }) => theme.breakpoint.tablet} {
    padding-left: 0;
    visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
    transform: translateX(${({ isOpen }) => (isOpen ? 'none' : `-100%`)});
  }
`;

export function LeftRail() {
  const leftRailRef = useRef(null);
  const upperContentRef = useRef(null);
  const { state } = useRouteHistory();
  const { newStoryURL, version } = useConfig();
  const {
    state: { sideBarVisible },
    actions: { toggleSideBar },
  } = useNavContext();

  const onContainerClickCapture = useCallback(
    ({ target }) => {
      if (
        target === leftRailRef.current ||
        target === upperContentRef.current
      ) {
        return;
      }
      toggleSideBar();
    },
    [toggleSideBar, leftRailRef, upperContentRef]
  );

  const handleSideBarClose = useCallback(() => {
    if (sideBarVisible) {
      toggleSideBar();
    }
  }, [toggleSideBar, sideBarVisible]);

  useFocusOut(leftRailRef, handleSideBarClose, [sideBarVisible]);

  return (
    <LeftRailContainer
      onClickCapture={onContainerClickCapture}
      ref={leftRailRef}
      isOpen={sideBarVisible}
    >
      <div ref={upperContentRef}>
        <LogoPlaceholder />
        <Content>
          <Button type={BUTTON_TYPES.CTA} href={newStoryURL} isLink>
            {__('Create New Story', 'web-stories')}
          </Button>
        </Content>
        <Content>
          {primaryPaths.map((path) => (
            <NavLink
              active={path.value === state.currentPath}
              key={path.value}
              href={`#${path.value}`}
            >
              {path.label}
            </NavLink>
          ))}
        </Content>
        <Rule />
        <Content>
          {secondaryPaths.map((path) => (
            <NavLink
              active={path.value === state.currentPath}
              key={path.value}
              href={`#${path.value}`}
            >
              {path.label}
            </NavLink>
          ))}
        </Content>
      </div>
      <Content>
        <AppInfo>
          {__('\u00A9 Google 2020', 'web-stories')}
          <br />
          {__('Version', 'web-stories')}&nbsp;
          {version}
        </AppInfo>
      </Content>
    </LeftRailContainer>
  );
}
