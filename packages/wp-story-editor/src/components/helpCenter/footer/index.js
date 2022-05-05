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
import { __ } from '@googleforcreators/i18n';
import { useCallback } from '@googleforcreators/react';
import { trackClick } from '@googleforcreators/tracking';
import {
  themeHelpers,
  Link as DsLink,
  THEME_CONSTANTS,
  Text,
} from '@googleforcreators/design-system';

const Panel = styled.div`
  padding: 16px 0 24px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.bg.tertiary};
`;

const Links = styled.ul`
  margin: 8px 0 0 0;
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
  &,
  & > * {
    font-weight: 700;
  }
`;

function Link({ children, ...props }) {
  return (
    <ListItem>
      <DsLink {...props} size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
        {children}
      </DsLink>
    </ListItem>
  );
}

Link.propTypes = {
  children: PropTypes.node,
};

const SUPPORT_URL = __(
  'https://wordpress.org/support/plugin/web-stories/',
  'web-stories'
);

const YOUTUBE_URL = __(
  'https://youtube.com/playlist?list=PLfVPq9A6B0RNoQ3HTE9LQzgAdVzcb7tmt',
  'web-stories'
);

const DOCS_URL = 'https://wp.stories.google/docs/getting-started/';

export default function Footer() {
  const onSupportClick = useCallback((evt) => {
    trackClick(evt, 'click_support_page');
  }, []);

  const onDocsClick = useCallback((evt) => {
    trackClick(evt, 'click_website_docs');
  }, []);

  const onYouTubeClick = useCallback((evt) => {
    trackClick(evt, 'click_storytime_channel');
  }, []);

  return (
    <Panel>
      <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
        {__(
          'Discover more resources to get the most out of Web Stories. Read our start guide or visit our support forum to get answers to your questions.',
          'web-stories'
        )}
      </Text>
      <Links>
        <Link
          href={DOCS_URL}
          target="_blank"
          rel="noreferrer"
          onClick={onDocsClick}
        >
          {__('Read Start Guide', 'web-stories')}
        </Link>
        <Link
          href={SUPPORT_URL}
          target="_blank"
          rel="noreferrer"
          onClick={onSupportClick}
        >
          {__('Visit Support Forums', 'web-stories')}
        </Link>
        <Link
          href={YOUTUBE_URL}
          target="_blank"
          rel="noreferrer"
          onClick={onYouTubeClick}
        >
          {__('Storytime YouTube Series', 'web-stories')}
        </Link>
      </Links>
    </Panel>
  );
}
