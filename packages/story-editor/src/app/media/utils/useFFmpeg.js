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
import { useCallback, useMemo } from '@googleforcreators/react';
import { getTimeTracker, trackError } from '@googleforcreators/tracking';
import {
  getExtensionFromMimeType,
  getFileName,
  blobToFile,
} from '@googleforcreators/media';

/**
 * Internal dependencies
 */
import { useConfig } from '../../config';
import { useCurrentUser } from '../../currentUser';
import {
  MEDIA_TRANSCODING_MAX_FILE_SIZE,
  MEDIA_VIDEO_DIMENSIONS_THRESHOLD,
  MEDIA_TRANSCODED_MIME_TYPE,
  MEDIA_TRANSCODED_FILE_TYPE,
  MEDIA_POSTER_IMAGE_MIME_TYPE,
  MEDIA_POSTER_IMAGE_FILE_TYPE,
} from '../../../constants';
import { TRANSCODABLE_MIME_TYPES } from '../constants';
import getPosterName from './getPosterName';

const isDevelopment =
  typeof WEB_STORIES_ENV !== 'undefined' && WEB_STORIES_ENV === 'development';

/**
 * Checks whether the file size is too large for transcoding.
 *
 * @see https://github.com/ffmpegwasm/ffmpeg.wasm/tree/9b56b7f05b552c404aa0f62f46bed2592d9daf06#what-is-the-maximum-size-of-input-file
 * @param {File} file File object.
 * @param {number} file.size File size.
 * @return {boolean} Whether the file is too  large.
 */
const isFileTooLarge = ({ size }) => size >= MEDIA_TRANSCODING_MAX_FILE_SIZE;

const FFMPEG_CONFIG = {
  CODEC: [
    // Use H.264 video codec.
    '-vcodec',
    'libx264',
  ],
  SCALE: [
    // Scale down to 720p as recommended by Storytime.
    // See https://trac.ffmpeg.org/wiki/Scaling
    // Adds 1px pad to width/height if they're not divisible by 2, which FFmpeg will complain about.
    '-vf',
    `scale='min(${MEDIA_VIDEO_DIMENSIONS_THRESHOLD.WIDTH},iw)':'min(${MEDIA_VIDEO_DIMENSIONS_THRESHOLD.HEIGHT},ih)':'force_original_aspect_ratio=decrease',pad='width=ceil(iw/2)*2:height=ceil(ih/2)*2'`,
  ],
  FPS: [
    // Reduce to 24fps as recommended by Storytime.
    // See https://trac.ffmpeg.org/wiki/ChangingFrameRate
    '-r',
    '24',
  ],
  FASTSTART: [
    // move some information to the beginning of your file.
    '-movflags',
    '+faststart',
  ],
  COLOR_PROFILE: [
    // Simpler color profile
    '-pix_fmt',
    'yuv420p',
  ],
  PRESET: [
    // As the name says...
    '-preset',
    'fast', // 'veryfast' seems to cause crashes.
  ],
  SEEK_TO_START: [
    // Desired position.
    // Using as an input option (before -i) saves us some time by seeking to position.
    '-ss',
    '00:00:01.000',
  ],
  SINGLE_FRAME: [
    // Stop writing to the stream after 1 frame.
    '-frames:v',
    '1',
  ],
};

const FFMPEG_SHARED_CONFIG = [
  ...FFMPEG_CONFIG.CODEC,
  ...FFMPEG_CONFIG.SCALE,
  ...FFMPEG_CONFIG.FPS,
  ...FFMPEG_CONFIG.FASTSTART,
  ...FFMPEG_CONFIG.COLOR_PROFILE,
  ...FFMPEG_CONFIG.PRESET,
];

/**
 * @typedef FFmpegData
 * @property {boolean} isTranscodingEnabled Whether transcoding is enabled.
 * @property {(file: File) => boolean} canTranscodeFile Whether a given file can be transcoded.
 * @property {(file: File) => boolean} isFileTooLarge Whether a given file is too large.
 * @property {(file: File) => Promise<File>} transcodeVideo Transcode a given video.
 * @property {(file: File) => Promise<File>} stripAudioFromVideo Strip audio from given video.
 * @property {(file: File) => Promise<File>} getFirstFrameOfVideo Get the first frame of a video.
 * @property {(file: File) => Promise<File>} convertGifToVideo Convert GIF to MP4.
 */

/**
 * Custom hook to interact with FFmpeg.
 *
 * @see https://ffmpeg.org/ffmpeg.html
 * @return {FFmpegData} Functions and vars related to FFmpeg usage.
 */
