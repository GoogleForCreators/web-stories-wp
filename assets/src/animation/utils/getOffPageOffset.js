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
} from '../../edit-story/constants';
import { dataToEditorY, getBox } from '../../edit-story/units/dimensions';

const FULLBLEED_HEIGHT = PAGE_WIDTH / FULLBLEED_RATIO;
const DANGER_ZONE_HEIGHT = (FULLBLEED_HEIGHT - PAGE_HEIGHT) / 2;

function calcTopOffset(box, dangerZoneOffset) {
  const { y, height } = box;
  const toTop = dangerZoneOffset + y;
  return -Number((toTop / height) * 100.0 + 100.0).toFixed(5);
}

function calcBottomOffset(box, dangerZoneOffset) {
  const { y, height } = box;
  const toBottom = 100 - y + dangerZoneOffset;
  return Number((toBottom / height) * 100.0).toFixed(5);
}

function calcLeftOffset(box) {
  const { x, width } = box;
  return -Number((x / width) * 100.0 + 100.0).toFixed(5);
}

function calcRightOffset(box) {
  const { x, width } = box;
  const toRight = 100 - x;
  return Number((toRight / width) * 100.0).toFixed(5);
}

function getOffPageOffset(element) {
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
