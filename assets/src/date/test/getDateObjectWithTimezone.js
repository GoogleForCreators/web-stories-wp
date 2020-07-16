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
import { getDateObjectWithTimezone } from '../';

describe('date/getDateObjectWithTimezone July', () => {
  const MOCK_UTC_DATE = moment.utc('2020-07-12 11:30');

  beforeEach(() => {
    MockDate.set(MOCK_UTC_DATE);
  });

  it('should return UTC by default which is default moment', () => {
    expect(getDateObjectWithTimezone()).toBe('2020-07-12T11:30:00Z');
  });

  it('should return 2020-07-12T04:30:00-07:00 when timezone is set to America/Los_Angeles', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: -7,
      timezone: 'America/Los_Angeles',
    });

    expect(date).toBe('2020-07-12T04:30:00-07:00');
  });

  it('should return 2020-07-12T04:30:00-07:00 when gmtOffset is -7 (America/Los_Angeles)', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: -7,
      timezone: '',
    });

    expect(date).toBe('2020-07-12T04:30:00-07:00');
  });

  it('should return 2020-07-12T07:30:00-04:00 when timezone is set to America/New_York', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: -4,
      timezone: 'America/New_York',
    });

    expect(date).toBe('2020-07-12T07:30:00-04:00');
  });

  it('should return 2020-07-12T07:30:00-04:00 when gmtOffset is -4 (America/New_York)', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: -4,
      timezone: '',
    });

    expect(date).toBe('2020-07-12T07:30:00-04:00');
  });

  it('should return 2020-07-12T04:30:00-07:00 when timezone is set to America/Tijuana', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: -7,
      timezone: 'America/Tijuana',
    });

    expect(date).toBe('2020-07-12T04:30:00-07:00');
  });

  it('should return 2020-07-12T04:30:00-07:00 when gmtOffset is -7 (America/Tijuana)', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: -7,
      timezone: '',
    });

    expect(date).toBe('2020-07-12T04:30:00-07:00');
  });

  it('should return 2020-07-12T08:30:00-03:00 when timezone is set to America/Sao_Paulo', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: -3,
      timezone: 'America/Sao_Paulo',
    });

    expect(date).toBe('2020-07-12T08:30:00-03:00');
  });

  it('should return 2020-07-12T08:30:00-03:00 when gmtOffset is -3 (America/Sao_Paulo)', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: -3,
      timezone: '',
    });

    expect(date).toBe('2020-07-12T08:30:00-03:00');
  });

  it('should return 2020-07-12T15:30:00+04:00 when timezone is set to Asia/Dubai', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: 4,
      timezone: 'Asia/Dubai',
    });

    expect(date).toBe('2020-07-12T15:30:00+04:00');
  });

  it('should return 2020-07-12T15:30:00+04:00 when gmtOffset is + 4 (Asia/Dubai)', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: 4,
      timezone: '',
    });

    expect(date).toBe('2020-07-12T15:30:00+04:00');
  });

  it('should return 2020-07-12T19:30:00+08:00 when timezone is set to Asia/Hong_Kong', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: 8,
      timezone: 'Asia/Hong_Kong',
    });

    expect(date).toBe('2020-07-12T19:30:00+08:00');
  });

  it('should return 2020-07-12T19:30:00+08:00 when gmtOffset is + 8 (Asia/Hong_Kong)', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: 8,
      timezone: '',
    });

    expect(date).toBe('2020-07-12T19:30:00+08:00');
  });

  it('should return 2020-07-12T21:30:00+10:00 when timezone is set to Australia/Brisbane', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: 10,
      timezone: 'Australia/Brisbane',
    });

    expect(date).toBe('2020-07-12T21:30:00+10:00');
  });

  it('should return 2020-07-12T21:30:00+10:00 when gmtOffset is +10 (Australia/Brisbane)', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: 10,
      timezone: '',
    });

    expect(date).toBe('2020-07-12T21:30:00+10:00');
  });

  it('should return 2020-07-12T13:30:00+02:00 when timezone is set to Europe/Amsterdam', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: 2,
      timezone: 'Europe/Amsterdam',
    });

    expect(date).toBe('2020-07-12T13:30:00+02:00');
  });

  it('should return 2020-07-12T13:30:00+02:00 when gmtOffset is +2 (Europe/Amsterdam)', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: 2,
      timezone: '',
    });

    expect(date).toBe('2020-07-12T13:30:00+02:00');
  });

  it('should return 2020-07-12T13:30:00+02:00 when timezone is set to Europe/Berlin', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: 2,
      timezone: 'Europe/Berlin',
    });

    expect(date).toBe('2020-07-12T13:30:00+02:00');
  });

  it('should return 2020-07-12T14:30:00+03:00 when timezone is set to Europe/Moscow', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: 3,
      timezone: 'Europe/Moscow',
    });

    expect(date).toBe('2020-07-12T14:30:00+03:00');
  });

  it('should return 2020-07-12T14:30:00+03:00 when gmtOffset is 3 (Europe/Moscow)', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: 3,
      timezone: '',
    });

    expect(date).toBe('2020-07-12T14:30:00+03:00');
  });

  it('should return 2020-07-12T12:30:00+01:00 when timezone is set to Europe/Dublin', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: 1,
      timezone: 'Europe/Dublin',
    });

    expect(date).toBe('2020-07-12T12:30:00+01:00');
  });

  it('should return 2020-07-12T11:30:00Z when gmtOffset is 0', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: 0,
      timezone: '',
    });

    expect(date).toBe('2020-07-12T11:30:00Z');
  });
});

