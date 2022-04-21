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
import {
  THEME_CONSTANTS,
  Text,
  BUTTON_TYPES,
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  Icons,
  Button,
  PLACEMENT,
  Popup,
} from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';
import styled from 'styled-components';
import { useRef, useState } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import { useStory, useConfig } from '../../../../app';
import { PRESET_TYPES } from '../../../../constants';
import useAddPreset from '../../../../utils/useAddPreset';
import useSidebar from '../../../sidebar/useSidebar';
import StyleGroup from '../../../styleManager/styleGroup';
import StyleManager, {
  NoStylesWrapper,
  MoreButton,
} from '../../../styleManager';
import useApplyStyle from '../../../styleManager/useApplyStyle';

const PresetsHeader = styled.div`
  display: flex;
  padding: 8px 0;
  justify-content: space-between;
`;

const StylesWrapper = styled.div``;

const SubHeading = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.secondary};
  margin: 6px 0;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;

const StyledButton = styled(Button)`
  margin-left: auto;
`;

const NoStylesText = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.tertiary};
`;

const SPACING = { x: 12 };

function PresetPanel({ pushUpdate }) {
  const textStyles = useStory(
    ({ state }) => state.story.globalStoryStyles.textStyles
  );

  const {
    refs: { sidebar },
  } = useSidebar();
  const buttonRef = useRef(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { isRTL, styleConstants: { leftOffset, topOffset } = {} } = useConfig();
  const hasPresets = textStyles.length > 0;

  const handleApplyStyle = useApplyStyle({ pushUpdate });
  const { addGlobalPreset } = useAddPreset({ presetType: PRESET_TYPES.STYLE });

  const handlePresetClick = (preset) => {
    handleApplyStyle(preset);
  };

  return (
    <>
      <PresetsHeader>
        <SubHeading size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
          {__('Recently Saved Styles', 'web-stories')}
        </SubHeading>
        <StyledButton
          type={BUTTON_TYPES.TERTIARY}
          size={BUTTON_SIZES.SMALL}
          variant={BUTTON_VARIANTS.SQUARE}
          onClick={addGlobalPreset}
          aria-label={__('Add style', 'web-stories')}
        >
          <Icons.Plus />
        </StyledButton>
      </PresetsHeader>
      {hasPresets && (
        <>
          <StylesWrapper>
            <StyleGroup
              styles={[...textStyles].reverse().slice(0, 2)}
              handleClick={handlePresetClick}
            />
          </StylesWrapper>
          <MoreButton
            ref={buttonRef}
            onClick={() => setIsPopupOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={isPopupOpen}
          >
            {__('More styles', 'web-stories')}
            <Icons.ChevronDownSmall />
          </MoreButton>
          <Popup
            topOffset={topOffset}
            isRTL={isRTL}
            leftOffset={leftOffset}
            anchor={buttonRef}
            dock={sidebar}
            isOpen={isPopupOpen}
            placement={PLACEMENT.RIGHT_START}
            spacing={SPACING}
            renderContents={() => (
              <StyleManager
                styles={textStyles}
                applyStyle={handlePresetClick}
                onClose={() => setIsPopupOpen(false)}
              />
            )}
          />
        </>
      )}
      {!hasPresets && (
        <NoStylesWrapper>
          <NoStylesText size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
            {__('No Styles Saved', 'web-stories')}
          </NoStylesText>
        </NoStylesWrapper>
      )}
    </>
  );
}

PresetPanel.propTypes = {
  pushUpdate: PropTypes.func.isRequired,
};

export default PresetPanel;
