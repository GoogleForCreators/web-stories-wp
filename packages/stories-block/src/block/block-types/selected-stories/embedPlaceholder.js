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
import { Button, ToolbarButton, Placeholder } from '@wordpress/components';
import { BlockControls, BlockIcon } from '@wordpress/block-editor';
import { useCallback, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import StoryPicker from '../../components/storyPicker/storyPicker';

const {
  config: { maxNumOfStories },
} = window.webStoriesBlockSettings;

const EmbedPlaceholder = ({
  icon,
  label,
  selectedStories,
  setSelectedStories,
}) => {
  const [isStoryPickerOpen, setIsStoryPickerOpen] = useState(false);
  const [isSortingStories, setIsSortingStories] = useState(false);

  const openStoryPicker = () => setIsStoryPickerOpen(true);
  const closeStoryPicker = useCallback(() => {
    setIsStoryPickerOpen(false);
    setIsSortingStories(false);
  }, []);

  const openStoryRearrangeWindow = useCallback(() => {
    setIsSortingStories(true);
    openStoryPicker();
  }, []);

  return (
    <>
      {/*
        Using ToolbarButton if available is mandatory as other usage is deprecated
        for accessibility reasons and causes console warnings.
        See https://github.com/WordPress/gutenberg/pull/23316
        See https://developer.wordpress.org/block-editor/components/toolbar-button/#inside-blockcontrols
        */}
      <BlockControls group="other">
        {Boolean(selectedStories?.length) &&
          (ToolbarButton ? (
            <>
              <ToolbarButton
                aria-expanded={isStoryPickerOpen}
                aria-haspopup="true"
                onClick={openStoryPicker}
              >
                {__('Select', 'web-stories')}
              </ToolbarButton>
              <ToolbarButton
                aria-expanded={isStoryPickerOpen}
                aria-haspopup="true"
                onClick={openStoryRearrangeWindow}
              >
                {__('Rearrange', 'web-stories')}
              </ToolbarButton>
            </>
          ) : (
            <>
              <Button
                className="components-toolbar__control"
                title={__('Select', 'web-stories')}
                aria-expanded={isStoryPickerOpen}
                aria-haspopup="true"
                onClick={openStoryPicker}
              />
              <Button
                className="components-toolbar__control"
                title={__('Rearrange', 'web-stories')}
                aria-expanded={openStoryRearrangeWindow}
                aria-haspopup="true"
                onClick={openStoryRearrangeWindow}
              />
            </>
          ))}
      </BlockControls>
      {selectedStories.length === 0 && (
        <Placeholder
          icon={<BlockIcon icon={icon} showColors />}
          label={label}
          className="wp-block-web-stories-embed"
          instructions={__(
            'Select the web stories you want to display on your site.',
            'web-stories'
          )}
        >
          <Button isPrimary onClick={openStoryPicker}>
            {__('Select Stories', 'web-stories')}
          </Button>
        </Placeholder>
      )}
      {isStoryPickerOpen && (
        <StoryPicker
          closeStoryPicker={closeStoryPicker}
          selectedStories={selectedStories}
          setSelectedStories={setSelectedStories}
          isSortingStories={isSortingStories}
          setIsSortingStories={setIsSortingStories}
          maxNumOfStories={maxNumOfStories}
        />
      )}
    </>
  );
};

EmbedPlaceholder.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string,
  selectedStories: PropTypes.array,
  setSelectedStories: PropTypes.func,
};

export default EmbedPlaceholder;
