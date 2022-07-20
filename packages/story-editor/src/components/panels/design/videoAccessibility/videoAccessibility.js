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
import { __, sprintf, translateToExclusiveList } from '@googleforcreators/i18n';
import { getExtensionsFromMimeType } from '@googleforcreators/media';
import { useCallback, useMemo } from '@googleforcreators/react';
import styled from 'styled-components';
import { Text, THEME_CONSTANTS } from '@googleforcreators/design-system';
import { useFeature } from 'flagged';

/**
 * Internal dependencies
 */
import { Media, Row, TextArea } from '../../../form';
import { SimplePanel } from '../../panel';
import { getCommonValue, useCommonObjectValue } from '../../shared';
import { useConfig } from '../../../../app/config';
import { styles, states, useHighlights } from '../../../../app/highlights';
import { MULTIPLE_VALUE, MULTIPLE_DISPLAY_VALUE } from '../../../../constants';

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

const StyledText = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.secondary};
  margin-bottom: 10px;
`;

function VideoAccessibilityPanel({ selectedElements, pushUpdate }) {
  const enablePosterHotlinking = useFeature('videoPosterHotlinking');
  const resource = useCommonObjectValue(
    selectedElements,
    'resource',
    DEFAULT_RESOURCE
  );
  const alt = getCommonValue(selectedElements, 'alt', resource.alt);
  const { height, width } = resource;

  const rawPoster = getCommonValue(selectedElements, 'poster');
  const poster = getCommonValue(selectedElements, 'poster', resource.poster);
  const {
    allowedMimeTypes: { image: allowedImageMimeTypes },
    capabilities: { hasUploadMediaAction },
  } = useConfig();

  const options = [
    enablePosterHotlinking && hasUploadMediaAction && 'upload',
    !enablePosterHotlinking && hasUploadMediaAction && 'edit',
    enablePosterHotlinking && 'hotlink',
    poster !== resource.poster && 'reset',
  ].filter(Boolean);

  const allowedImageFileTypes = useMemo(
    () =>
      allowedImageMimeTypes
        .map((type) => getExtensionsFromMimeType(type))
        .flat(),
    [allowedImageMimeTypes]
  );

  const handleChangePoster = useCallback(
    /**
     * Handle video poster change.
     *
     * @param {import('@googleforcreators/media').Resource} [newPoster] The new image. Or null if reset.
     */
    (newPoster) => {
      if (newPoster?.src === rawPoster) {
        return;
      }
      pushUpdate({ poster: newPoster?.src }, true);
    },
    [pushUpdate, rawPoster]
  );

  const onDeleteMedia = useCallback(
    (deleteResource) => {
      if (poster === deleteResource.src) {
        pushUpdate({ poster: resource.poster }, true);
      }
    },
    [poster, resource, pushUpdate]
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

  const {
    highlightInput,
    highlightMediaPicker,
    resetHighlight,
    cancelHighlight,
  } = useHighlights((state) => ({
    highlightInput: state[states.ASSISTIVE_TEXT],
    highlightMediaPicker: state[states.VIDEO_A11Y_POSTER],
    resetHighlight: state.onFocusOut,
    cancelHighlight: state.cancelEffect,
  }));

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
      onAnimationEnd={() => resetHighlight()}
      name="videoAccessibility"
      title={__('Accessibility', 'web-stories')}
      isPersistable={!highlightInput && !highlightMediaPicker}
    >
      <Row>
        <StyledMedia
          ref={(node) => {
            if (
              node &&
              highlightMediaPicker?.focus &&
              highlightMediaPicker?.showEffect
            ) {
              node.focus();
            }
          }}
          value={poster}
          cropParams={cropParams}
          onChange={handleChangePoster}
          onDeleteMedia={onDeleteMedia}
          onChangeErrorText={posterErrorMessage}
          title={__('Select as video poster', 'web-stories')}
          hotlinkTitle={__('Use external image as video poster', 'web-stories')}
          hotlinkInsertText={__('Use image as video poster', 'web-stories')}
          hotlinkInsertingText={__(
            'Using image as video poster',
            'web-stories'
          )}
          buttonInsertText={__('Set as video poster', 'web-stories')}
          alt={__('Preview poster image', 'web-stories')}
          type={allowedImageMimeTypes}
          ariaLabel={__('Video poster', 'web-stories')}
          menuOptions={options}
          imgProps={cropParams}
          canUpload={options.length !== 0}
        />
        <InputsWrapper>
          <StyledText size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
            {__('Add a brief description of the video.', 'web-stories')}
          </StyledText>
          <TextArea
            ref={(node) => {
              if (node && highlightInput?.focus && highlightInput?.showEffect) {
                node.addEventListener('keydown', cancelHighlight, {
                  once: true,
                });
                node.focus();
              }
            }}
            placeholder={alt === MULTIPLE_VALUE ? MULTIPLE_DISPLAY_VALUE : ''}
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
