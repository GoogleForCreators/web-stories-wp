/*
 * Copyright 2022 Google LLC
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
import {
  Icons,
  LOCAL_STORAGE_PREFIX,
  localStore,
  Placement,
} from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';
import styled, { css } from 'styled-components';

/**
 * Internal dependencies
 */
import Tooltip from '../tooltip';
import { useCanvas } from '../../app';
import { states, useHighlights } from '../../app/highlights';
import styles from '../../app/highlights/styles';
import { ToggleButton } from '../toggleButton';

const StyledButton = styled(ToggleButton)`
  ${({ isHighlighted }) =>
    isHighlighted &&
    css`
      ${styles.OUTLINE}
      ${styles.FLASH}
    `}
`;

const LOCAL_STORAGE_KEY = LOCAL_STORAGE_PREFIX.ELEMENT_TOOLBAR_SETTINGS;

function ToolbarToggle() {
  const { displayFloatingMenu, setDisplayFloatingMenu } = useCanvas(
    ({ state, actions }) => ({
      displayFloatingMenu: state.displayFloatingMenu,
      setDisplayFloatingMenu: actions.setDisplayFloatingMenu,
    })
  );

  const { highlight, resetHighlight } = useHighlights((state) => ({
    highlight: state[states.ElementToolbarToggle],
    resetHighlight: state.onFocusOut,
  }));

  const handleToolbarVisibility = () => {
    const local = localStore.getItemByKey(LOCAL_STORAGE_KEY) || {};
    localStore.setItemByKey(LOCAL_STORAGE_KEY, {
      ...local,
      isDisplayed: true,
    });
    setDisplayFloatingMenu(true);
  };

  // We only display the button for showing the toolbar.
  if (displayFloatingMenu) {
    return null;
  }
  return (
    <Tooltip
      title={__('Show element toolbar', 'web-stories')}
      placement={Placement.Top}
      hasTail
    >
      <StyledButton
        ref={(node) => {
          if (node && highlight?.focus && highlight?.showEffect) {
            node.focus();
          }
        }}
        onClick={handleToolbarVisibility}
        aria-label={__('Show element toolbar', 'web-stories')}
        label={__('Show element toolbar', 'web-stories')}
        isOpen={false}
        isHighlighted={highlight?.showEffect}
        onAnimationEnd={() => resetHighlight()}
        MainIcon={Icons.BoxWithDots}
      />
    </Tooltip>
  );
}

export default ToolbarToggle;
