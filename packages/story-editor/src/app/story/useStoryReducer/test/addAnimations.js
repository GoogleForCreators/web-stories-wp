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
import { setupReducer } from './_utils';

describe('addAnimations', () => {
  it('should ignore non-list arguments', () => {
    const { restore, addAnimations } = setupReducer();

    // Set an initial state with a current page and an animation.
    const initialState = restore({
      pages: [{ id: '111', elements: [{ id: '000' }] }],
      current: '111',
    });

    const result = addAnimations({ animations: false });

    expect(result).toStrictEqual(initialState);
  });

  it('should ignore an empty list', () => {
    const { restore, addAnimations } = setupReducer();

    // Set an initial state with a current page and other animations.
    const initialState = restore({
      pages: [{ id: '111', animations: [{ id: '000' }] }],
      current: '111',
    });

    const result = addAnimations({ animations: [] });

    expect(result).toStrictEqual(initialState);
  });

  it('should add all new animations to the current page', () => {
    const { restore, addAnimations } = setupReducer();

    // Set an initial state with a current page and other animations
    restore({
      pages: [{ id: '111', animations: [{ id: '000' }] }],
      current: '111',
    });

    const result = addAnimations({
      animations: [{ id: '123' }, { id: '234' }],
    });

    expect(result.pages[0]).toStrictEqual({
      id: '111',
      animations: [{ id: '000' }, { id: '123' }, { id: '234' }],
    });
  });

  it('should add animations even if page has no animation array', () => {
    const { restore, addAnimations } = setupReducer();

    // Set an initial state with a current page and no animations
    restore({
      pages: [{ id: '111' }],
      current: '111',
    });

    const result = addAnimations({
      animations: [{ id: '123' }, { id: '234' }],
    });

    expect(result.pages[0]).toStrictEqual({
      id: '111',
      animations: [{ id: '123' }, { id: '234' }],
    });
  });

  it('should skip animations matching existing ids', () => {
    const { restore, addAnimations } = setupReducer();

    // Set an initial state with a current page and other animations
    restore({
      pages: [{ id: '111', animations: [{ id: '000', a: 1 }] }],
      current: '111',
    });

    const result = addAnimations({
      animations: [{ id: '123' }, { id: '000', a: 2 }],
    });

    expect(result.pages[0]).toStrictEqual({
      id: '111',
      animations: [{ id: '000', a: 1 }, { id: '123' }],
    });
  });

  it('should only add animations with unique ids (using the latter)', () => {
    const { restore, addAnimations } = setupReducer();

    // Set an initial state with a current page and other elements.
    restore({
      pages: [{ id: '111', animations: [{ id: '000' }] }],
      current: '111',
    });

    const result = addAnimations({
      animations: [
        { id: '123', a: 1 },
        { id: '123', a: 2 },
      ],
    });

    expect(result.pages[0]).toStrictEqual({
      id: '111',
      animations: [{ id: '000' }, { id: '123', a: 2 }],
    });
  });
});
