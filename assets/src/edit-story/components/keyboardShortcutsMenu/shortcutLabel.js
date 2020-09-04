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
import { useMemo } from 'react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { Label, ShortcutKeyWrapper, ShortcutKey } from './components';
import { KEY_SIZE } from './constants';

const StyledLabel = styled(Label)`
  margin: 0 8px;
`;

function ShortCutLabel({ keys, alignment = 'center' }) {
  const commands = useMemo(
    () =>
      keys.map((key, index) =>
        key.label ? (
          <StyledLabel key={index}>{key.label}</StyledLabel>
        ) : (
          <ShortcutKey
            key={index}
            keySize={key.length > 1 ? KEY_SIZE.LARGE : KEY_SIZE.NORMAL}
          >
            {key}
          </ShortcutKey>
        )
      ),
    [keys]
  );

  return (
    <ShortcutKeyWrapper alignment={alignment}>{commands}</ShortcutKeyWrapper>
  );
}

ShortCutLabel.propTypes = {
  keys: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  ),
  alignment: PropTypes.oneOf(['left', 'center', 'right']),
};

export default ShortCutLabel;
