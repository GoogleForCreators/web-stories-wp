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
import styled from 'styled-components';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import { themeHelpers } from '../../../../design-system';

const Panel = styled.div`
  padding: 16px 0 24px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.bg.tertiary};
`;

const Caption = styled.p`
  ${themeHelpers.expandTextPreset(
    ({ paragraph }, { X_SMALL }) => paragraph[X_SMALL]
  )}
  margin-bottom: 8px;
`;

const Links = styled.ul`
  margin: 0;
  padding: 0;
  list-style-position: inside;
  list-style-type: none;
`;

const ListItem = styled.li`
  ${themeHelpers.expandTextPreset(
    ({ paragraph }, { X_SMALL }) => paragraph[X_SMALL]
  )}
  &::before {
    content: '- ';
  }
`;

const Anchor = styled.a`
  ${themeHelpers.focusableOutlineCSS}
  font-weight: 700;
  color: ${({ theme }) => theme.colors.accent.secondary};
  text-decoration: none;
`;

function Link({ children, ...props }) {
  return (
    <ListItem>
      <Anchor {...props}>{children}</Anchor>
    </ListItem>
  );
}

Link.propTypes = {
  children: PropTypes.node,
};

export function Footer() {
  return (
    <Panel>
      <Caption>
        {__(
          'Discover more resources to get the most out of Web Stories. Read our start guide or visit our support forum to get answers to your questions.',
          'web-stories'
        )}
      </Caption>
      <Links>
        <Link href="#">{__('Read start guide', 'web-stories')}</Link>
        <Link href="#">{__('Visit support forum', 'web-stories')}</Link>
        <Link href="#">{__('Stories Youtube Channel', 'web-stories')}</Link>
      </Links>
    </Panel>
  );
}
