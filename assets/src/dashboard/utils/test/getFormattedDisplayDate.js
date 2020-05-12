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
import moment from 'moment';

/**
 * Internal dependencies
 */
import getFormattedDisplayDate, {
  isToday,
  isYesterday,
} from '../getFormattedDisplayDate';

describe('getFormattedDisplayDate', () => {
  it('should return 2 minutes ago using a native date object', () => {
    const dateString = moment(new Date() - 2 * 60000);
    const formattedDate = getFormattedDisplayDate(dateString);

    expect(formattedDate).toBe('2 minutes ago');
  });

  it('should return 2 minutes ago using moment', () => {
    const dateString = moment().subtract(2, 'minutes');
    const formattedDate = getFormattedDisplayDate(dateString);

    expect(formattedDate).toBe('2 minutes ago');
  });

  it('should return an hour ago using a native date object', () => {
    const dateString = moment(new Date() - 60 * 60000);
    const formattedDate = getFormattedDisplayDate(dateString);

    expect(formattedDate).toBe('an hour ago');
  });

  it('should return an hour ago using moment', () => {
    const dateString = moment().subtract(1, 'hours');
    const formattedDate = getFormattedDisplayDate(dateString);

    expect(formattedDate).toBe('an hour ago');
  });

  it('should return 2 hours ago using a native date object', () => {
    const dateString = moment(new Date() - 120 * 60000);
    const formattedDate = getFormattedDisplayDate(dateString);

    expect(formattedDate).toBe('2 hours ago');
  });

  it('should return 2 hours ago using moment', () => {
    const dateString = moment().subtract(2, 'hours');
    const formattedDate = getFormattedDisplayDate(dateString);

    expect(formattedDate).toBe('2 hours ago');
  });

  it('should return yesterday using a native date object', () => {
    const dateString = moment(new Date() - 1440 * 60000);
    const formattedDate = getFormattedDisplayDate(dateString);

    expect(formattedDate).toBe('yesterday');
  });

  it('should return yesterday using moment', () => {
    const dateString = moment().subtract(1, 'days');
    const formattedDate = getFormattedDisplayDate(dateString);

    expect(formattedDate).toBe('yesterday');
  });

  it('should return 5/2/2020', () => {
    const dateString = moment(new Date('5/2/2020'));
    const formattedDate = getFormattedDisplayDate(dateString);

    expect(formattedDate).toBe('5/2/2020');
  });
});

describe('isToday', () => {
  it('should return false that 5/2/2020 is today', () => {
    const dateString = moment(new Date('5/2/2020'));
    const formattedDate = isToday(dateString);

    expect(formattedDate).toBe(false);
  });

  it('should return true that 6am of today is today', () => {
    const dateString = moment(new Date()).hours(6);
    const formattedDate = isToday(dateString);

    expect(formattedDate).toBe(true);
  });

  it('should return true that 11pm of "today" is today', () => {
    const dateString = moment(new Date()).hours(23);
    const formattedDate = isToday(dateString);

    expect(formattedDate).toBe(true);
  });

  it('should return false that now minus 24 hours is not today', () => {
    const dateString = moment(new Date() - 1440 * 60000);
    const formattedDate = isToday(dateString);

    expect(formattedDate).toBe(false);
  });
});

describe('isYesterday', () => {
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
