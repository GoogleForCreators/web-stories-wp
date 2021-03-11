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
import { getTimeTracker, trackError } from '@web-stories-wp/tracking';
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

/**
 * Custom hook to interact with FFmpeg.
 *
 * @see https://ffmpeg.org/ffmpeg.html
 *
 * @return {{
 * isFeatureEnabled: boolean,
 * isFileTooLarge: (function(File): boolean),
 * isTranscodingEnabled: boolean,
 * canTranscodeFile: (function(File): boolean),
 * transcodeVideo: (function(File): Promise<File>)
 * getFirstFrameOfVideo: (function(File): Promise<File>)
 * }} Functions and vars related to FFmpeg usage.
 */
function useFFmpeg() {
  const { ffmpegCoreUrl } = useConfig();
  const {
    state: { currentUser },
  } = useCurrentUser();
  /**
   * Whether the video optimization flag is enabled.
   *
   * @type {boolean} Whether the feature flag is enabled.
   */
  const isFeatureEnabled = useFeature('videoOptimization');

  async function getFFmpegInstance(file) {
    const { createFFmpeg, fetchFile } = await import(
      /* webpackChunkName: "chunk-ffmpeg" */ '@ffmpeg/ffmpeg'
    );

    const ffmpeg = createFFmpeg({
      corePath: ffmpegCoreUrl,
      log: isDevelopment,
    });
    await ffmpeg.load();

    ffmpeg.FS('writeFile', file.name, await fetchFile(file));

    return ffmpeg;
  }

  /**
   * Extract a video's first frame using FFmpeg.
   *
   * Exact seeking is not possible in most formats, so ffmpeg will seek to the closest seek point before position.
   *
   * @param {File} file Original video file object.
   * @return {Promise<File>} File object for the video frame.
   */
  async function getFirstFrameOfVideo(file) {
    //eslint-disable-next-line @wordpress/no-unused-vars-before-return
    const trackTiming = getTimeTracker('load_video_poster_ffmpeg');

    try {
      const ffmpeg = await getFFmpegInstance(file);

      const tempFileName = uuidv4() + '.jpeg';
      const outputFileName = getFileName(file) + '.jpeg';

      await ffmpeg.run(
        // Desired position.
        // Using as an input option (before -i) saves us some time by seeking to position.
        '-ss',
        '00:00:01.000',
        // Input filename.
        '-i',
        file.name,
        // Stop writing to the stream after 1 frame.
        '-frames:v',
        '1',
        // Resize videos if larger than 1080x1920, preserving aspect ratio.
        // See https://trac.ffmpeg.org/wiki/Scaling
        '-vf',
        "scale='min(1080,iw)':'min(1920,ih)':'force_original_aspect_ratio=decrease'",
        // Simpler color profile
        '-pix_fmt',
        'yuv420p',
        // As the name says...
        '-preset',
        'fast', // 'veryfast' seems to cause crashes.
        // Output filename. MUST be different from input filename.
        tempFileName
      );

      const data = ffmpeg.FS('readFile', tempFileName);
      return new File(
        [new Blob([data.buffer], { type: 'image/jpeg' })],
        outputFileName,
        {
          type: 'image/jpeg',
        }
      );
    } catch (err) {
      trackError('video_transcoding', err.message);
      throw err;
    } finally {
      trackTiming();
    }
  }

  /**
   * Transcode a video using FFmpeg.
   *
   * @param {File} file Original video file object.
   * @return {Promise<File>} Transcoded video file object.
   */
  async function transcodeVideo(file) {
    //eslint-disable-next-line @wordpress/no-unused-vars-before-return
    const trackTiming = getTimeTracker('load_video_transcoding');

    try {
      const ffmpeg = await getFFmpegInstance(file);

      const tempFileName = uuidv4() + '.mp4';
      const outputFileName = getFileName(file) + '.mp4';

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
        // move some information to the beginning of your file.
        '-movflags',
        '+faststart',
        // Simpler color profile
        '-pix_fmt',
        'yuv420p',
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
    } catch (err) {
      trackError('video_transcoding', err.message);
      throw err;
    } finally {
      trackTiming();
    }
  }

  /**
   * Determines whether the given file can be transcoded.
   *
   * @param {File} file File object.
   * @return {boolean} Whether transcoding is likely possible.
   */
  const canTranscodeFile = (file) =>
    MEDIA_TRANSCODING_SUPPORTED_INPUT_TYPES.includes(file.type);

  /**
   * Whether user opted in to video optimization.
   *
   * @type {boolean}
   */
  const isTranscodingEnabled = Boolean(
    currentUser.meta?.web_stories_media_optimization
  );

  return {
    isFeatureEnabled,
    isTranscodingEnabled,
    canTranscodeFile,
    isFileTooLarge,
    transcodeVideo,
    getFirstFrameOfVideo,
  };
}

export default useFFmpeg;