function useFFmpeg() {
  const {
    ffmpegCoreUrl,
    capabilities: { hasUploadMediaAction },
  } = useConfig();
  const { currentUser } = useCurrentUser(({ state }) => ({
    currentUser: state.currentUser,
  }));

  /**
   * Whether the video optimization feature is enabled.
   *
   *
   * @type {boolean} Whether the feature flag is enabled.
   */
  const isCrossOriginIsolationEnabled = Boolean(window?.crossOriginIsolated);

  const getFFmpegInstance = useCallback(
    async (file) => {
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
    },
    [ffmpegCoreUrl]
  );

  /**
   * Extract a video's first frame using FFmpeg.
   *
   * Exact seeking is not possible in most formats, so ffmpeg will seek to the closest seek point before position.
   *
   * @param {File} file Original video file object.
   * @return {Promise<File>} File object for the video frame.
   */
  const getFirstFrameOfVideo = useCallback(
    async (file) => {
      //eslint-disable-next-line @wordpress/no-unused-vars-before-return -- False positive because of the finally().
      const trackTiming = getTimeTracker('load_video_poster_ffmpeg');

      let ffmpeg;

      try {
        ffmpeg = await getFFmpegInstance(file);

        const tempFileName = uuidv4() + '.' + MEDIA_POSTER_IMAGE_FILE_TYPE;
        const originalFileName = getFileName(file);
        const outputFileName = getPosterName(originalFileName);

        await ffmpeg.run(
          ...FFMPEG_CONFIG.SEEK_TO_START,
          // Input filename.
          '-i',
          file.name,
          ...FFMPEG_CONFIG.SINGLE_FRAME,
          ...FFMPEG_CONFIG.SCALE,
          ...FFMPEG_CONFIG.COLOR_PROFILE,
          ...FFMPEG_CONFIG.PRESET,
          // Output filename. MUST be different from input filename.
          tempFileName
        );

        const data = ffmpeg.FS('readFile', tempFileName);

        return blobToFile(
          new Blob([data.buffer], { type: MEDIA_POSTER_IMAGE_MIME_TYPE }),
          outputFileName,
          MEDIA_POSTER_IMAGE_MIME_TYPE
        );
      } catch (err) {
        // eslint-disable-next-line no-console -- We want to surface this error.
        console.error(err);

        trackError('video_poster_generation_ffmpeg', err.message);

        throw err;
      } finally {
        try {
          ffmpeg.exit();
        } catch {
          // Not interested in errors here.
        }

        trackTiming();
      }
    },
    [getFFmpegInstance]
  );

  /**
   * Transcode a video using FFmpeg.
   *
   * @param {File} file Original video file object.
   * @return {Promise<File>} Transcoded video file object.
   */
  const transcodeVideo = useCallback(
    async (file) => {
      //eslint-disable-next-line @wordpress/no-unused-vars-before-return -- False positive because of the finally().
      const trackTiming = getTimeTracker('load_video_transcoding');

      let ffmpeg;

      try {
        ffmpeg = await getFFmpegInstance(file);

        const tempFileName = uuidv4() + '.' + MEDIA_TRANSCODED_FILE_TYPE;
        const outputFileName =
          getFileName(file) + '.' + MEDIA_TRANSCODED_FILE_TYPE;

        await ffmpeg.run(
          // Input filename.
          '-i',
          file.name,
          ...FFMPEG_SHARED_CONFIG,
          // Output filename. MUST be different from input filename.
          tempFileName
        );

        const data = ffmpeg.FS('readFile', tempFileName);

        return blobToFile(
          new Blob([data.buffer], { type: MEDIA_TRANSCODED_MIME_TYPE }),
          outputFileName,
          MEDIA_TRANSCODED_MIME_TYPE
        );
      } catch (err) {
        // eslint-disable-next-line no-console -- We want to surface this error.
        console.error(err);

        trackError('video_transcoding', err.message);

        throw err;
      } finally {
        try {
          ffmpeg.exit();
        } catch {
          // Not interested in errors here.
        }

        trackTiming();
      }
    },
    [getFFmpegInstance]
  );

  /**
   * Trim Video using FFmpeg.
   *
   * @param {File} file Original video file object.
   * @param {string} start Time stamp of start time of new video. Example '00:01:02.345'.
   * @param {string} end Time stamp of end time of new video. Example '00:02:00'.
   * @return {Promise<File>} Transcoded video file object.
   */
  const trimVideo = useCallback(
    async (file, start, end) => {
      //eslint-disable-next-line @wordpress/no-unused-vars-before-return -- False positive because of the finally().
      const trackTiming = getTimeTracker('load_trim_video_transcoding');

      let ffmpeg;

      try {
        ffmpeg = await getFFmpegInstance(file);

        const type = file?.type || MEDIA_TRANSCODED_MIME_TYPE;
        const ext = getExtensionFromMimeType(type);
        const tempFileName = uuidv4() + '.' + ext;
        const outputFileName = getFileName(file) + '-trimmed.' + ext;

        await ffmpeg.run(
          // Input filename.
          '-i',
          file.name,
          '-ss',
          start,
          '-to',
          end,
          tempFileName
        );
        const data = ffmpeg.FS('readFile', tempFileName);

        return blobToFile(
          new Blob([data.buffer], { type }),
          outputFileName,
          type
        );
      } catch (err) {
        // eslint-disable-next-line no-console -- We want to surface this error.
        console.log(err);

        trackError('trim_video_transcoding', err.message);

        throw err;
      } finally {
        try {
          ffmpeg.exit();
        } catch {
          // Not interested in errors here.
        }

        trackTiming();
      }
    },
    [getFFmpegInstance]
  );

  /**
   * Strip audio from video using FFmpeg.
   *
   * @param {File} file Original video file object.
   * @return {Promise<File>} Transcoded video file object.
   */
  const stripAudioFromVideo = useCallback(
    async (file) => {
      //eslint-disable-next-line @wordpress/no-unused-vars-before-return -- False positive because of the finally().
      const trackTiming = getTimeTracker('load_mute_video_transcoding');

      let ffmpeg;

      try {
        ffmpeg = await getFFmpegInstance(file);

        const type = file?.type || MEDIA_TRANSCODED_MIME_TYPE;
        const ext = getExtensionFromMimeType(type);
        const tempFileName = uuidv4() + '.' + ext;
        const outputFileName = getFileName(file) + '-muted.' + ext;

        await ffmpeg.run(
          // Input filename.
          '-i',
          file.name,
          '-vcodec',
          'copy',
          // Mute audio from video.
          '-an',
          // Output filename. MUST be different from input filename.
          tempFileName
        );

        const data = ffmpeg.FS('readFile', tempFileName);

        return blobToFile(
          new Blob([data.buffer], { type }),
          outputFileName,
          type
        );
      } catch (err) {
        // eslint-disable-next-line no-console -- We want to surface this error.
        console.log(err);

        trackError('mute_video_transcoding', err.message);

        throw err;
      } finally {
        try {
          ffmpeg.exit();
        } catch {
          // Not interested in errors here.
        }

        trackTiming();
      }
    },
    [getFFmpegInstance]
  );

  /**
   * Converts an animated GIF to a video using FFmpeg.
   *
   * @param {File} file Original GIF file object.
   * @return {Promise<File>} Converted video file object.
   */
  const convertGifToVideo = useCallback(
    async (file) => {
      //eslint-disable-next-line @wordpress/no-unused-vars-before-return -- False positive because of the finally().
      const trackTiming = getTimeTracker('load_gif_conversion');

      let ffmpeg;

      try {
        ffmpeg = await getFFmpegInstance(file);

        const tempFileName = uuidv4() + '.' + MEDIA_TRANSCODED_FILE_TYPE;
        const outputFileName =
          getFileName(file) + '.' + MEDIA_TRANSCODED_FILE_TYPE;

        await ffmpeg.run(
          // Input filename.
          '-i',
          file.name,
          ...FFMPEG_SHARED_CONFIG,
          // Output filename. MUST be different from input filename.
          tempFileName
        );

        const data = ffmpeg.FS('readFile', tempFileName);

        return new blobToFile(
          new Blob([data.buffer], { type: MEDIA_TRANSCODED_MIME_TYPE }),
          outputFileName,
          MEDIA_TRANSCODED_MIME_TYPE
        );
      } catch (err) {
        // eslint-disable-next-line no-console -- We want to surface this error.
        console.error(err);

        trackError('gif_conversion', err.message);

        throw err;
      } finally {
        try {
          ffmpeg.exit();
          // eslint-disable-next-line no-empty -- no-op
        } catch (e) {}

        trackTiming();
      }
    },
    [getFFmpegInstance]
  );

  /**
   * Determines whether the given file can be transcoded.
   *
   * @param {File} file File object.
   * @return {boolean} Whether transcoding is likely possible.
   */
  const canTranscodeFile = useCallback(
    (file) => TRANSCODABLE_MIME_TYPES.includes(file.type),
    []
  );

  /**
   * Whether user opted in to video optimization.
   *
   * @type {boolean}
   */
  const isUserSettingEnabled = Boolean(currentUser?.mediaOptimization);

  /**
   * Whether transcoding as a whole is supported.
   *
   * Considers user opt-in, cross-site isolation, and upload permissions.
   *
   * @type {boolean}
   */
  const isTranscodingEnabled =
    hasUploadMediaAction &&
    isUserSettingEnabled &&
    isCrossOriginIsolationEnabled;

  return useMemo(
    () => ({
      isTranscodingEnabled,
      canTranscodeFile,
      isFileTooLarge,
      transcodeVideo,
      stripAudioFromVideo,
      getFirstFrameOfVideo,
      convertGifToVideo,
      trimVideo,
    }),
    [
      isTranscodingEnabled,
      canTranscodeFile,
      transcodeVideo,
      stripAudioFromVideo,
      getFirstFrameOfVideo,
      convertGifToVideo,
      trimVideo,
    ]
  );
}

export default useFFmpeg;
