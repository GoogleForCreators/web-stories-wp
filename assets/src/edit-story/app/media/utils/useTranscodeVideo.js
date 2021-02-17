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
 * External dependencies
 */
import { v4 as uuidv4 } from 'uuid';
import { useFeature } from 'flagged';

/**
 * Internal dependencies
 */
import { useConfig } from '../../config';
import { useCurrentUser } from '../../currentUser';
import {
  MEDIA_TRANSCODING_MAX_FILE_SIZE,
  MEDIA_TRANSCODING_SUPPORTED_INPUT_TYPES,
} from '../../../constants';
import getFileName from './getFileName';

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Checks whether the file size is too large for transcoding.
 *
 * @see https://github.com/ffmpegwasm/ffmpeg.wasm/tree/9b56b7f05b552c404aa0f62f46bed2592d9daf06#what-is-the-maximum-size-of-input-file
 *
 * @param {File} file File object.
 * @param {number} file.size File size.
 * @return {boolean} Whether the file is too  large.
 */
const isFileTooLarge = ({ size }) => size >= MEDIA_TRANSCODING_MAX_FILE_SIZE;

function useTranscodeVideo() {
  const { ffmpegCoreUrl } = useConfig();
  const {
    state: { currentUser },
  } = useCurrentUser();
  const isFeatureEnabled = useFeature('videoOptimization');

  /**
   * Transcode a video using ffmpeg.
   *
   * @param {File} file File object of original video file.
   * @return {Promise<File>} File object of transcoded video file.
   */
  async function transcodeVideo(file) {
    const { createFFmpeg, fetchFile } = await import(
      /* webpackChunkName: "chunk-ffmpeg" */ '@ffmpeg/ffmpeg'
    );

    const ffmpeg = createFFmpeg({
      corePath: ffmpegCoreUrl,
      log: isDevelopment,
    });
    await ffmpeg.load();

    const tempFileName = uuidv4() + '.mp4';
    const outputFileName = getFileName(file) + '.mp4';

    ffmpeg.FS('writeFile', file.name, await fetchFile(file));
    // TODO: Optimize arguments.
    await ffmpeg.run(
      // Input filename.
      '-i',
      file.name,
      // Use H.264 video codec.
      '-vcodec',
      'libx264',
      // Resize videos if larger than 1080x1920, preserving aspect ratio.
      // See https://trac.ffmpeg.org/wiki/Scaling
      '-vf',
      "scale='min(1080,iw)':'min(1920,ih)':'force_original_aspect_ratio=decrease'",
      // As the name says...
      '-preset',
      'fast', // 'veryfast' seems to cause crashes.
      // Output filename. MUST be different from input filename.
      tempFileName
    );

    const data = ffmpeg.FS('readFile', tempFileName);
    return new File(
      [new Blob([data.buffer], { type: 'video/mp4' })],
      outputFileName,
      {
        type: 'video/mp4',
      }
    );
  }

  const canTranscodeFile = (file) =>
    MEDIA_TRANSCODING_SUPPORTED_INPUT_TYPES.includes(file.type);

  const isTranscodingEnabled = Boolean(
    currentUser.meta?.web_stories_media_optimization
  );

  return {
    isFeatureEnabled,
    isTranscodingEnabled,
    canTranscodeFile,
    isFileTooLarge,
    transcodeVideo,
  };
}

export default useTranscodeVideo;
