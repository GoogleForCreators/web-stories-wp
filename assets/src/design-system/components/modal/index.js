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
import { useContext } from 'react';
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';
import { createGlobalStyle, ThemeContext } from 'styled-components';

const ADMIN_TOOLBAR_HEIGHT = 32;
const ADMIN_MENU_WIDTH = 160;
const ADMIN_MENU_FOLDED_WIDTH = 36;
const CONTENT_CLASS = 'WebStories_ReactModal__Content';
const OVERLAY_CLASS = 'WebStories_ReactModal__Overlay';

export const GlobalStyle = createGlobalStyle`
  .${OVERLAY_CLASS} {
    opacity: 0;
    transition: opacity 0.1s ease-out;
    top: ${ADMIN_TOOLBAR_HEIGHT}px !important;
    left: ${ADMIN_MENU_WIDTH}px !important;
  }

  body.folded .${OVERLAY_CLASS} {
    left: ${ADMIN_MENU_FOLDED_WIDTH}px !important;
  }

  .${OVERLAY_CLASS}.ReactModal__Overlay--after-open {
    opacity: 1;
  }

  .${OVERLAY_CLASS}.ReactModal__Overlay--before-close {
    opacity: 0;
  }
`;

const customStyles = {
  overlay: (theme) => ({
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    backgroundColor: theme.colors.opacity.black64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  content: {
    overflow: 'auto',
    outline: 'none',
    display: 'flex',
    maxHeight: '100%',
    justifyContent: 'center',
  },
};

export function Modal({
  closeTimeoutMS = 100,
  children,
  contentLabel,
  contentStyles,
  isOpen,
  modalStyles = {},
  onClose,
  overlayStyles,
  ...props
}) {
  const themeContext = useContext(ThemeContext);

  return (
    <ReactModal
      className={CONTENT_CLASS}
      closeTimeoutMS={closeTimeoutMS}
      contentLabel={contentLabel}
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName={OVERLAY_CLASS}
      style={{
        maxHeight: '100vh',
        ...modalStyles,
        overlay: { ...customStyles.overlay(themeContext), ...overlayStyles },
        content: { ...customStyles.content, ...contentStyles },
      }}
      {...props}
    >
      {children}
    </ReactModal>
  );
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  closeTimeoutMS: PropTypes.number,
  contentLabel: PropTypes.string,
  contentStyles: PropTypes.object,
  isOpen: PropTypes.bool,
  modalStyles: PropTypes.object,
  overlayStyles: PropTypes.object,
};
