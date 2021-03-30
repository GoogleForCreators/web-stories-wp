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
import * as generalGuidance from './general';
import * as mediaGuidance from './media';
import * as textGuidance from './text';

export default {
  story: [
    generalGuidance.storyPagesCount,
    generalGuidance.storyTitleLength,
    textGuidance.storyTooLittleText,
  ],
  page: [mediaGuidance.videoElementSizeOnPage, textGuidance.pageTooMuchText],
  video: [
    mediaGuidance.mediaElementResolution,
    mediaGuidance.videoElementLength,
  ],
  gif: [
    mediaGuidance.mediaElementSizeOnPage,
    mediaGuidance.mediaElementResolution,
  ],
  image: [
    mediaGuidance.mediaElementSizeOnPage,
    mediaGuidance.mediaElementResolution,
  ],
};
