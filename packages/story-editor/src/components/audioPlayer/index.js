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
import { useState, useCallback, useRef } from '@web-stories-wp/react';
import {
  THEME_CONSTANTS,
  themeHelpers,
  Icons,
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
} from '@web-stories-wp/design-system';
import { __ } from '@web-stories-wp/i18n';

/**
 * Internal dependencies
 */
import Tooltip from '../tooltip';

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

function AudioPlayer({ title, src, mimeType }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const playerRef = useRef();

  const handlePlayPause = useCallback(() => {
    const player = playerRef.current;

    if (!player) {
      return;
    }

    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      player
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  }, [isPlaying, setIsPlaying]);

  return (
    <Wrapper>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption, styled-components-a11y/media-has-caption */}
      <Audio crossOrigin="anonymous" loop ref={playerRef}>
        <source src={src} type={mimeType} />
      </Audio>
      <div>{title}</div>
      <div>
        {isPlaying ? (
          <Tooltip hasTail title={__('Pause', 'web-stories')}>
            <StyledButton
              type={BUTTON_TYPES.TERTIARY}
              size={BUTTON_SIZES.SMALL}
              variant={BUTTON_VARIANTS.SQUARE}
              aria-label={__('Pause', 'web-stories')}
              onClick={handlePlayPause}
            >
              <Icons.StopFilled />
            </StyledButton>
          </Tooltip>
        ) : (
          <Tooltip hasTail title={__('Play', 'web-stories')}>
            <StyledButton
              type={BUTTON_TYPES.TERTIARY}
              size={BUTTON_SIZES.SMALL}
              variant={BUTTON_VARIANTS.SQUARE}
              aria-label={__('Play', 'web-stories')}
              onClick={handlePlayPause}
            >
              <Icons.PlayFilled />
            </StyledButton>
          </Tooltip>
        )}
      </div>
    </Wrapper>
  );
}

AudioPlayer.propTypes = {
  title: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  mimeType: PropTypes.string.isRequired,
};

export default AudioPlayer;
