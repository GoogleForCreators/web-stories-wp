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
import { publisherLogoExistence } from '../publisherLogoExistence';

describe('publisherLogoExistence', () => {
  it("should return true if the story's publisher logo is defined", () => {
    const noPublisherLogo = {
      height: 0,
      id: 0,
      url: '',
      width: 0,
    };
    const publisherLogo = {
      height: 100,
      id: 1,
      url: 'test',
      width: 200,
    };

    const testNoPublisherLogo = publisherLogoExistence(noPublisherLogo);
    const testPublisherLogo = publisherLogoExistence(publisherLogo);
    expect(testNoPublisherLogo).toBe(false);
    expect(testPublisherLogo).toBe(true);
  });
});
