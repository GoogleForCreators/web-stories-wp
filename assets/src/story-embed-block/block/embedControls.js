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
import { __, sprintf } from '@wordpress/i18n';
import {
  Button,
  ToolbarGroup,
  BaseControl,
  PanelBody,
} from '@wordpress/components';
import {
  BlockControls,
  InspectorControls,
  MediaUpload,
  MediaUploadCheck,
} from '@wordpress/block-editor';
import { withInstanceId } from '@wordpress/compose';
import { createRef, useCallback } from '@wordpress/element';

const POSTER_ALLOWED_MEDIA_TYPES = ['image'];

const EmbedControls = (props) => {
  const {
    instanceId,
    showEditButton,
    switchBackToURLInput,
    poster,
    setAttributes,
  } = props;

  const posterDescription = `web-stories-embed-block__poster-image-description-${instanceId}`;
  const posterImageButton = createRef();

  const onSelectPoster = useCallback(
    (image) => {
      setAttributes({ poster: image.url });
    },
    [setAttributes]
  );

  const onRemovePoster = useCallback(() => {
    setAttributes({ poster: '' });

    // Move focus back to the Media Upload button.
    posterImageButton.current.focus();
  }, [setAttributes, posterImageButton]);

  return (
    <>
      <BlockControls>
        <ToolbarGroup>
          {showEditButton && (
            <Button
              className="components-toolbar__control"
              label={__('Edit URL', 'web-stories')}
              icon="edit"
              onClick={switchBackToURLInput}
            />
          )}
        </ToolbarGroup>
      </BlockControls>
      <InspectorControls>
        <PanelBody>
          <MediaUploadCheck>
            <BaseControl className="editor-video-poster-control">
              <BaseControl.VisualLabel>
                {__('Poster image', 'web-stories')}
              </BaseControl.VisualLabel>
              <MediaUpload
                title={__('Select poster image', 'web-stories')}
                onSelect={onSelectPoster}
                allowedTypes={POSTER_ALLOWED_MEDIA_TYPES}
                render={({ open }) => (
                  <Button
                    isPrimary
                    onClick={open}
                    ref={posterImageButton}
                    aria-describedby={posterDescription}
                  >
                    {!poster
                      ? __('Select', 'web-stories')
                      : __('Replace', 'web-stories')}
                  </Button>
                )}
              />
              <p id={posterDescription} hidden>
                {poster
                  ? sprintf(
                      /* translators: %s: poster image URL. */
                      __('The current poster image url is %s', 'web-stories'),
                      poster
                    )
                  : __(
                      'There is no poster image currently selected',
                      'web-stories'
                    )}
              </p>
              {Boolean(poster) && (
                <Button onClick={onRemovePoster} isTertiary>
                  {__('Remove', 'web-stories')}
                </Button>
              )}
            </BaseControl>
          </MediaUploadCheck>
        </PanelBody>
      </InspectorControls>
    </>
  );
};

EmbedControls.propTypes = {
  instanceId: PropTypes.string,
  showEditButton: PropTypes.bool,
  switchBackToURLInput: PropTypes.func,
  poster: PropTypes.string,
  setAttributes: PropTypes.func,
};

export default withInstanceId(EmbedControls);
