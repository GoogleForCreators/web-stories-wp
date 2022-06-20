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
import {
  intersect,
  isInsideRange,
  moveArrayElement,
  getAbsolutePosition,
  removeAnimationsWithElementIds,
  updateAnimations,
  removeDuplicates,
  exclusion,
} from '../utils';
import { LAYER_DIRECTIONS } from '../../../../../constants';

const ABC = ['A', 'B', 'C'];
const BCD = ['B', 'C', 'D'];
const ABCD = ['A', 'B', 'C', 'D'];
const D = ['D'];

describe('intersect', () => {
  it('should return first element if only one given', () => {
    const result = intersect(ABC);

    expect(result).toStrictEqual(ABC);
  });

  it('should return intersection set if multiple elements given', () => {
    const shouldBeBC = intersect(ABC, BCD);
    expect(shouldBeBC).toStrictEqual(['B', 'C']);

    const shouldBeD = intersect(ABCD, BCD, D);
    expect(shouldBeD).toStrictEqual(['D']);

    const shouldBeEmpty = intersect(ABC, BCD, D);
    expect(shouldBeEmpty).toStrictEqual([]);
  });
});

describe('isInsideRange', () => {
  it('should function as expected', () => {
    const isSingleDigit = (number) => isInsideRange(number, 0, 9);

    expect(isSingleDigit(0)).toBe(true);
    expect(isSingleDigit(3.2)).toBe(true);
    expect(isSingleDigit(9)).toBe(true);

    expect(isSingleDigit(-0.1)).toBe(false);
    expect(isSingleDigit(10)).toBe(false);

    expect(isSingleDigit(Number.POSITIVE_INFINITY)).toBe(false);
    expect(isSingleDigit(Number.NEGATIVE_INFINITY)).toBe(false);
    expect(isSingleDigit(Number.NaN)).toBe(false);
  });
});

describe('moveArrayElement', () => {
  it('should move element forwards', () => {
    // Move B from being 2nd in the array (position 1) to being 3rd (position 2)
    const result = moveArrayElement(ABCD, 1, 2);
    expect(result).toStrictEqual(['A', 'C', 'B', 'D']);
  });

  it('should move element backwards', () => {
    // Move C from being 3rd (position 2) to being 2nd (position 1)
    const result = moveArrayElement(ABCD, 2, 1);
    expect(result).toStrictEqual(['A', 'C', 'B', 'D']);
  });

  it('should not allow to move element outside of range', () => {
    // Move C from being 3rd (position 2) to being last (position 3+)
    const firstResult = moveArrayElement(ABCD, 2, 100);
    expect(firstResult).toStrictEqual(['A', 'B', 'D', 'C']);

    // Move C from being 3rd (position 2) to being first (position 0-)
    const secondResult = moveArrayElement(ABCD, 2, -100);
    expect(secondResult).toStrictEqual(['C', 'A', 'B', 'D']);
  });
});

describe('getAbsolutePosition', () => {
  it('should return clamped number', () => {
    const resultWithinLimits = getAbsolutePosition({
      currentPosition: 10,
      minPosition: 0,
      maxPosition: 20,
      desiredPosition: 11,
    });
    expect(resultWithinLimits).toBe(11);

    const resultBelowLimit = getAbsolutePosition({
      currentPosition: 10,
      minPosition: 0,
      maxPosition: 20,
      desiredPosition: -3,
    });
    expect(resultBelowLimit).toBe(0);

    const resultAboveLimit = getAbsolutePosition({
      currentPosition: 10,
      minPosition: 0,
      maxPosition: 20,
      desiredPosition: 33,
    });
    expect(resultAboveLimit).toBe(20);
  });

  it('should return top and bottom limit', () => {
    const resultToBack = getAbsolutePosition({
      currentPosition: 10,
      minPosition: 0,
      maxPosition: 20,
      desiredPosition: LAYER_DIRECTIONS.BACK,
    });
    expect(resultToBack).toBe(0);

    const resultToFront = getAbsolutePosition({
      currentPosition: 10,
      minPosition: 0,
      maxPosition: 20,
      desiredPosition: LAYER_DIRECTIONS.FRONT,
    });
    expect(resultToFront).toBe(20);
  });

  it('should return relative position', () => {
    const resultGoingBackward = getAbsolutePosition({
      currentPosition: 10,
      minPosition: 0,
      maxPosition: 20,
      desiredPosition: LAYER_DIRECTIONS.BACKWARD,
    });
    expect(resultGoingBackward).toBe(9);

    const resultGoingBelow = getAbsolutePosition({
      currentPosition: 0,
      minPosition: 0,
      maxPosition: 20,
      desiredPosition: LAYER_DIRECTIONS.BACKWARD,
    });
    expect(resultGoingBelow).toBe(0);

    const resultGoingForward = getAbsolutePosition({
      currentPosition: 10,
      minPosition: 0,
      maxPosition: 20,
      desiredPosition: LAYER_DIRECTIONS.FORWARD,
    });
    expect(resultGoingForward).toBe(11);

    const resultGoingAbove = getAbsolutePosition({
      currentPosition: 20,
      minPosition: 0,
      maxPosition: 20,
      desiredPosition: LAYER_DIRECTIONS.FORWARD,
    });
    expect(resultGoingAbove).toBe(20);
  });

  it('should ignore invalid input', () => {
    const resultGoingBackward = getAbsolutePosition({
      currentPosition: 10,
      minPosition: 0,
      maxPosition: 20,
      desiredPosition: 'OFF_THE_CHARTS',
    });
    expect(resultGoingBackward).toBe(10);

    const resultGoingForward = getAbsolutePosition({
      currentPosition: 10,
      minPosition: 0,
      maxPosition: 20,
      desiredPosition: [15],
    });
    expect(resultGoingForward).toBe(10);
  });
});

