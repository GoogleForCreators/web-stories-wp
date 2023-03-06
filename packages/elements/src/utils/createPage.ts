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
import { v4 as uuidv4 } from 'uuid';

/**
 * Internal dependencies
 */
import { DEFAULT_PAGE_BACKGROUND_COLOR } from '../constants';
import { ElementType, type Page } from '../types';
import createNewElement from './createNewElement';

const createPage = (pageProps: Partial<Page> | null = null): Page => {
  const backgroundElementProps = {
    // The values of x, y, width, height are irrelevant here, however, need to be set.
    x: 1,
    y: 1,
    width: 1,
    height: 1,
    rotationAngle: 0,
    mask: {
      type: 'rectangle',
    },
    isBackground: true,
    isDefaultBackground: true,
  };
  const backgroundElement = createNewElement(
    ElementType.Shape,
    backgroundElementProps
  );

  const page: Page = {
    elements: [backgroundElement],
    backgroundColor: DEFAULT_PAGE_BACKGROUND_COLOR,
    ...pageProps,
    // id must be overridden even if present in partial
    id: uuidv4(),
  };

  return page;
};

export default createPage;
