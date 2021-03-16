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
import { ThemeProvider } from 'styled-components';

/**
 * Internal dependencies
 */
import {
  Dialog as StyledDialog,
  Button,
  BUTTON_SIZES,
  BUTTON_TYPES,
  theme,
} from '../../../design-system';

const Dialog = ({
  onClose,
  closeText,
  onConfirm,
  confirmText,
  actions,
  children,
  ...rest
}) => {
  return (
    <ThemeProvider theme={theme}>
      <StyledDialog
        onClose={onClose}
        {...rest}
        actions={
          actions || (
            <>
              <Button
                type={BUTTON_TYPES.TERTIARY}
                size={BUTTON_SIZES.SMALL}
                onClick={onClose}
              >
                {closeText}
              </Button>
              <Button
                type={BUTTON_TYPES.PRIMARY}
                size={BUTTON_SIZES.SMALL}
                onClick={onConfirm}
              >
                {confirmText}
              </Button>
            </>
          )
        }
      >
        {children}
      </StyledDialog>
    </ThemeProvider>
  );
};

Dialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  closeText: PropTypes.string,
  onConfirm: PropTypes.func,
  confirmText: PropTypes.string,
  actions: PropTypes.object,
  children: PropTypes.array,
};

export default Dialog;
