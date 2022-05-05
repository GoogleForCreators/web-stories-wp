/*
 * Copyright 2022 Google LLC
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
import { v4 as uuidv4 } from 'uuid';
import { __ } from '@googleforcreators/i18n';
import {
  Checkbox,
  Text,
  THEME_CONSTANTS,
  ThemeGlobals,
} from '@googleforcreators/design-system';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useInitializedValue } from '@googleforcreators/react';

const StyledCheckbox = styled(Checkbox)`
  ${({ theme }) => `
    input[type='checkbox']&.${ThemeGlobals.FOCUS_VISIBLE_SELECTOR} ~ div, input[type='checkbox']:focus ~ div {
      box-shadow: 0px 0px 0 2px ${theme.colors.bg.secondary}, 0px 0px 0 4px ${theme.colors.border.focus} !important;
    }
  `}
`;

const Wrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

function LoopPanelContent({ loop, className = '', onChange, ...props }) {
  const checkboxId = useInitializedValue(() => `cb-${uuidv4()}`);

  return (
    <Wrapper className={className}>
      <StyledCheckbox
        id={checkboxId}
        checked={loop}
        onChange={onChange}
        {...props}
      />
      <Text
        as="label"
        size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}
        htmlFor={checkboxId}
      >
        {__('Loop', 'web-stories')}
      </Text>
    </Wrapper>
  );
}

LoopPanelContent.propTypes = {
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  loop: PropTypes.bool,
};

export default LoopPanelContent;
