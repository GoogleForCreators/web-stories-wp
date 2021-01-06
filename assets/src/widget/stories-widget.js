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
(function ($) {
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
    var currentView = target.value;
    var widget = target.closest('.widget');
    var state = fieldState.fields[currentView];

    for (var [key, value] of Object.entries(state)) {
      var field = widget.querySelector('.' + key + '.stories-widget-field');
      var fieldWrapper = widget.querySelector('.' + key + '_wrapper');
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
  const viewSelectors = function () {
    return document.getElementsByClassName('view-type stories-widget-field');
  };

  /**
   * Bind event on view type selection change.
   */
  const bindEvent = function () {
    var dropdowns = viewSelectors();

    if (dropdowns.length) {
      for (var i = 0; i < dropdowns.length; i++) {
        dropdowns[i].onchange = function (event) {
          reactiveWidget(event.target, false);
        };
      }
    }
  };

  /**
   * Fire event manually once.
   */
  const fireEvent = function () {
    var dropdowns = viewSelectors();
    var evt = document.createEvent('HTMLEvents');
    evt.initEvent('change', false, true);
    for (var l = 0; l < dropdowns.length; l++) {
      dropdowns[l].dispatchEvent(evt);
    }
  };

  /**
   * Wait till document is interactive and then bind the event.
   */
  document.onreadystatechange = function () {
    if (document.readyState === 'interactive') {
      bindEvent();
      fireEvent();
    }
  };

  /**
   * Called when widget is updated or added.
   *
   * @param {Object} event Event object.
   * @param {Object} widget Widget jQuery object.
   */
  const widgetChange = function (event, widget) {
    if (!widget[0]) {
      return;
    }

    var target = widget[0].querySelectorAll('.view-type.stories-widget-field');

    if (target.length) {
      reactiveWidget(target[0], false);
      bindEvent();
    }
  };

  /**
   * Listen to widget updated event and update the widget.
   */
  $(document).on('widget-updated', widgetChange);
  $(document).on('widget-added', widgetChange);
})(window.jQuery);
