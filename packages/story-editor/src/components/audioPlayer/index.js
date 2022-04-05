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
import {
  useState,
  useCallback,
  useRef,
  useEffect,
} from '@googleforcreators/react';
import {
  THEME_CONSTANTS,
  themeHelpers,
  Icons,
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
} from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';
import { ResourcePropTypes } from '@googleforcreators/media';

/**
 * Internal dependencies
 */
import { Z_INDEX_STORY_DETAILS } from '../../constants/zIndex';
import Tooltip from '../tooltip';
import useCORSProxy from '../../utils/useCORSProxy';

const StyledButton = styled(Button)`
  ${({ theme }) =>
    themeHelpers.focusableOutlineCSS(
      theme.colors.border.focus,
      theme.colors.bg.secondary
    )};
`;

const Wrapper = styled.div(
  ({ theme }) => css`
    position: relative;
    min-width: 40px;
    width: 100%;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: ${theme.colors.fg.primary};

    ${themeHelpers.expandPresetStyles({
      preset: {
        ...theme.typography.presets.paragraph[
          THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL
        ],
      },
      theme,
    })};
  `
);

const Audio = styled.audio`
  display: none;
`;

function AudioPlayer({ title, src, mimeType, tracks = [], audioId, loop }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const playerRef = useRef();

  const { getProxiedUrl } = useCORSProxy();

  const handlePlayPause = useCallback(() => {
    const player = playerRef.current;

    if (!player) {
      return;
    }

    if (isPlaying) {
      player.pause();
    } else {
      player.play().catch(() => {});
    }
  }, [isPlaying]);

  useEffect(() => {
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
      <div>{title}</div>
      <Tooltip
        hasTail
        title={buttonTitle}
        popupZIndexOverride={Z_INDEX_STORY_DETAILS}
      >
        <StyledButton
          type={BUTTON_TYPES.TERTIARY}
          size={BUTTON_SIZES.SMALL}
          variant={BUTTON_VARIANTS.SQUARE}
          aria-label={buttonTitle}
          onClick={handlePlayPause}
        >
          {isPlaying ? <Icons.StopFilled /> : <Icons.PlayFilled />}
        </StyledButton>
      </Tooltip>
    </Wrapper>
  );
}

AudioPlayer.propTypes = {
  title: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  mimeType: PropTypes.string.isRequired,
  audioId: PropTypes.string,
  loop: PropTypes.bool,
  tracks: PropTypes.arrayOf(ResourcePropTypes.trackResource),
};

export default AudioPlayer;
