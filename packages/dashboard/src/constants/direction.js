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
export const DIRECTIONS = {
  TOP: 'top',
  RIGHT: 'right',
  BOTTOM: 'bottom',
  LEFT: 'left',
};

export const CORNER_DIRECTIONS = {
  [`${DIRECTIONS.TOP}_${DIRECTIONS.LEFT}`]: `${DIRECTIONS.TOP}_${DIRECTIONS.LEFT}`,
  [`${DIRECTIONS.TOP}_${DIRECTIONS.RIGHT}`]: `${DIRECTIONS.TOP}_${DIRECTIONS.RIGHT}`,
  [`${DIRECTIONS.BOTTOM}_${DIRECTIONS.RIGHT}`]: `${DIRECTIONS.BOTTOM}_${DIRECTIONS.RIGHT}`,
  [`${DIRECTIONS.BOTTOM}_${DIRECTIONS.LEFT}`]: `${DIRECTIONS.BOTTOM}_${DIRECTIONS.LEFT}`,
};
