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
import * as Components from '@wordpress/components';
import {
  BlockControls,
  InspectorControls,
  MediaUpload,
  MediaUploadCheck,
} from '@wordpress/block-editor';
import { withInstanceId } from '@wordpress/compose';
import { createRef, useCallback } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

const POSTER_ALLOWED_MEDIA_TYPES = ['image'];

const FallbackComponent = ({ children }) => children;

// Note: ToolbarGroup and ToolbarButton are only available in Gutenberg 7.0 or later,
// so they do not exist in WP 5.3.
const {
  Button,
  BaseControl,
  TextControl,
  PanelBody,
  PanelRow,
  ToolbarGroup = FallbackComponent,
  ToolbarButton,
} = Components;

const EmbedControls = (props) => {
  const {
    instanceId,
    switchBackToURLInput,
    width,
    height,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    poster,
    title,
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
            <ToolbarButton
              title={__('Edit URL', 'web-stories')}
              icon="edit"
              onClick={switchBackToURLInput}
            />
          ) : (
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
        <PanelBody title={__('Embed Settings', 'web-stories')}>
          <PanelRow>
            <BaseControl>
              <TextControl
                type="text"
                className="web-stories-embed-title-control"
                label={__('Title', 'web-stories')}
                value={title || ''}
                onChange={(value) => setAttributes({ title: value })}
              />
            </BaseControl>
          </PanelRow>
          <MediaUploadCheck>
            <PanelRow>
              <BaseControl>
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
                  <Button onClick={onRemovePoster} isTertiary>
                    {__('Remove', 'web-stories')}
                  </Button>
                )}
              </BaseControl>
            </PanelRow>
          </MediaUploadCheck>
          <PanelRow>
            <BaseControl className="web-stories-embed-size-control">
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
                    setAttributes({ width: parseInt(value) })
                  }
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
                      height: parseInt(value),
                    })
                  }
                />
              </div>
            </BaseControl>
          </PanelRow>
        </PanelBody>
      </InspectorControls>
    </>
  );
};

FallbackComponent.propTypes = {
  children: PropTypes.node,
};

EmbedControls.propTypes = {
  instanceId: PropTypes.number,
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
};

export default withInstanceId(EmbedControls);
