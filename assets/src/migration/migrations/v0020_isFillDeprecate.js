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

const PAGE_WIDTH = 440;
const PAGE_HEIGHT = 660;
const FULLBLEED_RATIO = 9 / 16;
const FULLBLEED_HEIGHT = PAGE_WIDTH / FULLBLEED_RATIO;
const DANGER_ZONE_HEIGHT = (FULLBLEED_HEIGHT - PAGE_HEIGHT) / 2;

function isFillDeprecate({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }) {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement({ isFill, ...rest }) {
  if (isFill) {
    return {
      ...rest,
      x: 0,
      y: -DANGER_ZONE_HEIGHT,
      width: PAGE_WIDTH,
      height: PAGE_WIDTH / FULLBLEED_RATIO,
      rotationAngle: 0,
    };
  }
  return rest;
}

export default isFillDeprecate;
