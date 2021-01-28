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
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import styled, { css } from 'styled-components';

/**
 * Internal dependencies
 */
import { themeHelpers, THEME_CONSTANTS } from '../../theme';
import { Text } from '../typography';

const StyledAutocomplete = styled(Autocomplete)(
  ({ theme }) => css`
    .MuiAutocomplete-fullWidth,
    .MuiAutocomplete-root,
    .MuiAutocomplete-input {
      height: 36px;
      padding: 0 !important;
    }
    .MuiInputBase-root {
      padding: 8px 12px;
      height: 36px;
      border-radius: ${theme.borders.radius.small};
      color: ${theme.colors.fg.primary};
      background-color: ${theme.colors.bg.primary};
      ${themeHelpers.expandPresetStyles({
        preset:
          theme.typography.presets.paragraph[
            THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL
          ],
        theme,
      })}
      &:hover {
        border: 1px solid ${theme.colors.border.defaultHover};
      }
    }
    .MuiAutocomplete-input {
      padding: 0;
      height: 100%;
    }
  `
);

const Typeahead = ({ options, label, ...rest }) => {
  const uuid = useMemo(() => `list-${uuidv4()}`, []);
  return (
    <>
      <Text>{label}</Text>
      <StyledAutocomplete
        id={uuid}
        options={options}
        getOptionLabel={(option) => option?.label}
        fullWidth={true}
        renderInput={(params) => <TextField {...params} variant="outlined" />}
        {...rest}
      />
    </>
  );
};

Typeahead.propTypes = {
  options: PropTypes.array.isRequired,
  label: PropTypes.string,
};
export default Typeahead;
