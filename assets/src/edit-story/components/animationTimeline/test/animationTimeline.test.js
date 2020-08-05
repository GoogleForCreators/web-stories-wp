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
import AnimationTimeline from '..';
import { renderWithTheme } from '../../../testUtils';

describe('<AnimationTimeline />', function () {
  it('should generate the number of rows for animations provided.', function () {
    const animations = Array.from(Array(10).keys()).map((id) => ({
      id,
    }));
    const { queryAllByTestId } = renderWithTheme(
      <AnimationTimeline animations={animations} />
    );
    expect(queryAllByTestId('timeline-animation-item')).toHaveLength(
      animations.length
    );
  });
});
