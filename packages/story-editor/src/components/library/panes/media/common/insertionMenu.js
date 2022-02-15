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
} from '@googleforcreators/design-system';
import { getSmallestUrlForWidth } from '@googleforcreators/media';

/**
 * Internal dependencies
 */
import getElementProperties from '../../../../canvas/utils/getElementProperties';
import useStory from '../../../../../app/story/useStory';
import useNestedRovingTabIndex from '../../shared/hooks/useNestedRovingTabIndex';
import { ActionButton } from '../../shared';

const DropDownContainer = styled.div`
  margin-top: 10px;
  min-width: 160px;
`;

const MenuContainer = styled.div`
  z-index: 1;
`;

const menuStylesOverride = css`
  min-width: 100px;
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
 * @return {null|*} Element or null if should not display the More icon.
 */
function InsertionMenu({ resource, display, onInsert, width, index }) {
  const insertButtonRef = useRef();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const onMenuOpen = useCallback((e) => {
    e.stopPropagation();
    setIsMenuOpen(true);
  }, []);
  const onMenuCancelled = useCallback(() => setIsMenuOpen(false), []);

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
  };

  useNestedRovingTabIndex({ ref: insertButtonRef }, [], BUTTON_NESTING_DEPTH);

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
        display={display}
        tabIndex={index === 0 ? 0 : -1}
      >
        <Icons.PlusFilled />
      </ActionButton>
      {(display || isMenuOpen) && (
        <Popup
          anchor={insertButtonRef}
          placement={PLACEMENT.BOTTOM_START}
          isOpen={isMenuOpen}
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
  resource: PropTypes.object.isRequired,
  display: PropTypes.bool.isRequired,
  onInsert: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
};

export default InsertionMenu;
