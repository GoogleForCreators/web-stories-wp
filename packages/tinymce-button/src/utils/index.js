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
import name from '../store/name';
import { webStoriesData } from './globals';

/**
 * Get current view.
 *
 * @return {string} View name.
 */
export const currentView = () => {
  return select(name).getCurrentView();
};

/**
 * Update the view wide settings.
 *
 * @param {Object} args Arguments.
 * @param {Object} args.fieldObj Field object.
 * @param {Object} args.field Field.
 * @param {boolean} [args.hidden=false] Whether the field is hidden.
 * @return {void}
 */
export const updateViewSettings = ({ fieldObj, field, hidden = false }) => {
  const currentViewSettings = select(name).getCurrentViewSettings();
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

  dispatch(name).setViewSettings(currentView(), updatedSettings);
};

/**
 * Set default setting state per se view type.
 *
 * @return {Object} Settings.
 */
export const setDefaultStateSetting = () => {
  const state = [];
  const { views, fields } = webStoriesData;

  views.forEach((value) => {
    const { value: viewType } = value;
    const {
      title,
      author,
      date,
      excerpt,
      archive_link,
      sharp_corners,
    } = fields[viewType];

    state[viewType] = {
      title: title,
      excerpt: excerpt,
      author: author,
      date: date,
      archive_link: archive_link,
      archive_link_label: '',
      circle_size: 150,
      sharp_corners: sharp_corners,
      image_alignment: 'left',
      number_of_columns: 1,
      number_of_stories: 5,
      order: 'DESC',
      orderby: 'post_title',
      view: viewType,
    };
  });

  return state;
};

/**
 * Build the shortcode tag based on the selected attributes.
 *
 * @return {string} Shortcode.
 */
export const prepareShortCode = () => {
  let shortCode = `[web_stories`;
  const editorInstance = select(name).getEditor();
  const settings = select(name).getCurrentViewSettings();

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
