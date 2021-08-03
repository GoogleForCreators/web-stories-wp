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
import styled from 'styled-components';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import { useStory } from '../../../../../app/story';
import { SAVED_COLOR_SIZE } from '../../../../../constants';
import ColorGroup from './colorGroup';
import useApplyColor from './useApplyColor';

const COLOR_GAP = 4;
const MAX_ROWS = 2;

const ColorsWrapper = styled.div`
  max-height: ${SAVED_COLOR_SIZE * MAX_ROWS + COLOR_GAP * (MAX_ROWS - 1)}px;
  width: calc(100% + 8px);
  overflow-x: hidden;
  overflow-y: auto;
`;

/**
 * @param {Object} properties Properties.
 * @param {Function} properties.pushUpdate Update function.
 * @return {*} Element.
 */
function ColorPresetActions({ pushUpdate }) {
  const { globalStoryStyles } = useStory(
    ({
      state: {
        story: { globalStoryStyles },
      },
    }) => ({ globalStoryStyles })
  );

  const { colors: globalColors } = globalStoryStyles;

  const applyStyle = useApplyColor({ pushUpdate });

  const savedColors = globalColors;
  return (
    <ColorsWrapper hasColors={savedColors.length > 0}>
      {savedColors.length > 0 && (
        <ColorGroup
          isEditMode={false}
          isLocal={false}
          colors={savedColors}
          handleClick={applyStyle}
          displayAdd={false}
          colorGap={COLOR_GAP}
        />
      )}
    </ColorsWrapper>
  );
}

ColorPresetActions.propTypes = {
  pushUpdate: PropTypes.func,
};

export default ColorPresetActions;
