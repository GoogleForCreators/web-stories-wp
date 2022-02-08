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
import SAT from 'sat';

/**
 * Internal dependencies
 */
import createPolygon from '../app/canvas/utils/createPolygon';

function isTargetCoveringContainer(target, container) {
  const targetBox = target.getBoundingClientRect();
  const containerBox = container.getBoundingClientRect();

  // Fix for snapping issue: https://github.com/GoogleForCreators/web-stories-wp/pull/10458#discussion_r801633826
  const tolerance = 2;
  const targetPolygon = createPolygon(
    0,
    targetBox.x - tolerance,
    targetBox.y - tolerance,
    targetBox.width + tolerance * 2,
    targetBox.height + tolerance * 2
  );
  const containerPolygon = createPolygon(
    0,
    containerBox.x,
    containerBox.y,
    containerBox.width,
    containerBox.height
  );

  const response = new SAT.Response();
  SAT.testPolygonPolygon(targetPolygon, containerPolygon, response);
  return response.bInA;
}

export default isTargetCoveringContainer;
