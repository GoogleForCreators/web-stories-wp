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
export const CARD_TYPE = {
  SINGLE_ISSUE: 'single_issue',
  MULTIPLE_ISSUE: 'multiple_issue',
};
export const GRID_VARIANT = {
  SINGLE_WITH_THUMBNAIL: 'single_with_thumbnail',
  SINGLE: 'single',
  DEFAULT: 'single',
  MULTIPLE_WITH_THUMBNAIL: 'multiple_with_thumbnail',
  MULTIPLE_WITH_THUMBNAIL_WITH_CTA: 'multiple_with_thumbnail_with_cta',
  MULTIPLE_WITH_THUMBNAIL_OVERFLOW: ' multiple_with_thumbnail_overflow',
};

export const GRID_TEMPLATE_AREA = {
  [GRID_VARIANT.SINGLE]: "'title title' 'cta thumbnail' 'footer footer'",
  [GRID_VARIANT.SINGLE_WITH_THUMBNAIL]:
    "'title thumbnail' 'cta thumbnail' 'footer footer'",
  [GRID_VARIANT.MULTIPLE_WITH_THUMBNAIL]:
    "'title title' 'thumbnail thumbnail' 'footer footer'",
  [GRID_VARIANT.MULTIPLE_WITH_THUMBNAIL_WITH_CTA]:
    "'title title' 'thumbnail thumbnail' 'cta cta' 'footer footer'",
  [GRID_VARIANT.MULTIPLE_WITH_THUMBNAIL_WITH_CTA_OVERFLOW]:
    "'title title' 'thumbnail thumbnail' 'cta cta' 'footer footer'",
};
