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
  FULLBLEED_RATIO,
  PAGE_HEIGHT,
  PAGE_WIDTH,
} from '../../../edit-story/constants';
import { dataToEditorY, getBox } from '../../../edit-story/units/dimensions';
import { ANIMATION_EFFECTS, DIRECTION } from '../../constants';
import SimpleAnimation from '../../parts/simpleAnimation';

const FULLBLEED_HEIGHT = PAGE_WIDTH / FULLBLEED_RATIO;
const DANGER_ZONE_HEIGHT = (FULLBLEED_HEIGHT - PAGE_HEIGHT) / 2;

function getTargetScale({ width, height }) {
  if (width < PAGE_WIDTH || height < FULLBLEED_HEIGHT) {
    const scaleFactor = 1.25;

    const widthScale = width < PAGE_WIDTH ? PAGE_WIDTH / width : 1;
    const heightScale =
      height < FULLBLEED_HEIGHT ? FULLBLEED_HEIGHT / height : 1;

    return Math.max(widthScale, heightScale) * scaleFactor;
  }

  return 1;
}

export function EffectPan({
  panDir = DIRECTION.RIGHT_TO_LEFT,
  duration = 1000,
  delay,
  easing,
  element,
}) {
  const timings = {
    fill: 'both',
    duration,
    delay,
    easing,
  };

  const scale = getTargetScale(element);
  const scaledElement = {
    x: element.x,
    y: element.y,
    width: element.width * scale,
    height: element.height * scale,
  };

  const { x, y, width, height } = getBox(scaledElement, 100, 100);
  const dangerZoneOffset = dataToEditorY(DANGER_ZONE_HEIGHT, 100);

  const alignTop = -((dangerZoneOffset + y) / height) * 100.0;
  const alignRight = ((100 - (x + width)) / width) * 100.0;
  const alignLeft = -(x / width) * 100.0;
  const alignBottom =
    ((100 - (y + height) + dangerZoneOffset) / height) * 100.0;

  let startX, startY, endX, endY;

  switch (panDir) {
    case DIRECTION.TOP_TO_BOTTOM:
      startX = (alignLeft + alignRight) / 2;
      startY = alignTop;
      endX = (alignLeft + alignRight) / 2;
      endY = alignBottom;
      break;
    case DIRECTION.BOTTOM_TO_TOP:
      startX = (alignLeft + alignRight) / 2;
      startY = alignBottom;
      endX = (alignLeft + alignRight) / 2;
      endY = alignTop;
      break;
    case DIRECTION.LEFT_TO_RIGHT:
      startX = alignLeft;
      startY = alignTop;
      endX = alignRight;
      endY = alignTop;
      break;
    default:
      // RIGHT_TO_LEFT
      startX = alignRight;
      startY = alignTop;
      endX = alignLeft;
      endY = alignTop;
  }

  const animationName = `direction-${panDir}-scale-${scale}-${ANIMATION_EFFECTS.PAN}`;
  const keyframes = {
    transform: [
      `translate(${startX}%, ${startY}%) scale(${scale})`,
      `translate(${endX}%, ${endY}%) scale(${scale})`,
    ],
    'transform-origin': 'left top',
  };

  const { id, WAAPIAnimation, AMPTarget, AMPAnimation } = SimpleAnimation(
    animationName,
    keyframes,
    timings,
    false
  );

  return {
    id,
    WAAPIAnimation,
    AMPTarget,
    AMPAnimation,
    generatedKeyframes: {
      [animationName]: keyframes,
    },
  };
}
