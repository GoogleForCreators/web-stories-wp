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

/**
 * Internal dependencies
 */
import { Snackbar } from '../../../design-system';

function SnackbarContainer({
  activeSnackbarMessage = {},
  handleDismissMessage,
}) {
  return (
    <Snackbar.Container>
      {activeSnackbarMessage?.id && (
        <Snackbar.Message
          key={`alert_${activeSnackbarMessage.id}`}
          aria-label={activeSnackbarMessage.message}
          handleDismiss={() => handleDismissMessage(activeSnackbarMessage.id)}
          message={activeSnackbarMessage.message}
        />
      )}
    </Snackbar.Container>
  );
}

SnackbarContainer.propTypes = {
  handleDismissMessage: PropTypes.func.isRequired,
  activeSnackbarMessage: PropTypes.shape({
    id: PropTypes.number,
    message: PropTypes.string,
  }),
};
export default SnackbarContainer;
