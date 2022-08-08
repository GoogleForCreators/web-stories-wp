/*
 * Copyright 2022 Google LLC
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
import useMediaRecording from './useMediaRecording';
import Countdown from './countdown';
import ProgressBar from './progressBar';
import PlaybackMedia from './playbackMedia';
import ErrorDialog from './errorDialog';
import PermissionsDialog from './permissionsDialog';
import ProcessingOverlay from './processingOverlay';
import { Wrapper } from './components';

function MediaRecording() {
  const { status, error, needsPermissions, isProcessingTrim } =
    useMediaRecording(({ state }) => ({
      status: state.status,
      error: state.error,
      needsPermissions:
        ('idle' === state.status || 'acquiring_media' === state.status) &&
        !state.videoInput,
      isProcessingTrim: state.isProcessingTrim,
    }));

  const isFailed = 'failed' === status || Boolean(error);

  if (isFailed) {
    return <ErrorDialog />;
  }

  if (needsPermissions) {
    return <PermissionsDialog />;
  }

  return (
    <>
      <Wrapper>
        <PlaybackMedia />
        {isProcessingTrim && <ProcessingOverlay />}
      </Wrapper>
      <ProgressBar />
      <Countdown />
    </>
  );
}

export default MediaRecording;
