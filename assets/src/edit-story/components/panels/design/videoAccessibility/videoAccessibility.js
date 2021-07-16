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
import { __, sprintf, translateToExclusiveList } from '@web-stories-wp/i18n';
import { useCallback, useRef, useMemo } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { Media, Row, TextArea } from '../../../form';
import { SimplePanel } from '../../panel';
import { getCommonValue, useCommonObjectValue } from '../../shared';
import { useConfig } from '../../../../app/config';
import { MULTIPLE_DISPLAY_VALUE, MULTIPLE_VALUE } from '../../../../constants';
import { styles, states, useFocusHighlight } from '../../../../app/highlights';

const DEFAULT_RESOURCE = {
  alt: null,
  poster: null,
  height: 0,
  width: 0,
};

export const MIN_MAX = {
  ALT_TEXT: {
    MAX: 1000,
  },
};

const StyledMedia = styled(Media)`
  height: 114px;
  width: 64px;
`;

const InputsWrapper = styled.div`
  align-self: flex-start;
  margin-left: 16px;
`;

function VideoAccessibilityPanel({ selectedElements, pushUpdate }) {
  const resource = useCommonObjectValue(
    selectedElements,
    'resource',
    DEFAULT_RESOURCE
  );
  const alt = getCommonValue(selectedElements, 'alt', resource.alt);
  const { height, width } = resource;

  const rawPoster = getCommonValue(selectedElements, 'poster');
  const poster = getCommonValue(selectedElements, 'poster', resource.poster);
  const { allowedImageMimeTypes, allowedImageFileTypes } = useConfig();

  const handleChangePoster = useCallback(
    (image) => {
      const newPoster = image?.sizes?.full?.url || image?.url;
      if (newPoster === rawPoster) {
        return;
      }
      pushUpdate({ poster: newPoster }, true);
    },
    [pushUpdate, rawPoster]
  );

  const posterErrorMessage = useMemo(() => {
    let message = __('No file types are currently supported.', 'web-stories');

    if (allowedImageFileTypes.length) {
      message = sprintf(
        /* translators: %s: list of allowed file types. */
        __('Please choose only %s as a poster.', 'web-stories'),
        translateToExclusiveList(allowedImageFileTypes)
      );
    }

    return message;
  }, [allowedImageFileTypes]);

  // Used for focusing and highlighting the panel from the pre-publish checkist.
  const inputRef = useRef();
  const mediaRef = useRef();
  const highlightInput = useFocusHighlight(states.ASSISTIVE_TEXT, inputRef);
  const highlightMediaPicker = useFocusHighlight(
    states.VIDEO_A11Y_POSTER,
    mediaRef
  );

  let cropParams = null;
  if (
    height &&
    height !== MULTIPLE_VALUE &&
    width &&
    width !== MULTIPLE_VALUE
  ) {
    cropParams = {
      height,
      width,
    };
  }

  return (
    <SimplePanel
      css={(highlightInput || highlightMediaPicker) && styles.FLASH}
      name="videoAccessibility"
      title={__('Accessibility', 'web-stories')}
      isPersistable={!highlightInput && !highlightMediaPicker}
    >
      <Row>
        <StyledMedia
          ref={mediaRef}
          value={poster}
          cropParams={cropParams}
          onChange={handleChangePoster}
          onChangeErrorText={posterErrorMessage}
          title={__('Select as video poster', 'web-stories')}
          buttonInsertText={__('Set as video poster', 'web-stories')}
          alt={__('Preview poster image', 'web-stories')}
          type={allowedImageMimeTypes}
          ariaLabel={__('Video poster', 'web-stories')}
          menuOptions={['edit', 'reset']}
          resource={cropParams /* Just width / height are relevant */}
        />
        <InputsWrapper>
          <TextArea
            ref={inputRef}
            placeholder={
              alt === MULTIPLE_VALUE
                ? MULTIPLE_DISPLAY_VALUE
                : __(
                    'Add assistive text for visually impaired users',
                    'web-stories'
                  )
            }
            value={alt || ''}
            onChange={(evt) =>
              pushUpdate(
                {
                  alt: evt?.target?.value?.trim() || null,
                },
                true
              )
            }
            aria-label={__('Assistive text', 'web-stories')}
            maxLength={MIN_MAX.ALT_TEXT.MAX}
            rows={2}
            isIndeterminate={alt === MULTIPLE_VALUE}
          />
        </InputsWrapper>
      </Row>
    </SimplePanel>
  );
}

VideoAccessibilityPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default VideoAccessibilityPanel;
