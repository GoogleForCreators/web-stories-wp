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
import { generatePatternStyles } from '@googleforcreators/patterns';
import type { ShapeElement } from '@googleforcreators/elements';

/**
 * Internal dependencies
 */
import type { OutputProps } from '../types';

/**
 * Returns AMP HTML for saving into post content for displaying in the FE.
 *
 * @param props Props.
 * @return Rendered component.
 */
function ShapeOutput({
  element: { backgroundColor, isDefaultBackground },
}: OutputProps<ShapeElement>) {
  const style = isDefaultBackground
    ? null
    : generatePatternStyles(backgroundColor);
  // willChange added by #7380 https://github.com/googleforcreators/web-stories-wp/pull/7380
  // to prevent issues with the border radius on shapes not being respected when animated
  return <div className="fill" style={{ ...style, willChange: 'transform' }} />;
}

export default ShapeOutput;
