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
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { rgba } from 'polished';
/**
 * Internal dependencies
 */
import { TypographyPresets } from '../typography';
import Modal from '../modal';

// Shadow styles ported from @material-ui/Dialog
const DialogBox = styled.div(
  ({
    theme: {
      internalTheme: { colors },
    },
  }) => `
    display: flex;
    position: relative;
    overflow-y: auto;
    max-width: 920px;
    max-height: calc(100% - 64px);
    padding: 24px 0;
    flex-direction: column;
    background-color: ${colors.white};
    border-radius: 4px;
    box-shadow: ${`0px 11px 15px -7px ${rgba(
      colors.gray900,
      0.2
    )}, 0px 24px 38px 3px ${rgba(
      colors.gray900,
      0.14
    )}, 0px 9px 46px 8px ${rgba(colors.gray900, 0.12)}`};
    color: ${colors.gray800};
    transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  `
);

const DialogTitle = styled.h1`
  ${TypographyPresets.Large};
  flex: 0 0 auto;
  margin: 0 24px;
  font-weight: ${({ theme }) => theme.internalTheme.typography.weight.bold};
`;
const DialogContent = styled.div`
  ${TypographyPresets.Medium};
  flex: 1 1 auto;
  padding: 24px 0 16px;
  margin: 0 24px;
  overflow-y: auto;
  color: ${({ theme }) => theme.internalTheme.colors.gray700};
`;

const DialogActions = styled.div`
  display: flex;
  align-items: flex-end;
  align-items: center;
  justify-content: flex-end;
  margin: 0 16px;

  & > button {
    margin-right: 10px;
    &:last-of-type {
      margin-right: 0;
    }
  }
`;

function Dialog({ children, title, actions, isOpen, onClose, ...props }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} {...props}>
      <DialogBox>
        {Boolean(title) && <DialogTitle>{title}</DialogTitle>}
        <DialogContent>{children}</DialogContent>
        {Boolean(actions) && <DialogActions>{actions}</DialogActions>}
      </DialogBox>
    </Modal>
  );
}

Dialog.propTypes = {
  actions: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  contentLabel: PropTypes.string,
};

export default Dialog;
