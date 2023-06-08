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
import removeBasedOnFromElements from '../v0048_removeBasedOnFromElements';

describe('removeBasedOnFromElements', () => {
  it('should move grouped elements together', () => {
    expect(
      removeBasedOnFromElements({
        pages: [
          {
            elements: [
              { id: '1_1', groupId: 'a', basedOn: '123' },
              { id: '1_3', groupId: 'a' },
              { id: '1_2' },
            ],
          },
          {
            elements: [
              { id: '2_1', groupId: 'b' },
              { id: '2_5', groupId: 'b', basedOn: '123' },
              { id: '2_2' },
              { id: '2_3', groupId: 'c' },
              { id: '2_4', groupId: 'c' },
            ],
          },
          {
            elements: [
              { id: '3_1', groupId: 'd' },
              { id: '3_5', groupId: 'd', basedOn: '123' },
              { id: '3_2', groupId: 'e' },
              { id: '3_6', groupId: 'e' },
              { id: '3_3', groupId: 'f' },
              { id: '3_7', groupId: 'f' },
              { id: '3_4', groupId: 'g' },
              { id: '3_8', groupId: 'g' },
            ],
          },
        ],
      })
    ).toStrictEqual({
      pages: [
        {
          elements: [
            { id: '1_1', groupId: 'a' },
            { id: '1_3', groupId: 'a' },
            { id: '1_2' },
          ],
        },
        {
          elements: [
            { id: '2_1', groupId: 'b' },
            { id: '2_5', groupId: 'b' },
            { id: '2_2' },
            { id: '2_3', groupId: 'c' },
            { id: '2_4', groupId: 'c' },
          ],
        },
        {
          elements: [
            { id: '3_1', groupId: 'd' },
            { id: '3_5', groupId: 'd' },
            { id: '3_2', groupId: 'e' },
            { id: '3_6', groupId: 'e' },
            { id: '3_3', groupId: 'f' },
            { id: '3_7', groupId: 'f' },
            { id: '3_4', groupId: 'g' },
            { id: '3_8', groupId: 'g' },
          ],
        },
      ],
    });
  });
});
