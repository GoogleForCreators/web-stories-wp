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

/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from '@web-stories-wp/react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { useLayout } from '../../../app';
import Cue from './cue';

const Track = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  align-content: end;
  font-size: ${({ $fontSize }) => `${$fontSize}px`};
`;

/** @typedef {import('react').ReactNode} ReactNode */

/**
 *
 * @param {Object} props Component props.
 * @param {string} props.videoId Video element ID.
 * @param {number} props.trackIndex Video track index in the tracklist.
 * @return {*} Track component.
 */
function TrackRenderer({ videoId, trackIndex }) {
  const { pageWidth, pageHeight } = useLayout(
    ({ state: { pageWidth, pageHeight } }) => ({
      pageWidth,
      pageHeight,
    })
  );

  // To mimic the responsive `amp-story-captions span` styling on the frontend.
  const fontSize = pageWidth * 0.04;
  const height = pageHeight * 0.2;

  const [track, setTrack] = useState(null);
  const [videoTime, setVideoTime] = useState(0);
  const [cues, setCues] = useState([]);

  /**
   * @type {import('react').MutableRefObject<HTMLVideoElement>} video Video element.
   */
  const videoRef = useRef(null);

  const updateCues = useCallback(() => {
    const activeCues = track?.activeCues ? [...track.activeCues] : [];
    setCues(activeCues);
  }, [track]);

  useEffect(() => {
    updateCues();

    /**
     * @type {HTMLVideoElement}
     */
    videoRef.current = document.getElementById(`video-${videoId}`);

    if (!videoRef.current) {
      return undefined;
    }

    const videoTrack = videoRef.current.textTracks?.[trackIndex];

    if (!videoTrack) {
      return undefined;
    }

    videoTrack.mode = 'hidden';

    updateCues();

    setTrack(videoTrack);

    videoRef.current.addEventListener('timeupdate', () => {
      setVideoTime(videoRef.current.currentTime);
    });

    videoTrack.addEventListener('cuechange', updateCues);
    videoTrack.addEventListener('play', updateCues);

    return () => {
      videoTrack.removeEventListener('cuechange', updateCues);
      videoTrack.removeEventListener('play', updateCues);
    };
  }, [trackIndex, updateCues, videoId, pageWidth, pageHeight]);

  if (!cues || !track || !videoRef.current?.isConnected) {
    return null;
  }

  return (
    <Track $fontSize={fontSize}>
      {cues.map((cue, index) => (
        <Cue
          key={
            // eslint-disable-next-line react/no-array-index-key
            index
          }
          cue={cue}
          videoTime={videoTime}
          height={height}
        />
      ))}
    </Track>
  );
}

TrackRenderer.propTypes = {
  videoId: PropTypes.string.isRequired,
  trackIndex: PropTypes.number.isRequired,
};

export default TrackRenderer;
