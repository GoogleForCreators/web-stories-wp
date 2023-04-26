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

export const AUTO_REMOVE_MESSAGE_TIME_INTERVAL_MAX = 10000;
export const AUTO_REMOVE_MESSAGE_TIME_INTERVAL_MIN = 1200;
export const DEFAULT_MESSAGE_Z_INDEX = 15;

export enum SnackbarPlacement {
  TopLeft = 'top-left',
  BottomLeft = 'bottom-left',
  TopRight = 'top-right',
  BottomRight = 'bottom-right',
  Top = 'top',
  Bottom = 'bottom',
}

export enum ThumbnailStatus {
  Success = 'success',
  Error = 'error',
}

export interface SnackbarNotificationThumbnail {
  src: string;
  alt?: string;
  status?: ThumbnailStatus;
}

export interface SnackbarNotification {
  message: string;
  actionLabel?: JSX.Element;
  actionHelpText?: string;
  dismissible?: boolean;
  onAction?: () => void;
  onDismiss?: () => void;
  preventActionDismiss?: boolean;
  preventAutoDismiss?: boolean;
  timeout?: number;
  thumbnail?: SnackbarNotificationThumbnail;
  id?: string;
}
