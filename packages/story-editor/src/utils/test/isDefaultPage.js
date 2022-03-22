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
import { createSolid } from '@googleforcreators/patterns';
import { createPage, registerElementType } from '@googleforcreators/elements';
import { elementTypes } from '@googleforcreators/element-library';

/**
 * Internal dependencies
 */
import isDefaultPage from '../isDefaultPage';

describe('isDefaultPage', () => {
  beforeAll(() => {
    elementTypes.forEach(registerElementType);
  });

  it('should return true with base page', () => {
    const page = createPage();
    expect(isDefaultPage(page)).toBeTrue();
  });

  it('should return false with custom background color', () => {
    const page = createPage({
      backgroundColor: createSolid(0, 0, 0),
    });
    expect(isDefaultPage(page)).toBeFalse();
  });

  it('should return false with additional elements', () => {
    const page = createPage();
    page.elements.push({});
    expect(isDefaultPage(page)).toBeFalse();
  });

  it('should return false if background element is no longer default', () => {
    const page = createPage();
    delete page.elements[0].isDefaultBackground;
    expect(isDefaultPage(page)).toBeFalse();
  });
});
