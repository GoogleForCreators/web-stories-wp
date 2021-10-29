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
import { __ } from '@web-stories-wp/i18n';
import { hasOpacity, hasGradient } from '@web-stories-wp/patterns';
import { Swatch, Icons } from '@web-stories-wp/design-system';
/**
 * Internal dependencies
 */
import { useStory } from '../../../../../app/story';
import { areAllType } from '../utils';
import Tooltip from '../../../../tooltip';
function Color({ color, i, activeIndex, handleOnClick, isEditMode, isLocal }) {
  const { currentPage, selectedElements } = useStory(
    ({ state: { currentPage, selectedElements } }) => {
      return {
        currentPage,
        selectedElements,
      };
    }
  );
  if (!color) {
    return null;
  }
  const isText = areAllType('text', selectedElements);
  const isBackground = selectedElements[0].id === currentPage.elements[0].id;
  const deleteLabel = isLocal
    ? __('Delete local color', 'web-stories')
    : __('Delete global color', 'web-stories');
  const applyLabel = isLocal
    ? __('Apply local color', 'web-stories')
    : __('Apply global color', 'web-stories');
  const hasTransparency = hasOpacity(color);
  const isSolid = !hasGradient(color);

  // In edit mode we always enable the button for being able to delete.
  const isDisabled =
    !isEditMode && ((isBackground && hasTransparency) || (isText && !isSolid));
  let tooltip = null;
  if (isDisabled) {
    tooltip = isBackground
      ? __('Page background colors cannot have an opacity.', 'web-stories')
      : __('Gradient not allowed for Text', 'web-stories');
  }

  return (
    <Tooltip title={tooltip}>
      <Swatch
        aria-label={isEditMode ? deleteLabel : applyLabel}
        isDisabled={isDisabled}
        tabIndex={activeIndex === i ? 0 : -1}
        onClick={() => handleOnClick(color)}
        pattern={color}
      >
        {isEditMode && <Icons.Cross />}
      </Swatch>
    </Tooltip>
  );
}

Color.propTypes = {
  color: PropTypes.object,
  i: PropTypes.number.isRequired,
  activeIndex: PropTypes.number.isRequired,
  handleOnClick: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  isLocal: PropTypes.bool,
};

export default Color;
