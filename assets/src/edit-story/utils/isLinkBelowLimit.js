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
import { FULLBLEED_RATIO, PAGE_HEIGHT, PAGE_WIDTH } from '../constants';

const FULLBLEED_HEIGHT = PAGE_WIDTH / FULLBLEED_RATIO;
const DANGER_ZONE_HEIGHT = (FULLBLEED_HEIGHT - PAGE_HEIGHT) / 2;

const getYCoordinatesByAngle = ({ y, width, height, rotationAngle }) => {
  const radians = (rotationAngle * Math.PI) / 180;
  const centerY = y + height / 2;
  const sin = Math.sin(radians);
  const cos = Math.cos(radians);
  return [
    // Upper left
    centerY + (width / -2) * sin + (height / -2) * cos,
    // Upper right
    centerY + (width / 2) * sin + (height / -2) * cos,
    // Bottom right.
    centerY + (width / 2) * sin + (height / 2) * cos,
    // Bottom left.
    centerY + (width / -2) * sin + (height / 2) * cos,
  ];
};

const isLinkBelowLimit = (element) => {
  if (!element.link?.url?.length > 0) {
    return false;
  }
  const limit = FULLBLEED_HEIGHT * 0.8 - DANGER_ZONE_HEIGHT;
  const points = getYCoordinatesByAngle(element);
  return Boolean(points.find((y) => y > limit));
};

export default isLinkBelowLimit;
