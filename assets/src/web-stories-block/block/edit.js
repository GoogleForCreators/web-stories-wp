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
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './edit.css';
import StoryEmbedEdit from '../../story-embed-block/block/edit';
import { ConfigProvider } from '../../dashboard/app/config';
import BlockConfigurationPanel from './components/storiesBlockConfigurationPanel';
import LatestStoriesEdit from './block-types/latest-stories/edit';
import {
  BLOCK_TYPE_LATEST_STORIES,
  BLOCK_TYPE_URL,
  BLOCK_TYPES,
  VIEW_TYPES,
} from './constants';
import { icon } from './';

const { config } = global.webStoriesBlockSettings;

function WebStoriesEdit({ attributes, setAttributes, className, isSelected }) {
  const { blockType, viewType } = attributes;

  if (!blockType) {
    return (
      <BlockConfigurationPanel
        icon={icon}
        setAttributes={setAttributes}
        instruction={__('Select Block Type', 'web-stories')}
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
        instruction={__('Select Block View Type', 'web-stories')}
        columnCount={4}
        selectionOptions={VIEW_TYPES}
        selectionType={'viewType'}
      />
    );
  }

  return (
    <ConfigProvider config={config}>
      {blockType === BLOCK_TYPE_LATEST_STORIES && (
        <LatestStoriesEdit
          attributes={attributes}
          setAttributes={setAttributes}
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
    orderByValue: PropTypes.string,
    viewAllLinkLabel: PropTypes.string,
    authors: PropTypes.array,
  }),
  setAttributes: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
  isSelected: PropTypes.bool,
};

export default WebStoriesEdit;
