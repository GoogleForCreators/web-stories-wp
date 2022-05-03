/*
 * Copyright 2022 Google LLC
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
import { isValidShopifyHost } from '..';

const hostToValidate = [
  ['example.com', false],
  ['https://webstories.myshopify.com', true],
  ['webstories.myyshopify.com', false],
  ['webstories.myshopify.com', true],
];

describe('isValidShopifyHost', () => {
  it.each(hostToValidate)(
    'should take " %s " and return as %p for shopify host',
    (host, expected) => {
      const bool = isValidShopifyHost(host);
      expect(bool).toBe(expected);
    }
  );
});
