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

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { AddColor } from '../../../../../icons';

const COLOR_SIZE = 30;
const AddColorAction = styled.button`
  cursor: pointer;
  background-color: transparent;
  border-color: transparent;
  border-width: 0;
  height: ${COLOR_SIZE}px;
  width: ${COLOR_SIZE}px;
  padding: 0;
  svg {
    height: 100%;
    width: 100%;
  }
`;

// @todo Use color from design system when theme reference changes.
const Note = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.fg.secondary};
  margin-bottom: 10px;
`;

function ColorAdd({ handleAddPreset, helper, ...rest }) {
  return (
    <>
      <AddColorAction
        onClick={handleAddPreset}
        aria-label={__('Add color', 'web-stories')}
        {...rest}
      >
        <AddColor />
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
