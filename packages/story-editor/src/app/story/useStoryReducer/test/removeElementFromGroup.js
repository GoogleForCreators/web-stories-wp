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
  it('should remove element from group', () => {
    const { restore, removeElementFromGroup } = setupReducer();
    const initialState = restore({
      current: 'f93d7',
      selection: ['53b7e'],
      story: {},
      pages: [
        {
          elements: [
            { id: '3e822', layerName: 'Bkd' },
            { groupId: '86b8e', id: '5c37d', layerName: 'C1' },
            { groupId: '86b8e', id: '53b7e', layerName: 'B1' },
            { groupId: '86b8e', id: '53d47', layerName: 'A1' },
            { id: '0e26d', layerName: 'A' },
          ],
          type: 'page',
          id: 'f93d70',
          groups: {
            '86b8e': {
              name: 'Group 1',
              isLocked: false,
              isCollapsed: false,
            },
          },
        },
      ],
    });

    const result = removeElementFromGroup(initialState, {
      elementId: '53b7e',
      groupId: '86b8e',
    });

    const elements = result.pages[0].elements;
    expect(elements[3].id).toBe('53b7e');
  });
});
