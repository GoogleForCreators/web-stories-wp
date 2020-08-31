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
import { getCorners } from './getBoundRect';

const FULLBLEED_HEIGHT = PAGE_WIDTH / FULLBLEED_RATIO;
const DANGER_ZONE_HEIGHT = (FULLBLEED_HEIGHT - PAGE_HEIGHT) / 2;

const isLinkBelowLimit = (element, verifyLink = true) => {
  if (verifyLink && !element.link?.url?.length > 0) {
    return false;
  }
  const limit = FULLBLEED_HEIGHT * 0.8 - DANGER_ZONE_HEIGHT;
  const { x, y, width, height, rotationAngle } = element;
  const points = getCorners(rotationAngle, x, y, width, height);
  return Object.keys(points).find((point) => points[point].y > limit);
};

export default isLinkBelowLimit;
