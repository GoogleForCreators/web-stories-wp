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
 * Internal dependencies
 */
import visitAdminPage from './visitAdminPage';

async function deleteWidgets() {
  // Remove all widgets
  await visitAdminPage('widgets.php');
  await page.evaluate(() => {
    const widgets = document.querySelectorAll(
      '#widgets-right .widget .widget-action'
    );
    for (const widget of widgets) {
      widget.click();
    }

    const widgetsDelete = document.querySelectorAll(
      '#widgets-right .widget .widget-control-remove'
    );
    for (const widgetDelete of widgetsDelete) {
      widgetDelete.click();
    }
  });
}

export default deleteWidgets;
