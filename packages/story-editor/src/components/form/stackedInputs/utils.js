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
import { __ } from '@web-stories-wp/i18n';

const getInputLabel = (key) => {
  switch (key) {
    case 'topRight':
      return __('Top right corner radius', 'web-stories');

    case 'bottomRight':
      return __('Bottom right corner radius', 'web-stories');

    case 'bottomLeft':
      return __('Bottom left corner radius', 'web-stories');

    case 'top':
      return __('Top border', 'web-stories');

    case 'right':
      return __('Right border', 'web-stories');

    case 'bottom':
      return __('Bottom border', 'web-stories');

    default:
      return key;
  }
};

export const getStackedInputValues = (values, key, fallback) => {
  const keyExists = values[key] !== undefined;

  return {
    key: keyExists ? key : fallback,
    props: keyExists ? values[key] : values[fallback],
    label: getInputLabel(keyExists ? key : fallback),
  };
};