describe('date/getDateObjectWithTimezone November', () => {
  const MOCK_UTC_DATE = moment.utc('2020-11-12 11:30');

  beforeAll(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => MOCK_UTC_DATE);
  });
  beforeEach(() => {
    MockDate.set(MOCK_UTC_DATE);
  });

  it('should return UTC by default which is 2020-11-12T11:30:00Z', () => {
    const date = getDateObjectWithTimezone({});
    expect(date).toBe('2020-11-12T11:30:00Z');
  });

  it('should return 2020-11-12T03:30:00-08:00 when timezone is set to America/Los_Angeles', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: -8,
      timezone: 'America/Los_Angeles',
    });

    expect(date).toBe('2020-11-12T03:30:00-08:00');
  });

  it('should return 2020-11-12T06:30:00-05:00 when timezone is set to America/New_York', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: -5,
      timezone: 'America/New_York',
    });

    expect(date).toBe('2020-11-12T06:30:00-05:00');
  });

  it('should return 2020-11-12T03:30:00-08:00 when timezone is set to America/Tijuana', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: -8,
      timezone: 'America/Tijuana',
    });

    expect(date).toBe('2020-11-12T03:30:00-08:00');
  });

  it('should return 2020-11-12T08:30:00-03:00 when timezone is set to America/Sao_Paulo', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: -3,
      timezone: 'America/Sao_Paulo',
    });

    expect(date).toBe('2020-11-12T08:30:00-03:00');
  });

  it('should return 2020-11-12T15:30:00+04:00 when timezone is set to Asia/Dubai', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: 4,
      timezone: 'Asia/Dubai',
    });

    expect(date).toBe('2020-11-12T15:30:00+04:00');
  });

  it('should return 2020-11-12T19:30:00+08:00 when timezone is set to Asia/Hong_Kong', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: 8,
      timezone: 'Asia/Hong_Kong',
    });

    expect(date).toBe('2020-11-12T19:30:00+08:00');
  });

  it('should return 2020-11-12T21:30:00+10:00 when timezone is set to Australia/Brisbane', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: 10,
      timezone: 'Australia/Brisbane',
    });

    expect(date).toBe('2020-11-12T21:30:00+10:00');
  });

  it('should return 2020-11-12T12:30:00+01:00 when timezone is set to Europe/Berlin', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: 1,
      timezone: 'Europe/Berlin',
    });

    expect(date).toBe('2020-11-12T12:30:00+01:00');
  });

  it('should return 2020-11-12T11:30:00Z when timezone is set to Europe/Moscow', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: 0,
      timezone: '	Europe/Moscow',
    });

    expect(date).toBe('2020-11-12T11:30:00Z');
  });

  it('should return 2020-11-12T11:30:00Z when timezone is set to Europe/Dublin', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: 0,
      timezone: '	Europe/Dublin',
    });

    expect(date).toBe('2020-11-12T11:30:00Z');
  });

  it('should return 2020-11-12T12:30:00+01:00 when timezone is set to Europe/Amsterdam', () => {
    const date = getDateObjectWithTimezone({
      gmtOffset: 1,
      timezone: 'Europe/Amsterdam',
    });

    expect(date).toBe('2020-11-12T12:30:00+01:00');
  });
});
