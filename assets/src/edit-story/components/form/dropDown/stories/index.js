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

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { useState } from 'react';
import DropDown from '../';

export default {
  title: 'Stories Editor/Components/DropDown',
  component: DropDown,
};

export const _default = () => {
  const [fontStyle, setFontStyle] = useState('normal');
  const fontStyles = [
    { name: __('Normal', 'web-stories'), value: 'normal' },
    { name: __('Italic', 'web-stories'), value: 'italic' },
    { name: __('Underline', 'web-stories'), value: 'underline' },
  ];

  return (
    <DropDown
      aria-label={__('Font style', 'web-stories')}
      options={fontStyles}
      value={fontStyle}
      onChange={(value) => setFontStyle(value)}
    />
  );
};
