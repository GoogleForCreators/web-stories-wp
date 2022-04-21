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
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import {
  useRef,
  useMemo,
  useCallback,
  useState,
} from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import { v4 as uuidv4 } from 'uuid';
import {
  Icons,
  Menu,
  PLACEMENT,
  Popup,
  useKeyDownEffect,
  noop,
} from '@googleforcreators/design-system';
import {
  getSmallestUrlForWidth,
  ResourcePropTypes,
} from '@googleforcreators/media';

/**
 * Internal dependencies
 */
import getElementProperties from '../../../../canvas/utils/getElementProperties';
import useStory from '../../../../../app/story/useStory';
import { ActionButton } from '../../shared';
import useRovingTabIndex from '../../../../../utils/useRovingTabIndex';
import useFocusCanvas from '../../../../canvas/useFocusCanvas';
import { useConfig } from '../../../../../app';

const DropDownContainer = styled.div`
  margin-top: 10px;
  min-width: 160px;
`;

const MenuContainer = styled.div`
  z-index: 1;
`;

const menuStylesOverride = css`
  min-width: 160px;
  margin-top: 0;
  li {
    display: block;
  }
`;

// This is used for nested roving tab index to detect parent siblings.
const BUTTON_NESTING_DEPTH = 3;
const MENU_OPTIONS = {
  INSERT: 'insert',
  ADD_BACKGROUND: 'addBackground',
};

/**
 * Get a More icon that displays a dropdown menu on click.
 *
 * @param {Object} props Component props.
 * @param {Object} props.resource Selected media element's resource object.
 * @param {boolean} props.display Whether the more icon should be displayed.
 * @param {Function} props.onInsert Callback for inserting media.
 * @param {number} props.width Media width.
 * @param {number} props.index Element index in the gallery.
 * @param {boolean} props.isLocal If the menu is for local or 3p media.
 * @param {Function} props.setParentActive Sets the parent element active.
 * @param {Function} props.setParentInactive Sets the parent element inactive.
 * @return {null|*} Element or null if should not display the More icon.
 */
function InsertionMenu({
  resource,
  display,
  onInsert,
  width,
  index,
  isLocal = false,
  setParentActive = noop,
  setParentInactive = noop,
}) {
  const { isRTL, styleConstants: { leftOffset } = {} } = useConfig();

  const insertButtonRef = useRef();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const onMenuOpen = useCallback((e) => {
    e.stopPropagation();
    setIsMenuOpen(true);
  }, []);
  const onMenuCancelled = useCallback(() => {
    // When menu gets closed, we want to focus back on the original button.
    setIsMenuOpen(false);
    insertButtonRef.current?.focus();
    // However, activeness of the parent is also lost then due to blurring, we need to set it active "manually".
    setParentActive();
  }, [setParentActive]);

  const { currentBackgroundId, combineElements } = useStory((state) => ({
    currentBackgroundId: state.state.currentPage?.elements?.[0]?.id,
    combineElements: state.actions.combineElements,
  }));

  const { type, poster } = resource;
  const insertLabel = ['image', 'gif'].includes(type)
    ? __('Insert image', 'web-stories')
    : __('Insert video', 'web-stories');
  const options = [
    {
      group: [
        { label: insertLabel, value: MENU_OPTIONS.INSERT },
        {
          label: __('Add as background', 'web-stories'),
          value: MENU_OPTIONS.ADD_BACKGROUND,
        },
      ],
    },
  ];

  const handleCurrentValue = (evt, value) => {
    const thumbnailUrl = poster || getSmallestUrlForWidth(width, resource);
    const newElement = getElementProperties(resource.type, {
      resource,
    });
    setIsMenuOpen(false);
    switch (value) {
      case MENU_OPTIONS.INSERT:
        onInsert(resource, thumbnailUrl);
        break;
      case MENU_OPTIONS.ADD_BACKGROUND:
        combineElements({
          firstElement: newElement,
          secondId: currentBackgroundId,
        });
        break;
      default:
        break;
    }
    // Since the parent is set active when closing a menu, we need to set it inactive here "manually".
    setParentInactive();
  };

  useRovingTabIndex({ ref: insertButtonRef }, [], BUTTON_NESTING_DEPTH);
  // In case of 3p media, we tab out of the panel since it's the only button there.
  const focusCanvas = useFocusCanvas();
  useKeyDownEffect(isLocal ? null : insertButtonRef, 'tab', focusCanvas, [
    focusCanvas,
  ]);

  const listId = useMemo(() => `list-${uuidv4()}`, []);
  const buttonId = useMemo(() => `button-${uuidv4()}`, []);

  // Keep icon and menu displayed if menu is open (even if user's mouse leaves the area).
  return (
    <MenuContainer>
      <ActionButton
        ref={insertButtonRef}
        onClick={onMenuOpen}
        aria-label={__('Open insertion menu', 'web-stories')}
        aria-pressed={isMenuOpen}
        aria-haspopup
        aria-expanded={isMenuOpen}
        aria-owns={isMenuOpen ? listId : null}
        id={buttonId}
        $display={display}
        tabIndex={index === 0 ? 0 : -1}
      >
        <Icons.PlusFilledSmall />
      </ActionButton>
      {isMenuOpen && (
        <Popup
          anchor={insertButtonRef}
          placement={PLACEMENT.BOTTOM_START}
          isOpen={isMenuOpen}
          isRTL={isRTL}
          leftOffset={leftOffset}
        >
          <DropDownContainer>
            <Menu
              parentId={buttonId}
              listId={listId}
              onMenuItemClick={handleCurrentValue}
              options={options}
              onDismissMenu={onMenuCancelled}
              hasMenuRole
              menuStylesOverride={menuStylesOverride}
            />
          </DropDownContainer>
        </Popup>
      )}
    </MenuContainer>
  );
}

InsertionMenu.propTypes = {
  resource: ResourcePropTypes.resource.isRequired,
  display: PropTypes.bool.isRequired,
  onInsert: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  isLocal: PropTypes.bool,
  setParentActive: PropTypes.func,
  setParentInactive: PropTypes.func,
};

export default InsertionMenu;
