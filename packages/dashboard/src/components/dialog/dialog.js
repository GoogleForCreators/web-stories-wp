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
import { useMemo } from '@googleforcreators/react';
import { ThemeProvider } from 'styled-components';
import {
  Dialog as StyledDialog,
  Button,
  ButtonSize,
  ButtonType,
  theme,
} from '@googleforcreators/design-system';

/**
 * Dialog is wrapped in a ThemeProvider so that colors can be inverted.
 *
 * @param {boolean} isOpen When true, dialog will be visible - passed to dialog directly
 * @param {Function} onClose Action taken on 'x'/clicking outside of dialog. Default secondary action.
 * @param {Function} onSecondary Action taken on secondary button click when specified.
 * @param {Function} onPrimary Action taken on primary button click.
 * @param {string} primaryText When present, primary button will render.
 * @param {string} secondaryText When present, secondary button will render.
 * @param {Object} primaryRest Unique props needed on primary button, spread on button.
 * @param {Object} secondaryRest Unique props needed on secondary button, spread on button.
 * @param {Object} actions Custom actions object for when the API restrictions of primary and secondary structure are too much.
 * @param {Node} children Contents of dialog
 */

const Dialog = ({
  onClose,
  onSecondary,
  onPrimary,
  primaryText,
  secondaryText,
  primaryRest,
  secondaryRest,
  actions,
  children,
  ...rest
}) => {
  const _PrimaryButton = useMemo(
    () =>
      primaryText && (
        <Button
          type={ButtonType.Primary}
          size={ButtonSize.Small}
          onClick={() => onPrimary?.()}
          {...primaryRest}
        >
          {primaryText}
        </Button>
      ),
    [primaryText, primaryRest, onPrimary]
  );

  const _SecondaryButton = useMemo(
    () =>
      secondaryText && (
        <Button
          type={ButtonType.Tertiary}
          size={ButtonSize.Small}
          onClick={() => onSecondary?.() || onClose()}
          {...secondaryRest}
        >
          {secondaryText}
        </Button>
      ),
    [secondaryText, secondaryRest, onSecondary, onClose]
  );

  return (
    <ThemeProvider theme={theme}>
      <StyledDialog
        onClose={onClose}
        {...rest}
        actions={
          actions || (
            <>
              {_SecondaryButton}
              {_PrimaryButton}
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
  onPrimary: PropTypes.func,
  onSecondary: PropTypes.func,
  primaryText: PropTypes.string,
  primaryRest: PropTypes.object,
  secondaryText: PropTypes.string,
  secondaryRest: PropTypes.object,
  actions: PropTypes.object,
  children: PropTypes.node,
};

export default Dialog;