describe('removeAnimationsWithElementIds', () => {
  it('should return an empty array if no animations passed in', () => {
    expect(removeAnimationsWithElementIds()).toStrictEqual([]);
  });

  it('should return all animations if no ids passed in', () => {
    const animations = [{ id: 'a', targets: ['e1'] }];
    expect(removeAnimationsWithElementIds(animations)).toStrictEqual(
      animations
    );
  });

  it('should filter out animations with matching ids', () => {
    const animations = [
      { id: 'a', targets: ['e1'] },
      { id: 'b', targets: ['e2'] },
      { id: 'c', targets: ['e1'] },
    ];
    expect(removeAnimationsWithElementIds(animations, ['e1'])).toStrictEqual([
      { id: 'b', targets: ['e2'] },
    ]);
  });
});

describe('updateAnimations', () => {
  it('should return original if no updates requested', () => {
    const animations = [
      { id: 'a', targets: ['e1'] },
      { id: 'b', targets: ['e2'] },
      { id: 'c', targets: ['e1'] },
    ];
    const updates = {};
    expect(updateAnimations(animations, updates)).toStrictEqual(animations);
  });
  it('should delete animations if requested', () => {
    const animations = [
      { id: 'a', targets: ['e1'] },
      { id: 'b', targets: ['e2'] },
      { id: 'c', targets: ['e1'] },
    ];
    const updates = { b: { delete: true } };
    expect(updateAnimations(animations, updates)).toStrictEqual([
      { id: 'a', targets: ['e1'] },
      { id: 'c', targets: ['e1'] },
    ]);
  });
  it('should modify animations if requested', () => {
    const animations = [
      { id: 'a', targets: ['e1'] },
      { id: 'b', targets: ['e2'] },
      { id: 'c', targets: ['e1'] },
    ];
    const updates = { b: { id: 'b', targets: ['e2'], newProp: 'x' } };
    expect(updateAnimations(animations, updates)).toStrictEqual([
      { id: 'a', targets: ['e1'] },
      { id: 'b', targets: ['e2'], newProp: 'x' },
      { id: 'c', targets: ['e1'] },
    ]);
  });
  it('should add animations if requested', () => {
    const animations = [
      { id: 'a', targets: ['e1'] },
      { id: 'b', targets: ['e2'] },
      { id: 'c', targets: ['e1'] },
    ];
    const updates = { d: { id: 'd', targets: ['e3'] } };
    expect(updateAnimations(animations, updates)).toStrictEqual([
      { id: 'a', targets: ['e1'] },
      { id: 'b', targets: ['e2'] },
      { id: 'c', targets: ['e1'] },
      { id: 'd', targets: ['e3'] },
    ]);
  });
});

describe('removeDuplicates', () => {
  it('should return an empty array if nothing passed in', () => {
    expect(removeDuplicates()).toStrictEqual([]);
  });
});

describe('exclusion', () => {
  it('should return entries from right not present in left', () => {
    const left = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    const right = [{ id: 'a' }, { id: 'd' }, { id: 'e' }];
    expect(exclusion(left, right)).toStrictEqual([{ id: 'd' }, { id: 'e' }]);
  });

  it('should return only last instance of entries with duplicate keys', () => {
    const left = [];
    const right = [
      { id: 'a', prop: 1 },
      { id: 'a', prop: 2 },
      { id: 'a', prop: 3 },
    ];
    expect(exclusion(left, right)).toStrictEqual([{ id: 'a', prop: 3 }]);
  });

  it('should return an empty array if no new entries present', () => {
    const left = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    const right = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    expect(exclusion(left, right)).toStrictEqual([]);
  });

  it('should return an empty array if nothing passed in', () => {
    expect(exclusion()).toStrictEqual([]);
  });
});
