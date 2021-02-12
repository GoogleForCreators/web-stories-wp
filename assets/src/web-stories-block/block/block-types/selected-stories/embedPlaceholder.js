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
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, Placeholder } from '@wordpress/components';
import { BlockIcon } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import StoryPicker from './storyPicker';

const SelectStoriesPlaceholder = styled(Placeholder)`
  &.is-appender {
    min-height: 0;
    margin-top: 20px;

    &.not-editing {
      display: none;
    }
  }
`;

const EmbedPlaceholder = ({
  icon,
  label,
  selectedStories,
  setSelectedStories,
  selectedStoriesObject,
  setSelectedStoriesObject,
  isEditing,
}) => {
  const [isStoryPickerOpen, setIsStoryPickerOpen] = useState(false);
  const [isSortingStories, setIsSortingStories] = useState(false);

  const openStoryPicker = () => setIsStoryPickerOpen(true);
  const closeStoryPicker = () => {
    setIsStoryPickerOpen(false);
    setIsSortingStories(false);
  };

  let placeholderIcon = <BlockIcon icon={icon} showColors />;
  let placeholderLabel = label;
  let instruction = __(
    'Select the web stories you want to display on your site.',
    'web-stories'
  );
  let placeholderClassName = 'wp-block-web-stories-embed';

  const openStoryRearrangeWindow = () => {
    setIsSortingStories(true);
    openStoryPicker();
  };

  if (selectedStoriesObject.length) {
    placeholderIcon = false;
    placeholderLabel = false;
    instruction = false;
    placeholderClassName = 'wp-block-web-stories-embed is-appender';

    if (!isEditing) {
      placeholderClassName += ' not-editing';
    }
  }

  return (
    <SelectStoriesPlaceholder
      icon={placeholderIcon}
      label={placeholderLabel}
      className={placeholderClassName}
      instructions={instruction}
    >
      <Button isPrimary onClick={openStoryPicker}>
        {__('Select Stories', 'web-stories')}
      </Button>
      {selectedStoriesObject.length > 1 && (
        <Button isSecondary onClick={openStoryRearrangeWindow}>
          {__('Rearrange Stories', 'web-stories')}
        </Button>
      )}
      {isStoryPickerOpen && (
        <StoryPicker
          selectedStories={selectedStories}
          setSelectedStories={setSelectedStories}
          closeStoryPicker={closeStoryPicker}
          selectedStoriesObject={selectedStoriesObject}
          setSelectedStoriesObject={setSelectedStoriesObject}
          isSortingStories={isSortingStories}
          setIsSortingStories={setIsSortingStories}
        />
      )}
    </SelectStoriesPlaceholder>
  );
};

EmbedPlaceholder.propTypes = {
  icon: PropTypes.func,
  label: PropTypes.string,
  selectedStories: PropTypes.array,
  setSelectedStories: PropTypes.func,
  selectedStoriesObject: PropTypes.array,
  setSelectedStoriesObject: PropTypes.func,
  isEditing: PropTypes.bool,
};

export default EmbedPlaceholder;
