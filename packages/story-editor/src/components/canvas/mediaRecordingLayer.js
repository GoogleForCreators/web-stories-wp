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
 * External dependencies
 */
import styled, { StyleSheetManager } from 'styled-components';
import stylisRTLPlugin from 'stylis-plugin-rtl';
Object.defineProperty(stylisRTLPlugin, 'name', { value: 'stylisRTLPlugin' });
import { __ } from '@googleforcreators/i18n';
import { useEffect, useMemo } from '@googleforcreators/react';
import { withOverlay } from '@googleforcreators/moveable';
import { FULLBLEED_RATIO } from '@googleforcreators/units';

/**
 * Internal dependencies
 */
import useConfig from '../../app/config/useConfig';
import { Z_INDEX_RECORDING_MODE } from '../../constants/zIndex';
import {
  useMediaRecording,
  SettingsModal,
  MediaRecording,
  DurationIndicator,
  Footer,
} from '../mediaRecording';
import VideoRecordingTrimProvider from '../videoTrim/recordingProvider';
import VideoTrimmer from '../videoTrim/videoTrimmer';
import { PageTitleArea, Layer, PageArea, FooterArea } from './layout';

const DisplayPageArea = styled(PageArea)`
  position: absolute;
`;

const LayerWithGrayout = withOverlay(styled(Layer)`
  background-color: ${({ theme }) => theme.colors.opacity.overlayExtraDark};
  z-index: ${Z_INDEX_RECORDING_MODE};
`);

const StyledFooter = styled(FooterArea)`
  display: flex;
  align-items: start;
  flex-direction: row;
  justify-content: center;
  z-index: ${Z_INDEX_RECORDING_MODE};
`;

function MediaRecordingLayer() {
  const { isRTL } = useConfig();

  const {
    status,
    audioInput,
    videoInput,
    isTrimming,
    trimData,
    mediaBlobUrl,
    duration,
    updateMediaDevices,
    getMediaStream,
    resetStream,
    onTrim,
  } = useMediaRecording(({ state, actions }) => ({
    status: state.status,
    audioInput: state.audioInput,
    videoInput: state.videoInput,
    isTrimming: state.isTrimming,
    trimData: state.trimData,
    mediaBlobUrl: state.mediaBlobUrl,
    duration: state.duration,
    updateMediaDevices: actions.updateMediaDevices,
    getMediaStream: actions.getMediaStream,
    resetStream: actions.resetStream,
    onTrim: actions.onTrim,
  }));

  const isReady = 'ready' === status;

  useEffect(() => {
    resetStream();
    getMediaStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Only want to act on actual input changes.
  }, [audioInput, videoInput]);

  useEffect(() => {
    if (isReady) {
      updateMediaDevices();
    }
  }, [isReady, updateMediaDevices]);

  // Video data was designed for a different purpose, so we need to fake the api a bit here
  const videoData = useMemo(() => {
    return isTrimming
      ? {
          element: {
            width: FULLBLEED_RATIO * 480,
            height: 480,
            scale: 1,
            focalX: 50,
            focalY: 50,
            flip: {},
          },
          resource: {
            src: mediaBlobUrl,
            length: duration,
          },
          ...trimData,
        }
      : null;
  }, [isTrimming, trimData, mediaBlobUrl, duration]);

  return (
    // CanvasLayout disables stylisRTLPlugin, but for this subtree we want it again
    // to make RTL work automatically.
    <StyleSheetManager stylisPlugins={isRTL ? [stylisRTLPlugin] : []}>
      <VideoRecordingTrimProvider onTrim={onTrim} videoData={videoData}>
        <LayerWithGrayout
          aria-label={__('Media Recording layer', 'web-stories')}
        >
          <PageTitleArea>
            <DurationIndicator />
          </PageTitleArea>
          <DisplayPageArea withSafezone={false} showOverflow>
            <MediaRecording />
          </DisplayPageArea>
          <StyledFooter showOverflow>
            {isTrimming ? <VideoTrimmer /> : <Footer />}
          </StyledFooter>
        </LayerWithGrayout>
        <SettingsModal />
      </VideoRecordingTrimProvider>
    </StyleSheetManager>
  );
}

export default MediaRecordingLayer;
