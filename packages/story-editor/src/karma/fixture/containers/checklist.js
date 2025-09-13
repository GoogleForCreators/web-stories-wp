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
import { Container } from './container';

/**
 * The checklist that can be toggled open
 * that will show different types of issues to the user.
 *
 * Some issues may prompt extra actions.
 */
export class Checklist extends Container {
  get toggleButton() {
    return this.getByRole('button', { name: /^Checklist/ });
  }

  get issues() {
    return this.getByRole('tablist', {
      name: /^Potential Story issues by category$/,
    });
  }

  get closeButton() {
    return this.getByRole('button', { name: /^Close/ });
  }

  get priorityTab() {
    return this.queryByRole('tab', { name: /Priority issue/ });
  }

  get priorityPanel() {
    return this.queryByRole('tabpanel', { name: /^Priority/ });
  }

  get expandedPriorityTab() {
    return this.getByRole('tab', { name: /Priority issue/, selected: true });
  }

  get designTab() {
    return this.queryByRole('tab', { name: /Design issue/ });
  }

  get expandedDesignTab() {
    return this.getByRole('tab', { name: /Design issue/, selected: true });
  }

  get designPanel() {
    return this.queryByRole('tabpanel', { name: /^Design/ });
  }

  get accessibilityTab() {
    return this.queryByRole('tab', { name: /Accessibility issue/ });
  }

  get expandedAccessibilityTab() {
    return this.getByRole('tab', {
      name: /Accessibility issue/,
      selected: true,
    });
  }

  get accessibilityPanel() {
    return this.queryByRole('tabpanel', { name: /^Accessibility/ });
  }
}
