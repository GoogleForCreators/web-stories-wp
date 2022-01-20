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
import styled from 'styled-components';
import { __ } from '@googleforcreators/i18n';
import {
  themeHelpers,
  Text,
  THEME_CONSTANTS,
} from '@googleforcreators/design-system';

const Panel = styled.div`
  padding: 24px 0 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.bg.tertiary};
`;

const Heading = styled.h1`
  ${themeHelpers.expandTextPreset(({ label }, { MEDIUM }) => label[MEDIUM])}
  color: ${({ theme }) => theme.colors.fg.primary};
  line-height: 32px;
  margin: 0 0 8px 0;
`;

export function Header() {
  return (
    <Panel>
      <Heading as="h2">{__('Web Stories Help Center', 'web-stories')}</Heading>
      <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL}>
        {__(
          'Discover tips & resources to help you get the most out of your Web Stories.',
          'web-stories'
        )}
      </Text>
    </Panel>
  );
}
