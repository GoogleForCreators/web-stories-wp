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
import Modal from '../modal';

export const TRANSITION_DURATION = 300;

// Shadow styles ported from @material-ui/Dialog
const DialogBox = styled.div`
  border-radius: 4px;
  max-width: ${({ maxWidth }) => maxWidth}px;
  margin: 32px;
  position: relative;
  overflow-y: auto;
  display: flex;
  max-height: calc(100% - 64px);
  flex-direction: column;
  box-shadow: 0px 11px 15px -7px ${({ theme }) => rgba(theme.DEPRECATED_THEME.colors.bg.black, 0.2)},
    0px 24px 38px 3px
      ${({ theme }) => rgba(theme.DEPRECATED_THEME.colors.bg.black, 0.14)},
    0px 9px 46px 8px
      ${({ theme }) => rgba(theme.DEPRECATED_THEME.colors.bg.black, 0.12)};
  color: ${({ theme }) => rgba(theme.DEPRECATED_THEME.colors.bg.black, 0.87)};
  transition: box-shadow ${TRANSITION_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)
    0ms;
  background-color: ${({ theme }) => theme.DEPRECATED_THEME.colors.fg.white};
`;

const DialogTitle = styled.h1`
  flex: 0 0 auto;
  margin: 0;
  padding: 24px;
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body1.family};
  font-weight: 500;
  font-size: 20px;
  line-height: 23px;
`;
const DialogContent = styled.div`
  flex: 1 1 auto;
  padding: 0px 24px;
  overflow-y: auto;
  font-family: ${({ theme }) => theme.DEPRECATED_THEME.fonts.body1.family};
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }) => rgba(theme.DEPRECATED_THEME.colors.fg.black, 0.6)};

  b {
    color: ${({ theme }) => rgba(theme.DEPRECATED_THEME.colors.fg.black, 0.7)};
  }
`;
const DialogActions = styled.div`
  flex: 0 0 auto;
  display: flex;
  padding: 16px;
  align-items: center;
  justify-content: flex-end;
`;

function Dialog({
  children,
  title,
  actions,
  open,
  onClose,
  contentLabel,
  maxWidth,
  ...props
}) {
  return (
    <Modal open={open} onClose={onClose} contentLabel={contentLabel} {...props}>
      <DialogBox maxWidth={maxWidth}>
        {Boolean(title) && <DialogTitle>{title}</DialogTitle>}
        <DialogContent>{children}</DialogContent>
        {Boolean(actions) && <DialogActions>{actions}</DialogActions>}
      </DialogBox>
    </Modal>
  );
}

Dialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  contentLabel: PropTypes.string,
  actions: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  children: PropTypes.node,
  maxWidth: PropTypes.number,
};

Dialog.defaultProps = {
  maxWidth: 920,
};

export default Dialog;
