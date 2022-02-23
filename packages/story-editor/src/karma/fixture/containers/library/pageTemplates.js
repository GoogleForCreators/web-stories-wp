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
 * Internal dependencies
 */
import { Container } from '../container';

export default class PageTemplates extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get pageTemplates() {
    return this.getAllByRole('listitem');
  }

  get pageTemplateButtons() {
    return this.node.querySelectorAll('[data-testid^=page_template_]');
  }

  pageTemplate(name) {
    return this.getByRole('listitem', { name });
  }

  pageTemplateButton(name) {
    return this.getByRole('button', { name });
  }

  get dropDown() {
    return this.queryByRole('button', { name: 'Select templates type' });
  }

  dropDownOption(name) {
    return this.getByRole('option', { name: new RegExp(`${name}$`, 'i') });
  }

  get saveTemplateBtn() {
    return this.getByRole('button', { name: 'Save current page as template' });
  }

  deleteBtnByIndex(index) {
    const deleteButtons = this.getAllByRole('button', {
      name: 'Delete Page Template',
    });
    return deleteButtons[index];
  }
}
