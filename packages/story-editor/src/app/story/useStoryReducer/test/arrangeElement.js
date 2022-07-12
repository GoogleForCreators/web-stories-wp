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
import { LAYER_DIRECTIONS } from '../../../../constants';
import { setupReducer } from './_utils';

describe('arrangeElement', () => {
  it('should do nothing if there are only two elements on page', () => {
    const { restore, arrangeElement } = setupReducer();

    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [{ id: '123', isBackground: true }, { id: '234' }],
        },
      ],
      current: '111',
    });

    const result = arrangeElement({ elementId: '234', position: 0 });

    expect(result).toBe(initialState);
  });

  it('should do nothing if already in the right place and no groups are used', () => {
    const { restore, arrangeElement } = setupReducer();

    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', isBackground: true },
            { id: '234' },
            { id: '345' },
          ],
        },
      ],
      current: '111',
    });

    const result = arrangeElement({ elementId: '234', position: 1 });

    expect(result).toStrictEqual(initialState);
  });

  it('should do nothing if already in the right place and in the right group', () => {
    const { restore, arrangeElement } = setupReducer();

    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', isBackground: true },
            { id: '234', groupId: 'g1' },
            { id: '345' },
          ],
          groups: {
            g1: { name: 'Group 1' },
          },
        },
      ],
      current: '111',
    });

    const result = arrangeElement({
      elementId: '234',
      position: 1,
      groupId: 'g1',
    });

    expect(result).toBe(initialState);
  });

  it('should set group if already in the right place, but changing group', () => {
    const { restore, arrangeElement } = setupReducer();

    restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: 'e1', isBackground: true },
            { id: 'e2', groupId: 'g1' },
            { id: 'e3', groupId: 'g1' },
            { id: 'e4', groupId: 'g2' },
          ],
          groups: {
            g1: { name: 'Group 1' },
            g2: { name: 'Group 2' },
          },
        },
      ],
      current: '111',
    });

    const result = arrangeElement({
      elementId: 'e3',
      position: 2,
      groupId: 'g2',
    });

    expect(result.pages[0].elements).toStrictEqual([
      { id: 'e1', isBackground: true },
      { id: 'e2', groupId: 'g1' },
      { id: 'e3', groupId: 'g2' },
      { id: 'e4', groupId: 'g2' },
    ]);
  });

  it('should remove group if changing group and the old group is empty', () => {
    const { restore, arrangeElement } = setupReducer();

    restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: 'e1', isBackground: true },
            { id: 'e2', groupId: 'g1' },
            { id: 'e3', groupId: 'g2' },
            { id: 'e4', groupId: 'g2' },
          ],
          groups: {
            g1: { name: 'Group 1' },
            g2: { name: 'Group 2' },
          },
        },
      ],
      current: '111',
    });

    const result = arrangeElement({
      elementId: 'e2',
      position: 1,
      groupId: 'g2',
    });

    expect(result.pages[0].elements).toStrictEqual([
      { id: 'e1', isBackground: true },
      { id: 'e2', groupId: 'g2' },
      { id: 'e3', groupId: 'g2' },
      { id: 'e4', groupId: 'g2' },
    ]);

    expect(result.pages[0].groups).toStrictEqual({
      g2: { name: 'Group 2' },
    });
  });

  it('should not be able to change group to a group that does not exist', () => {
    const { restore, arrangeElement } = setupReducer();

    const initialState = restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: 'e1', isBackground: true },
            { id: 'e2', groupId: 'g1' },
            { id: 'e3', groupId: 'g1' },
          ],
          groups: {
            g1: { name: 'Group 1' },
          },
        },
      ],
      current: '111',
    });

    const result = arrangeElement({
      elementId: 'e2',
      position: 1,
      groupId: 'g2',
    });

    expect(result).toBe(initialState);
  });

  it('should remove group if already in the right place, but explicitly without group', () => {
    const { restore, arrangeElement } = setupReducer();

    restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', isBackground: true },
            { id: '234', groupId: 'g1' },
            { id: '345', groupId: 'g1' },
          ],
          groups: {
            g1: { name: 'Group 1' },
          },
        },
      ],
      current: '111',
    });

    const result = arrangeElement({
      elementId: '234',
      position: 1,
      groupId: null,
    });

    expect(result.pages[0].elements).toStrictEqual([
      { id: '123', isBackground: true },
      { id: '234' },
      { id: '345', groupId: 'g1' },
    ]);
  });

  it('should delete the group if no elements left into the group', () => {
    const { restore, arrangeElement } = setupReducer();

    restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', isBackground: true },
            { id: '234', groupId: 'g1' },
            { id: '345' },
          ],
          groups: { g1: { name: 'Group 1' } },
        },
      ],
      current: '111',
    });

    const result = arrangeElement({
      elementId: '234',
      position: 1,
      groupId: null,
    });

    expect(result.pages[0]).toStrictEqual({
      id: '111',
      elements: [
        { id: '123', isBackground: true },
        { id: '234' },
        { id: '345' },
      ],
      groups: {},
    });
  });

  it('should move but not alter group if group is unset', () => {
    const { restore, arrangeElement } = setupReducer();

    restore({
      pages: [
        {
          id: '111',
          elements: [
            { id: '123', isBackground: true },
            { id: '234', groupId: 'g1' },
            { id: '345' },
          ],
        },
      ],
      current: '111',
    });

    const result = arrangeElement({ elementId: '234', position: 2 });

    expect(result.pages[0].elements).toStrictEqual([
      { id: '123', isBackground: true },
      { id: '345' },
      { id: '234', groupId: 'g1' },
    ]);
  });

  it('should move element to specified position', () => {
    const { restore, arrangeElement } = setupReducer();

    restore(getInitialState());

    const result = arrangeElement({ elementId: '234', position: 2 });

    expect(getElementIdsFromCurrentPage(result)).toStrictEqual([
      '123',
      '345',
      '234',
      '456',
    ]);
  });

  it('should move element to front', () => {
    const { restore, arrangeElement } = setupReducer();

    restore(getInitialState());

    const result = arrangeElement({
      elementId: '234',
      position: LAYER_DIRECTIONS.FRONT,
    });

    expect(getElementIdsFromCurrentPage(result)).toStrictEqual([
      '123',
      '345',
      '456',
      '234',
    ]);
  });

  it('should move element to back', () => {
    const { restore, arrangeElement } = setupReducer();

    restore(getInitialState());

    const result = arrangeElement({
      elementId: '456',
      position: LAYER_DIRECTIONS.BACK,
    });

    expect(getElementIdsFromCurrentPage(result)).toStrictEqual([
      '123',
      '456',
      '234',
      '345',
    ]);
  });

  it('should move element forward', () => {
    const { restore, arrangeElement } = setupReducer();

    restore(getInitialState());

    const result = arrangeElement({
      elementId: '234',
      position: LAYER_DIRECTIONS.FORWARD,
    });

    expect(getElementIdsFromCurrentPage(result)).toStrictEqual([
      '123',
      '345',
      '234',
      '456',
    ]);
  });

  it('should move element backward', () => {
    const { restore, arrangeElement } = setupReducer();

    restore(getInitialState());

    const result = arrangeElement({
      elementId: '345',
      position: LAYER_DIRECTIONS.BACKWARD,
    });

    expect(getElementIdsFromCurrentPage(result)).toStrictEqual([
      '123',
      '345',
      '234',
      '456',
    ]);
  });

  it('should only allow element in positions inside the bounds', () => {
    const { restore, arrangeElement } = setupReducer();

    restore(getInitialState());

    // Try to move element from 2nd position before the start.
    const firstResult = arrangeElement({ elementId: '456', position: -100 });
    expect(getElementIdsFromCurrentPage(firstResult)).toStrictEqual([
      '123',
      '456',
      '234',
      '345',
    ]);

    // Try to move element from 2nd position after the end.
    const secondResult = arrangeElement({ elementId: '234', position: 100 });
    expect(getElementIdsFromCurrentPage(secondResult)).toStrictEqual([
      '123',
      '456',
      '345',
      '234',
    ]);
  });

  it('should not be able to move background element at all', () => {
    const { restore, arrangeElement } = setupReducer();

    restore(getInitialState());

    // Try to move bg element anywhere
    const result = arrangeElement({ elementId: '123', position: 2 });

    expect(getElementIdsFromCurrentPage(result)).toStrictEqual([
      '123',
      '234',
      '345',
      '456',
    ]);
  });

  it('should not be able to move element below background using position', () => {
    const { restore, arrangeElement } = setupReducer();

    restore(getInitialState());

    // Try to move any non-bg element to position 0
    const result = arrangeElement({ elementId: '345', position: 0 });

    expect(getElementIdsFromCurrentPage(result)).toStrictEqual([
      '123',
      '345', // Note that it *does* move, but not below background
      '234',
      '456',
    ]);
  });

  it('should not be able to move element below background using "send backwards"', () => {
    const { restore, arrangeElement } = setupReducer();

    restore(getInitialState());

    // Try to move the element just above the background further backwards.
    const result = arrangeElement({
      elementId: '234',
      position: LAYER_DIRECTIONS.BACKWARD,
    });

    expect(getElementIdsFromCurrentPage(result)).toStrictEqual([
      '123',
      '234',
      '345',
      '456',
    ]);
  });

  it('should not be able to move element below background using "send to back"', () => {
    const { restore, arrangeElement } = setupReducer();

    restore(getInitialState());

    // Try to move any non-bg element to position BACK
    const result = arrangeElement({
      elementId: '345',
      position: LAYER_DIRECTIONS.BACK,
    });

    expect(getElementIdsFromCurrentPage(result)).toStrictEqual([
      '123',
      '345', // Note that it *does* move, but not below background
      '234',
      '456',
    ]);
  });
});

function getElementIdsFromCurrentPage({ pages, current }) {
  return pages.find(({ id }) => id === current).elements.map(({ id }) => id);
}

function getInitialState() {
  return {
    pages: [
      {
        id: '111',
        elements: [
          { id: '123', isBackground: true },
          { id: '234' },
          { id: '345' },
          { id: '456' },
        ],
      },
    ],
    current: '111',
  };
}
