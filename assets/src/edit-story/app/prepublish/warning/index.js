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
import * as accessibilityWarnings from './accessibility';
import * as distributionWarnings from './distribution';

export const story = [distributionWarnings.storyMissingExcerpt];
export const page = [accessibilityWarnings.pageTooManyLinks];
export const element = [
  {
    type: 'text',
    checklist: [
      accessibilityWarnings.textElementFontLowContrast,
      accessibilityWarnings.textElementFontSizeTooSmall,
    ],
  },
  {
    type: ['image', 'gif'],
    checklist: [
      accessibilityWarnings.imageElementLowResolution,
      accessibilityWarnings.imageElementMissingAlt,
    ],
  },
  {
    type: 'video',
    checklist: [
      accessibilityWarnings.videoElementMissingTitle,
      accessibilityWarnings.videoElementMissingAlt,
      accessibilityWarnings.videoElementMissingCaptions,
    ],
  },
  {
    type: ['text', 'image', 'shape', 'video', 'gif'],
    checklist: [accessibilityWarnings.elementLinkTappableRegionTooSmall],
  },
];
