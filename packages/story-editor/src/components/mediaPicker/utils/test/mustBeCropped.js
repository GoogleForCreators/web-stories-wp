/*
 * Copyright 2021 Google LLC
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
import mustBeCropped from '../mustBeCropped';

describe('mustBeCropped', () => {
  it('flexible height / width false, and height and with 0', () => {
    const result = mustBeCropped(false, false, 0, 0, 0, 0);
    expect(result).toBeFalse();
  });

  it('flexible height / width', () => {
    const result = mustBeCropped(true, true, 300, 300, 300, 300);
    expect(result).toBeFalse();
  });

  it('matching values', () => {
    const result = mustBeCropped(false, false, 300, 300, 300, 300);
    expect(result).toBeFalse();
  });

  it('larger height and width', () => {
    const result = mustBeCropped(false, false, 300, 300, 500, 505);
    expect(result).toBeTrue();
  });

  it('same aspect ratio', () => {
    const result = mustBeCropped(false, false, 300, 300, 500, 500);
    expect(result).toBeFalse();
  });

  it('smaller values', () => {
    const result = mustBeCropped(false, false, 680, 853, 300, 300);
    expect(result).toBeTrue();
  });
});
