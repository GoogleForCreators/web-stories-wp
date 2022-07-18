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
import PropTypes from 'prop-types';
import { rgba } from 'polished';
import styled, { css } from 'styled-components';
import { useEffect, useState, useRef } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import { Icons, useKeyDownEffect } from '@googleforcreators/design-system';

/**
 * Internal dependencies
 */
import { useConfig } from '../../app/config';

const PLAY_BUTTON_SIZE = 82;
const ICON_SVG_SIZE = 72;

const Controls = styled.div`
  position: absolute;
`;

const ButtonWrapper = styled.button.attrs({ tabIndex: -1 })`
  cursor: pointer;
  pointer-events: initial;
  width: ${PLAY_BUTTON_SIZE}px;
  height: ${PLAY_BUTTON_SIZE}px;
  overflow: hidden;
  background: transparent;
  border: none;
  padding: 0;
`;

const iconCss = css`
  width: ${ICON_SVG_SIZE}px;
  height: ${ICON_SVG_SIZE}px;
  color: ${({ theme }) => theme.colors.standard.white};
  filter: drop-shadow(
    0px 0px 10px ${({ theme }) => rgba(theme.colors.bg.primary, 0.4)}
  );
`;

const Play = styled(Icons.PlayFilled)`
  ${iconCss};
`;

const Pause = styled(Icons.StopFilled)`
  ${iconCss};
`;

function PlayPauseButton({ videoRef }) {
  const { isRTL } = useConfig();

  const [showControls, setShowControls] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const videoNode = videoRef?.current;

    const onVideoEnd = () => {
      if (videoNode) {
        videoNode.currentTime = 0;
      }
      setIsPlaying(false);
    };

    videoNode?.addEventListener('ended', onVideoEnd);
    return () => videoNode?.removeEventListener('ended', onVideoEnd);
  }, [videoRef]);

  useEffect(() => {
    const videoNode = videoRef?.current;

    if (!videoNode) {
      return undefined;
    }

    const onVideoPlay = () => setIsPlaying(true);
    const onVideoPause = () => setIsPlaying(false);
    const onTimeUpdate = ({ target: { paused } }) => setIsPlaying(!paused);

    videoNode.addEventListener('play', onVideoPlay);
    videoNode.addEventListener('pause', onVideoPause);
    videoNode.addEventListener('timeupdate', onTimeUpdate);
    return () => {
      videoNode.removeEventListener('play', onVideoPlay);
      videoNode.removeEventListener('pause', onVideoPause);
      videoNode.removeEventListener('paustimeupdatee', onTimeUpdate);
    };
  }, [videoRef]);

  const handlePlayPause = (evt) => {
    evt.stopPropagation();

    const videoNode = videoRef?.current;

    if (!videoNode) {
      return;
    }

    if (isPlaying) {
      videoNode.pause();
      setShowControls(true);
    } else {
      videoNode.play().catch(() => {});
    }
  };

  useKeyDownEffect(
    videoRef,
    {
      key: ['space'],
    },
    handlePlayPause,
    [handlePlayPause]
  );

  const nodeRef = useRef();

  const buttonLabel = isPlaying
    ? __('Click to pause', 'web-stories')
    : __('Click to play', 'web-stories');

  const Icon = isPlaying ? Pause : Play;
  return (
    <Controls>
      {showControls && (
        <ButtonWrapper
          ref={nodeRef}
          aria-label={buttonLabel}
          aria-pressed={isPlaying}
          key="wrapper"
          onClick={handlePlayPause}
        >
          <Icon $isRTL={isRTL} />
        </ButtonWrapper>
      )}
    </Controls>
  );
}

PlayPauseButton.propTypes = {
  videoRef: PropTypes.object,
};

export default PlayPauseButton;
