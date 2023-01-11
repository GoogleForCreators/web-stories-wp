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
import { __ } from '@googleforcreators/i18n';
import {
  useRef,
  useCallback,
  useDebouncedCallback,
} from '@googleforcreators/react';
import {
  Button,
  ButtonSize,
  ButtonType,
  ButtonVariant,
} from '@googleforcreators/design-system';
import { getVideoLengthDisplay } from '@googleforcreators/media';

/**
 * Internal dependencies
 */
import useLayout from '../../app/layout/useLayout';
import useFocusTrapping from '../../utils/useFocusTrapping';
import useVideoTrim from './useVideoTrim';
import useRailBackground from './useRailBackground';
import CurrentTime from './currentTime';
import {
  Menu,
  RailWrapper,
  Rail,
  Duration,
  Handle,
  Scrim,
  ButtonWrapper,
} from './trimmerComponents';

const BUTTON_SPACE = 130;

function VideoTrimmer() {
  const {
    startOffset,
    endOffset,
    maxOffset,
    setStartOffset,
    setEndOffset,
    hasChanged,
    performTrim,
    setIsDraggingHandles,
    toggleTrimMode,
    videoData,
  } = useVideoTrim(
    ({
      state: { startOffset, endOffset, maxOffset, hasChanged, videoData },
      actions: {
        setStartOffset,
        setEndOffset,
        performTrim,
        toggleTrimMode,
        setIsDraggingHandles,
      },
    }) => ({
      startOffset,
      endOffset,
      maxOffset,
      setStartOffset,
      setEndOffset,
      hasChanged,
      performTrim,
      setIsDraggingHandles,
      toggleTrimMode,
      videoData,
    })
  );
  const { workspaceWidth, pageWidth } = useLayout(
    ({ state: { workspaceWidth, pageWidth } }) => ({
      workspaceWidth,
      pageWidth,
    })
  );

  const debouncedNudge = useDebouncedCallback(
    () => setIsDraggingHandles(false),
    1000
  );

  const menu = useRef(null);

  // Keep focus trapped within the menu
  useFocusTrapping({ ref: menu });

  // Auto-focus the cancel button on mount
  const setCancelRef = useCallback((node) => {
    if (node) {
      node.focus();
    }
  }, []);

  const railWidth = Math.min(pageWidth, workspaceWidth - 2 * BUTTON_SPACE);

  const isReady = pageWidth && maxOffset && videoData;

  const railBackgroundImage = useRailBackground(isReady, videoData, railWidth);

  const menuProps = {
    ref: menu,
    'aria-label': __('Video trimmer', 'web-stories'),
  };

  if (!isReady) {
    // We still need a reffed element, or the focus trap will break,
    // so just return an empty element
    return <Menu {...menuProps} />;
  }

  const sliderProps = {
    min: 0,
    max: maxOffset,
    step: 100,
    minorStep: 10,
    onPointerDown: () => setIsDraggingHandles(true),
    onPointerUp: () => setIsDraggingHandles(false),
    onNudge: () => {
      setIsDraggingHandles(true);
      debouncedNudge();
    },
  };

  return (
    <Menu {...menuProps}>
      <ButtonWrapper isStart>
        <Button
          variant={ButtonVariant.Rectangle}
          type={ButtonType.Secondary}
          size={ButtonSize.Small}
          onClick={toggleTrimMode}
          ref={setCancelRef}
        >
          {__('Cancel', 'web-stories')}
        </Button>
      </ButtonWrapper>
      <RailWrapper>
        <Rail
          width={railWidth}
          style={{
            backgroundImage: railBackgroundImage
              ? `url(${railBackgroundImage})`
              : undefined,
          }}
        >
          <Scrim isLeftAligned width={(startOffset / maxOffset) * railWidth} />
          <Scrim width={((maxOffset - endOffset) / maxOffset) * railWidth} />
          <CurrentTime railWidth={railWidth} {...sliderProps} />
          <Handle
            railWidth={railWidth}
            value={startOffset}
            aria-label={__('Start offset', 'web-stories')}
            onChange={(val) => setStartOffset(val)}
            {...sliderProps}
          />
          <Handle
            railWidth={railWidth}
            value={endOffset}
            aria-label={__('End offset', 'web-stories')}
            onChange={(val) => setEndOffset(val)}
            {...sliderProps}
          />
        </Rail>
        <Duration>
          {getVideoLengthDisplay(Math.ceil((endOffset - startOffset) / 1000))}
        </Duration>
      </RailWrapper>
      <ButtonWrapper>
        <Button
          variant={ButtonVariant.Rectangle}
          type={ButtonType.Primary}
          size={ButtonSize.Small}
          onClick={performTrim}
          disabled={!hasChanged}
        >
          {__('Trim', 'web-stories')}
        </Button>
      </ButtonWrapper>
    </Menu>
  );
}

export default VideoTrimmer;
