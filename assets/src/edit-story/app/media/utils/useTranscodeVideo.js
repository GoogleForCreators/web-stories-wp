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

  // TODO: Check for ffmpeg's list of supported file types instead.
  // See `ffmpeg -demuxers`
  // TODO: Add max size check.
  // See https://github.com/ffmpegwasm/ffmpeg.wasm#what-is-the-maximum-size-of-input-file
  const canTranscodeFile = (file) =>
    isFeatureEnabled && file.type.startsWith('video/');

  return {
    canTranscodeFile,
    transcodeVideo,
  };
}

export default useTranscodeVideo;
