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
export const TRACKING_EVENTS = {
  PAGE_NAVIGATION: {
    category: 'page',
    label: 'arrow_navigate',
  },
  PAGE_PREVIEW_CLICK: {
    category: 'page',
    label: 'carousel_navigate',
  },
  PAGE_ADD: {
    category: 'page',
    label: 'add_new',
  },
  PAGE_DELETE: {
    category: 'page',
    label: 'delete',
  },
  SELECT_ELEMENT: {
    category: 'select_element',
  },
  LIBRARY_PANEL_CLICK: {
    category: 'library_panel',
  },
  DESIGN_PANEL_CLICK: {
    category: 'design_panel',
  },
  INSERT_ELEMENT: {
    category: 'insert_element',
  },
  DELETE_ELEMENT: {
    category: 'delete_element',
  },
  SET_BACKGROUND_MEDIA: {
    category: 'background',
    label: 'set_media_as_bg',
  },
};
