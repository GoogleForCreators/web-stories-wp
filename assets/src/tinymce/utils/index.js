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
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';
/**
 * Internal dependencies
 */
import name from '../store/name';
import { forEach, isEmpty, webStoriesData } from './globals';

/**
 * Get current view.
 *
 * @return {string}
 */
export const currentView = () => {
  return select(name).getCurrentView();
};

/**
 * Check if current view is circle view.
 *
 * @return {boolean} Flag.
 */
export const isCircleView = () => {
  return 'circles' === currentView();
};

/**
 * Update the view wide settings.
 *
 * @param root0
 * @param root0.fieldObj
 * @param root0.field
 * @param root0.isReadonly
 * @return {void}
 */
export const updateViewSettings = ({ fieldObj, field, isReadonly = false }) => {
  let currentViewSettings = select(name).getCurrentViewSettings();
  let updatedSettings = currentViewSettings;

  switch (typeof fieldObj) {
    case 'object':
      if (!isReadonly) {
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
export const SetDefaultStateSetting = () => {
  const State = [];
  const { orderlist, views, fields } = webStoriesData;

  forEach(views, (value) => {
    const { value: viewValue } = value;
    const { title, author, date, excerpt, image_align, archive_link } = fields[
      viewValue
    ];

    State[viewValue] = {
      title: title,
      author: author,
      date: date,
      image_align: image_align,
      excerpt: excerpt,
      archive_link: archive_link,
      number: 5,
      columns: 1,
      view: viewValue,
      order: isEmpty(orderlist) ? 'latest' : orderlist[0].value,
    };
  });

  return State;
};
