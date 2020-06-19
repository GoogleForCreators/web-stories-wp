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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';
import { createGlobalStyle } from 'styled-components';
import { rgba } from 'polished';

/**
 * Internal dependencies
 */
import theme from '../../theme';

const CONTENT_CLASS = 'WebStories_ReactModal__Content';
const OVERLAY_CLASS = 'WebStories_ReactModal__Overlay';

export const GlobalStyle = createGlobalStyle`
  .${OVERLAY_CLASS} {
    opacity: 0;
    transition: opacity 0.1s ease-out;
  }

  .${OVERLAY_CLASS}.ReactModal__Overlay--after-open {
    opacity: 1;
  }

  .${OVERLAY_CLASS}.ReactModal__Overlay--before-close {
    opacity: 0;
  }
`;

const customStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    backgroundColor: rgba(theme.colors.gray900, 0.96),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    overflow: 'auto',
    outline: 'none',
    display: 'flex',
    maxHeight: '100%',
    justifyContent: 'center',
  },
};

export default function Modal({
  children,
  contentLabel = __('modal', 'web-stories'),
  contentStyles,
  isOpen,
  modalStyles = {},
  onClose,
  overlayStyles,
  ...props
}) {
  return (
    <ReactModal
      className={CONTENT_CLASS}
      closeTimeoutMS={100}
      contentLabel={contentLabel}
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName={OVERLAY_CLASS}
      style={{
        maxHeight: '100vh',
        ...modalStyles,
        overlay: { ...customStyles.overlay, ...overlayStyles },
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
  contentLabel: PropTypes.string,
  contentStyles: PropTypes.object,
  isOpen: PropTypes.bool,
  modalStyles: PropTypes.object,
  overlayStyles: PropTypes.object,
};
