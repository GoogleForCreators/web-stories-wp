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
import { __ } from '@googleforcreators/i18n';
import { useCallback } from '@googleforcreators/react';
import { trackEvent } from '@googleforcreators/tracking';
import { Tooltip } from '@googleforcreators/story-editor';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
  PLACEMENT,
} from '@googleforcreators/design-system';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import useMetaBoxes from '../useMetaBoxes';

const Box = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Item = styled.div``;

function MenuItem() {
  const { metaBoxesVisible, toggleMetaBoxesVisible, hasMetaBoxes } =
    useMetaBoxes(({ state, actions }) => ({
      hasMetaBoxes: state.hasMetaBoxes,
      metaBoxesVisible: state.metaBoxesVisible,
      toggleMetaBoxesVisible: actions.toggleMetaBoxesVisible,
    }));

  const handleMetaBoxesClick = useCallback(() => {
    toggleMetaBoxesVisible();
    trackEvent('meta_boxes_toggled', {
      status: metaBoxesVisible ? 'visible' : 'hidden',
    });
  }, [metaBoxesVisible, toggleMetaBoxesVisible]);

  if (!hasMetaBoxes) {
    return null;
  }

  return (
    <Item>
      <Box>
        <Tooltip
          title={__('Third-Party Meta Boxes', 'web-stories')}
          placement={PLACEMENT.TOP}
          hasTail
        >
          <Button
            variant={BUTTON_VARIANTS.SQUARE}
            type={BUTTON_TYPES.TERTIARY}
            size={BUTTON_SIZES.SMALL}
            onClick={handleMetaBoxesClick}
            aria-label={__('Third-Party Meta Boxes', 'web-stories')}
          >
            <Icons.LetterMOutline />
          </Button>
        </Tooltip>
      </Box>
    </Item>
  );
}

export default MenuItem;
