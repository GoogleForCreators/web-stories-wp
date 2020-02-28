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
function elementsFromPoint(x, y) {
  const elements = [],
    previousPointerEvents = [];
  let current, i, d;

  // get all elements via elementFromPoint, and remove them from hit-testing in order
  while (
    (current = document.elementFromPoint(x, y)) &&
    elements.indexOf(current) === -1 &&
    current !== null
  ) {
    // push the element and its current style
    elements.push(current);
    previousPointerEvents.push({
      value: current.style.getPropertyValue('pointer-events'),
      priority: current.style.getPropertyPriority('pointer-events'),
    });

    // add "pointer-events: none", to get to the underlying element
    current.style.setProperty('pointer-events', 'none', 'important');
  }

  // restore the previous pointer-events values
  for (i = previousPointerEvents.length; (d = previousPointerEvents[--i]); ) {
    elements[i].style.setProperty(
      'pointer-events',
      d.value ? d.value : '',
      d.priority
    );
  }

  // return our results
  return elements;
}

export default elementsFromPoint;
