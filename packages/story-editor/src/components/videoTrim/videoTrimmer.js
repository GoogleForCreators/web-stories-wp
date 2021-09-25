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
import { __ } from '@web-stories-wp/i18n';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
} from '@web-stories-wp/design-system';

/**
 * Internal dependencies
 */
import useLayout from '../../app/layout/useLayout';
import useVideoTrim from './useVideoTrim';
import {
  Menu,
  Wrapper,
  Handle,
  CurrentTime,
  Scrim,
  ButtonWrapper,
} from './trimmerComponents';

const BUTTON_SPACE = 130;

function VideoTrimmer() {
  const {
    currentTime,
    startOffset,
    endOffset,
    maxOffset,
    setStartOffset,
    setEndOffset,
    hasChanged,
    performTrim,
    resetOffsets,
  } = useVideoTrim(
    ({
      state: { currentTime, startOffset, endOffset, maxOffset, hasChanged },
      actions: { setStartOffset, setEndOffset, performTrim, resetOffsets },
    }) => ({
      currentTime,
      startOffset,
      endOffset,
      maxOffset,
      setStartOffset,
      setEndOffset,
      hasChanged,
      performTrim,
      resetOffsets,
    })
  );
  const { workspaceWidth, pageWidth } = useLayout(
    ({ state: { workspaceWidth, pageWidth } }) => ({
      workspaceWidth,
      pageWidth,
    })
  );

  if (!pageWidth || !maxOffset) {
    return null;
  }

  const railWidth = Math.min(pageWidth, workspaceWidth - 2 * BUTTON_SPACE);

  const sliderProps = {
    min: 0,
    max: maxOffset,
    step: 100,
    minorStep: 10,
  };

  return (
    <Menu>
      {hasChanged && (
        <ButtonWrapper isStart>
          <Button
            variant={BUTTON_VARIANTS.RECTANGLE}
            type={BUTTON_TYPES.SECONDARY}
            size={BUTTON_SIZES.SMALL}
            onClick={resetOffsets}
          >
            {__('Cancel', 'web-stories')}
          </Button>
        </ButtonWrapper>
      )}
      <Wrapper pageWidth={railWidth}>
        <Scrim atStart width={(startOffset / maxOffset) * railWidth} />
        <Scrim width={((maxOffset - endOffset) / maxOffset) * railWidth} />
        <CurrentTime
          railWidth={railWidth}
          aria-label={__('Current time', 'web-stories')}
          disabled
          value={currentTime}
          {...sliderProps}
        />
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
      </Wrapper>
      {hasChanged && (
        <ButtonWrapper>
          <Button
            variant={BUTTON_VARIANTS.RECTANGLE}
            type={BUTTON_TYPES.PRIMARY}
            size={BUTTON_SIZES.SMALL}
            onClick={performTrim}
          >
            {__('Trim', 'web-stories')}
          </Button>
        </ButtonWrapper>
      )}
    </Menu>
  );
}

export default VideoTrimmer;
