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
import { useCallback, useMemo } from 'react';
import { __, sprintf } from '@web-stories-wp/i18n';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { Row, Media } from '../../../form';
import { SimplePanel } from '../../panel';
import { getCommonValue, useCommonObjectValue, Note } from '../../shared';
import { useConfig } from '../../../../app/config';

const StyledMedia = styled(Media)`
  height: 114px;
  width: 64px;
`;

const DEFAULT_RESOURCE = {
  poster: null,
};

function VideoPosterPanel({ selectedElements, pushUpdate }) {
  const resource = useCommonObjectValue(
    selectedElements,
    'resource',
    DEFAULT_RESOURCE
  );
  const rawPoster = getCommonValue(selectedElements, 'poster');
  const poster = getCommonValue(selectedElements, 'poster', resource.poster);
  const { allowedImageMimeTypes, allowedImageFileTypes } = useConfig();

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

  const posterErrorMessage = useMemo(() => {
    return sprintf(
      /* translators: %s: list of allowed file types. */
      __('Please choose only %s as a poster.', 'web-stories'),
      allowedImageFileTypes.join(
        /* translators: delimiter used in a list */
        __(', ', 'web-stories')
      )
    );
  }, [allowedImageFileTypes]);

  return (
    <SimplePanel name="videoPoster" title={__('Poster', 'web-stories')}>
      <Row>
        <StyledMedia
          value={poster}
          onChange={handleChangePoster}
          onChangeErrorText={posterErrorMessage}
          title={__('Select as video poster', 'web-stories')}
          buttonInsertText={__('Set as video poster', 'web-stories')}
          alt={__('Preview poster image', 'web-stories')}
          type={allowedImageMimeTypes}
          ariaLabel={__('Video poster', 'web-stories')}
          menuOptions={['edit', 'reset']}
        />
      </Row>
      <Row>
        <Note>
          {__(
            'For improved loading experience on slower connections.',
            'web-stories'
          )}
        </Note>
      </Row>
    </SimplePanel>
  );
}

VideoPosterPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default VideoPosterPanel;
