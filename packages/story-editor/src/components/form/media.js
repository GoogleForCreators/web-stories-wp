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
import { useCallback, forwardRef } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import styled from 'styled-components';
import {
  MediaInput as Input,
  themeHelpers,
} from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useConfig } from '../../app';
import { MULTIPLE_VALUE } from '../../constants';

const StyledInput = styled(Input)`
  button:focus {
    ${({ theme }) =>
      themeHelpers.focusCSS(
        theme.colors.border.focus,
        theme.colors.bg.secondary
      )}
  }
`;

const MediaInputField = ({
  open,
  dropdownOptions,
  onChange,
  forwardedRef,
  value,
  ...rest
}) => {
  const onMenuOption = useCallback(
    (evt, opt) => {
      switch (opt) {
        case 'edit':
          open(evt);
          break;
        case 'remove':
        case 'reset':
          onChange(null);
          break;
        default:
          break;
      }
    },
    [onChange, open]
  );

  return (
    <StyledInput
      onMenuOption={onMenuOption}
      menuOptions={dropdownOptions}
      openMediaPicker={open}
      ref={forwardedRef}
      value={value === MULTIPLE_VALUE ? null : value}
      {...rest}
    />
  );
};

function MediaInput(
  {
    buttonInsertText = __('Choose an image', 'web-stories'),
    menuOptions = [],
    onChange,
    onChangeErrorText = __(
      'Unable to use this file type, please select a valid image type.',
      'web-stories'
    ),
    title = __('Choose an image', 'web-stories'),
    type = 'image',
    value,
    cropParams,
    ...rest
  },
  forwardedRef
) {
  const { MediaUpload } = useConfig();

  const renderMediaIcon = useCallback(
    (open) => {
      // Options available for the media input menu.
      const availableMenuOptions = [
        { label: __('Edit', 'web-stories'), value: 'edit' },
        { label: __('Remove', 'web-stories'), value: 'remove' },
        { label: __('Reset', 'web-stories'), value: 'reset' },
      ];

      // No menu for mixed value.
      // Match the options from props, if none are matched, menu is not displayed.
      const dropdownOptions =
        value === MULTIPLE_VALUE
          ? []
          : availableMenuOptions.filter(({ value: option }) =>
              menuOptions.includes(option)
            );

      return (
        <MediaInputField
          open={open}
          onChange={onChange}
          dropdownOptions={dropdownOptions}
          forwardedRef={forwardedRef}
          value={value}
          {...rest}
        />
      );
    },
    [value, onChange, forwardedRef, rest, menuOptions]
  );

  return (
    <MediaUpload
      title={title}
      buttonInsertText={buttonInsertText}
      onSelect={onChange}
      onSelectErrorMessage={onChangeErrorText}
      type={type}
      cropParams={cropParams}
      render={renderMediaIcon}
    />
  );
}

const MediaInputWithRef = forwardRef(MediaInput);

MediaInputField.propTypes = {
  open: PropTypes.func,
  dropdownOptions: PropTypes.array,
  onChange: PropTypes.func,
  forwardedRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.elementType }),
  ]),
  value: PropTypes.string,
};

MediaInput.propTypes = {
  className: PropTypes.string,
  buttonInsertText: PropTypes.string,
  menuOptions: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  onChangeErrorText: PropTypes.string,
  type: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  cropParams: PropTypes.object,
  title: PropTypes.string,
  value: PropTypes.string,
};

export default MediaInputWithRef;
