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
  UnusedAtStart,
  UnusedAtEnd,
  ButtonWrapper,
} from './trimmerComponents';

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
  const { pageWidth } = useLayout(({ state: { pageWidth } }) => ({
    pageWidth,
  }));

  if (!pageWidth || !maxOffset) {
    return null;
  }

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
      <Wrapper pageWidth={pageWidth}>
        <UnusedAtStart width={(startOffset / maxOffset) * pageWidth} />
        <UnusedAtEnd
          width={((maxOffset - endOffset) / maxOffset) * pageWidth}
        />
        <CurrentTime
          railWidth={pageWidth}
          aria-label={__('Current time', 'web-stories')}
          disabled
          value={currentTime}
          max={maxOffset}
        />
        <Handle
          railWidth={pageWidth}
          max={maxOffset}
          value={startOffset}
          aria-label={__('Start offset', 'web-stories')}
          onChange={(val) => setStartOffset(val)}
        />
        <Handle
          railWidth={pageWidth}
          value={endOffset}
          max={maxOffset}
          aria-label={__('End offset', 'web-stories')}
          onChange={(val) => setEndOffset(val)}
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
