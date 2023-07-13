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
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import store from '../store';

/**
 * Update the view wide settings.
 *
 * @param {Object} args Arguments.
 * @param {Object} args.fieldObj Field object.
 * @param {Object} args.field Field.
 * @param {boolean} [args.hidden] Whether the field is hidden.
 * @return {void}
 */
export const updateViewSettings = ({ fieldObj, field, hidden = false }) => {
  const currentViewSettings = select(store).getCurrentViewSettings();
  let updatedSettings = currentViewSettings;

  switch (typeof fieldObj) {
    case 'object':
      if (!hidden) {
        const { show } = fieldObj;
        updatedSettings = {
          ...currentViewSettings,
          [field]: { ...fieldObj, show: !show },
        };
      }
      break;

    default:
      updatedSettings = {
        ...currentViewSettings,
        [field]: fieldObj,
      };
      break;
  }

  dispatch(store).setViewSettings(
    select(store).getCurrentView(),
    updatedSettings
  );
};

/**
 * Build the shortcode tag based on the selected attributes.
 *
 * @return {string} Shortcode.
 */
export const prepareShortCode = () => {
  let shortCode = `[web_stories`;
  const editorInstance = select(store).getEditor();
  const settings = select(store).getCurrentViewSettings();

  if (editorInstance) {
    Object.keys(settings).forEach((value) => {
      const ValueObject = settings[value];
      const Value =
        'object' === typeof ValueObject
          ? ValueObject.show.toString()
          : ValueObject.toString();
      shortCode += ` ${value.toString()}="${Value}"`;
    });
  }

  shortCode += ' /]';

  return shortCode;
};
