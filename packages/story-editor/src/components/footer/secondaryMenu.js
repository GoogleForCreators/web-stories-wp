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
import styled from 'styled-components';
import { useCallback, useEffect, useRef } from '@googleforcreators/react';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import KeyboardShortcutsMenu from '../keyboardShortcutsMenu';
import { HelpCenter } from '../helpCenter';
import { useCanvas, useHelpCenter } from '../../app';
import { Checklist, useChecklist, useCheckpoint } from '../checklist';
import { useKeyboardShortcutsMenu } from '../keyboardShortcutsMenu/keyboardShortcutsMenuContext';
import { FOOTER_MENU_GAP, FOOTER_MARGIN } from './constants';

const Wrapper = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
`;

const MenuItems = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: ${FOOTER_MARGIN}px;
  gap: ${FOOTER_MENU_GAP}px;
`;

const POPUPS = {
  HELP_CENTER: 'help_center',
  CHECKLIST: 'checklist',
  KEYBOARD_SHORTCUTS: 'keyboard_shortcuts',
};

function SecondaryMenu({ menu }) {
  const expandedPopupRef = useRef('');

  const { close: closeHelpCenter, isHelpCenterOpen } = useHelpCenter(
    ({ actions: { close }, state: { isOpen: isHelpCenterOpen } }) => ({
      close,
      isHelpCenterOpen,
    })
  );

  const {
    close: closeChecklist,
    open: openChecklist,
    isChecklistOpen,
  } = useChecklist(
    ({ actions: { close, open }, state: { isOpen: isChecklistOpen } }) => ({
      close,
      open,
      isChecklistOpen,
    })
  );

  const { close: closeKeyboardShortcutsMenu, isKeyboardShortcutsMenuOpen } =
    useKeyboardShortcutsMenu(
      ({
        actions: { close },
        state: { isOpen: isKeyboardShortcutsMenuOpen },
      }) => ({
        close,
        isKeyboardShortcutsMenuOpen,
      })
    );

  const { onResetReviewDialogRequest, reviewDialogRequested } = useCheckpoint(
    ({
      actions: { onResetReviewDialogRequest },
      state: { reviewDialogRequested },
    }) => ({
      reviewDialogRequested,
      onResetReviewDialogRequest,
    })
  );

  const isActiveTrimOrEdit = useCanvas(
    ({
      state: {
        editingElementState: { isTrimMode },
        isEditing,
      },
    }) => isTrimMode || isEditing
  );

  const setPopupRef = useCallback((newPopup = '') => {
    expandedPopupRef.current = newPopup;
  }, []);

  // Only one popup is open at a time
  // we want to close an open popup if a new one is opened.
  useEffect(() => {
    if (isChecklistOpen && expandedPopupRef.current !== POPUPS.CHECKLIST) {
      closeHelpCenter();
      closeKeyboardShortcutsMenu();
      setPopupRef(POPUPS.CHECKLIST);
    }
  }, [
    closeHelpCenter,
    closeKeyboardShortcutsMenu,
    isChecklistOpen,
    setPopupRef,
  ]);

  useEffect(() => {
    if (isHelpCenterOpen && expandedPopupRef.current !== POPUPS.HELP_CENTER) {
      closeChecklist();
      closeKeyboardShortcutsMenu();
      setPopupRef(POPUPS.HELP_CENTER);
    }
  }, [
    closeChecklist,
    closeKeyboardShortcutsMenu,
    isHelpCenterOpen,
    setPopupRef,
  ]);

  useEffect(() => {
    if (
      isKeyboardShortcutsMenuOpen &&
      expandedPopupRef.current !== POPUPS.KEYBOARD_SHORTCUTS
    ) {
      closeChecklist();
      closeHelpCenter();
      setPopupRef(POPUPS.KEYBOARD_SHORTCUTS);
    }
  }, [
    closeChecklist,
    closeHelpCenter,
    isKeyboardShortcutsMenuOpen,
    setPopupRef,
  ]);

  useEffect(() => {
    if (reviewDialogRequested) {
      setPopupRef();
      onResetReviewDialogRequest();
      openChecklist();
    }
  }, [
    reviewDialogRequested,
    onResetReviewDialogRequest,
    openChecklist,
    setPopupRef,
  ]);

  // The checklist and help center will stay open as user interacts with canvas
  // we want to collapse either of these if expanded when the trim or cropping mode is selected.
  useEffect(() => {
    if (isActiveTrimOrEdit && expandedPopupRef.current) {
      setPopupRef();
      closeChecklist();
      closeHelpCenter();
    }
  }, [closeChecklist, closeHelpCenter, isActiveTrimOrEdit, setPopupRef]);

  return (
    <Wrapper>
      <MenuItems>
        <HelpCenter components={menu?.helpCenter} />
        {menu?.checklist && <Checklist items={menu.checklist} />}
        <KeyboardShortcutsMenu />
      </MenuItems>
    </Wrapper>
  );
}

SecondaryMenu.propTypes = {
  menu: PropTypes.shape({
    checklist: PropTypes.object,
    helpCenter: PropTypes.object,
  }),
};

export default SecondaryMenu;
