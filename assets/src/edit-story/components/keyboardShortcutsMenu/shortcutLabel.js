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
 * Internal dependencies
 */
import { Text, THEME_CONSTANTS } from '../../../design-system';
import { KEY_SIZE } from './constants';

const Wrapper = styled.dd`
  display: flex;
  justify-content: ${({ alignment }) => alignment};
  align-items: center;
  margin: 0;
`;

const KeyboardKey = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL,
})`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ keySize }) => keySize}px;
  height: 24px;
  border-radius: ${({ theme }) => theme.borders.radius.medium};
  border: 1px solid ${({ theme }) => theme.colors.border.defaultNormal};
  color: ${({ theme }) => theme.colors.fg.primary};

  & + & {
    margin-left: 2px;
  }
`;

const TextOnly = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.X_SMALL,
})`
  color: ${({ theme }) => theme.colors.fg.tertiary};
  margin: 0 4px;
`;

function ShortCutLabel({ keys, alignment = 'center', ...rest }) {
  return (
    <Wrapper alignment={alignment} {...rest}>
      {keys.map((key, index) =>
        key.label ? (
          // Disable reason: some keys consist of just a word, e.g. "or" -- there is nothing else than index unique in these.
          // eslint-disable-next-line react/no-array-index-key
          <TextOnly key={`${key.label}-${index}`}>{key.label}</TextOnly>
        ) : (
          <KeyboardKey
            key={JSON.stringify(key)}
            aria-label={key.title}
            title={key.title}
            keySize={
              (key.symbol || key).length > 1 ? KEY_SIZE.LARGE : KEY_SIZE.NORMAL
            }
          >
            {key.symbol || key}
          </KeyboardKey>
        )
      )}
    </Wrapper>
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
