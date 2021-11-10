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

export const AUTO_REMOVE_MESSAGE_TIME_INTERVAL_MAX = 10000;
export const AUTO_REMOVE_MESSAGE_TIME_INTERVAL_MIN = 1200;
export const DEFAULT_MESSAGE_Z_INDEX = 15;

export const Placement = PropTypes.oneOf([
  'top-left',
  'bottom-left',
  'top-right',
  'bottom-right',
  'top',
  'bottom',
]);

export const THUMBNAIL_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error',
};

export const SnackbarNotificationThumbnail = PropTypes.shape({
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  status: PropTypes.oneOf(Object.values(THUMBNAIL_STATUS)),
});

export const SnackbarNotification = PropTypes.shape({
  message: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  actionLabel: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  actionHelpText: PropTypes.string,
  dismissible: PropTypes.bool,
  onAction: PropTypes.func,
  onDismiss: PropTypes.func,
  preventActionDismiss: PropTypes.bool,
  preventAutoDismiss: PropTypes.bool,
  timeout: PropTypes.number,
  thumbnail: SnackbarNotificationThumbnail,
  id: PropTypes.string,
});
