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
} from '@googleforcreators/design-system';
import { __, _n } from '@googleforcreators/i18n';
import styled from 'styled-components';

export const RIGHT_CLICK_MENU_LABELS = {
  ADD_NEW_PAGE_AFTER: __('Add New Page After', 'web-stories'),
  ADD_NEW_PAGE_BEFORE: __('Add New Page Before', 'web-stories'),
  ADD_TO_COLOR_PRESETS: __('Add Color to “Saved Colors”', 'web-stories'),
  ADD_TO_TEXT_PRESETS: __('Add Style to “Saved Styles”', 'web-stories'),
  BRING_FORWARD: __('Bring Forward', 'web-stories'),
  BRING_TO_FRONT: __('Bring to Front', 'web-stories'),
  BROWSE_STOCK_IMAGES_AND_VIDEO: __(
    'Browse Stock Images and Video',
    'web-stories'
  ),
  BROWSE_PAGE_TEMPLATES: __('Browse Page Templates', 'web-stories'),
  CLEAR_IMAGE_STYLES: __('Clear Image Styles', 'web-stories'),
  CLEAR_SHAPE_STYLES: __('Clear Shape Styles', 'web-stories'),
  CLEAR_VIDEO_STYLES: __('Clear Video Styles', 'web-stories'),
  CLEAR_STYLES: (numElements = 1) =>
    _n('Clear style', 'Clear styles', numElements, 'web-stories'),
  CHOOSE_IMAGE_OR_VIDEO: __('Choose Image or Video', 'web-stories'),
  COPY_IMAGE_STYLES: __('Copy Image Styles', 'web-stories'),
  COPY_SHAPE_STYLES: __('Copy Shape Styles', 'web-stories'),
  COPY_VIDEO_STYLES: __('Copy Video Styles', 'web-stories'),
  COPY_STYLES: __('Copy Style', 'web-stories'),
  DELETE_PAGE: __('Delete Page', 'web-stories'),
  DETACH_IMAGE_FROM_BACKGROUND: __(
    'Detach Image From Background',
    'web-stories'
  ),
  DETACH_VIDEO_FROM_BACKGROUND: __(
    'Detach Video From Background',
    'web-stories'
  ),
  DUPLICATE_PAGE: __('Duplicate Page', 'web-stories'),
  DUPLICATE_ELEMENTS: (numElements = 1) =>
    _n('Duplicate Element', 'Duplicate Elements', numElements, 'web-stories'),
  GROUP_LAYERS: __('Group Layers', 'web-stories'),
  UNGROUP_LAYERS: __('Ungroup Layers', 'web-stories'),
  UNGROUP_LAYER: __('Remove from Group', 'web-stories'),
  LOCK_UNLOCK: __('Lock/Unlock', 'web-stories'),
  RENAME_LAYER: __('Rename Layer', 'web-stories'),
  PASTE_IMAGE_STYLES: __('Paste Image Styles', 'web-stories'),
  PASTE_SHAPE_STYLES: __('Paste Shape Styles', 'web-stories'),
  PASTE_VIDEO_STYLES: __('Paste Video Styles', 'web-stories'),
  PASTE_STYLES: __('Paste Style', 'web-stories'),
  SCALE_AND_CROP_BACKGROUND_IMAGE: __(
    'Scale & Crop Background Image',
    'web-stories'
  ),
  SCALE_AND_CROP_BACKGROUND_VIDEO: __(
    'Scale & Crop Background Video',
    'web-stories'
  ),
  SCALE_AND_CROP_IMAGE: __('Scale & Crop Image', 'web-stories'),
  SCALE_AND_CROP_VIDEO: __('Scale & Crop Video', 'web-stories'),
  SEND_BACKWARD: __('Send Backward', 'web-stories'),
  SEND_TO_BACK: __('Send to Back', 'web-stories'),
  SET_AS_PAGE_BACKGROUND: __('Set as Page Background', 'web-stories'),
  TRIM_VIDEO: __('Trim Video', 'web-stories'),
  UPLOAD_IMAGE_OR_VIDEO: __('Upload Image or Video', 'web-stories'),
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
