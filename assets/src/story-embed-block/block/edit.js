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

/**
 * WordPress dependencies
 */
import { useCallback, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import EmbedPlaceholder from './embed-placeholder';
import './edit.css';
import EmbedControls from './embed-controls';
import { icon } from './index.js';

function StoryEmbedEdit({ attributes, setAttributes, className }) {
  const {
    url: outerURL,
    width = 360,
    height = 600,
    title,
    poster
  } = attributes;

  const [editingURL, setEditingURL] = useState(false);
  const [url, setURL] = useState(outerURL);

  const onSubmit = useCallback(
    (event) => {
      if (event) {
        event.preventDefault();
      }

      setEditingURL(false);
      setAttributes({ url });
    },
    [setAttributes, url]
  );

  const switchBackToURLInput = useCallback(() => {
    setEditingURL(true);
  }, []);

  const label = __('Web Story URL', 'web-stories');

  if (editingURL) {
    return (
      <EmbedPlaceholder
        icon={icon}
        label={label}
        value={url}
        onSubmit={onSubmit}
        onChange={(event) => setURL(event.target.value)}
      />
    );
  }

  return (
    <>
      <EmbedControls
        showEditButton={true}
        switchBackToURLInput={switchBackToURLInput}
      />
      <div className={className}>{'todo'}</div>
    </>
  );
}

StoryEmbedEdit.propTypes = {
  attributes: PropTypes.shape({
    url: PropTypes.string,
    title: PropTypes.string,
    poster: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    align: PropTypes.string,
  }).isRequired,
  setAttributes: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
};

export default StoryEmbedEdit;
