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
import { useMemo } from 'react';

function useContentHelper() {
  const helper = useMemo(() => {
    let buffer = null;

    /**
     * @param {string} content
     * @return {DocumentFragment}
     */
    function parse(content) {
      if (!buffer) {
        buffer = document.createElement('template');
      }
      buffer.innerHTML = content;
      return buffer.content;
    }

    /**
     * @return {string}
     * @private
     */
    function stringify() {
      return (buffer && buffer.innerHTML) || '';
    }

    /**
     * @param {string} content
     * @param {function(DocumentFragment)} callback
     * @return {string}
     */
    function transform(content, callback) {
      const dom = parse(content);
      callback(dom);
      return stringify();
    }

    function purgeAll(nodeList) {
      for (let i = nodeList.length - 1; i >= 0; i--) {
        const node = nodeList[i];
        if (node.parentNode) {
          node.replaceWith(...node.childNodes);
        }
      }
    }

    function setStyles(nodeList, styles) {
      const entries = Object.entries(styles);
      for (let i = 0; i < nodeList.length; i++) {
        const node = nodeList[i];
        entries.forEach(([k, v]) => (node.style[k] = v));
      }
    }

    /**
     * @param {string} content
     * @param {string} flag
     * @return {boolean}
     */
    function isFlagSet(content, flag) {
      const tagName = flag.toUpperCase();
      const dom = parse(content);
      return (
        dom.childNodes.length === 1 && dom.childNodes[0].tagName === tagName
      );
    }

    /**
     * @param {string} content
     * @param {string} flag
     * @return {string} content
     */
    function setFlagOn(content, flag) {
      const tagName = flag.toUpperCase();
      return transform(content, (dom) => {
        let top;
        if (
          dom.childNodes.length === 1 &&
          dom.childNodes[0].tagName === tagName
        ) {
          top = dom.childNodes[0];
        } else {
          top = document.createElement(tagName);
          top.append(...dom.childNodes);
          dom.appendChild(top);
        }
        purgeAll(top.querySelectorAll(tagName));
      });
    }

    /**
     * @param {string} content
     * @param {string} flag
     * @return {string} content
     */
    function setFlagOff(content, flag) {
      const tagName = flag.toUpperCase();
      return transform(content, (dom) => {
        purgeAll(dom.querySelectorAll(tagName));
      });
    }

    /**
     * @param {string} content
     * @param {string} flag
     * @param {boolean} value
     * @return {string} content
     */
    function setFlag(content, flag, value) {
      return value ? setFlagOn(content, flag) : setFlagOff(content, flag);
    }

    /**
     * @param {string} content
     * @param {string} flag
     * @return {string} content
     */
    function toggleFlag(content, flag) {
      return setFlag(content, flag, !isFlagSet(content, flag));
    }

    /**
     * @param {string} content
     * @param {string} flag
     * @param {Object} styles
     * @return {string} content
     */
    function setCustomStyle(content, flag, styles) {
      const tagName = flag.toUpperCase();
      return transform(content, (dom) => {
        setStyles(dom.querySelectorAll(tagName), styles);
      });
    }

    return { isFlagSet, setCustomStyle, setFlag, toggleFlag };
  }, []);
  return helper;
}

export default useContentHelper;
