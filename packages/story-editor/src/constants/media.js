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

const GB_IN_BYTES = 1024 * 1024 * 1024;

export const MEDIA_TRANSCODING_MAX_FILE_SIZE = 2 * GB_IN_BYTES;

export const MEDIA_POSTER_IMAGE_FILE_TYPE = 'jpeg';
export const MEDIA_POSTER_IMAGE_MIME_TYPE = 'image/jpeg';

export const MEDIA_TRANSCODED_MIME_TYPE = 'video/mp4';
export const MEDIA_TRANSCODED_FILE_TYPE = 'mp4';

// Minimum duration time in milliseconds for a video
export const MEDIA_VIDEO_MINIMUM_DURATION = 100;

export const MEDIA_VIDEO_DIMENSIONS_THRESHOLD = {
  HEIGHT: 720,
  WIDTH: 1280,
};

export const MEDIA_VIDEO_FILE_SIZE_THRESHOLD = 4_000_000;

// This could eventually also include WebM/VP9
export const MEDIA_MIME_TYPES_OPTIMIZED_VIDEOS = ['video/mp4'];
