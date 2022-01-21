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
import { createSolid } from '@googleforcreators/patterns';
/**
 * Internal dependencies
 */
import createNewElement from './createNewElement';

export const DEFAULT_PAGE_BACKGROUND_COLOR = createSolid(255, 255, 255);

const createPage = (pageProps = null) => {
  const backgroundElementProps = {
    // The values of x, y, width, height are irrelevant here, however, need to be set.
    x: 1,
    y: 1,
    width: 1,
    height: 1,
    mask: {
      type: 'rectangle',
    },
    isBackground: true,
    isDefaultBackground: true,
  };
  const backgroundElement = createNewElement('shape', backgroundElementProps);

  const newAttributes = {
    elements: [backgroundElement],
    backgroundColor: DEFAULT_PAGE_BACKGROUND_COLOR,
    ...pageProps,
  };

  return createNewElement('page', newAttributes);
};

export default createPage;
