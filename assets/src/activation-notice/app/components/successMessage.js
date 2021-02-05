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
import { useCallback } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { trackClick } from '../../../tracking';
import { useConfig } from '../config';

import Paragraph from './paragraph';
import SecondaryLink from './link';

const Message = styled.div`
  min-width: 260px;
  padding: 30px 0 30px;

  ${SecondaryLink} {
    @media ${({ theme }) => theme.breakpoint.tabletSmall} {
      display: none;
    }
  }
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.title.family};
  font-size: ${({ theme }) => theme.fonts.title.size};
  line-height: ${({ theme }) => theme.fonts.title.lineHeight};
  font-weight: ${({ theme }) => theme.fonts.title.fontWeight};
  color: ${({ theme }) => theme.colors.primary};
  margin: 0 0 10px;
`;

const PrimaryLink = styled.a`
  font-family: ${({ theme }) => theme.fonts.button.family};
  font-size: ${({ theme }) => theme.fonts.button.size};
  line-height: ${({ theme }) => theme.fonts.button.lineHeight};
  font-weight: ${({ theme }) => theme.fonts.button.fontWeight};
  background: ${({ theme }) => theme.colors.action.bg};
  color: ${({ theme }) => theme.colors.action.fg};
  padding: 5px 8px;
  cursor: pointer;
  text-decoration: none;
  border-radius: 2px;

  &:focus,
  &:hover {
    background: ${({ theme }) => theme.colors.action.hover.bg};
    color: ${({ theme }) => theme.colors.action.fg};
  }
`;

const ParagraphWithSpace = styled(Paragraph)`
  margin-bottom: 15px !important;
`;

function SuccessMessage() {
  const { dashboardURL, demoStoryURL } = useConfig();

  const onClickPrimary = useCallback(
    (evt) => {
      trackClick(evt, 'open_dashboard', 'activation-notice', dashboardURL);
    },
    [dashboardURL]
  );
  const onClickSecondary = useCallback(
    (evt) => {
      trackClick(evt, 'open_demo_story', 'activation-notice', demoStoryURL);
    },
    [demoStoryURL]
  );

  return (
    <Message>
      <Title>
        {__("You're all set!", 'web-stories')}
        <br />
        {__('Tell some stories.', 'web-stories')}
      </Title>
      <ParagraphWithSpace $secondary>
        {__('Welcome to Web Stories for WordPress.', 'web-stories')}
      </ParagraphWithSpace>
      <ParagraphWithSpace>
        <PrimaryLink href={dashboardURL} onClick={onClickPrimary}>
          {__('Go to Stories Dashboard', 'web-stories')}
        </PrimaryLink>
      </ParagraphWithSpace>
      <Paragraph>
        <SecondaryLink href={demoStoryURL} onClick={onClickSecondary}>
          {__('Read the Get Started story', 'web-stories')}
        </SecondaryLink>
      </Paragraph>
    </Message>
  );
}

export default SuccessMessage;
