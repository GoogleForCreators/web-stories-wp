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
  BaseControl,
  TextControl,
  PanelBody,
  PanelRow,
  ToggleControl,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const EmbedControlsInLoop = (props) => {
  const {
    width,
    height,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    previewOnly,
    setAttributes,
  } = props;

  const onChangePreviewOnly = useCallback(() => {
    setAttributes({ previewOnly: !previewOnly });
  }, [setAttributes, previewOnly]);

  return (
    <InspectorControls>
      <PanelBody title={__('Embed Settings', 'web-stories')}>
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
                  setAttributes({ width: Number.parseInt(value) })
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
                    height: Number.parseInt(value),
                  })
                }
              />
            </div>
          </BaseControl>
        </PanelRow>
        <PanelRow>
          <BaseControl>
            <ToggleControl
              label={__('Display as preview', 'web-stories')}
              checked={previewOnly}
              onChange={onChangePreviewOnly}
              help={__(
                'Displays the story poster that opens the story in a lightbox on click',
                'web-stories'
              )}
            />
          </BaseControl>
        </PanelRow>
      </PanelBody>
    </InspectorControls>
  );
};

EmbedControlsInLoop.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  minWidth: PropTypes.number,
  maxWidth: PropTypes.number,
  minHeight: PropTypes.number,
  maxHeight: PropTypes.number,
  setAttributes: PropTypes.func,
  previewOnly: PropTypes.bool,
};

export default EmbedControlsInLoop;
