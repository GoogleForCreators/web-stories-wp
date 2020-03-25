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
import { useCallback } from 'react';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { useStory } from '../../app/story';
import { PatternPropType } from '../../types';

const ActionsWrapper = styled.div`
  position: absolute;
  right: 0;
  left: 0;
  bottom: 0;
  text-align: center;
`;

const AddColorPreset = styled.button``;

function Actions({ color }) {
  const {
    state: {
      story: { colorPresets },
    },
    actions: { updateStory },
  } = useStory();

  const handleAddColorPreset = useCallback(() => {
    updateStory({
      properties: {
        colorPresets: [...colorPresets, { color }],
      },
    });
  }, [color, colorPresets, updateStory]);
  return (
    <ActionsWrapper>
      <AddColorPreset onClick={handleAddColorPreset}>
        {'+ Add to Color Preset'}
      </AddColorPreset>
    </ActionsWrapper>
  );
}

Actions.propTypes = {
  color: PatternPropType,
};

export default Actions;
