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

const isDevelopment = process.env.NODE_ENV === 'development';

const getFileName = ({ name }) => name.split('.').slice(0, -1).join('.');

function useTranscodeVideo() {
  const { ffmpegCoreUrl } = useConfig();
  const isFeatureEnabled = useFeature('videoOptimization');

  /**
   * Transcode a video using ffmpeg.
   *
   * @param {File} file File object of original video file.
   * @return {Promise<File>} File object of transcoded video file.
   */
  async function transcodeVideo(file) {
    const { createFFmpeg, fetchFile } = await import(
      /* webpackChunkName: "ffmpeg" */ '@ffmpeg/ffmpeg'
    );
    const ffmpeg = createFFmpeg({
      // Useful for testing, where corePath will be automatically defined.
      // See https://github.com/ffmpegwasm/ffmpeg.wasm/blob/bc8db3a1a5dca5c98026bdd1f8842e9a3c0cab1d/docs/api.md#createffmpegoptions-ffmpeg
      // TODO: Don't do this. Load from CDN instead. The files are way too big.
      corePath: isDevelopment ? ffmpegCoreUrl : undefined,
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
      "scale='min(1080,iw)':'min(1920,ih)'",
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

  //eslint-disable-next-line require-await -- So the caller will always get an async function.
  const transcodeVideoNoop = async (file) => file;

  return isFeatureEnabled ? transcodeVideo : transcodeVideoNoop;
}

export default useTranscodeVideo;
