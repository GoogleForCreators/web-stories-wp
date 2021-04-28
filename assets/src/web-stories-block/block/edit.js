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
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ReactComponent as icon } from '../images/icon.svg';
import StoryEmbedEdit from './block-types/story-embed-block/edit';
import { ConfigProvider } from './config';
import StoriesBlockControls from './components/storiesBlockControls';
import BlockConfigurationPanel from './components/storiesBlockConfigurationPanel';
import LatestStoriesEdit from './block-types/latest-stories/edit';
import SelectedStoriesEdit from './block-types/selected-stories/edit';
import {
  BLOCK_TYPE_LATEST_STORIES,
  BLOCK_TYPE_SELECTED_STORIES,
  BLOCK_TYPE_URL,
  BLOCK_TYPES,
  VIEW_TYPES,
} from './constants';
import { webStoriesBlockSettings } from './globals';

const { config } = webStoriesBlockSettings;

function WebStoriesEdit({ attributes, setAttributes, className, isSelected }) {
  const { blockType, viewType } = attributes;

  if (!blockType) {
    return (
      <BlockConfigurationPanel
        icon={icon}
        setAttributes={setAttributes}
        instruction={__(
          'Embed a collection of your latest stories, select your own or enter an URL',
          'web-stories'
        )}
        columnCount={3}
        selectionOptions={BLOCK_TYPES}
        selectionType={'blockType'}
      />
    );
  }

  if (blockType !== BLOCK_TYPE_URL && !viewType) {
    return (
      <BlockConfigurationPanel
        icon={icon}
        setAttributes={setAttributes}
        instruction={__('Select a layout style', 'web-stories')}
        columnCount={4}
        selectionOptions={VIEW_TYPES}
        selectionType={'viewType'}
      />
    );
  }

  return (
    <ConfigProvider config={config}>
      <StoriesBlockControls
        blockType={blockType}
        viewType={viewType}
        setAttributes={setAttributes}
      />

      {blockType === BLOCK_TYPE_LATEST_STORIES && (
        <LatestStoriesEdit
          attributes={attributes}
          setAttributes={setAttributes}
        />
      )}

      {blockType === BLOCK_TYPE_SELECTED_STORIES && (
        <SelectedStoriesEdit
          icon={icon}
          attributes={attributes}
          setAttributes={setAttributes}
          isSelected={isSelected}
        />
      )}

      {blockType === BLOCK_TYPE_URL && (
        <StoryEmbedEdit
          icon={icon}
          attributes={attributes}
          setAttributes={setAttributes}
          className={className}
          isSelected={isSelected}
        />
      )}
    </ConfigProvider>
  );
}

WebStoriesEdit.propTypes = {
  attributes: PropTypes.shape({
    blockType: PropTypes.string,
    url: PropTypes.string,
    title: PropTypes.string,
    poster: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
    align: PropTypes.string,
    stories: PropTypes.array,
    viewType: PropTypes.string,
    numOfStories: PropTypes.number,
    numOfColumns: PropTypes.number,
    orderby: PropTypes.string,
    order: PropTypes.string,
    archiveLinkLabel: PropTypes.string,
    authors: PropTypes.array,
  }),
  setAttributes: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
};

export default WebStoriesEdit;
