/*
 * Copyright 2021 Google LLC
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

export const PAGE_RATIO = 2 / 3;
export const PAGE_WIDTH = 412;
export const PAGE_HEIGHT = 618;

export const FULLBLEED_RATIO = 9 / 16;

export const FULLBLEED_HEIGHT = PAGE_WIDTH / FULLBLEED_RATIO;
export const DANGER_ZONE_HEIGHT = (FULLBLEED_HEIGHT - PAGE_HEIGHT) / 2;

// Default 1em value for font size.
export const DEFAULT_EM = PAGE_HEIGHT * 0.02186;

// Default device pixel ratio.
export const DEFAULT_DPR = 0.5;
