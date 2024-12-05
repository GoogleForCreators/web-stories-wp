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
import {
  Button,
  BaseControl,
  TextControl,
  PanelBody,
  PanelRow,
  ToolbarGroup,
  ToolbarButton,
  ToggleControl,
} from '@wordpress/components';
import {
  BlockControls,
  InspectorControls,
  MediaUpload,
  MediaUploadCheck,
} from '@wordpress/block-editor';
import { useInstanceId } from '@wordpress/compose';
import { createRef, useCallback } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

const POSTER_ALLOWED_MEDIA_TYPES = ['image'];

const EmbedControls = (props) => {
  const {
    switchBackToURLInput,
    width,
    height,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    poster,
    title,
    previewOnly,
    setAttributes,
  } = props;

  const instanceId = useInstanceId(EmbedControls, 'web-stories-embed');

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

  const onChangePreviewOnly = useCallback(() => {
    setAttributes({ previewOnly: !previewOnly });
  }, [setAttributes, previewOnly]);

  const hasPoster = Boolean(poster);

  return (
    <>
      <BlockControls>
        <ToolbarGroup>
          {/*
          Using ToolbarButton if available is mandatory as other usage is deprecated
          for accessibility reasons and causes console warnings.
          See https://github.com/WordPress/gutenberg/pull/23316
          See https://developer.wordpress.org/block-editor/components/toolbar-button/#inside-blockcontrols
          */}
          {ToolbarButton ? (
            <ToolbarButton onClick={switchBackToURLInput}>
              {__('Replace', 'web-stories')}
            </ToolbarButton>
          ) : (
            <Button
              className="components-toolbar__control"
              title={__('Replace', 'web-stories')}
              onClick={switchBackToURLInput}
            />
          )}
        </ToolbarGroup>
      </BlockControls>
      <InspectorControls>
        <PanelBody title={__('Embed Settings', 'web-stories')}>
          <PanelRow>
            <BaseControl __nextHasNoMarginBottom>
              <TextControl
                type="text"
                className="web-stories-embed-title-control"
                label={__('Title', 'web-stories')}
                value={title || ''}
                onChange={(value) => setAttributes({ title: value })}
                __nextHasNoMarginBottom
              />
            </BaseControl>
          </PanelRow>
          <MediaUploadCheck>
            <PanelRow>
              <BaseControl __nextHasNoMarginBottom>
                <BaseControl.VisualLabel className="web-stories-embed-poster-label">
                  {__('Poster image', 'web-stories')}
                </BaseControl.VisualLabel>
                {hasPoster && <img src={poster} alt="" />}
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
                      {!hasPoster
                        ? __('Select', 'web-stories')
                        : __('Replace', 'web-stories')}
                    </Button>
                  )}
                />
                <p id={posterDescription} hidden>
                  {hasPoster
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
                {hasPoster && (
                  <Button
                    className="web-stories-embed-poster-remove"
                    onClick={onRemovePoster}
                  >
                    {__('Remove', 'web-stories')}
                  </Button>
                )}
              </BaseControl>
            </PanelRow>
          </MediaUploadCheck>
          <PanelRow>
            <BaseControl
              className="web-stories-embed-size-control"
              __nextHasNoMarginBottom
            >
              <BaseControl.VisualLabel>
                {__('Story dimensions', 'web-stories')}
              </BaseControl.VisualLabel>
              <div className="web-stories-embed-size-control__row">
                <TextControl
                  type="number"
                  className="web-stories-embed-size-control__width"
                  label={__('Width', 'web-stories')}
                  value={width || ''}
                  min={minWidth}
                  max={maxWidth}
                  onChange={(value) =>
                    setAttributes({ width: Number.parseInt(value) })
                  }
                  __nextHasNoMarginBottom
                />
                <TextControl
                  type="number"
                  className="web-stories-embed-size-control__height"
                  label={__('Height', 'web-stories')}
                  value={height || ''}
                  min={minHeight}
                  max={maxHeight}
                  onChange={(value) =>
                    setAttributes({
                      height: Number.parseInt(value),
                    })
                  }
                  __nextHasNoMarginBottom
                />
              </div>
            </BaseControl>
          </PanelRow>
          <PanelRow>
            <BaseControl __nextHasNoMarginBottom>
              <ToggleControl
                label={__('Display as preview', 'web-stories')}
                checked={previewOnly}
                onChange={onChangePreviewOnly}
                help={__(
                  'Displays the story poster that opens the story in a lightbox on click',
                  'web-stories'
                )}
                __nextHasNoMarginBottom
              />
            </BaseControl>
          </PanelRow>
        </PanelBody>
      </InspectorControls>
    </>
  );
};

EmbedControls.propTypes = {
  switchBackToURLInput: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
  minWidth: PropTypes.number,
  maxWidth: PropTypes.number,
  minHeight: PropTypes.number,
  maxHeight: PropTypes.number,
  poster: PropTypes.string,
  title: PropTypes.string,
  setAttributes: PropTypes.func,
  previewOnly: PropTypes.bool,
};

export default EmbedControls;
