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
import generateGroupName, { getNextGroupNumber } from '../generateGroupName';

describe('getNextGroupNumber', () => {
  it('should return next highest number from group name', () => {
    const groups = {
      'b524f947-ce3f-4559-95ce-ac5538ed75dc': {
        name: 'mygroup',
      },
      'a524f947-ce3f-4559-95ce-ac5538ed75dc': {
        name: 'my group',
      },
      '66f74a42-a5b2-4d05-91a2-5f82ac57dddb': {
        name: 'Group 2',
      },
      '36f74a42-a5b2-4d05-91a2-5f82ac57dddb': {
        name: 'Group 1',
      },
    };

    expect(getNextGroupNumber(groups)).toBe(3);
  });

  it('should return 1 when no numbered groups exists', () => {
    const groups = {
      'b524f947-ce3f-4559-95ce-ac5538ed75dc': {
        name: 'mygroup',
      },
      'a524f947-ce3f-4559-95ce-ac5538ed75dc': {
        name: 'my group',
      },
    };

    expect(getNextGroupNumber(groups)).toBe(1);
  });

  it('should return 1 when groups are empty', () => {
    const groups = {};
    expect(getNextGroupNumber(groups)).toBe(1);
  });

  it('should return 1 when groups is undefined', () => {
    expect(getNextGroupNumber()).toBe(1);
  });

  it('should return 1 when bad data is passed', () => {
    const groups = {
      'b524f947-ce3f-4559-95ce-ac5538ed75dc': {},
      'a524f947-ce3f-4559-95ce-ac5538ed75dc': [],
    };

    expect(getNextGroupNumber(groups)).toBe(1);
  });
});

describe('generateGroupName', () => {
  it('should return next highest group name', () => {
    const groups = {
      'b524f947-ce3f-4559-95ce-ac5538ed75dc': {
        name: 'mygroup',
      },
      'a524f947-ce3f-4559-95ce-ac5538ed75dc': {
        name: 'my group',
      },
      '66f74a42-a5b2-4d05-91a2-5f82ac57dddb': {
        name: 'Group 2',
      },
      '36f74a42-a5b2-4d05-91a2-5f82ac57dddb': {
        name: 'Group 1',
      },
    };

    expect(generateGroupName(groups)).toBe('Group 3');
  });

  it('should return default group name', () => {
    const groups = {
      'b524f947-ce3f-4559-95ce-ac5538ed75dc': {},
      'a524f947-ce3f-4559-95ce-ac5538ed75dc': {},
    };

    expect(generateGroupName(groups)).toBe('Group 1');
  });

  it('should return group name with "copy" appended', () => {
    const groups = {
      'b524f947-ce3f-4559-95ce-ac5538ed75dc': {},
      'a524f947-ce3f-4559-95ce-ac5538ed75dc': {},
    };

    expect(generateGroupName(groups, 'My group')).toBe('My group Copy');
  });

  it('should append "copy" to copied group name', () => {
    const groups = {};
    expect(generateGroupName(groups, 'My group Copy')).toBe(
      'My group Copy Copy'
    );
  });
});
