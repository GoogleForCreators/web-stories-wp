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
import { Button, ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { BlockControls } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { BLOCK_TYPE_URL, VIEW_TYPES } from '../constants';
import BlockTypeSwitcher from './blockTypeSwitcher';

/**
 * StoriesBlockControls props.
 *
 * @typedef StoriesBlockControlsProps
 * @property {string}    viewType     String indicator of active view type.
 * @property {Function} setAttributes Callable function for saving attribute values.
 */

/**
 * LatestStoriesBlockControls component. Used for rendering block controls of the block.
 *
 * @param {StoriesBlockControlsProps} props Component props.
 * @return {*} JSX markup.
 */
const StoriesBlockControls = ({ blockType, viewType, setAttributes }) => {
  return (
    <BlockControls>
      <ToolbarGroup>
        {blockType && BLOCK_TYPE_URL !== blockType && (
          <Fragment>
            {VIEW_TYPES.map((view) => {
              return ToolbarButton ? (
                <ToolbarButton
                  key={view.id}
                  label={view.label}
                  icon={view.icon}
                  onClick={() => {
                    setAttributes({ viewType: view.id });
                  }}
                  isPressed={view.id === viewType}
                />
              ) : (
                <Button
                  key={view.id}
                  label={view.label}
                  icon={view.icon}
                  onClick={() => {
                    setAttributes({ viewType: view.id });
                  }}
                  isPressed={view.id === viewType}
                />
              );
            })}
          </Fragment>
        )}
      </ToolbarGroup>
      <BlockTypeSwitcher
        selectedBlockType={blockType}
        setAttributes={setAttributes}
      />
    </BlockControls>
  );
};

StoriesBlockControls.propTypes = {
  blockType: PropTypes.string.isRequired,
  viewType: PropTypes.string.isRequired,
  setAttributes: PropTypes.func.isRequired,
};

export default StoriesBlockControls;
