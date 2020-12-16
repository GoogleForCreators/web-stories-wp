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
import { useCallback } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Media, Row, usePresubmitHandler } from '../../../form';
import {
  getCommonValue,
  useCommonObjectValue,
  Note,
  ExpandedTextInput,
} from '../../shared';
import { SimplePanel } from '../../panel';

const DEFAULT_RESOURCE = { poster: null, alt: null };
export const MIN_MAX = {
  ALT_TEXT: {
    MAX: 1000,
  },
};

function VideoAccessibilityPanel({ selectedElements, pushUpdate }) {
  const resource = useCommonObjectValue(
    selectedElements,
    'resource',
    DEFAULT_RESOURCE
  );

  const rawPoster = getCommonValue(selectedElements, 'poster');
  const poster = getCommonValue(selectedElements, 'poster', resource.poster);
  const alt = getCommonValue(selectedElements, 'alt', resource.alt);

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

  usePresubmitHandler(
    ({ resource: newResource }) => ({
      resource: {
        ...newResource,
        alt: newResource.alt?.slice(0, MIN_MAX.ALT_TEXT.MAX),
      },
    }),
    []
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
          type={'image'}
          ariaLabel={__('Video poster', 'web-stories')}
          canReset
        />
      </Row>
      <Row>
        <ExpandedTextInput
          placeholder={__('Video description', 'web-stories')}
          value={alt || ''}
          onChange={(value) => pushUpdate({ alt: value || null })}
          clear
          aria-label={__('Video description', 'web-stories')}
          maxLength={MIN_MAX.ALT_TEXT.MAX}
        />
      </Row>
      <Row>
        <Note>
          {__(
            'For indexability and accessibility. Include any burned-in text inside the video.',
            'web-stories'
          )}
        </Note>
      </Row>
    </SimplePanel>
  );
}

VideoAccessibilityPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default VideoAccessibilityPanel;
