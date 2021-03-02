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

const MediaInput = forwardRef(
  (
    {
      hasMenu = false,
      onChange,
      title = __('Choose an image', 'web-stories'),
      buttonInsertText = __('Choose an image', 'web-stories'),
      type = 'image',
      ...rest
    },
    forwardedRef
  ) => {
    const openMediaPicker = useMediaPicker({
      title,
      buttonInsertText,
      onSelect: onChange,
      type,
    });

    const dropdownOptions = hasMenu
      ? [
          { name: __('Edit', 'web-stories'), value: 'edit' },
          { name: __('Reset', 'web-stories'), value: 'reset' },
        ]
      : null;

    const onOption = useCallback(
      (opt, evt) => {
        switch (opt) {
          case 'edit':
            openMediaPicker(evt);
            break;
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
        {...rest}
      />
    );
  }
);

MediaInput.propTypes = {
  canReset: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  buttonInsertText: PropTypes.string,
  title: PropTypes.string,
};

export default MediaInput;
