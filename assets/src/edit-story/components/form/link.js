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
import { withProtocol } from '../../utils/url';
import Row from './row';
import TextInput from './text';
import HelperText from './helperText';

const MIN_MAX = {
  URL: {
    MIN: 2,
    MAX: 2048, // Based on sitemaps url limits (safe side)
  },
};

const BoxedTextInput = styled(TextInput)`
  padding: 6px 6px;
  border-radius: 4px;
  flex-grow: 1;
`;

const Error = styled.span`
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.colors.warning};
`;

function LinkInput({
  onChange,
  onBlur,
  onFocus,
  value,
  isValidUrl,
  description,
  ...rest
}) {
  return (
    <>
      {description && <HelperText>{description}</HelperText>}
      <Row>
        <BoxedTextInput
          placeholder={__('Web address', 'web-stories')}
          onChange={onChange}
          onBlur={(atts = {}) => {
            const { onClear } = atts;
            // If the onBlur is not clearing the field, add protocol.
            if (value.length > 0 && !onClear) {
              const urlWithProtocol = withProtocol(value);
              if (urlWithProtocol !== value) {
                onChange(urlWithProtocol);
              }
            }
            if (onBlur) {
              onBlur();
            }
          }}
          onFocus={onFocus}
          value={value || ''}
          minLength={MIN_MAX.URL.MIN}
          maxLength={MIN_MAX.URL.MAX}
          {...rest}
        />
      </Row>
      {value.length > 0 && !isValidUrl && (
        <Row>
          <Error>{__('Invalid web address.', 'web-stories')}</Error>
        </Row>
      )}
    </>
  );
}

LinkInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  isValidUrl: PropTypes.bool.isRequired,
  description: PropTypes.string,
};

export default LinkInput;
