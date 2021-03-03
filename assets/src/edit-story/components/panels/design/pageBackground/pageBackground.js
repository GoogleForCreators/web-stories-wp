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
import { __ } from '@web-stories-wp/i18n';
import PropTypes from 'prop-types';
import styled from 'styled-components';

/**
 * Internal dependencies
 */
import { Color, Row as DefaultRow } from '../../../form';
import { useStory } from '../../../../app';
import { SimplePanel } from '../../panel';
import { FlipControls, getColorPickerActions } from '../../shared';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
  Text as DefaultText,
  THEME_CONSTANTS,
} from '../../../../../design-system';
import { getDefinitionForType } from '../../../../elements';

const DEFAULT_FLIP = { horizontal: false, vertical: false };

const Row = styled(DefaultRow)`
  justify-content: flex-start;
`;

const SelectedMedia = styled.div`
  width: 128px;
  height: 36px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.colors.border.defaultNormal};
  display: flex;
  justify-content: space-between;
  margin-right: 20px;
`;

const MediaWrapper = styled.div`
  height: 24px;
  width: 24px;
  border-radius: 4px;
  overflow: hidden;
  margin: 6px;
  img {
    object-fit: cover;
    min-height: 24px;
  }
`;

const RemoveButton = styled(Button)`
  margin: 1px;
  align-self: center;
`;

const Text = styled(DefaultText)`
  align-self: center;
  width: 55px;
`;

function PageBackgroundPanel({ selectedElements, pushUpdate }) {
  const {
    state: { currentPage },
    actions: { updateCurrentPageProperties },
  } = useStory();

  const updateBackgroundColor = useCallback(
    (value) => {
      updateCurrentPageProperties({ properties: { backgroundColor: value } });
    },
    [updateCurrentPageProperties]
  );

  const { setBackgroundElement } = useStory((state) => ({
    setBackgroundElement: state.actions.setBackgroundElement,
  }));

  const removeAsBackground = useCallback(() => {
    pushUpdate(
      {
        isBackground: false,
        opacity: 100,
        overlay: null,
      },
      true
    );
    setBackgroundElement({ elementId: null });
  }, [pushUpdate, setBackgroundElement]);

  const backgroundEl = selectedElements[0];
  if (!backgroundEl || !backgroundEl.isBackground) {
    return null;
  }
  const isDefaultBackground = backgroundEl.isDefaultBackground;
  const isMedia = backgroundEl.isBackground && !isDefaultBackground;

  const { backgroundColor } = currentPage;
  const { LayerContent } = getDefinitionForType(backgroundEl.type);

  // Background can only have one selected element.
  const flip = selectedElements[0]?.flip || DEFAULT_FLIP;

  return (
    <SimplePanel
      name="pageBackground"
      title={__('Page background', 'web-stories')}
      isPersistable={false}
    >
      {isDefaultBackground && (
        <Row>
          <Color
            hasGradient
            value={backgroundColor}
            onChange={updateBackgroundColor}
            label={__('Background color', 'web-stories')}
            colorPickerActions={getColorPickerActions}
            hasOpacity={false}
          />
        </Row>
      )}
      {isMedia && (
        <Row expand={false}>
          <SelectedMedia>
            <MediaWrapper>
              <LayerContent element={backgroundEl} height={'100%'} />
            </MediaWrapper>
            <Text size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
              {__('Media', 'web-stories')}
            </Text>
            <RemoveButton
              onClick={removeAsBackground}
              size={BUTTON_SIZES.SMALL}
              variant={BUTTON_VARIANTS.SQUARE}
              type={BUTTON_TYPES.TERTIARY}
            >
              <Icons.Cross />
            </RemoveButton>
          </SelectedMedia>
          <FlipControls
            onChange={(value) => pushUpdate({ flip: value }, true)}
            value={flip}
          />
        </Row>
      )}
    </SimplePanel>
  );
}

PageBackgroundPanel.propTypes = {
  selectedElements: PropTypes.array,
  pushUpdate: PropTypes.func,
};

export default PageBackgroundPanel;
