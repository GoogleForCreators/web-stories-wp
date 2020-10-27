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
// import * as mediaGuidance from '../media';

describe('Pre-publish checklist - media guidelines (guidance)', () => {
  // triggered if only one video is on the page and it takes less than 50% of the safe zone area
  // encourage users to consider a more immersive media sizing and cropping.
  it.todo(
    'should return a message if a video or image element is too small on the page'
  );
  // actual image asset on screen, at the current zoom, offers <2x pixel density
  // guideline is to strive for >828 x 1792
  it.todo('should return a message if an image element has low resolution');
  // suggest breaking video up into multiple segments
  it.todo(
    'should return a message if the video element is longer than 1 minute'
  );
  it.todo('should return a message if the video element is less than 24fps');
  it.todo('should return a message if any videos are less than 480p');
  it.todo(
    'should return a message if any video resolution is too high to display on most mobile devices (>4k)'
  );
});
