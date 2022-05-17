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
import { firstPageAnimation } from '../firstPageAnimation';

describe('firstPageAnimation', () => {
  it('should return false if animations is empty', () => {
    const animations = [];
    const test = firstPageAnimation(animations);
    expect(test).toBe(false);
  });

  it('should return true if animations is not empty', () => {
    const animations = [
      {
        delay: 0,
        duration: 1600,
        id: '530d9a8d-d5d9-45d6-807d-2dab3fe6dd1d',
        targets: ['cea32b1d-7539-4b0c-86b8-7b731c692f7b'],
        type: 'effect-drop',
      },
    ];
    const test = firstPageAnimation(animations);

    expect(test).toBe(true);
  });

  it('should return false if animations is undefined', () => {
    const animations = undefined;
    const test = firstPageAnimation(animations);
    expect(test).toBe(false);
  });
});
