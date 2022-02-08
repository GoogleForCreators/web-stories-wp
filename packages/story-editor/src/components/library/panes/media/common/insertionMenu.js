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
import { useRef, useMemo } from '@googleforcreators/react';
import { __ } from '@googleforcreators/i18n';
import { v4 as uuidv4 } from 'uuid';
import {
  Button,
  BUTTON_VARIANTS,
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

const AddButton = styled(Button).attrs({ variant: BUTTON_VARIANTS.ICON })`
  display: flex;
  align-items: center;
  position: absolute;
  top: calc(50% - 16px);
  right: calc(50% - 16px);
  color: ${({ theme }) => theme.colors.fg.primary};
  border-radius: 100%;
  width: 28px;
  height: 28px;
`;

const IconContainer = styled.div`
  height: 32px;
  width: 32px;
`;

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

/**
 * Get a More icon that displays a dropdown menu on click.
 *
 * @param {Object} props Component props.
 * @param {Object} props.resource Selected media element's resource object.
 * @param {boolean} props.display Whether the more icon should be displayed.
 * @param {boolean} props.isMenuOpen If the dropdown menu is open.
 * @param {Function} props.onInsert Callback for inserting media.
 * @param {Function} props.onMenuOpen Callback for when menu is opened.
 * @param {Function} props.onMenuCancelled Callback for when menu is closed without any selections.
 * @param {Function} props.onMenuSelected Callback for when menu is closed and an option selected.
 * @param {number} props.width Media width.
 * @return {null|*} Element or null if should not display the More icon.
 */
function InsertionMenu({
  resource,
  display,
  isMenuOpen,
  onInsert,
  onMenuOpen,
  onMenuCancelled,
  onMenuSelected,
  width,
}) {
  const insertButtonRef = useRef();

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
        { label: insertLabel, value: 'insert' },
        {
          label: __('Add as background', 'web-stories'),
          value: 'addBackground',
        },
      ],
    },
  ];

  const handleCurrentValue = (evt, value) => {
    onMenuSelected();

    const thumbnailUrl = poster
      ? poster
      : getSmallestUrlForWidth(width, resource);
    const newElement = getElementProperties(resource.type, {
      resource,
    });
    switch (value) {
      case 'insert':
        onInsert(resource, thumbnailUrl);
        break;
      case 'addBackground':
        combineElements({
          firstElement: newElement,
          secondId: currentBackgroundId,
        });
        break;
      default:
        break;
    }
  };

  const listId = useMemo(() => `list-${uuidv4()}`, []);
  const buttonId = useMemo(() => `button-${uuidv4()}`, []);

  // Keep icon and menu displayed if menu is open (even if user's mouse leaves the area).
  return (
    <MenuContainer>
      {(display || isMenuOpen) && (
        <>
          <AddButton
            ref={insertButtonRef}
            onClick={onMenuOpen}
            aria-label={__('Open insertion menu', 'web-stories')}
            aria-pressed={isMenuOpen}
            aria-haspopup
            aria-expanded={isMenuOpen}
            aria-owns={isMenuOpen ? listId : null}
            id={buttonId}
          >
            <IconContainer>
              <Icons.PlusFilled />
            </IconContainer>
          </AddButton>
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
        </>
      )}
    </MenuContainer>
  );
}

InsertionMenu.propTypes = {
  resource: PropTypes.object.isRequired,
  display: PropTypes.bool.isRequired,
  isMenuOpen: PropTypes.bool.isRequired,
  onInsert: PropTypes.func.isRequired,
  onMenuOpen: PropTypes.func.isRequired,
  onMenuCancelled: PropTypes.func.isRequired,
  onMenuSelected: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
};

export default InsertionMenu;
