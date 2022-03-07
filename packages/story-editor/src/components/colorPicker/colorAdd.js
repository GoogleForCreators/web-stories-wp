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
import PropTypes from 'prop-types';
import { __ } from '@googleforcreators/i18n';
import { Icons } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { focusStyle } from '../panels/shared';
import useAddPreset from '../../utils/useAddPreset';
import { PRESET_TYPES } from '../../constants';

const COLOR_SIZE = 24;
const AddColorAction = styled.button`
  cursor: pointer;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.fg.primary};
  border-color: ${({ theme }) => theme.colors.border.defaultNormal};
  border-width: 1px;
  border-style: dashed;
  border-radius: 50%;
  height: ${COLOR_SIZE}px;
  width: ${COLOR_SIZE}px;
  padding: 0;
  svg {
    height: 100%;
    width: 100%;
  }
  :hover {
    border-color: ${({ theme }) => theme.colors.border.defaultHover};
  }
  ${focusStyle};
`;

function ColorAdd({
  isLocal = false,
  isGlobal = false,
  isBackground = false,
  ...props
}) {
  const { addGlobalPreset, addLocalPreset } = useAddPreset({
    presetType: PRESET_TYPES.COLOR,
    isBackgroundColor: isBackground,
  });
  if (!isLocal && !isGlobal) {
    return null;
  }

  const label = isLocal
    ? __('Add local color', 'web-stories')
    : __('Add global color', 'web-stories');

  return (
    <AddColorAction
      tabIndex="0"
      onClick={isLocal ? addLocalPreset : addGlobalPreset}
      aria-label={label}
      {...props}
    >
      <Icons.Plus />
    </AddColorAction>
  );
}

ColorAdd.propTypes = {
  isLocal: PropTypes.bool,
  isGlobal: PropTypes.bool,
  isBackground: PropTypes.bool,
};

export default ColorAdd;
