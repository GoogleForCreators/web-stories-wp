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
 * External dependencies
 */
import {
  getByRole,
  getAllByRole,
  queryByRole,
  waitFor,
} from '@testing-library/react';

/** @typedef {import('@testing-library/dom').Matcher} Matcher */
/** @typedef {import('@testing-library/dom').ByRoleOptions} ByRoleOptions */

export class Container {
  /**
   * @param {Element} node Node.
   * @param {string} path Path.
   */
  constructor(node, path) {
    this._node = node;
    this._path = path;
  }

  get node() {
    return this._node;
  }

  get path() {
    return this._path;
  }

  /**
   * The container can indicate that it's not ready by setting the
   * `data-ready="false"` attribute.
   *
   * @return {!Promise} Resolve when the container is ready.
   */
  waitReady() {
    // @todo: consider joining on the parent waitReady as well.
    return waitFor(() => {
      if (this._node.getAttribute('data-ready') === 'false') {
        throw new Error(`Container <${this._path}>is not ready  yet`);
      }
    });
  }

  /**
   * @return {!Promise} Resolve when the element or one of its children becomes
   * focused.
   */
  waitFocusedWithin() {
    return waitFor(() => {
      if (!this._node.contains(document.activeElement)) {
        throw new Error(`Focus is not set within the <${this._path}> yet`);
      }
    });
  }

  /**
   * See https://testing-library.com/docs/dom-testing-library/api-queries#byrole
   *
   * @param {Matcher} role Role name.
   * @param {ByRoleOptions} options Options.
   * @return {HTMLElement} The found element.
   */
  getByRole(role, options) {
    return getByRole(this._node, role, options);
  }

  /**
   * See https://testing-library.com/docs/dom-testing-library/api-queries#byrole
   *
   * @param {Matcher} role Role name.
   * @param {ByRoleOptions} options Options.
   * @return {Array.<HTMLElement>} The found elements.
   */
  getAllByRole(role, options) {
    return getAllByRole(this._node, role, options);
  }

  /**
   * See https://testing-library.com/docs/dom-testing-library/api-queries#byrole
   *
   * @param {HTMLElement} root Root node
   * @param {Matcher} role Role name.
   * @param {ByRoleOptions} options Options.
   * @return {HTMLElement} The found element.
   */
  getByRoleIn(root, role, options) {
    return getByRole(root, role, options);
  }

  /**
   * See https://testing-library.com/docs/dom-testing-library/api-queries#byrole
   *
   * @param {HTMLElement} root Root node
   * @param {Matcher} role Role name.
   * @param {ByRoleOptions} options Options.
   * @return {Array.<HTMLElement>} The found elements.
   */
  getAllByRoleIn(root, role, options) {
    return getAllByRole(root, role, options);
  }

  /**
   * See https://testing-library.com/docs/dom-testing-library/api-queries#byrole
   *
   * @param {Matcher} role Role name.
   * @param {ByRoleOptions} options Options.
   * @return {HTMLElement} The found element.
   */
  queryByRole(role, options) {
    return queryByRole(this._node, role, options);
  }

  _get(node, name, constr) {
    if (!node) {
      return null;
    }
    const path = `${this._path}.${name}`;
    const key = `FixturePath(${path})`;
    if (!node[key]) {
      node[key] = new constr(node, path);
    }
    return node[key];
  }

  _getAll(nodeList, nameFn, constr) {
    return Array.from(nodeList).map((node) =>
      this._get(node, nameFn(node), constr)
    );
  }
}
