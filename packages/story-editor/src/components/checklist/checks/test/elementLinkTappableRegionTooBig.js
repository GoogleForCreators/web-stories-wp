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
import { isElementLinkTappableRegionTooBig } from '../elementLinkTappableRegionTooBig';

describe('isElementLinkTappableRegionTooBig', () => {
  it('should return true if element tappable region is too big', () => {
    const element = {
      id: 'elementid',
      type: 'text',
      link: {
        url: 'https://google.com',
      },
      content: 'G',
      width: 300,
      height: 500,
    };
    const pageSize = {
      width: 336,
      height: 504,
    };
    expect(isElementLinkTappableRegionTooBig(element, pageSize)).toBe(true);
  });

  it('should return false if element has large enough tappable region', () => {
    const element = {
      id: 'elementid',
      type: 'text',
      link: {
        url: 'https://google.com',
      },
      content: 'G',
      width: 150,
      height: 100,
    };
    const pageSize = {
      width: 336,
      height: 504,
    };
    expect(isElementLinkTappableRegionTooBig(element, pageSize)).toBe(false);
  });

  it('should return false if not an element with link', () => {
    const element = {
      id: 'elementid',
      type: 'text',
      content: 'G',
      width: 40,
      height: 40,
    };
    const pageSize = {
      width: 336,
      height: 504,
    };
    expect(isElementLinkTappableRegionTooBig(element, pageSize)).toBe(false);
  });

  it('should return false for an element of an unknown type', () => {
    const element = {
      id: 'elementid',
      type: 'unknown',
      link: {
        url: 'https://google.com',
      },
      content: 'G',
      width: 40,
      height: 40,
    };
    const pageSize = {
      width: 336,
      height: 504,
    };
    expect(isElementLinkTappableRegionTooBig(element, pageSize)).toBe(false);
  });
});
