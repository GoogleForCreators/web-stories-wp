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
import moment from 'moment-timezone';

/**
 * Internal dependencies
 */
import { isYesterday } from '../';

describe('date/isYesterday', () => {
  it('should return true that today minus 1 day is yesterday', () => {
    const dateString = moment().subtract(1, 'days');
    const formattedDate = isYesterday(dateString);

    expect(formattedDate).toBe(true);
  });

  it('should return false that today minus 3 days is yesterday', () => {
    const dateString = moment().subtract(3, 'days');
    const formattedDate = isYesterday(dateString);

    expect(formattedDate).toBe(false);
  });

  it('should return false that today is yesterday', () => {
    const dateString = moment();
    const formattedDate = isYesterday(dateString);

    expect(formattedDate).toBe(false);
  });
});
