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
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { Icons, Text } from '../../../../../../design-system';
import { focusStyle } from '../../../shared';

const COLOR_SIZE = 32;
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

const Note = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.secondary};
`;

function ColorAdd({ handleAddPreset, helper, ...rest }) {
  return (
    <>
      <AddColorAction
        onClick={handleAddPreset}
        aria-label={__('Add color', 'web-stories')}
        {...rest}
      >
        <Icons.Plus />
      </AddColorAction>
      {helper && <Note>{helper}</Note>}
    </>
  );
}

ColorAdd.propTypes = {
  helper: PropTypes.string,
  handleAddPreset: PropTypes.func.isRequired,
};

export default ColorAdd;
