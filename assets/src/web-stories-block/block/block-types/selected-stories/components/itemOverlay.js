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
import { Icon, VisuallyHidden } from '@wordpress/components';
import { useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

function ItemOverlay({
  isSelected,
  story,
  addSelectedStory,
  removeSelectedStory,
}) {
  const onClickOverlay = useCallback(
    (event) => {
      event.preventDefault();

      if (isSelected) {
        return;
      }

      addSelectedStory(story);
    },
    [addSelectedStory, story, isSelected]
  );

  const onClickIcon = useCallback(
    (event) => {
      event.preventDefault();

      if (isSelected) {
        removeSelectedStory(story);
      } else {
        addSelectedStory(story);
      }
    },
    [removeSelectedStory, addSelectedStory, story, isSelected]
  );

  return (
    <button
      type="button"
      className={
        isSelected
          ? 'web-stories-story-preview-card__overlay item-selected'
          : 'web-stories-story-preview-card__overlay'
      }
      onClick={onClickOverlay}
    >
      {isSelected && (
        <div className="item-selected-icon">
          <Icon className="item-selected-icon-check" icon="saved" />
          <Icon
            className="item-selected-icon-minus"
            icon="minus"
            onClick={onClickIcon}
          />
          <VisuallyHidden>{__('Deselect', 'web-stories')}</VisuallyHidden>
        </div>
      )}
    </button>
  );
}

ItemOverlay.propTypes = {
  isSelected: PropTypes.bool,
  story: PropTypes.object.isRequired,
  addSelectedStory: PropTypes.func,
  removeSelectedStory: PropTypes.func,
};

export default ItemOverlay;
