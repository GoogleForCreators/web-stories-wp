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
import { __ } from '@web-stories-wp/i18n';
import styled from 'styled-components';
/**
 * Internal dependencies
 */
import { Icons, Text, THEME_CONSTANTS } from '../../../design-system';
import { useCategoryCount } from './checkCountContext';
import { ISSUE_TYPES } from './constants';

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: 113px 64px;
  width: 308px;
  margin: 0 auto 32px;

  & > * {
    display: flex;
    align-self: center;
    justify-self: center;
    color: ${({ theme }) => theme.colors.fg.secondary};
  }

  p {
    width: 226px;
    text-align: center;
  }
`;

const IconContainer = styled.div`
  height: 50px;
  width: 50px;
`;

export const EmptyContent = () => {
  return (
    <Wrapper>
      <IconContainer>
        <Icons.CheckmarkCircle />
      </IconContainer>
      <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        {__(
          'You are all set for now. Return to this checklist as you build your Web Story for tips on how to improve it.',
          'web-stories'
        )}
      </Text>
    </Wrapper>
  );
};

const EmptyContentCheck = () => {
  const accessibilityCount = useCategoryCount(ISSUE_TYPES.ACCESSIBILITY);
  const designCount = useCategoryCount(ISSUE_TYPES.DESIGN);
  const priorityCount = useCategoryCount(ISSUE_TYPES.PRIORITY);

  return accessibilityCount + designCount + priorityCount === 0 ? (
    <EmptyContent />
  ) : null;
};

export default EmptyContentCheck;
