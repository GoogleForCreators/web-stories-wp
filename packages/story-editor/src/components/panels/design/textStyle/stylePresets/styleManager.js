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
import { __ } from '@web-stories-wp/i18n';
import { CSSTransition } from 'react-transition-group';
import { useFocusOut, useRef, useState } from '@web-stories-wp/react';
import styled from 'styled-components';
import {
  LOCAL_STORAGE_PREFIX,
  localStore,
  Text,
  THEME_CONSTANTS,
} from '@web-stories-wp/design-system';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
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

function StyleManager({ styles, onClose, applyStyle }) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const containerRef = useRef(null);

  const deleteStyle = useDeleteStyle({ onEmpty: () => onClose() });

  const maybeClose = () => {
    // If we're focusing out of the style manager but it's for confirmation dialog, don't close.
    if (!showDialog) {
      onClose();
    }
  };
  // Detect focus out of the style manager
  useFocusOut(containerRef, maybeClose, [showDialog]);

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
    <CSSTransition in appear classNames="style-manager" timeout={300}>
      <Container
        role="dialog"
        aria-label={__('Style presets manager', 'web-stories')}
        ref={containerRef}
      >
        <Header
          handleClose={onClose}
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
