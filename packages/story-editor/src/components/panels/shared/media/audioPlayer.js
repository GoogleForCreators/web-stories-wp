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
import styled, { css } from 'styled-components';
import { useState, useCallback, useEffect } from '@googleforcreators/react';
import {
  TextSize,
  themeHelpers,
  Icons,
  Button,
  ButtonSize,
  ButtonType,
  ButtonVariant,
} from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';
import { ResourcePropTypes } from '@googleforcreators/media';

/**
 * Internal dependencies
 */
import { Z_INDEX_STORY_DETAILS } from '../../../../constants/zIndex';
import Tooltip from '../../../tooltip';
import useCORSProxy from '../../../../utils/useCORSProxy';
import { noop } from '../../../../utils/noop';

const Play = styled(Icons.PlayFilled)`
  width: 30px !important;
  height: 30px !important;
`;

const Stop = styled(Icons.StopFilled)`
  width: 30px !important;
  height: 30px !important;
`;

const StyledButton = styled(Button)`
  ${({ theme }) =>
    themeHelpers.focusableOutlineCSS(
      theme.colors.border.focus,
      theme.colors.bg.secondary
    )};
`;

const Wrapper = styled.div(
  ({ theme }) => css`
    color: ${theme.colors.fg.primary};

    ${themeHelpers.expandPresetStyles({
      preset: {
        ...theme.typography.presets.paragraph[TextSize.Small],
      },
      theme,
    })};
  `
);

const Audio = styled.audio`
  display: none;
`;

function AudioPlayer({ src, mimeType, tracks = [], audioId, loop, playerRef }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const { getProxiedUrl } = useCORSProxy();

  const handlePlayPause = useCallback(() => {
    /**
     * @type {HTMLAudioElement}
     */
    const player = playerRef.current;

    if (!player) {
      return;
    }

    if (isPlaying) {
      player.pause();
    } else {
      player.play().catch(noop);
    }
  }, [isPlaying, playerRef]);

  useEffect(() => {
    /**
     * @type {HTMLAudioElement}
     */
    const player = playerRef.current;

    if (!player) {
      return undefined;
    }

    const onAudioPlay = () => setIsPlaying(true);
    const onAudioPause = () => setIsPlaying(false);
    const onAudioEnd = () => {
      player.currentTime = 0;
      setIsPlaying(false);
    };

    player.addEventListener('play', onAudioPlay);
    player.addEventListener('pause', onAudioPause);
    player.addEventListener('ended', onAudioEnd);
    return () => {
      player.removeEventListener('play', onAudioPlay);
      player.removeEventListener('pause', onAudioPause);
      player.removeEventListener('ended', onAudioEnd);
    };
  }, [playerRef]);

  const buttonTitle = isPlaying
    ? __('Pause', 'web-stories')
    : __('Play', 'web-stories');

  const tracksFormatted = tracks.map((track) => {
    const trackSrc = getProxiedUrl(track, track?.track);
    return {
      ...track,
      track: trackSrc,
    };
  });

  return (
    <Wrapper>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption, styled-components-a11y/media-has-caption -- No captions wanted/needed here. */}
      <Audio crossOrigin="anonymous" loop={loop} ref={playerRef} id={audioId}>
        <source src={src} type={mimeType} />
        {tracksFormatted &&
          tracksFormatted.map(
            ({ srclang, label, track: trackSrc, id: key }, i) => (
              <track
                srcLang={srclang}
                label={label}
                // Hides the track from the user.
                // Displaying happens in MediaCaptionsLayer instead.
                kind="metadata"
                src={trackSrc}
                key={key}
                default={i === 0}
              />
            )
          )}
      </Audio>
      <Tooltip
        hasTail
        title={buttonTitle}
        popupZIndexOverride={Z_INDEX_STORY_DETAILS}
      >
        <StyledButton
          type={ButtonType.Tertiary}
          size={ButtonSize.Small}
          variant={ButtonVariant.Square}
          aria-label={buttonTitle}
          onClick={handlePlayPause}
        >
          {isPlaying ? <Stop /> : <Play />}
        </StyledButton>
      </Tooltip>
    </Wrapper>
  );
}

AudioPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  mimeType: PropTypes.string.isRequired,
  audioId: PropTypes.string,
  loop: PropTypes.bool,
  tracks: PropTypes.arrayOf(ResourcePropTypes.trackResource),
  playerRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    .isRequired,
};

export default AudioPlayer;
