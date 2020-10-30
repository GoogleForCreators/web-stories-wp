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
import { THEME_CONSTANTS } from '../../';
import { Modal, Headline } from '../';

// Shadow styles ported from @material-ui/Dialog
const DialogBox = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: ${({ theme }) => theme.colors.fg.primary};
  overflow-y: auto;
  max-width: 512px;
  max-height: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  border: ${({ theme }) => `1px solid ${rgba(theme.colors.fg.primary, 0.24)}`};
  transition: background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`;

const DialogContent = styled.div`
  padding: 8px 0 12px;
  margin: 0;
  overflow-y: auto;
  color: ${({ theme }) => theme.colors.fg.primary};
`;

const DialogActions = styled.div`
  display: flex;
  align-self: flex-end;
  margin: 0;

  & > button {
    margin-right: 10px;
    &:last-of-type {
      margin-right: 0;
    }
  }
`;

export function Dialog({
  children,
  title,
  actions,
  isOpen,
  onClose,
  ...props
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} {...props}>
      <DialogBox>
        {Boolean(title) && (
          <Headline
            as="h2"
            size={THEME_CONSTANTS.TYPOGRAPHY_PRESET_SIZES.X_SMALL}
          >
            {title}
          </Headline>
        )}
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
