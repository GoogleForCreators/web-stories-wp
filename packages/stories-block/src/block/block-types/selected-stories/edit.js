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
import { useState, useEffect, useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import StoriesInspectorControls from '../../components/storiesInspectorControls';
import StoriesPreview from '../../components/storiesPreview';
import FetchSelectedStories from '../../components/storyPicker/fetchSelectedStories';
import EmbedPlaceholder from './embedPlaceholder';

function SelectedStoriesEdit({
  icon,
  attributes,
  setAttributes,
  isSelected: isEditing,
}) {
  const { stories = [], archiveLinkLabel } = attributes;

  const [selectedStoryIds, setSelectedStoryIds] = useState(stories);
  const [selectedStories, _setSelectedStories] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const label = __('Selected Stories', 'web-stories');

  const viewAllLabel = archiveLinkLabel
    ? archiveLinkLabel
    : __('View All Stories', 'web-stories');

  useEffect(() => {
    if (attributes.stories.toString() !== selectedStoryIds.toString()) {
      setAttributes({
        stories: selectedStoryIds,
      });
    }
  }, [attributes.stories, setAttributes, selectedStoryIds]);

  useEffect(() => {
    if (selectedStoryIds.length && !selectedStories.length) {
      setIsFetching(true);
    }
  }, [selectedStoryIds, selectedStories, setIsFetching]);

  const setSelectedStories = useCallback(
    (newStories) => {
      _setSelectedStories(newStories);
      setSelectedStoryIds(newStories.map((story) => story.id));
    },
    [_setSelectedStories]
  );

  if (isFetching) {
    return (
      <FetchSelectedStories
        icon={icon}
        label={label}
        selectedStoryIds={selectedStoryIds}
        setSelectedStories={setSelectedStories}
        setIsFetching={setIsFetching}
      />
    );
  }

  return (
    <>
      <StoriesInspectorControls
        attributes={attributes}
        setAttributes={setAttributes}
        showFilters={false}
      />
      {Boolean(selectedStories?.length) && (
        <StoriesPreview
          attributes={attributes}
          stories={selectedStories}
          viewAllLabel={viewAllLabel}
        />
      )}
      <EmbedPlaceholder
        icon={icon}
        label={label}
        selectedStories={selectedStories}
        setSelectedStories={setSelectedStories}
        isEditing={isEditing}
      />
    </>
  );
}

SelectedStoriesEdit.propTypes = {
  icon: PropTypes.node,
  attributes: PropTypes.shape({
    blockType: PropTypes.string,
    stories: PropTypes.array,
    align: PropTypes.string,
    viewType: PropTypes.string,
    numOfColumns: PropTypes.number,
    archiveLinkLabel: PropTypes.string,
    circleSize: PropTypes.number,
  }),
  setAttributes: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
};

export default SelectedStoriesEdit;
