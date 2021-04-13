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
import { __ } from '@web-stories-wp/i18n';
import { useCallback } from 'react';

/**
 * Internal dependencies
 */
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  THEME_CONSTANTS,
  Text,
  themeHelpers,
} from '../../../../../design-system';
import { ReactComponent as Icon } from './illustration.svg';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  height: ${({ pageSize }) => pageSize.containerHeight}px;
  width: ${({ pageSize }) => pageSize.width}px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transform: ${({ translateX, translateY }) =>
    `translateX(${translateX}px) translateY(${translateY}px)`};

  ${themeHelpers.focusableOutlineCSS};
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 106px;
`;

const StyledText = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

function TemplateSave({ pageSize }) {
  const handleSaveTemplate = useCallback(() => {}, []);
  return (
    <Wrapper pageSize={pageSize}>
      <IconWrapper>
        <Icon />
      </IconWrapper>
      <StyledText size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
        {__('Save current page as template', 'web-stories')}
      </StyledText>
      <Button
        onClick={handleSaveTemplate}
        variant={BUTTON_VARIANTS.SQUARE}
        type={BUTTON_TYPES.TERTIARY}
        size={BUTTON_SIZES.MEDIUM}
        aria-label={__('Save new template', 'web-stories')}
      >
        {__('Save', 'web-stories')}
      </Button>
    </Wrapper>
  );
}

export default TemplateSave;
