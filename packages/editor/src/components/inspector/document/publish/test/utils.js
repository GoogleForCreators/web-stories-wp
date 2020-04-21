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
import { is12Hour, getReadableTime, getReadableDate } from '../utils';

describe('is12Hour', () => {
  it('should detect time format correctly', () => {
    const is12Hour1 = is12Hour('g:i a');
    expect(is12Hour1).toBe(true);

    const is12Hour2 = is12Hour('H:i');
    expect(is12Hour2).toBe(false);
  });
});

describe('getReadableTime', () => {
  it('should display correct time', () => {
    const with12HoursTime = getReadableTime('2020-01-01T20:20:20', true);
    expect(with12HoursTime).toStrictEqual('08:20PM');

    const with24HoursTime = getReadableTime('2020-01-01T20:20:20', false);
    expect(with24HoursTime).toStrictEqual('20:20');
  });
});

describe('getReadableDate', () => {
  it('should display correct date', () => {
    const with12HoursDate = getReadableDate('2020-03-01T20:20:20', true);
    expect(with12HoursDate).toStrictEqual('03/01/2020');

    const with24HoursDate = getReadableDate('2020-03-01T20:20:20', false);
    expect(with24HoursDate).toStrictEqual('01/03/2020');
  });
});
