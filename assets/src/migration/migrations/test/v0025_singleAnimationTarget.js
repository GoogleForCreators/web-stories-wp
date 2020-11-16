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
jest.mock('uuid');
import { v4 } from 'uuid';
/**
 * Internal dependencies
 */
import singleAnimationTarget from '../v0025_singleAnimationTarget';

const MOCK_ID = 'newUuid';

describe('singleAnimationTarget', () => {
  v4.mockImplementation(() => MOCK_ID);

  it('should migrate old animations with multiple targets to separate animations with a single target', () => {
    expect(
      singleAnimationTarget({
        _test: 'story',
        pages: [
          {
            _test: 'page1',
            animations: [
              {
                type: 'bounce',
                duration: 1000,
                delay: 200,
                id: '1',
                targets: ['a', 'b'],
              },
              {
                type: 'fly-in',
                duration: 1000,
                delay: 200,
                id: '2',
                targets: ['a', 'b', 'c'],
              },
            ],
          },
          {
            _test: 'page2',
            animations: [
              {
                type: 'move',
                duration: 1000,
                delay: 200,
                id: '3',
                targets: ['a'],
              },
              {
                type: 'bounce',
                duration: 1000,
                delay: 200,
                id: '4',
                targets: ['a', 'b', 'c'],
              },
            ],
          },
        ],
      })
    ).toStrictEqual({
      _test: 'story',
      pages: [
        {
          _test: 'page1',
          animations: [
            {
              type: 'bounce',
              duration: 1000,
              delay: 200,
              id: '1',
              targets: ['a'],
            },
            {
              type: 'bounce',
              duration: 1000,
              delay: 200,
              id: MOCK_ID,
              targets: ['b'],
            },
            {
              type: 'fly-in',
              duration: 1000,
              delay: 200,
              id: '2',
              targets: ['a'],
            },
            {
              type: 'fly-in',
              duration: 1000,
              delay: 200,
              id: MOCK_ID,
              targets: ['b'],
            },
            {
              type: 'fly-in',
              duration: 1000,
              delay: 200,
              id: MOCK_ID,
              targets: ['c'],
            },
          ],
        },
        {
          _test: 'page2',
          animations: [
            {
              type: 'move',
              duration: 1000,
              delay: 200,
              id: '3',
              targets: ['a'],
            },
            {
              type: 'bounce',
              duration: 1000,
              delay: 200,
              id: '4',
              targets: ['a'],
            },
            {
              type: 'bounce',
              duration: 1000,
              delay: 200,
              id: MOCK_ID,
              targets: ['b'],
            },
            {
              type: 'bounce',
              duration: 1000,
              delay: 200,
              id: MOCK_ID,
              targets: ['c'],
            },
          ],
        },
      ],
    });
  });
});
