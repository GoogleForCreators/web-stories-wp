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
import { parseToRgb } from 'polished';

function colorToPattern({ pages, ...rest }) {
  return {
    pages: pages.map(updatePage),
    ...rest,
  };
}

function updatePage({ elements, backgroundColor, ...rest }) {
  return {
    elements: elements.map(updateElement),
    backgroundColor: parse(backgroundColor),
    ...rest,
  };
}

function updateElement(props) {
  const newProps = { ...props };

  if (Object.prototype.hasOwnProperty.call(props, 'color')) {
    newProps.color = parse(newProps.color);
  }

  if (Object.prototype.hasOwnProperty.call(props, 'backgroundColor')) {
    newProps.backgroundColor = parse(newProps.backgroundColor);
  }

  return newProps;
}

function parse(colorString) {
  if (!colorString || colorString === 'transparent') {
    return null;
  }

  const { red: r, green: g, blue: b, alpha: a = 1 } = parseToRgb(colorString);
  if (a === 1) {
    return { color: { r, g, b } };
  }
  return { color: { r, g, b, a } };
}

export default colorToPattern;
