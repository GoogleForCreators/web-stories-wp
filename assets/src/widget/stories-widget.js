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
import domReady from '@wordpress/dom-ready';

/**
 * Store field states in local variable.
 *
 * @type {Object}
 */
const fieldState = window.webStoriesData || {};

/**
 * Closure for making inputs reactive
 * on view type selection change.
 *
 * @param {Object}  target Event object.
 * @param {boolean} reset Flag to reset fields value.
 */
const reactiveWidget = function (target, reset = false) {
  const currentView = target.value;
  const widget = target.closest('.widget');
  const state = fieldState.fields[currentView];

  for (const [key, value] of Object.entries(state)) {
    const field = widget.querySelector(`.${key}.stories-widget-field`);
    const fieldWrapper = widget.querySelector(`.${key}_wrapper`);
    if (field && fieldWrapper && 'checkbox' === field.getAttribute('type')) {
      if (reset) {
        field.checked = false;
      }
      /**
       * If this is readonly field.
       * Assign the value automatically and hide it afterward.
       */
      if (value.readonly) {
        field.checked = value.show;
      }
      fieldWrapper.style.display = value.readonly ? 'none' : 'block';
    }
  }
};

/**
 * Returns the HTML Collection of view type selectors.
 *
 * @return {HTMLCollection} Array of elements.
 */
const viewSelectors = () =>
  document.getElementsByClassName('view-type stories-widget-field');

/**
 * Bind event on view type selection change.
 */
const bindEvent = function () {
  const dropdowns = viewSelectors();

  if (dropdowns.length) {
    for (let i = 0; i < dropdowns.length; i++) {
      dropdowns[i].addEventListener('change', (event) => {
        reactiveWidget(event.target, false);
      });
    }
  }
};

/**
 * Fire event manually once.
 */
const fireEvent = function () {
  const dropdowns = viewSelectors();
  const evt = document.createEvent('HTMLEvents');
  evt.initEvent('change', false, true);
  for (let l = 0; l < dropdowns.length; l++) {
    dropdowns[l].dispatchEvent(evt);
  }
};

/**
 * Wait till document is ready and then bind the event.
 */
domReady(() => {
  bindEvent();
  fireEvent();
});

/**
 * Called when widget is updated or added.
 *
 * @param {Object} event Event object.
 * @param {Object} widget Widget jQuery object.
 */
const widgetChange = (event, widget) => {
  if (!widget[0]) {
    return;
  }

  const target = widget[0].querySelectorAll('.view-type.stories-widget-field');

  if (target.length) {
    reactiveWidget(target[0], false);
    bindEvent();
  }
};

const $ = window.jQuery;

/**
 * Listen to widget updated event and update the widget.
 */
$(document).on('widget-updated', widgetChange);
$(document).on('widget-added', widgetChange);
