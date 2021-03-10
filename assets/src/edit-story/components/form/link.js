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
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { isValidUrl, withProtocol } from '../../utils/url';
import { Input } from '../../../design-system';
import Row from './row';
import HelperText from './helperText';

const MIN_MAX = {
  URL: {
    MIN: 2,
    MAX: 2048, // Based on sitemaps url limits (safe side)
  },
};

function LinkInput({
  onChange,
  onBlur,
  onFocus,
  value,
  description,
  hint,
  hasError,
  ...rest
}) {
  const trimmedValue = (value || '').trim();
  const isValid = isValidUrl(withProtocol(trimmedValue));
  const isNotValid = trimmedValue.length > 0 && !isValid;
  return (
    <>
      {description && <HelperText>{description}</HelperText>}
      <Row>
        <Input
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
          {...rest}
        />
      </Row>
    </>
  );
}

LinkInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  description: PropTypes.string,
  hint: PropTypes.string,
  hasError: PropTypes.boolean,
};

export default LinkInput;
