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
import { ReactComponent as WebStoriesLogoSVG } from '../../images/logo.svg';
import { BUTTON_TYPES, DROPDOWN_TYPES, paths } from '../../constants';
import { useConfig } from '../../app/config';
import { useRouteHistory } from '../../app/router';
import Dropdown from '../dropdown';
import { Nav, ActionLink } from './components';

const PageLinks = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
  margin-right: 40px;
  text-align: right;

  @media ${({ theme }) => theme.breakpoint.largeDisplayPhone} {
    display: none;
  }

  @media ${({ theme }) => theme.breakpoint.min} {
    justify-content: flex-end;
    display: ${({ pathCount = 0 }) => (pathCount > 1 ? 'flex' : 'none')};
    padding-right: 10px;
    padding-top: 10px;
    order: 3;
    width: 100%;
    margin-right: 0;
  }
`;

const Link = styled.a`
  font-family: ${({ theme }) => theme.fonts.tab.family};
  font-size: ${({ theme }) => theme.fonts.tab.size};
  line-height: ${({ theme }) => theme.fonts.tab.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.tab.letterSpacing};
  text-decoration: none;
  margin-left: 40px;
  color: ${({ theme, active }) =>
    active ? theme.colors.gray900 : theme.colors.gray600};

  @media ${({ theme }) => theme.breakpoint.min} {
    margin-left: 20px;
    font-size: ${({ theme }) => theme.fonts.tab.minSize};
  }
`;

const DropdownContainer = styled.div`
  display: none;

  @media ${({ theme }) => theme.breakpoint.largeDisplayPhone} {
    position: absolute;
    display: flex;
    left: 50%;
    transform: translateX(-50%);
  }

  @media ${({ theme }) => theme.breakpoint.min} {
    display: none;
  }
`;

const WebStoriesLogo = styled(WebStoriesLogoSVG)`
  width: 37px;
  height: 28px;
`;

export function MainNavBar() {
  const { state, actions } = useRouteHistory();
  const { newStoryURL } = useConfig();

  return (
    <Nav>
      <WebStoriesLogo />
      <DropdownContainer>
        <Dropdown
          ariaLabel={__('Dashboard Navigation', 'web-stories')}
          items={paths}
          value={state.currentPath}
          type={DROPDOWN_TYPES.TRANSPARENT_MENU}
          onChange={(path) => actions.push(path.value)}
        />
      </DropdownContainer>
      <PageLinks pathCount={paths.length}>
        {paths.map((path) => (
          <Link
            active={path.value === state.currentPath}
            key={path.value}
            href={`#${path.value}`}
          >
            {path.label}
          </Link>
        ))}
      </PageLinks>

      <ActionLink type={BUTTON_TYPES.CTA} href={newStoryURL} isLink={true}>
        {__('Create Story', 'web-stories')}
      </ActionLink>
    </Nav>
  );
}
