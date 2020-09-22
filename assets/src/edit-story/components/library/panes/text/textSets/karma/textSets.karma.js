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
 * Internal dependencies
 */
import { Fixture } from '../../../../../../karma/fixture';

describe('CUJ: Text Sets (Text and Shape Combinations): Inserting Text Sets', () => {
  let fixture;
  beforeEach(async () => {
    fixture = new Fixture();
    await fixture.render();
  });

  afterEach(() => {
    fixture.restore();
  });

  // Disable reason: not implemented yet.
  // eslint-disable-next-line jasmine/no-disabled-tests
  xit('should display text sets', async () => {});

  // Disable reason: not implemented yet.
  // eslint-disable-next-line jasmine/no-disabled-tests
  xit('should allow inserting text sets', () => {});
});
