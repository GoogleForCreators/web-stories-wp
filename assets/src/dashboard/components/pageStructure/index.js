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
import Button from '../button';
import { useRouteHistory } from '../../app/router';
import { useConfig } from '../../app/config';
import { BUTTON_TYPES, primaryPaths, secondaryPaths } from '../../constants';
import {
  AppInfo,
  Content,
  LeftRailContainer,
  LogoPlaceholder,
  NavLink,
  Rule,
} from './navigationComponents';

export const AppFrame = styled.div`
  display: flex;
  flex-direction: row;
  height: inherit;
`;

export const PageContent = styled.div`
  position: relative;
  width: 100%;
  padding-left: max(15%, 190px);
  height: inherit;
`;

export function LeftRail() {
  const { state } = useRouteHistory();
  const { newStoryURL, version } = useConfig();

  return (
    <LeftRailContainer>
      <div>
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
