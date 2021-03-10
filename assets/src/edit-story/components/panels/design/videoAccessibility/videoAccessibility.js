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
import { __ } from '@web-stories-wp/i18n';
import { useCallback } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { Media, Row, TextArea } from '../../../form';
import { SimplePanel } from '../../panel';
import { getCommonValue, useCommonObjectValue } from '../../shared';
import { useConfig } from '../../../../app/config';
import { MULTIPLE_DISPLAY_VALUE, MULTIPLE_VALUE } from '../../../../constants';

const DEFAULT_RESOURCE = {
  alt: null,
  poster: null,
};

export const MIN_MAX = {
  ALT_TEXT: {
    MAX: 1000,
  },
};

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

  const rawPoster = getCommonValue(selectedElements, 'poster');
  const poster = getCommonValue(selectedElements, 'poster', resource.poster);
  const { allowedImageMimeTypes } = useConfig();

  const handleChangePoster = useCallback(
    (image) => {
      const newPoster = image?.sizes?.medium?.url || image?.url;
      if (newPoster === rawPoster) {
        return;
      }
      pushUpdate({ poster: newPoster }, true);
    },
    [pushUpdate, rawPoster]
  );

  return (
    <SimplePanel
      name="videoAccessibility"
      title={__('Accessibility', 'web-stories')}
    >
      <Row>
        <Media
          value={poster}
          onChange={handleChangePoster}
          title={__('Select as video poster', 'web-stories')}
          buttonInsertText={__('Set as video poster', 'web-stories')}
          alt={__('Preview poster image', 'web-stories')}
          type={allowedImageMimeTypes}
          ariaLabel={__('Video poster', 'web-stories')}
          menuOptions={['edit', 'reset']}
        />
        <InputsWrapper>
          <TextArea
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
