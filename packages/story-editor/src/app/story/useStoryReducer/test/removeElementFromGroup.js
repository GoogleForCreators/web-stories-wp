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
import { setupReducer } from './_utils';

describe('removeElementFromGroup', () => {
  it('should do nothing if element is not in group', () => {
    const { restore, removeElementFromGroup } = setupReducer();
    const initialState = restore({
      current: 'p1',
      selection: ['e2'],
      pages: [
        {
          elements: [
            { id: 'e1', isBackground: true },
            { id: 'e2' },
            { id: 'e3', groupId: 'g1' },
            { id: 'e4', groupId: 'g1' },
            { id: 'e5', groupId: 'g2' },
          ],
          id: 'p1',
          groups: {
            g1: { name: 'Group 1' },
            g2: { name: 'Group 2' },
          },
        },
      ],
    });

    const result = removeElementFromGroup({
      elementId: 'e2',
      groupId: 'g1',
    });

    expect(result).toBe(initialState);
  });

  it('should move element out of group', () => {
    const { restore, removeElementFromGroup } = setupReducer();
    restore({
      current: 'p1',
      selection: ['e2'],
      pages: [
        {
          elements: [
            { id: 'e1', isBackground: true },
            { id: 'e2' },
            { id: 'e3', groupId: 'g1' },
            { id: 'e4', groupId: 'g1' },
            { id: 'e5', groupId: 'g2' },
          ],
          id: 'p1',
          groups: {
            g1: { name: 'Group 1' },
            g2: { name: 'Group 2' },
          },
        },
      ],
    });

    const result = removeElementFromGroup({
      elementId: 'e3',
      groupId: 'g1',
    });

    expect(result.pages[0].elements).toStrictEqual([
      { id: 'e1', isBackground: true },
      { id: 'e2' },
      { id: 'e4', groupId: 'g1' },
      { id: 'e3' },
      { id: 'e5', groupId: 'g2' },
    ]);
  });

  it('should remove element from group but not reorder if already last element', () => {
    const { restore, removeElementFromGroup } = setupReducer();
    restore({
      current: 'p1',
      selection: ['e2'],
      pages: [
        {
          elements: [
            { id: 'e1', isBackground: true },
            { id: 'e2' },
            { id: 'e3', groupId: 'g1' },
            { id: 'e4', groupId: 'g1' },
            { id: 'e5', groupId: 'g2' },
          ],
          id: 'p1',
          groups: {
            g1: { name: 'Group 1' },
            g2: { name: 'Group 2' },
          },
        },
      ],
    });

    const result = removeElementFromGroup({
      elementId: 'e4',
      groupId: 'g1',
    });

    expect(result.pages[0].elements).toStrictEqual([
      { id: 'e1', isBackground: true },
      { id: 'e2' },
      { id: 'e3', groupId: 'g1' },
      { id: 'e4' },
      { id: 'e5', groupId: 'g2' },
    ]);
  });
});
