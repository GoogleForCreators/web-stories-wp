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
  createShortcutAriaLabel,
  Shortcut,
  Text,
  THEME_CONSTANTS,
} from '@web-stories-wp/design-system';
import { __ } from '@web-stories-wp/i18n';
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

  :not(:last-child) {
    margin-right: 4px;
  }
`;

export const RIGHT_CLICK_MENU_SHORTCUTS = {
  SEND_BACKWARD: {
    display: <Shortcut shortcut="mod down" component={StyledKbd} />,
    title: createShortcutAriaLabel('mod down'),
  },
  SEND_TO_BACK: {
    display: <Shortcut shortcut="mod shift down" component={StyledKbd} />,
    title: createShortcutAriaLabel('mod shift down'),
  },
  BRING_FORWARD: {
    display: <Shortcut shortcut="mod up" component={StyledKbd} />,
    title: createShortcutAriaLabel('mod up'),
  },
  BRING_TO_FRONT: {
    display: <Shortcut shortcut="mod shift up" component={StyledKbd} />,
    title: createShortcutAriaLabel('mod shift up'),
  },
  DELETE: {
    display: <Shortcut shortcut="delete" component={StyledKbd} />,
    title: createShortcutAriaLabel('delete'),
  },
  COPY_STYLES: {
    display: <Shortcut shortcut="alt mod O" component={StyledKbd} />,
    title: createShortcutAriaLabel('alt mod O'),
  },
  PASTE_STYLES: {
    display: <Shortcut shortcut="alt mod P" component={StyledKbd} />,
    title: createShortcutAriaLabel('alt mod P'),
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
