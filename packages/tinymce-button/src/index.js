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
import { render } from '@wordpress/element';
import { dispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import name from './store/name';
import WebStoryMCEStore from './store';
import WebStoriesModal from './containers/Modal';

const { _ } = window;

/**
 * Add button to tinyMCE editor.
 */

/**
 * This is a patch for TinyMCE editor to insert content
 * using `insertContent` method.
 *
 * WP still uses `_.pluck` method
 * https://github.com/WordPress/WordPress/blob/master/wp-includes/js/mce-view.js#L145
 * lodash (which WP uses now) does not have this method, so there will be JS error in console.
 */
// eslint-disable-next-line no-prototype-builtins -- False positive because this is Lodash.
if (!_.hasOwnProperty('pluck')) {
  _.pluck = _.map;
}

/**
 * Render tinyMCE settings modal.
 *
 * @class
 */
const RenderModal = () => {
  const target = document.getElementById('web-stories-tinymce');

  if (target) {
    render(<WebStoriesModal />, target);
  }
};

/**
 * Subscribe to state change in store.
 */
WebStoryMCEStore.subscribe(() => RenderModal());

tinymce.PluginManager.add('web_stories', function (editor) {
  editor.addButton('web_stories', {
    text: __('Web Stories', 'web-stories'),
    classes: 'web-stories',
    image:
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjA4IiBoZWlnaHQ9IjIwOCIgdmlld0JveD0iMCAwIDIwOCAyMDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMTAwIiBmaWxsPSJibGFjayIvPgo8cGF0aCBkPSJNMTM1LjIgNjIuNDAwNUMxNDAuOTQ0IDYyLjQwMDUgMTQ1LjYgNjcuMDU2NyAxNDUuNiA3Mi44MDA1VjEzNS4yQzE0NS42IDE0MC45NDQgMTQwLjk0NCAxNDUuNiAxMzUuMiAxNDUuNlY2Mi40MDA1WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTU3LjIgNjIuNDAwNUM1Ny4yIDU2LjY1NjcgNjEuODU2MiA1Mi4wMDA1IDY3LjYgNTIuMDAwNUgxMTQuNEMxMjAuMTQ0IDUyLjAwMDUgMTI0LjggNTYuNjU2NyAxMjQuOCA2Mi40MDA1VjE0NS42QzEyNC44IDE1MS4zNDQgMTIwLjE0NCAxNTYgMTE0LjQgMTU2SDY3LjZDNjEuODU2MiAxNTYgNTcuMiAxNTEuMzQ0IDU3LjIgMTQ1LjZWNjIuNDAwNVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xNTYgNzIuODAwNUMxNjAuMzA4IDcyLjgwMDUgMTYzLjggNzYuMjkyNyAxNjMuOCA4MC42MDA1VjEyNy40QzE2My44IDEzMS43MDggMTYwLjMwOCAxMzUuMiAxNTYgMTM1LjJWNzIuODAwNVoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPg==',
    onclick: function () {
      dispatch(name).setEditor(editor);
      dispatch(name).toggleModal(true);
    },
  });
});
