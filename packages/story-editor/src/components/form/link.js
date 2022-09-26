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
import PropTypes from 'prop-types';
import { forwardRef } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import { Input } from '@googleforcreators/design-system';
import { isValidUrl, withProtocol } from '@googleforcreators/url';

/**
 * Internal dependencies
 */
import { inputContainerStyleOverride } from '../panels/shared/styles';
import Row from './row';

const MIN_MAX = {
  URL: {
    MIN: 2,
    MAX: 2048, // Based on sitemaps url limits (safe side)
  },
};

const LinkInput = forwardRef(function LinkInput(
  { onChange, onBlur, onFocus, value = '', hint, hasError, ...rest },
  ref
) {
  const trimmedValue = (value || '').trim();
  const isValid = isValidUrl(withProtocol(trimmedValue));
  const isNotValid = trimmedValue.length > 0 && !isValid;
  return (
    <Row>
      <Input
        ref={ref}
        placeholder={__('Web address', 'web-stories')}
        onChange={(evt) => onChange(evt.target.value)}
        onBlur={() => {
          if (trimmedValue?.length) {
            const urlWithProtocol = withProtocol(trimmedValue);
            if (urlWithProtocol !== trimmedValue) {
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
        hasError={isNotValid || hasError}
        hint={isNotValid ? __('Invalid web address.', 'web-stories') : hint}
        containerStyleOverride={inputContainerStyleOverride}
        {...rest}
      />
    </Row>
  );
});

LinkInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  hint: PropTypes.string,
  hasError: PropTypes.bool,
};

export default LinkInput;
