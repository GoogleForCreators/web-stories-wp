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

const StyledCheckbox = styled(Checkbox)`
  ${({ theme }) => `
    input[type='checkbox']&.${ThemeGlobals.FOCUS_VISIBLE_SELECTOR} ~ div, input[type='checkbox']:focus ~ div {
      box-shadow: 0px 0px 0 2px ${theme.colors.bg.secondary}, 0px 0px 0 4px ${theme.colors.border.focus} !important;
    }
  `}
`;

const Label = styled.label`
  margin-left: 12px;
`;

function LoopPanelContent({ loop, onChange }) {
  const checkboxId = `cb-${uuidv4()}`;

  return (
    <>
      <StyledCheckbox id={checkboxId} checked={loop} onChange={onChange} />
      <Label htmlFor={checkboxId}>
        <Text as="span" size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {__('Loop', 'web-stories')}
        </Text>
      </Label>
    </>
  );
}

LoopPanelContent.propTypes = {
  onChange: PropTypes.func.isRequired,
  loop: PropTypes.bool,
};

export default LoopPanelContent;
