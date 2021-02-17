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

// List of mime types supported by the video transcoding.
// Based on the demuxers list as of FFmpeg 4.3.
export const MEDIA_TRANSCODING_SUPPORTED_INPUT_TYPES = [
  'video/3gpp',
  'video/3gpp2',
  'video/MP2T',
  'video/mp4',
  'video/mpeg',
  'video/ogg',
  'video/quicktime',
  'video/webm',
  'video/x-flv',
  'video/x-h261',
  'video/x-h263',
  'video/x-m4v',
  'video/x-matroska',
  'video/x-mjpeg',
  'video/x-ms-asf',
  'video/x-msvideo',
  'video/x-nut',
];
