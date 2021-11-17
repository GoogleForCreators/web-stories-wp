/*
 * Copyright 2021 Google LLC
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
import { URLPopover } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { Button } from '@wordpress/components';
import { keyboardReturn } from '@wordpress/icons';

/**
 * Component to render url popover.
 *
 * @see https://github.com/WordPress/gutenberg/blob/adbe3eaae3d7f231953045c96ad67eb7a30369b7/packages/block-editor/src/components/media-placeholder/index.js#L31-L52
 * @param {Object} props Component props.
 * @param {string} props.url Value of form input.
 * @param {Function} props.onChange Callback from when url is changed.
 * @param {Function} props.onSubmit Callback when form is submitted.
 * @param {Function} props.onClose Callback when the dialog is closed.
 * @return {*} JSX markup for the editor.
 */
const InsertFromURLPopover = ({ url, onChange, onSubmit, onClose }) => (
  <URLPopover onClose={onClose}>
    <form
      className="block-editor-media-placeholder__url-input-form"
      data-testid="embed-placeholder-form"
      onSubmit={onSubmit}
    >
      <input
        className="block-editor-media-placeholder__url-input-field"
        type="url"
        aria-label={__('Story URL', 'web-stories')}
        placeholder={__('Paste or type URL', 'web-stories')}
        onChange={onChange}
        value={url}
      />
      <Button
        className="block-editor-media-placeholder__url-input-submit-button"
        icon={keyboardReturn}
        label={__('Embed', 'web-stories')}
        type="submit"
      />
    </form>
  </URLPopover>
);

InsertFromURLPopover.propTypes = {
  url: PropTypes.string,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

export default InsertFromURLPopover;
