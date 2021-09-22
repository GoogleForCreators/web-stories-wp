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
import { Container } from '../container';

/**
 * The taxonomies panel containing taxonomy and metadata about the story.
 */
export class CategoriesAndTags extends Container {
  constructor(node, path) {
    super(node, path);
  }

  get categoriesAndTagsButton() {
    return this.getByRole('button', { name: /Categories and Tags/ });
  }

  get categories() {
    return this.getAllByRole('checkbox');
  }

  get addNewCategoryButton() {
    return this.getByRole('button', { name: /Add New Category/ });
  }

  get newCategoryNameInput() {
    return this.getByRole('textbox', {
      name: /New Category Name/,
    });
  }

  get parentDropdownButton() {
    return this.getByRole('button', { name: /Parent Category/ });
  }

  get tagTokenRemoveButtons() {
    return this.getAllByRole('button', { name: /Remove Tag/ });
  }

  get tagsInput() {
    return this.getByRole('textbox', { name: /Add New Tag/ });
  }
}
