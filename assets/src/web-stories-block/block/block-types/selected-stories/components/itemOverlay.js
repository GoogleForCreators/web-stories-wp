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
import { Icon, check, minus } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { PageSizePropType } from '../../../../../dashboard/types';

const StyledOverlay = styled.a(
  ({ pageSize }) => `
  display: block;
  position: absolute;
  z-index: 1;
  width: 100%;
  height: ${pageSize.containerHeight}px;

  &:focus {
    box-shadow: 0 0 3px 3px #5b9dd9, 0 0 2px 1px rgba(30, 140, 190, 0.8);
  }

  &.item-selected {

    .item-selected-icon {
      position: absolute;
      top: -7px;
      right: -7px;
      z-index: 1;

      svg {
        background-color: #ccc;
        box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        stroke: #000;
        stroke-width: 2px;
        padding: 3px;
      }

      .item-selected-icon-minus {
        display: none;
      }

      &:hover {
        .item-selected-icon-minus {
          display: block;
        }

        .item-selected-icon-check {
          display: none;
        }
      }
    }

    &:focus {

      .item-selected-icon {

        svg {
          background-color: #0073aa;
          stroke: #fff;
        }
      }
    }
  }
`
);

function ItemOverlay({
  isSelected,
  pageSize,
  storyId,
  addItemToSelectedStories,
  removeItemFromSelectedStories,
}) {
  return (
    <StyledOverlay
      className={isSelected ? 'item-selected' : ''}
      pageSize={pageSize}
      href={`#select-story-${storyId}`}
      onClick={(event) => {
        event.preventDefault();
        addItemToSelectedStories(storyId);
      }}
    >
      {isSelected && (
        <div className="item-selected-icon">
          <Icon className="item-selected-icon-check" icon={check} />
          <Icon
            className="item-selected-icon-minus"
            icon={minus}
            onClick={(event) => {
              event.preventDefault();
              removeItemFromSelectedStories(storyId);
            }}
          />
        </div>
      )}
    </StyledOverlay>
  );
}

ItemOverlay.propTypes = {
  isSelected: PropTypes.bool,
  pageSize: PageSizePropType,
  storyId: PropTypes.number,
  addItemToSelectedStories: PropTypes.func,
  removeItemFromSelectedStories: PropTypes.func,
};

export default ItemOverlay;
