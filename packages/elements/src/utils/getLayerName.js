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
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import getDefinitionForType from './getDefinitionForType';

/** @typedef {import('../types').Element} Element */

/**
 * Returns the layer name based on the element properties.
 *
 * @param {Element} element Element.
 * @return {string} Layer name.
 */
function getLayerName(element) {
  if (element.isBackground) {
    return __('Background', 'web-stories');
  }

  /* TODO: Enable this when layers can have names:
  if (element.layerName) {
    return element.layerName;
  }
  */

  return getDefinitionForType(element.type).getLayerText(element);
}

export default getLayerName;
