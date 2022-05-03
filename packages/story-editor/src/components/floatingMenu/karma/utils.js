/*
 * Copyright 2022 Google LLC
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

export async function tabToCanvasFocusContainer(focusContainer, fixture) {
  // start focused on media pane searchbar
  await fixture.editor.library.mediaTab.click();
  await fixture.events.focus(fixture.editor.library.media.searchBar);

  // tab until focus reaches the canvas container
  let count = 0;
  while (count < 15) {
    // eslint-disable-next-line no-await-in-loop -- need to await key press
    await fixture.events.keyboard.press('tab');

    if (document.activeElement === focusContainer) {
      break;
    }

    count++;
  }

  if (count >= 15) {
    throw new Error('Could not find focus container.');
  }
}

export async function focusFloatingMenu(fixture) {
  await fixture.events.keyboard.shortcut('control+alt+p');
}
