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
import { useContextReact as useContext } from '@googleforcreators/react';
import type { ComponentProps, CSSProperties } from 'react';
import ReactModal from 'react-modal';
import { ThemeContext } from 'styled-components';

/**
 * Internal dependencies
 */
import type { Theme } from '../../theme';
import { BODY_CLASS, CONTENT_CLASS, OVERLAY_CLASS } from './constants';

const customStyles = {
  overlay: (theme: Theme) =>
    ({
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 10,
      backgroundColor: theme.colors.interactiveBg.modalScrim,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }) as const,
  content: {
    overflow: 'auto',
    outline: 'none',
    display: 'flex',
    maxHeight: '100%',
    justifyContent: 'center',
  },
};

type ReactModalProps = ComponentProps<typeof ReactModal>;

interface ModalProps extends ReactModalProps {
  onClose?: ReactModalProps['onRequestClose'];
  modalStyles?: CSSProperties;
  overlayStyles?: CSSProperties;
  contentStyles?: CSSProperties;
}

function Modal({
  closeTimeoutMS = 100,
  children,
  contentStyles,
  modalStyles = {},
  onClose,
  overlayStyles,
  ...rest
}: ModalProps) {
  const theme = useContext(ThemeContext);

  return (
    <ReactModal
      className={CONTENT_CLASS}
      closeTimeoutMS={closeTimeoutMS}
      onRequestClose={onClose}
      overlayClassName={OVERLAY_CLASS}
      bodyOpenClassName={BODY_CLASS}
      style={{
        maxHeight: '100vh',
        ...modalStyles,
        overlay: { ...customStyles.overlay(theme), ...overlayStyles },
        content: { ...customStyles.content, ...contentStyles },
      }}
      {...rest}
    >
      {children}
    </ReactModal>
  );
}

export default Modal;
