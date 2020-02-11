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
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';

/**
 * Internal dependencies
 */
import { ADMIN_TOOLBAR_HEIGHT } from '../../constants';

const PADDING_TOP = 70;
const PADDING_LEFT = 170;
const ADMIN_MENU_WIDTH = 160;
const ADMIN_MENU_FOLDED_WIDTH = 36;

export const GlobalStyle = createGlobalStyle`
  .WebStories_ReactModal__Content {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: ${PADDING_TOP}px ${PADDING_LEFT}px ${PADDING_TOP}px ${PADDING_LEFT}px;
    overflow: auto;
    outline: none;
    background-color: ${({ theme }) => theme.colors.bg.v1};
  }

  .WebStories_ReactModal__Overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({ theme }) => theme.colors.bg.v1};
    z-index: 10;
  }

  body.edit-story .WebStories_ReactModal__Overlay {
    top: ${ADMIN_TOOLBAR_HEIGHT}px;
    left: ${ADMIN_MENU_WIDTH}px;
  }

  body.edit-story.folded .WebStories_ReactModal__Overlay {
    left: ${ADMIN_MENU_FOLDED_WIDTH}px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  background: transparent;
  border: none;
  padding: 0 10px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.fg.v1};
  font-family: ${({ theme }) => theme.fonts.body1.family};
  font-size: ${({ theme }) => theme.fonts.body1.size};
  line-height: ${({ theme }) => theme.fonts.body1.lineHeight};
  letter-spacing: ${({ theme }) => theme.fonts.body1.letterSpacing};
  height: 32px;
`;

const ModalContent = styled.div`
  position: relative;
`;

function StyledModal({ children, closeButtonLabel, ...props }) {
  // Also needs to be passed to the Modal itself.
  const { onRequestClose } = props;

  return (
    <Modal
      {...props}
      className="WebStories_ReactModal__Content"
      overlayClassName="WebStories_ReactModal__Overlay"
    >
      <ModalContent>
        <CloseButton onClick={onRequestClose}>{closeButtonLabel}</CloseButton>
        {children}
      </ModalContent>
    </Modal>
  );
}

StyledModal.propTypes = {
  closeButtonLabel: PropTypes.string.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default StyledModal;
