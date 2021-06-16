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
 * Internal dependencies
 */
import { GRID_VARIANT } from '../constants';

/**
 *
 * @param {string} gridVariant passed in from card, found based on card type and thumbnail count
 * @return {string} to be used as css value of `grid-template-areas`
 */
export const getGridTemplateAreas = (gridVariant) => {
  switch (gridVariant) {
    case GRID_VARIANT.SINGLE:
      return "'title title' 'cta thumbnail' 'helper helper'";
    case GRID_VARIANT.SINGLE_WITH_THUMBNAIL:
      return "'title thumbnail' 'cta thumbnail' 'helper helper'";

    default:
      return "'title thumbnail' 'cta thumbnail' 'helper helper'";
  }
};
