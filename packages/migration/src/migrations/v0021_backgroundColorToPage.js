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

function backgroundColorToPage({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage(page) {
  const { elements, defaultBackgroundElement } = page;
  const defaultBackground = {
    type: 'solid',
    color: { r: 255, g: 255, b: 255 },
  };
  const backgroundColor = elements[0]?.isDefaultBackground
    ? elements[0].backgroundColor
    : defaultBackgroundElement?.backgroundColor;
  return {
    ...page,
    backgroundColor: backgroundColor ? backgroundColor : defaultBackground,
  };
}

export default backgroundColorToPage;
