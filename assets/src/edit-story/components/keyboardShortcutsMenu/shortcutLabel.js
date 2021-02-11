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

/**
 * Internal dependencies
 */
import { ShortcutKeyWrapper, ShortcutKey, ShortcutKeyLabel } from './styled';
import { KEY_SIZE } from './constants';

function ShortCutLabel({ keys, alignment = 'center', ...rest }) {
  const commands = useMemo(
    () =>
      keys.map((key, index) =>
        key.label ? (
          // Disable reason: some keys consist of just a word, e.g. "or" -- there is nothing else than index unique in these.
          // eslint-disable-next-line react/no-array-index-key
          <ShortcutKeyLabel key={`${key.label}-${index}`}>
            {key.label}
          </ShortcutKeyLabel>
        ) : (
          <ShortcutKey
            key={JSON.stringify(key)}
            aria-label={key.title}
            title={key.title}
            keySize={
              (key.symbol || key).length > 1 ? KEY_SIZE.LARGE : KEY_SIZE.NORMAL
            }
          >
            {key.symbol || key}
          </ShortcutKey>
        )
      ),
    [keys]
  );

  return (
    <ShortcutKeyWrapper alignment={alignment} {...rest}>
      {commands}
    </ShortcutKeyWrapper>
  );
}

ShortCutLabel.propTypes = {
  keys: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        title: PropTypes.string,
        label: PropTypes.string,
        symbol: PropTypes.string,
      }),
    ])
  ),
  alignment: PropTypes.oneOf(['left', 'center', 'right']),
};

export default ShortCutLabel;
