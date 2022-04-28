/*
 * Copyright 2021 Google LLC
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
import {
  ELEMENT_TYPES,
  getDefinitionForType,
} from '@googleforcreators/elements';

export const SELECTED_ELEMENT_TYPES = {
  ...ELEMENT_TYPES,
  MULTIPLE: 'multiple',
  NONE: 'none',
};

export function hasDesignMenu(type) {
  switch (type) {
    case SELECTED_ELEMENT_TYPES.MULTIPLE:
      return true;
    case SELECTED_ELEMENT_TYPES.NONE:
      return false;
    default:
      return getDefinitionForType(type)?.hasDesignMenu;
  }
}
