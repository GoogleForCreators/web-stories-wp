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
import {
  dataToEditorY,
  getBox,
  DANGER_ZONE_HEIGHT,
  type ElementBox,
  type DimensionableElement,
} from '@googleforcreators/units';

function calcTopOffset(box: ElementBox, dangerZoneOffset: number): number {
  const { y, height } = box;
  const toTop = dangerZoneOffset + y;
  return -Number(Number((toTop / height) * 100.0 + 100.0).toFixed(5));
}

function calcBottomOffset(box: ElementBox, dangerZoneOffset: number): number {
  const { y, height } = box;
  const toBottom = 100 - y + dangerZoneOffset;
  return Number(Number((toBottom / height) * 100.0).toFixed(5));
}

function calcLeftOffset(box: ElementBox): number {
  const { x, width } = box;
  return -Number(Number((x / width) * 100.0 + 100.0).toFixed(5));
}

function calcRightOffset(box: ElementBox): number {
  const { x, width } = box;
  const toRight = 100 - x;
  return Number(Number((toRight / width) * 100.0).toFixed(5));
}

function getOffPageOffset(element: DimensionableElement) {
  const box = getBox(element, 100, 100);
  const dangerZoneOffset = dataToEditorY(DANGER_ZONE_HEIGHT, 100);

  return {
    offsetTop: calcTopOffset(box, dangerZoneOffset),
    offsetBottom: calcBottomOffset(box, dangerZoneOffset),
    offsetLeft: calcLeftOffset(box),
    offsetRight: calcRightOffset(box),
  };
}

export default getOffPageOffset;
