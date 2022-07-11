import SAT from 'sat';

import { useUnits } from '@googleforcreators/units';
import useStory from '../app/story/useStory';
import useCanvas from '../app/canvas/useCanvas';

function useElementPolygon() {
  const nodesById = useCanvas(({ state: { nodesById } }) => nodesById);
  const bgElement = useStory(({ state }) => state.currentPage?.elements?.find(({ isBackground }) => isBackground));

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
      return { element, polygon: bgPolygon };
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
