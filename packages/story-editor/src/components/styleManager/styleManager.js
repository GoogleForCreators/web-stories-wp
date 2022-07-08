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
import { CSSTransition } from 'react-transition-group';
import {
  useFocusOut,
  useRef,
  useState,
  useCallback,
  useEffect,
} from '@googleforcreators/react';
import styled from 'styled-components';
import {
  LOCAL_STORAGE_PREFIX,
  localStore,
  Text,
  THEME_CONSTANTS,
  useKeyDownEffect,
} from '@googleforcreators/design-system';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import useFocusTrapping from '../../utils/useFocusTrapping';
import Header from './header';
import StyleGroup from './styleGroup';
import useDeleteStyle from './useDeleteStyle';
import ConfirmationDialog from './confirmationDialog';
import { STORAGE_KEY } from './constants';

const Container = styled.div`
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.bg.secondary};
  width: 256px;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: hidden;

  &.style-manager-appear {
    opacity: 0.01;
    margin-top: -10px;

    &.style-manager-appear-active {
      opacity: 1;
      margin-top: 0;
      transition: 300ms ease-out;
      transition-property: opacity, margin-top;
    }
  }
`;

const Body = styled.div`
  display: flex;
  margin: 8px 12px 16px;
`;

const StyledText = styled(Text).attrs({
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  margin: 0 0 0 8px;
  color: ${({ theme }) => theme.colors.fg.primary};
`;

function StyleManager({ styles, onClose, applyStyle, ...rest }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const containerRef = useRef(null);

  // Re-establish focus when actively exiting by button or key press
  const previousFocus = useRef(null);

  useEffect(() => {
    previousFocus.current = document.activeElement;
  }, []);

  const handleCloseAndRefocus = useCallback(
    (evt) => {
      // Ignore reason: In Jest, focus is always on document.body if not on any specific
      // element, so it can never be falsy, as it can be in a real browser.

      // istanbul ignore else
      if (previousFocus.current) {
        previousFocus.current.focus();
      }
      onClose(evt);
    },
    [onClose]
  );
  useKeyDownEffect(containerRef, 'esc', handleCloseAndRefocus);

  const deleteStyle = useDeleteStyle({ onEmpty: handleCloseAndRefocus });

  const maybeClose = () => {
    // If we're focusing out of the style manager but it's for confirmation dialog, don't close.
    if (!showDialog) {
      onClose();
    }
  };
  // Detect focus out of the style manager
  useFocusOut(containerRef, maybeClose, [showDialog]);
  // Focus trapping.
  useFocusTrapping({ ref: containerRef });

  const handleClick = (style) => {
    if (!isEditMode) {
      applyStyle(style);
      return;
    }

    const isDialogDismissed = localStore.getItemByKey(
      LOCAL_STORAGE_PREFIX[STORAGE_KEY]
    );
    if (isDialogDismissed) {
      deleteStyle(style);
      return;
    }

    // Ask confirmation for a global style.
    setShowDialog(true);
    setToDelete(style);
  };
  return (
    <CSSTransition
      nodeRef={containerRef}
      in
      appear
      classNames="style-manager"
      timeout={300}
    >
      <Container
        role="dialog"
        aria-label={__('Style presets manager', 'web-stories')}
        ref={containerRef}
      >
        <Header
          handleClose={handleCloseAndRefocus}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
        >
          <StyledText>{__('Saved Styles', 'web-stories')}</StyledText>
        </Header>
        <Body>
          <StyleGroup
            styles={[...styles].reverse()}
            handleClick={handleClick}
            isEditMode={isEditMode}
            buttonWidth={106}
            {...rest}
          />
        </Body>
        {showDialog && (
          <ConfirmationDialog
            onClose={() => setShowDialog(false)}
            onPrimary={() => {
              deleteStyle(toDelete);
              setToDelete(null);
              setShowDialog(false);
            }}
          />
        )}
      </Container>
    </CSSTransition>
  );
}

StyleManager.propTypes = {
  styles: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  applyStyle: PropTypes.func.isRequired,
};

export default StyleManager;
