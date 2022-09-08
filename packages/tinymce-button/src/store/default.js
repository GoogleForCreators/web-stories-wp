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
 * Set default setting state per se view type.
 *
 * @return {Object} Settings.
 */
const setDefaultStateSetting = () => {
  const state = [];
  const { views = [], fields } = window.webStoriesData || {};

  views.forEach((value) => {
    const { value: viewType } = value;
    const { title, author, date, excerpt, archive_link, sharp_corners } =
      fields[viewType];

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

const DEFAULT_STATE = {
  settings: setDefaultStateSetting(),
  modalOpen: false,
  editor: false,
  currentView: 'circles',
};

export default DEFAULT_STATE;
