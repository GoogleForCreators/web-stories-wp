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
import { Draggable } from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { PageSizePropType } from '../../../../dashboard/types';
import { UnitsProvider } from '../../../../edit-story/units';
import { TransformProvider } from '../../../../edit-story/components/transform';
import FontProvider from '../../../../dashboard/app/font/fontProvider';
import reshapeStoryObject from '../../../../dashboard/app/serializers/stories';
import { StoryGrid, StoryGridItem } from './components/cardGridItem';
import ItemOverlay from './components/itemOverlay';
import StoryPreview from './storyPreview';

function SortStories({
  selectedStories,
  setSelectedStories,
  selectedStoriesObject,
  setSelectedStoriesObject,
  pageSize,
  addItemToSelectedStories,
  removeItemFromSelectedStories,
}) {
  const [droppingToIndex, setDroppingToIndex] = useState();
  const [draggedElID, setDragedElementID] = useState();
  const [selectedStoryList, setSelectedStoryList] = useState([]);

  useEffect(() => {
    setSelectedStoryList(
      selectedStoriesObject.map((story) => {
        return reshapeStoryObject()(story);
      })
    );
  }, [selectedStoriesObject]);

  const rearrangeStories = (oldIndex, newIndex) => {
    const selectedStoryIds = [...selectedStories];
    selectedStoryIds.splice(
      newIndex,
      0,
      selectedStoryIds.splice(oldIndex, 1).pop()
    );
    setSelectedStories(selectedStoryIds);
    setSelectedStoriesObject(
      selectedStoryIds.map((storyId) => {
        return selectedStoriesObject.find((story) => story.id === storyId);
      })
    );
  };

  return (
    <FontProvider>
      <TransformProvider>
        <UnitsProvider
          pageSize={{
            width: pageSize.width,
            height: pageSize.height,
          }}
        >
          <StoryGrid
            pageSize={pageSize}
            role="list"
            ariaLabel={__('Sorting stories', 'web-stories')}
          >
            {selectedStoryList.map((story, index) => {
              return (
                <div
                  key={story.id}
                  onDragOver={(event) => {
                    event.preventDefault();
                    event.target.closest('.droppable').style.borderLeft =
                      '5px solid #000';

                    setDroppingToIndex(
                      event.target.parentElement.dataset.order
                    );
                  }}
                  onDragLeave={(event) => {
                    event.preventDefault();
                    event.target.closest('.droppable').style.borderLeft = 0;
                  }}
                  onDrop={(event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    // Update the list after drop
                    if (draggedElID) {
                      const oldIndex = selectedStoryList.findIndex(
                        (storyItem) => storyItem.id === draggedElID
                      );
                      rearrangeStories(oldIndex, droppingToIndex);
                    }

                    event.target.closest('.droppable').style.borderLeft = 0;
                  }}
                  className="droppable"
                >
                  <div
                    data-order={index}
                    id={`draggable-example-box-${story.id}`}
                  >
                    <Draggable elementId={`draggable-example-box-${story.id}`}>
                      {({ onDraggableStart, onDraggableEnd }) => {
                        const handleOnDragStart = (event) => {
                          setDragedElementID(story.id);
                          onDraggableStart(event);
                        };
                        const handleOnDragEnd = (event) => {
                          onDraggableEnd(event);
                        };

                        return (
                          <StoryGridItem
                            role="listitem"
                            data-testid={`story-grid-item-${story.id}`}
                            onDragStart={handleOnDragStart}
                            onDragEnd={handleOnDragEnd}
                            data-order={index}
                            draggable
                          >
                            <StoryPreview pageSize={pageSize} story={story} />
                            <ItemOverlay
                              isSelected={true}
                              pageSize={pageSize}
                              storyId={story.id}
                              addItemToSelectedStories={
                                addItemToSelectedStories
                              }
                              removeItemFromSelectedStories={
                                removeItemFromSelectedStories
                              }
                            />
                          </StoryGridItem>
                        );
                      }}
                    </Draggable>
                  </div>
                </div>
              );
            })}
          </StoryGrid>
        </UnitsProvider>
      </TransformProvider>
    </FontProvider>
  );
}

SortStories.propTypes = {
  selectedStories: PropTypes.array,
  setSelectedStories: PropTypes.func,
  selectedStoriesObject: PropTypes.array,
  setSelectedStoriesObject: PropTypes.func,
  pageSize: PageSizePropType,
  addItemToSelectedStories: PropTypes.func,
  removeItemFromSelectedStories: PropTypes.func,
};

export default SortStories;
