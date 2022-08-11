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
  ToggleButton,
  BUTTON_SIZES,
  BUTTON_TYPES,
  BUTTON_VARIANTS,
  Icons,
  LOCAL_STORAGE_PREFIX,
  localStore,
} from '@googleforcreators/design-system';
import { __ } from '@googleforcreators/i18n';

/**
 * Internal dependencies
 */
import { useCanvas } from '../../app';

const LOCAL_STORAGE_KEY = LOCAL_STORAGE_PREFIX.ELEMENT_TOOLBAR_SETTINGS;

function ToolbarToggle() {
  const { displayFloatingMenu, setDisplayFloatingMenu } = useCanvas(
    ({ state, actions }) => ({
      displayFloatingMenu: state.displayFloatingMenu,
      setDisplayFloatingMenu: actions.setDisplayFloatingMenu,
    })
  );

  const handleToolbarVisibility = () => {
    const local = localStore.getItemByKey(LOCAL_STORAGE_KEY) || {};
    localStore.setItemByKey(LOCAL_STORAGE_KEY, {
      ...local,
      isDisplayed: !displayFloatingMenu,
    });
    setDisplayFloatingMenu(!displayFloatingMenu);
  };
  return (
    <ToggleButton
      variant={BUTTON_VARIANTS.SQUARE}
      type={BUTTON_TYPES.TERTIARY}
      size={BUTTON_SIZES.SMALL}
      isToggled={displayFloatingMenu}
      onClick={handleToolbarVisibility}
      aria-label={__('Toggle element toolbar', 'web-stories')}
    >
      <Icons.Pencil />
    </ToggleButton>
  );
}

export default ToolbarToggle;
