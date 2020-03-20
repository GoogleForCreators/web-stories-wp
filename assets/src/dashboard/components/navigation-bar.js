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
import { useRouteHistory } from '../app/router';
import { ReactComponent as WebStoriesLogoSVG } from '../images/logo.svg';
import { BUTTON_TYPES } from '../constants';
import Button from './button';
import Dropdown from './dropdown';

const Link = styled.a`
  font-family: ${({ theme }) => theme.fonts.tab.family};
  font-size: ${({ theme }) => theme.fonts.tab.size};
  line-height: ${({ theme }) => theme.fonts.tab.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.tab.letterSpacing};
  text-decoration: none;
  margin-left: 40px;
  color: ${({ theme, active }) =>
    active ? theme.colors.gray900 : theme.colors.gray500};
`;

const DropdownContainer = styled.div`
  display: none;
`;

const Nav = styled.nav`
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-direction: row;
  padding: 20px;

  @media (max-width: 800px) {
    ${Link} {
      display: none;
    }
    ${DropdownContainer} {
      display: block;
    }
  }
`;

const WebStoriesLogo = styled(WebStoriesLogoSVG)`
  width: 37px;
  height: 28px;
  margin-right: 95px;
`;

const LinksContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;

  button {
    margin-left: 40px;
  }
`;

const paths = [
  { value: '/', label: __('My Stories', 'web-stories') },
  {
    value: '/templates-gallery',
    label: __('Templates Gallery', 'web-stories'),
  },
  { value: '/my-bookmarks', label: __('My Bookmarks', 'web-stories') },
];

function NavigationBar() {
  const { state, actions } = useRouteHistory();
  return (
    <Nav>
      <WebStoriesLogo />
      <DropdownContainer>
        <Dropdown
          transparent
          ariaLabel="Dashboard Navigation"
          items={paths}
          value={state.currentPath}
          onChange={(path) => actions.push(path.value)}
        />
      </DropdownContainer>
      <LinksContainer>
        {paths.map((path) => (
          <Link
            active={path.value === state.currentPath}
            key={path.value}
            href={`#${path.value}`}
          >
            {path.label}
          </Link>
        ))}
        <Button
          type={BUTTON_TYPES.CTA}
          onClick={() =>
            (window.location.href = 'post-new.php?post_type=web-story')
          }
        >
          {__('Create Story', 'web-stories')}
        </Button>
      </LinksContainer>
    </Nav>
  );
}

export default NavigationBar;
