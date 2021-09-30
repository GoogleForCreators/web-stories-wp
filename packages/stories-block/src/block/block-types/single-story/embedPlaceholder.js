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
import { useCallback, useState } from '@wordpress/element';
import { Button, Placeholder } from '@wordpress/components';
import { BlockIcon } from '@wordpress/block-editor';
import { __, sprintf } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import StoryPicker from '../../components/storyPicker/storyPicker';
import InsertFromURLPopover from './insertFromURLPopover';

const EmbedPlaceholder = ({
  icon,
  label,
  value,
  onSubmit,
  cannotEmbed,
  errorMessage,
  selectedStories = [],
  setSelectedStories,
}) => {
  const [url, setUrl] = useState(value);
  const [isURLInputVisible, setIsURLInputVisible] = useState(false);
  const [isStoryPickerOpen, setIsStoryPickerOpen] = useState(false);

  const openStoryPicker = () => setIsStoryPickerOpen(true);
  const closeStoryPicker = useCallback(() => {
    setIsStoryPickerOpen(false);
  }, []);

  const openURLInput = () => setIsURLInputVisible(true);
  const closeURLInput = () => setIsURLInputVisible(false);

  const onChangeUrl = (event) => {
    setUrl(event.target.value);
  };

  const onSubmitUrl = (event) => {
    event.preventDefault();

    closeURLInput();
    onSubmit(url);
  };

  const hasStories = selectedStories.length > 0;

  return (
    <>
      <Placeholder
        icon={<BlockIcon icon={icon} showColors />}
        label={label}
        className="wp-block-web-stories-embed"
        instructions={__(
          'Select an existing story from your site, or add one with a URL.',
          'web-stories'
        )}
      >
        <>
          <Button isPrimary onClick={openStoryPicker}>
            {!hasStories
              ? __('Select Story', 'web-stories')
              : __('Replace Story', 'web-stories')}
          </Button>
          <div className="block-editor-media-placeholder__url-input-container">
            <Button
              className="block-editor-media-placeholder__button"
              onClick={openURLInput}
              isPressed={isURLInputVisible}
              variant="tertiary"
            >
              {!hasStories && value
                ? __('Replace URL', 'web-stories')
                : __('Insert from URL', 'web-stories')}
            </Button>
            {isURLInputVisible && (
              <InsertFromURLPopover
                url={url}
                onChange={onChangeUrl}
                onSubmit={onSubmitUrl}
                onClose={closeURLInput}
              />
            )}
          </div>
        </>
        {cannotEmbed && (
          <div className="components-placeholder__error">
            <div className="components-placeholder__instructions">
              {__('Sorry, this content could not be embedded.', 'web-stories')}
              {errorMessage && (
                <>
                  {' '}
                  {sprintf(
                    /* translators: %s: error message. */
                    __('Reason: %s.', 'web-stories'),
                    errorMessage
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </Placeholder>
      {isStoryPickerOpen && (
        <StoryPicker
          closeStoryPicker={closeStoryPicker}
          maxNumOfStories={1}
          selectedStories={selectedStories}
          setSelectedStories={setSelectedStories}
        />
      )}
    </>
  );
};

EmbedPlaceholder.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string,
  value: PropTypes.string,
  onSubmit: PropTypes.func,
  cannotEmbed: PropTypes.bool,
  errorMessage: PropTypes.string,
  selectedStories: PropTypes.array,
  setSelectedStories: PropTypes.func,
};

EmbedPlaceholder.defaultProps = {
  cannotEmbed: false,
};

export default EmbedPlaceholder;
