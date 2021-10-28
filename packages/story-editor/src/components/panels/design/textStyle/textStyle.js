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
import { __ } from '@web-stories-wp/i18n';
import { useState } from '@web-stories-wp/react';
import {
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
  Text,
  THEME_CONSTANTS,
  themeHelpers,
} from '@web-stories-wp/design-system';
import styled from 'styled-components';
import { trackEvent } from '@web-stories-wp/tracking';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import getUpdatedSizeAndPosition from '../../../../utils/getUpdatedSizeAndPosition';
import { styles, useHighlights, states } from '../../../../app/highlights';
import { usePresubmitHandler } from '../../../form';
import PanelTitle from '../../panel/shared/title';
import PanelContent from '../../panel/shared/content';
import Panel from '../../panel/panel';
import Tooltip from '../../../tooltip';
import useApplyTextAutoStyle from '../../../../utils/useApplyTextAutoStyle';
import StyleControls from './style';
import ColorControls from './color';
import FontControls from './font';
import BackgroundColorControls from './backgroundColor';
import PaddingControls from './padding';

const SubSection = styled.section`
  border-top: 1px solid ${({ theme }) => theme.colors.border.defaultNormal};
`;
const SubHeading = styled(Text)`
  color: ${({ theme }) => theme.colors.fg.secondary};
  margin: 14px 0;
`;

const AutoStyleButton = styled(Button).attrs({
  variant: BUTTON_VARIANTS.SQUARE,
  type: BUTTON_TYPES.TERTIARY,
  size: BUTTON_SIZES.SMALL,
})`
  margin-right: 4px;
  ${({ theme }) =>
    themeHelpers.focusableOutlineCSS(theme.colors.border.focus, '#1d1f20')};
`;

function StylePanel(props) {
  const { selectedElements, pushUpdate } = props;
  // use highlights to update panel styles
  // but don't dynamically adjust the `isPersistable` prop on `SimplePanel`
  // the textStyle panel automatically opens already whenever a text element is selected
  // if we update this to only be when there's a highlight the functionality that is expected
  // will be wrong.
  const { dropdownHighlight, colorHighlight, resetHighlight, cancelHighlight } =
    useHighlights((state) => ({
      dropdownHighlight: state[states.FONT],
      colorHighlight: state[states.TEXT_COLOR],
      resetHighlight: state.onFocusOut,
      cancelHighlight: state.cancelEffect,
    }));

  const [fontsFocused, setFontsFocused] = useState(false);

  const applyTextAutoStyle = useApplyTextAutoStyle(
    selectedElements[0],
    (textProps) => {
      pushUpdate(textProps, true);
      trackEvent('auto_style_text');
    }
  );

  const getActions = () => {
    const isCollapsed = false; // @todo Get correct.
    if (isCollapsed) {
      return null;
    }
    return (
      <Tooltip title={__('Adaptive text colors', 'web-stories')}>
        <AutoStyleButton
          aria-label={__('Adaptive text colors', 'web-stories')}
          onClick={applyTextAutoStyle}
          disabled={selectedElements?.length > 1}
        >
          <Icons.ColorBucket />
        </AutoStyleButton>
      </Tooltip>
    );
  };

  // Update size and position if relevant values have changed.
  usePresubmitHandler(getUpdatedSizeAndPosition, []);

  const panelTitle = __('Text', 'web-stories');
  return (
    <Panel
      name="textStyle"
      css={
        (dropdownHighlight?.showEffect || colorHighlight?.showEffect) &&
        styles.FLASH
      }
      onAnimationEnd={() => resetHighlight()}
      isPersistable={false}
    >
      <PanelTitle ariaLabel={panelTitle} secondaryAction={getActions()}>
        {panelTitle}
      </PanelTitle>
      <PanelContent>
        <FontControls
          {...props}
          fontDropdownRef={(node) => {
            if (
              node &&
              dropdownHighlight?.focus &&
              dropdownHighlight?.showEffect
            ) {
              node.focus();
              setFontsFocused(true);
            }
          }}
          highlightStylesOverride={fontsFocused ? styles.OUTLINE : []}
        />
        <StyleControls {...props} />
        <ColorControls
          {...props}
          textColorRef={(node) => {
            if (node && colorHighlight?.focus && colorHighlight?.showEffect) {
              node.addEventListener('keydown', cancelHighlight, { once: true });
              node.focus();
              setFontsFocused(false);
            }
          }}
        />
        <SubSection>
          <SubHeading size={THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL}>
            {__('Text Box', 'web-stories')}
          </SubHeading>
          <BackgroundColorControls {...props} />
          <PaddingControls {...props} />
        </SubSection>
      </PanelContent>
    </Panel>
  );
}

StylePanel.propTypes = {
  selectedElements: PropTypes.array.isRequired,
  pushUpdate: PropTypes.func.isRequired,
};

export default StylePanel;
