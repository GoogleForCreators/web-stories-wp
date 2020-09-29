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
import MockDate from 'mockdate';
import { subMinutes, subHours, subDays } from 'date-fns';

/**
 * Internal dependencies
 */
import getRelativeDisplayDate from '../getRelativeDisplayDate';
import { updateSettings, resetSettings } from '../settings';

describe('date/getRelativeDisplayDate', () => {
  beforeEach(() => {
    MockDate.set('2020-07-15T22:47:26');
  });

  afterEach(() => {
    MockDate.reset();
    resetSettings();
  });

  it('should return 2 minutes ago in America/New_York', () => {
    updateSettings({
      dateFormat: 'F j, Y',
      gmtOffset: -4,
      timeFormat: 'g:i A',
      timezone: 'America/New_York',
    });
    const date = subMinutes(new Date(), 2);
    const formattedDate = getRelativeDisplayDate(date);

    expect(formattedDate).toStrictEqual('2 minutes ago');
  });

  it('should return 2 minutes ago in America/Los_Angeles', () => {
    updateSettings({
      dateFormat: 'F j, Y',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });

    const date = subMinutes(new Date(), 2);
    const formattedDate = getRelativeDisplayDate(date);

    expect(formattedDate).toStrictEqual('2 minutes ago');
  });

  it('should return an hour ago', () => {
    updateSettings({
      dateFormat: 'F j, Y',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });

    const date = subHours(new Date(), 1);
    const formattedDate = getRelativeDisplayDate(date);

    expect(formattedDate).toStrictEqual('an hour ago');
  });

  it('should return 2 hours ago', () => {
    updateSettings({
      dateFormat: 'F j, Y',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });
    const date = subHours(new Date(), 2);
    const formattedDate = getRelativeDisplayDate(date);

    expect(formattedDate).toStrictEqual('2 hours ago');
  });

  it('should return yesterday', () => {
    updateSettings({
      dateFormat: 'F j, Y',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });
    const date = subDays(new Date(), 1);
    const formattedDate = getRelativeDisplayDate(date);

    expect(formattedDate).toStrictEqual('yesterday');
  });

  it('should return 2020-05-02 with no formatting options', () => {
    const date = '2020-05-02T10:47:26';
    const formattedDate = getRelativeDisplayDate(date);

    expect(formattedDate).toStrictEqual('2020-05-02');
  });

  it('should return May 2, 2020 with F j, Y formatting options', () => {
    updateSettings({
      dateFormat: 'F j, Y',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });

    const date = '2020-05-02T10:47:26';
    const formattedDate = getRelativeDisplayDate(date);

    expect(formattedDate).toStrictEqual('May 2, 2020');
  });

  it('should return 2020-05-02 with Y-m-d formatting options', () => {
    updateSettings({
      dateFormat: 'Y-m-d',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });

    const date = '2020-05-02T10:47:26';
    const formattedDate = getRelativeDisplayDate(date);

    expect(formattedDate).toStrictEqual('2020-05-02');
  });

  it('should return 05/02/2020 with m/d/Y formatting options', () => {
    updateSettings({
      dateFormat: 'm/d/Y',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });

    const date = '2020-05-02T10:47:26';
    const formattedDate = getRelativeDisplayDate(date);

    expect(formattedDate).toStrictEqual('05/02/2020');
  });

  it('should return 02/05/2020 with d/m/Y formatting options', () => {
    updateSettings({
      dateFormat: 'd/m/Y',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });

    const date = '2020-05-02T10:47:26';
    const formattedDate = getRelativeDisplayDate(date);

    expect(formattedDate).toStrictEqual('02/05/2020');
  });

  it('should return Sat 05 02 2020 with D m d yy formatting options', () => {
    updateSettings({
      dateFormat: 'D m d yy',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });
    const date = '2020-05-02T10:47:26';
    const formattedDate = getRelativeDisplayDate(date);

    expect(formattedDate).toStrictEqual('Sat 05 02 2020');
  });

  it('should correctly format a string date', () => {
    updateSettings({
      dateFormat: 'm/d/Y',
      gmtOffset: -7,
      timeFormat: 'g:i A',
      timezone: 'America/Los_Angeles',
    });

    const date = '2020-05-02T10:47:26';
    const formattedDate = getRelativeDisplayDate(date);

    expect(formattedDate).toStrictEqual('05/02/2020');
  });

  it('should return an empty string with a null date', () => {
    const formattedDate = getRelativeDisplayDate(null);

    expect(formattedDate).toStrictEqual('');
  });
});
