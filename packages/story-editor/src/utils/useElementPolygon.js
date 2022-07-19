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
 * External dependencies
 */
import SAT from 'sat';
import { useUnits } from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import useStory from '../app/story/useStory';
import useCanvas from '../app/canvas/useCanvas';

function useElementPolygon() {
  const nodesById = useCanvas(({ state: { nodesById } }) => nodesById);
  const bgElement = useStory(({ state }) =>
    state.currentPage?.elements?.find(({ isBackground }) => isBackground)
  );

  const getBox = useUnits(({ actions: { getBox } }) => getBox);
  const bgNode = nodesById[bgElement.id];
  const {
    x: bgX,
    y: bgY,
    width: bgWidth,
    height: bgHeight,
  } = bgNode.getBoundingClientRect();
  const bgPolygon = new SAT.Box(
    new SAT.Vector(bgX, bgY),
    bgWidth,
    bgHeight
  ).toPolygon();
  // The background element is offset by a certain amount, so add that back in for
  // other elements when resolving their position relative to it.
  const elementYOffset = -getBox(bgElement).y;
  const getElementPolygon = (element) => {
    if (element.isBackground) {
      return bgPolygon;
    }
    const { id, rotationAngle } = element;
    const node = nodesById[id];
    if (!node) {
      return null;
    }
    const box = getBox(element);
    // Note that we place the box at the center coordinate. We do this for the angle
    // to apply correctly. We correct for this offset with `setOffset`` later.
    const center = new SAT.Vector(
      bgPolygon.pos.x + box.x + box.width / 2,
      bgPolygon.pos.y + elementYOffset + box.y + box.height / 2
    );
    const elementBox = new SAT.Box(center, box.width, box.height);
    const polygon = elementBox.toPolygon();
    const offset = new SAT.Vector(-box.width / 2, -box.height / 2);
    polygon.setOffset(offset);
    polygon.setAngle((rotationAngle * Math.PI) / 180);
    return polygon;
  };

  return getElementPolygon;
}

export default useElementPolygon;
