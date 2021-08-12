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
import { Text, THEME_CONSTANTS } from '@web-stories-wp/design-system';
import { __ } from '@web-stories-wp/i18n';
import styled from 'styled-components';
/**
 * Internal dependencies
 */
import { SPECIAL_KEYS } from '../../components/keyboardShortcutsMenu/constants';
import {
  cmdOrCtrl,
  optionOrAlt,
} from '../../components/keyboardShortcutsMenu/keyboardShortcutList';

export const RIGHT_CLICK_MENU_LABELS = {
  ADD_NEW_PAGE_AFTER: __('Add New Page After', 'web-stories'),
  ADD_NEW_PAGE_BEFORE: __('Add New Page Before', 'web-stories'),
  ADD_TO_COLOR_PRESETS: __('Add Color to “Saved Colors”', 'web-stories'),
  ADD_TO_TEXT_PRESETS: __('Add style to “Saved Styles”', 'web-stories'),
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
  REPLACE_BACKGROUND_IMAGE: __('Replace Background Image', 'web-stories'),
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
  SEND_BACKWARD: (
    <>
      <StyledKbd aria-label={cmdOrCtrl.title}>{cmdOrCtrl.symbol}</StyledKbd>{' '}
      <StyledKbd aria-label={SPECIAL_KEYS.DOWN.title}>
        {SPECIAL_KEYS.DOWN.symbol}
      </StyledKbd>
    </>
  ),
  SEND_TO_BACK: (
    <>
      <StyledKbd aria-label={cmdOrCtrl.title}>{cmdOrCtrl.symbol}</StyledKbd>{' '}
      <StyledKbd aria-label={SPECIAL_KEYS.SHIFT.title}>
        {SPECIAL_KEYS.SHIFT.symbol}
      </StyledKbd>{' '}
      <StyledKbd aria-label={SPECIAL_KEYS.DOWN.title}>
        {SPECIAL_KEYS.DOWN.symbol}
      </StyledKbd>
    </>
  ),
  BRING_FORWARD: (
    <>
      <StyledKbd aria-label={cmdOrCtrl.title}>{cmdOrCtrl.symbol}</StyledKbd>{' '}
      <StyledKbd aria-label={SPECIAL_KEYS.UP.title}>
        {SPECIAL_KEYS.UP.symbol}
      </StyledKbd>
    </>
  ),
  BRING_TO_FRONT: (
    <>
      <StyledKbd aria-label={cmdOrCtrl.title}>{cmdOrCtrl.symbol}</StyledKbd>{' '}
      <StyledKbd aria-label={SPECIAL_KEYS.SHIFT.title}>
        {SPECIAL_KEYS.SHIFT.symbol}
      </StyledKbd>{' '}
      <StyledKbd aria-label={SPECIAL_KEYS.UP.title}>
        {SPECIAL_KEYS.UP.symbol}
      </StyledKbd>
    </>
  ),
  DELETE: (
    <StyledKbd aria-label={SPECIAL_KEYS.DELETE.title}>
      {SPECIAL_KEYS.DELETE.symbol}
    </StyledKbd>
  ),
  COPY_STYLES: (
    <>
      <StyledKbd aria-label={optionOrAlt.title}>{optionOrAlt.symbol}</StyledKbd>{' '}
      <StyledKbd aria-label={cmdOrCtrl.title}>{cmdOrCtrl.symbol}</StyledKbd>{' '}
      <StyledKbd>{'O'}</StyledKbd>
    </>
  ),
  PASTE_STYLES: (
    <>
      <StyledKbd aria-label={optionOrAlt.title}>{optionOrAlt.symbol}</StyledKbd>{' '}
      <StyledKbd aria-label={cmdOrCtrl.title}>{cmdOrCtrl.symbol}</StyledKbd>{' '}
      <StyledKbd>{'P'}</StyledKbd>
    </>
  ),
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
