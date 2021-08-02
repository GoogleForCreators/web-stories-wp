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
  BRING_FORWARD: __('Bring forward', 'web-stories'),
  BRING_TO_FRONT: __('Bring to front', 'web-stories'),
  COPY: __('Copy', 'web-stories'),
  DELETE_PAGE: __('Delete Page', 'web-stories'),
  DELETE: __('Delete', 'web-stories'),
  DUPLICATE_PAGE: __('Duplicate Page', 'web-stories'),
  PASTE: __('Paste', 'web-stories'),
  SCALE_AND_CROP_IMAGE: __('Scale & crop image', 'web-stories'),
  SEND_BACKWARD: __('Send backward', 'web-stories'),
  SEND_TO_BACK: __('Send to back', 'web-stories'),
  SET_AS_PAGE_BACKGROUND: __('Set as page background', 'web-stories'),
};

const StyledKbd = styled(Text).attrs({
  forwardedAs: 'kbd',
  size: THEME_CONSTANTS.TYPOGRAPHY.PRESET_SIZES.SMALL,
})`
  color: inherit;
`;

export const RIGHT_CLICK_MENU_SHORTCUTS = {
  COPY: (
    <>
      <StyledKbd aria-label={cmdOrCtrl.title}>{cmdOrCtrl.symbol}</StyledKbd>{' '}
      <StyledKbd>{'C'}</StyledKbd>
    </>
  ),
  PASTE: (
    <>
      <StyledKbd aria-label={cmdOrCtrl.title}>{cmdOrCtrl.symbol}</StyledKbd>{' '}
      <StyledKbd>{'V'}</StyledKbd>
    </>
  ),
  SEND_BACKWARD: (
    <>
      <StyledKbd aria-label={optionOrAlt.title}>{optionOrAlt.symbol}</StyledKbd>{' '}
      <StyledKbd aria-label={cmdOrCtrl.title}>{cmdOrCtrl.symbol}</StyledKbd>{' '}
      <StyledKbd>{'['}</StyledKbd>
    </>
  ),
  SEND_TO_BACK: (
    <>
      <StyledKbd aria-label={cmdOrCtrl.title}>{cmdOrCtrl.symbol}</StyledKbd>{' '}
      <StyledKbd>{'['}</StyledKbd>
    </>
  ),
  BRING_FORWARD: (
    <>
      <StyledKbd aria-label={cmdOrCtrl.title}>{cmdOrCtrl.symbol}</StyledKbd>{' '}
      <StyledKbd>{']'}</StyledKbd>
    </>
  ),
  BRING_TO_FRONT: (
    <>
      <StyledKbd aria-label={optionOrAlt.title}>{optionOrAlt.symbol}</StyledKbd>{' '}
      <StyledKbd aria-label={cmdOrCtrl.title}>{cmdOrCtrl.symbol}</StyledKbd>{' '}
      <StyledKbd>{']'}</StyledKbd>
    </>
  ),
  DELETE: (
    <StyledKbd aria-label={SPECIAL_KEYS.DELETE.title}>
      {SPECIAL_KEYS.DELETE.symbol}
    </StyledKbd>
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
