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
import { useCallback } from '@googleforcreators/react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { PatternPropType } from '@googleforcreators/patterns';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
} from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import useStory from '../../app/story/useStory';
import getUniquePresets from '../../utils/getUniquePresets';

const StyledButton = styled(Button)`
  flex: 0 0 32px;
  margin: 0 16px 16px;
`;

function AddCustomColor({ color, onSave }) {
  const { updateStory, globalStoryStyles } = useStory(
    ({
      state: {
        story: { globalStoryStyles },
      },
      actions: { updateStory },
    }) => ({
      globalStoryStyles,
      updateStory,
    })
  );

  const handleAddSavedColor = useCallback(() => {
    updateStory({
      properties: {
        globalStoryStyles: {
          ...globalStoryStyles,
          colors: getUniquePresets(
            [...globalStoryStyles.colors, color].filter(Boolean)
          ),
        },
      },
    });
    onSave();
  }, [onSave, color, globalStoryStyles, updateStory]);

  return (
    <StyledButton
      onClick={handleAddSavedColor}
      type={BUTTON_TYPES.SECONDARY}
      size={BUTTON_SIZES.SMALL}
      variant={BUTTON_VARIANTS.RECTANGLE}
    >
      {__('Add to Saved Colors', 'web-stories')}
    </StyledButton>
  );
}

AddCustomColor.propTypes = {
  onSave: PropTypes.func,
  color: PatternPropType,
};

export default AddCustomColor;
