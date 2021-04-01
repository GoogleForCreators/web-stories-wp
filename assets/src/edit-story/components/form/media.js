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
import { useCallback, forwardRef } from 'react';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import { useMediaPicker } from '../mediaPicker';
import { MediaInput as Input } from '../../../design-system/components/mediaInput';
import { MULTIPLE_VALUE } from '../../constants';

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
    ...rest
  },
  forwardedRef
) {
  const openMediaPicker = useMediaPicker({
    title,
    buttonInsertText,
    onSelect: onChange,
    onSelectErrorMessage: onChangeErrorText,
    type,
  });

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

  const onOption = useCallback(
    (evt, opt) => {
      switch (opt) {
        case 'edit':
          openMediaPicker(evt);
          break;
        case 'remove':
        case 'reset':
          onChange(null);
          break;
        default:
          break;
      }
    },
    [onChange, openMediaPicker]
  );

  return (
    <Input
      onMenuOption={onOption}
      menuOptions={dropdownOptions}
      openMediaPicker={openMediaPicker}
      ref={forwardedRef}
      value={value === MULTIPLE_VALUE ? null : value}
      {...rest}
    />
  );
}

const MediaInputWithRef = forwardRef(MediaInput);

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
  title: PropTypes.string,
  value: PropTypes.string,
};

export default MediaInputWithRef;
