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
import { registerElementType } from '@googleforcreators/elements';
import { elementTypes } from '@googleforcreators/element-library';

/**
 * Internal dependencies
 */
import { setupReducer } from './_utils';

describe('duplicateGroupById', () => {
  beforeAll(() => {
    elementTypes.forEach(registerElementType);
  });

  it('should do nothing if nothing supplied', () => {
    const { restore, duplicateGroupById } = setupReducer();

    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [{ id: '123', isBackground: true }, { id: '234' }],
          groups: {},
        },
      ],
      current: '111',
    });

    const result = duplicateGroupById({});

    expect(result).toBe(initialState);
  });

  it('should do nothing if no new group id supplied', () => {
    const { restore, duplicateGroupById } = setupReducer();

    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [{ id: '123', isBackground: true }, { id: '234' }],
          groups: {},
        },
      ],
      current: '111',
    });

    const result = duplicateGroupById({ oldGroupId: 'g1' });

    expect(result).toBe(initialState);
  });

  it('should do nothing if no new group name supplied', () => {
    const { restore, duplicateGroupById } = setupReducer();

    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [{ id: '123', isBackground: true }, { id: '234' }],
          groups: {},
        },
      ],
      current: '111',
    });

    const result = duplicateGroupById({ oldGroupId: 'g1', groupId: 'g2' });

    expect(result).toBe(initialState);
  });

  it('should do nothing if no old group does not exist', () => {
    const { restore, duplicateGroupById } = setupReducer();

    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [{ id: '123', isBackground: true }, { id: '234' }],
          groups: {},
        },
      ],
      current: '111',
    });

    const result = duplicateGroupById({
      oldGroupId: 'g1',
      groupId: 'g2',
      name: 'Group 1 Copy',
    });

    expect(result).toBe(initialState);
  });

  it('should do nothing if no old group has no members', () => {
    const { restore, duplicateGroupById } = setupReducer();

    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [{ id: '123', isBackground: true }, { id: '234' }],
          groups: { g1: { name: 'Group 1' } },
        },
      ],
      current: '111',
    });

    const result = duplicateGroupById({
      oldGroupId: 'g1',
      groupId: 'g2',
      name: 'Group 1 Copy',
    });

    expect(result).toBe(initialState);
  });

  it('should do nothing if group contains background', () => {
    const { restore, duplicateGroupById } = setupReducer();

    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', type: 'shape', isBackground: true, groupId: 'g1' },
            { id: '234' },
          ],
          groups: { g1: { name: 'Group 1' } },
        },
      ],
      current: '111',
    });

    const result = duplicateGroupById({
      oldGroupId: 'g1',
      groupId: 'g2',
      name: 'Group 1 Copy',
    });

    expect(result).toBe(initialState);
  });

  it('should do nothing if element has invalid type', () => {
    const { restore, duplicateGroupById } = setupReducer();

    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', isBackground: true },
            { id: '234', type: 'invalid-type', groupId: 'g1' },
          ],
          groups: { g1: { name: 'Group 1' } },
        },
      ],
      current: '111',
    });

    const result = duplicateGroupById({
      oldGroupId: 'g1',
      groupId: 'g2',
      name: 'Group 1 Copy',
    });

    expect(result).toBe(initialState);
  });

  it('should make a duplicate with all elements', () => {
    const { restore, duplicateGroupById } = setupReducer();

    restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', isBackground: true },
            { id: '234', type: 'shape', border: { width: 1 }, groupId: 'g1' },
            { id: '345', type: 'shape', border: { width: 3 }, groupId: 'g1' },
            { id: '456', groupId: 'g2' },
            { id: '567' },
          ],
          groups: {
            g1: { name: 'Group 1', isLocked: false },
            g2: { name: 'Group 2', isLocked: false },
          },
        },
      ],
      current: '111',
    });

    const result = duplicateGroupById({
      oldGroupId: 'g1',
      groupId: 'g3',
      name: 'Group 1 Copy',
    });

    expect(result.pages[0]).toStrictEqual(
      expect.objectContaining({
        elements: [
          { id: '123', isBackground: true },
          { id: '234', type: 'shape', border: { width: 1 }, groupId: 'g1' },
          { id: '345', type: 'shape', border: { width: 3 }, groupId: 'g1' },
          expect.objectContaining({
            id: expect.any(String),
            basedOn: '234',
            type: 'shape',
            border: { width: 1 },
            groupId: 'g3',
          }),
          expect.objectContaining({
            id: expect.any(String),
            basedOn: '345',
            type: 'shape',
            border: { width: 3 },
            groupId: 'g3',
          }),
          {
            id: '456',
            groupId: 'g2',
          },
          {
            id: '567',
          },
        ],
        groups: {
          g1: { name: 'Group 1', isLocked: false },
          g2: { name: 'Group 2', isLocked: false },
          g3: { name: 'Group 1 Copy', isLocked: false },
        },
      })
    );
  });
});
