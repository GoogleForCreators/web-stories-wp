/*
 * Copyright 2021 Google LLC
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
import {
  getKeyForOS,
  prettifyShortcut,
  Text,
  THEME_CONSTANTS,
} from '@web-stories-wp/design-system';
import { sprintf, _x, __ } from '@web-stories-wp/i18n';
import styled from 'styled-components';

export const RIGHT_CLICK_MENU_LABELS = {
  ADD_NEW_PAGE_AFTER: __('Add New Page After', 'web-stories'),
  ADD_NEW_PAGE_BEFORE: __('Add New Page Before', 'web-stories'),
  ADD_TO_COLOR_PRESETS: __('Add Color to “Saved Colors”', 'web-stories'),
  ADD_TO_TEXT_PRESETS: __('Add Style to “Saved Styles”', 'web-stories'),
  BRING_FORWARD: __('Bring Forward', 'web-stories'),
  BRING_TO_FRONT: __('Bring to Front', 'web-stories'),
  CLEAR_IMAGE_STYLES: __('Clear Image Styles', 'web-stories'),
  CLEAR_SHAPE_STYLES: __('Clear Shape Styles', 'web-stories'),
  CLEAR_STYLE: __('Clear Style', 'web-stories'),
  COPY_IMAGE_STYLES: __('Copy Image Styles', 'web-stories'),
  COPY_SHAPE_STYLES: __('Copy Shape Styles', 'web-stories'),
  COPY_STYLES: __('Copy Style', 'web-stories'),
  DELETE_PAGE: __('Delete Page', 'web-stories'),
  DETACH_IMAGE_FROM_BACKGROUND: __(
    'Detach Image From Background',
    'web-stories'
  ),
  DUPLICATE_PAGE: __('Duplicate Page', 'web-stories'),
  PASTE_IMAGE_STYLES: __('Paste Image Styles', 'web-stories'),
  PASTE_SHAPE_STYLES: __('Paste Shape Styles', 'web-stories'),
  PASTE_STYLES: __('Paste Style', 'web-stories'),
  SCALE_AND_CROP_BACKGROUND: __('Scale & Crop Background Image', 'web-stories'),
  SCALE_AND_CROP_IMAGE: __('Scale & Crop Image', 'web-stories'),
  SEND_BACKWARD: __('Send Backward', 'web-stories'),
  SEND_TO_BACK: __('Send to Back', 'web-stories'),
  SET_AS_PAGE_BACKGROUND: __('Set as Page Background', 'web-stories'),
};

const StyledKbd = styled(Text).attrs({
  forwardedAs: 'kbd',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  color: inherit;
`;

export const RIGHT_CLICK_MENU_SHORTCUTS = {
  SEND_BACKWARD: {
    display: <StyledKbd>{prettifyShortcut('mod down')}</StyledKbd>,
    title: sprintf(
      /* Translators: 1: Command/Caret keyboard key.*/
      _x(
        '%s down',
        'The keyboard keys "Command" or "Caret" and "down"',
        'web-stories'
      ),
      getKeyForOS('mod')
    ),
  },
  SEND_TO_BACK: {
    display: <StyledKbd>{prettifyShortcut('mod shift down')}</StyledKbd>,
    title: sprintf(
      /* Translators: 1: Command/Carat keyboard key.*/
      _x(
        '%s Shift down',
        'The keyboard keys "Command" or "Carat", "Shift", and "down"',
        'web-stories'
      ),
      getKeyForOS('mod')
    ),
  },
  BRING_FORWARD: {
    display: <StyledKbd>{prettifyShortcut('mod up')}</StyledKbd>,
    title: sprintf(
      /* Translators: 1: Command/Carat keyboard key.*/
      _x(
        '%s up',
        'The keyboard keys "Command" or "Carat" and "up"',
        'web-stories'
      ),
      getKeyForOS('mod')
    ),
  },
  BRING_TO_FRONT: {
    display: <StyledKbd>{prettifyShortcut('mod shift up')}</StyledKbd>,
    title: sprintf(
      /* Translators: 1: Command/Carat keyboard key.*/
      _x(
        '%s Shift up',
        'The keyboard keys "Command" or "Carat", "Shift", and "up"',
        'web-stories'
      ),
      getKeyForOS('mod')
    ),
  },
  DELETE: {
    display: <StyledKbd>{prettifyShortcut('delete')}</StyledKbd>,
    title: _x('Delete', 'The keyboard key "Delete"', 'web-stories'),
  },
  COPY_STYLES: {
    display: (
      <>
        <StyledKbd>{prettifyShortcut('alt mod')}</StyledKbd>{' '}
        <StyledKbd>{'O'}</StyledKbd>
      </>
    ),
    title: sprintf(
      /* Translators: 1: Alt keyboard key. 2: Command/Carat keyboard key */
      _x(
        '%1$s %2$s O',
        'The keyboard keys "Alt", "Command" or "Carat", and "O"',
        'web-stories'
      ),
      getKeyForOS('alt'),
      getKeyForOS('mod')
    ),
  },
  PASTE_STYLES: {
    display: (
      <>
        <StyledKbd>{prettifyShortcut('alt mod')}</StyledKbd>{' '}
        <StyledKbd>{'P'}</StyledKbd>
      </>
    ),
    title: sprintf(
      /* Translators: 1: Alt keyboard key. 2: Command/Carat keyboard key */
      _x(
        '%1$s %2$s P',
        'The keyboard keys "Alt", "Command" or "Carat", and "P"',
        'web-stories'
      ),
      getKeyForOS('alt'),
      getKeyForOS('mod')
    ),
  },
};

export const RIGHT_CLICK_SNACKBAR_TEXT = {
  ADDED_STYLE: __('Added style to "Saved styles".', 'web-stories'),
  ADDED_COLOR: __('Added color to "Saved colors".', 'web-stories'),
  COPIED_STYLE: __('Copied style.', 'web-stories'),
  PASTED_STYLE: __('Pasted style.', 'web-stories'),
  PROPERTIES_COPIED: __('Properties copied.', 'web-stories'),
  PROPERTIES_PASTED: __('Properties pasted.', 'web-stories'),
  TEXT_COPIED: __('Text copied.', 'web-stories'),
  TEXT_PASTED: __('Copied styles.', 'web-stories'),
  UNDO: __('Undo', 'web-stories'),
};
