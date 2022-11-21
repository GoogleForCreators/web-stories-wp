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
import { __ } from '@googleforcreators/i18n';
import {
  PAGE_WIDTH,
  FULLBLEED_HEIGHT,
  DANGER_ZONE_HEIGHT,
  dataToEditorY,
  getBox,
  ElementBox,
} from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import createAnimation from '../parts/createAnimation';
import {
  AMPEffectTiming,
  AnimationDirection,
  AnimationType,
  Element,
  FieldType,
} from '../types';

function getTargetScale({ width, height }: ElementBox) {
  if (width < PAGE_WIDTH || height < FULLBLEED_HEIGHT) {
    const scaleFactor = 1.25;

    const widthScale = width < PAGE_WIDTH ? PAGE_WIDTH / width : 1;
    const heightScale =
      height < FULLBLEED_HEIGHT ? FULLBLEED_HEIGHT / height : 1;

    return Math.max(widthScale, heightScale) * scaleFactor;
  }

  return 1;
}

export interface PanEffect extends AMPEffectTiming {
  panDir?: AnimationDirection;
  type: AnimationType.EffectPan;
}

export function EffectPan(
  {
    panDir = AnimationDirection.RightToLeft,
    duration = 1000,
    delay,
    easing,
  }: PanEffect,
  element: Element
) {
  const timings: AMPEffectTiming = {
    fill: 'both',
    duration,
    delay,
    easing,
  };

  const scale = getTargetScale(element);
  const scaledElement: ElementBox = {
    x: element.x,
    y: element.y,
    width: element.width * scale,
    height: element.height * scale,
    rotationAngle: element.rotationAngle,
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
    case AnimationDirection.TopToBottom:
      startX = (alignLeft + alignRight) / 2;
      startY = alignTop;
      endX = (alignLeft + alignRight) / 2;
      endY = alignBottom;
      break;
    case AnimationDirection.BottomToTop:
      startX = (alignLeft + alignRight) / 2;
      startY = alignBottom;
      endX = (alignLeft + alignRight) / 2;
      endY = alignTop;
      break;
    case AnimationDirection.LeftToRight:
      startX = alignLeft;
      startY = alignTop;
      endX = alignRight;
      endY = alignTop;
      break;
    case AnimationDirection.RightToLeft:
    default:
      startX = alignRight;
      startY = alignTop;
      endX = alignLeft;
      endY = alignTop;
  }

  const keyframes = {
    transform: [
      `translate(${startX}%, ${startY}%) scale(${scale})`,
      `translate(${endX}%, ${endY}%) scale(${scale})`,
    ],
    'transform-origin': 'left top',
  };

  return createAnimation(keyframes, timings, false);
}

export const fields = {
  panDir: {
    label: __('Direction', 'web-stories'),
    type: FieldType.DirectionPicker,
    values: [
      AnimationDirection.TopToBottom,
      AnimationDirection.BottomToTop,
      AnimationDirection.LeftToRight,
      AnimationDirection.RightToLeft,
    ],
    defaultValue: AnimationDirection.BottomToTop,
  },
};
