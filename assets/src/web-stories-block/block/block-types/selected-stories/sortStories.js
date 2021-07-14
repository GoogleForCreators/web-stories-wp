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
import { Draggable } from '@wordpress/components';
import { useCallback, useState } from '@wordpress/element';
import { useThrottle } from '@wordpress/compose';

/**
 * Internal dependencies
 */
import StoryPreview from './storyPreview';

function SortStories({ selectedStories, setSelectedStories }) {
  const [droppingToIndex, setDroppingToIndex] = useState();
  const [draggedElementId, setDraggedElementId] = useState();

  const rearrangeStories = useCallback(
    (oldIndex, newIndex) => {
      const newList = selectedStories.map((story) => story.id);
      newList.splice(newIndex, 0, newList.splice(oldIndex, 1).pop());
      setSelectedStories(
        newList.map((storyId) => {
          return selectedStories.find((story) => story.id === storyId);
        })
      );
    },
    [selectedStories, setSelectedStories]
  );

  const throttledOnDragOver = useThrottle((event, currentTarget) => {
    event.preventDefault();

    currentTarget.classList.add('web-stories-story-picker-show-drag-inserter');

    const targetElementRect = currentTarget.getBoundingClientRect();

    const isDraggingOnRightSide =
      Math.abs(event.clientX - targetElementRect.x) >
      Math.abs(event.clientX - (targetElementRect.x + targetElementRect.width));

    if (isDraggingOnRightSide) {
      currentTarget.classList.add(
        'web-stories-story-picker-show-drag-inserter-right'
      );
    } else {
      currentTarget.classList.remove(
        'web-stories-story-picker-show-drag-inserter-right'
      );
    }

    const dropIndex = Number(currentTarget.children[0].dataset.order);

    setDroppingToIndex(dropIndex);
  });

  return (
    <div
      role="list"
      aria-label={__('Sorting Stories', 'web-stories')}
      className="web-stories-story-picker-filter__grid"
    >
      {selectedStories.map((story, index) => {
        return (
          <div
            key={story.id}
            onDragOver={(event) => {
              // `currentTarget` is only available while the event is being
              // handled, so get it now and pass it to the throttled function.
              // https://developer.mozilla.org/en-US/docs/Web/API/Event/currentTarget
              throttledOnDragOver(event, event.currentTarget);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              throttledOnDragOver.cancel();
              const targetElement = event.target.closest('.droppable');
              targetElement.classList.remove(
                'web-stories-story-picker-show-drag-inserter',
                'web-stories-story-picker-show-drag-inserter-right'
              );
            }}
            onDrop={(event) => {
              event.preventDefault();
              event.stopPropagation();

              throttledOnDragOver.cancel();

              // Update the list after drop
              if (draggedElementId) {
                const oldIndex = selectedStories.findIndex(
                  (storyItem) => storyItem.id === draggedElementId
                );
                rearrangeStories(oldIndex, droppingToIndex);
              }

              const targetElement = event.target.closest('.droppable');
              targetElement.classList.remove(
                'web-stories-story-picker-show-drag-inserter',
                'web-stories-story-picker-show-drag-inserter-right'
              );
            }}
            className="droppable"
          >
            <div data-order={index} id={`draggable-story-${story.id}`}>
              <Draggable elementId={`draggable-story-${story.id}`}>
                {({ onDraggableStart, onDraggableEnd }) => {
                  const handleOnDragStart = (event) => {
                    setDraggedElementId(story.id);
                    onDraggableStart(event);
                  };
                  const handleOnDragEnd = (event) => {
                    onDraggableEnd(event);
                  };

                  return (
                    <div
                      key={story.id}
                      role="listitem"
                      className="web-stories-story-picker-filter__grid_item"
                      onDragStart={handleOnDragStart}
                      onDragEnd={handleOnDragEnd}
                      data-order={index}
                      draggable
                    >
                      <StoryPreview story={story} />
                    </div>
                  );
                }}
              </Draggable>
            </div>
          </div>
        );
      })}
    </div>
  );
}

SortStories.propTypes = {
  selectedStories: PropTypes.array,
  setSelectedStories: PropTypes.func,
};

export default SortStories;
