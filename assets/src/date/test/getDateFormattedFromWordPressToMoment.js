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
import MockDate from 'mockdate';

/**
 * Internal dependencies
 */
import { getDateFormattedFromWordPressToMoment } from '../';

describe('date/getDateFormattedFromWordPressToMoment', () => {
  const MOCK_UTC_DATE = moment.utc('2020-07-12 11:30');

  beforeEach(() => {
    MockDate.set(MOCK_UTC_DATE);
  });

  it('should return 2020-05-02 with Y-m-d wpFormat', () => {
    const dateString = moment.parseZone('2020-05-02T10:47:26');
    const formattedDate = getDateFormattedFromWordPressToMoment(dateString);

    expect(formattedDate).toBe('2020-05-02');
  });

  it("should return default formatting of Y-m-d (wpFormat) or YYYY-MM-DD (moment format) when a wpFormat string isn't passed in", () => {
    const dateString = moment.parseZone('2020-05-02T10:47:26');
    const formattedDate = getDateFormattedFromWordPressToMoment(dateString);

    expect(formattedDate).toBe('2020-05-02');
  });

  it('should return May 2, 2020 with F j, Y wpFormat', () => {
    const dateString = moment.parseZone('2020-05-02T10:47:26');
    const formattedDate = getDateFormattedFromWordPressToMoment(
      dateString,
      'F j, Y'
    );

    expect(formattedDate).toBe('May 2, 2020');
  });

  it('should return 05/02/2020 with m/d/Y wpFormat', () => {
    const dateString = moment.parseZone('2020-05-02T10:47:26');
    const formattedDate = getDateFormattedFromWordPressToMoment(
      dateString,
      'm/d/Y'
    );

    expect(formattedDate).toBe('05/02/2020');
  });

  it('should return 02/05/2020 with d/m/Y wpFormat', () => {
    const dateString = moment.parseZone('2020-05-02T10:47:26');
    const formattedDate = getDateFormattedFromWordPressToMoment(
      dateString,
      'd/m/Y'
    );

    expect(formattedDate).toBe('02/05/2020');
  });

  it("should return false when wpFormat isn't a default setting that can be converted", () => {
    const formattedDate = getDateFormattedFromWordPressToMoment(
      moment(),
      'something unexpected'
    );

    expect(formattedDate).toBeUndefined();
  });
});
