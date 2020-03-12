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
import { useEffect, useState } from 'react';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Media } from '../form';
import { SimplePanel } from './panel';
import getCommonValue from './utils/getCommonValue';

function VideoPosterPanel({ selectedElements, onSetProperties }) {
  const featuredMedia = getCommonValue(selectedElements, 'featuredMedia');
  const poster = getCommonValue(selectedElements, 'poster');
  const [state, setState] = useState({ featuredMedia, poster });
  useEffect(() => {
    setState({ featuredMedia, poster });
  }, [featuredMedia, poster]);

  const handleSubmit = (evt) => {
    onSetProperties(state);
    evt.preventDefault();
  };

  const handleChangeImage = (image) => {
    const newState = {
      featuredMedia: image.id,
      poster: image.sizes?.medium?.url || image.url,
    };
    setState({ ...state, ...newState });
    onSetProperties(newState);
  };

  return (
    <SimplePanel
      name="videoPoster"
      title={__('Poster image', 'web-stories')}
      onSubmit={handleSubmit}
    >
      <Media
        value={state.poster}
        onChange={handleChangeImage}
        title={__('Select as video poster', 'web-stories')}
        buttonInsertText={__('Set as video poster', 'web-stories')}
        type={'image'}
      />
    </SimplePanel>
  );
}

VideoPosterPanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  onSetProperties: PropTypes.func.isRequired,
};

export default VideoPosterPanel;
