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
import { getPagePreviewHeights } from '../usePagePreviewSize';

describe('getPagePreviewHeights', () => {
  it('should return { fullBleedHeight: 359.11, storyHeight: 303 } when width is 202', () => {
    const previewHeights = getPagePreviewHeights(202);

    expect(previewHeights.fullBleedHeight).toBeCloseTo(359.11);
    expect(previewHeights.storyHeight).toBeCloseTo(303);
  });
  it('should return { fullBleedHeight: 451.55, storyHeight: 381 } when width is 202', () => {
    const previewHeights = getPagePreviewHeights(254);

    expect(previewHeights.fullBleedHeight).toBeCloseTo(451.56);
    expect(previewHeights.storyHeight).toBeCloseTo(381);
  });
});
