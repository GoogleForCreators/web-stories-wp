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
import ColorThief from 'colorthief';
const thief = new ColorThief();

const STYLES = {
  boxSizing: 'border-box',
  visibility: 'hidden',
  position: 'fixed',
  contain: 'layout paint',
  top: '-9999px',
  left: '-9999px',
  zIndex: -1,
};

const BASE_COLOR_NODE = '__WEB_STORIES_BASE_COLOR__';

export function getMediaBaseColor(resource, onBaseColor) {
  const { type, src, poster } = resource;
  setOrCreateImage(type === 'video' ? poster : src).then(
    (color) => onBaseColor(color),
    () => onBaseColor([255, 255, 255]) // Fallback color is white.
  );
}

export function setOrCreateImage(src) {
  return new Promise((resolve, reject) => {
    let imgNode = document.body[BASE_COLOR_NODE];
    if (!imgNode) {
      imgNode = document.createElement('div');
      imgNode.id = '__web-stories-base-color';
      Object.assign(imgNode, STYLES);
      document.body.appendChild(imgNode);
      document.body[BASE_COLOR_NODE] = imgNode;
    }
    imgNode.innerHTML = '';

    const img = new Image();
    // Necessary to avoid tainting canvas with CORS image data.
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const node = document.body[BASE_COLOR_NODE];
      try {
        resolve(thief.getColor(node.firstElementChild));
      } catch (e) {
        reject(e);
      }
    };
    img.onerror = (e) => {
      reject(new Error('Base color image error: ' + e.message));
    };
    img.width = 10;
    img.height = 'auto';
    img.src = src;
    imgNode.appendChild(img);
  });
}
