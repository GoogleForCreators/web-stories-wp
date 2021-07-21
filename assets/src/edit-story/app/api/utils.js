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
 * Flattern data passed to form data, so multi level object can be passed.
 *
 * @param {FormData} formData Form data object.
 * @param {string} key Key to ammended to to form data object
 * @param {string|Object} data Data to be ammended to form, data, this could be either string or object.
 */
export const flatternFormData = (formData, key, data) => {
  if (typeof data === 'object') {
    for (const name in data) {
      if (Object.prototype.hasOwnProperty.call(data, name)) {
        flatternFormData(formData, `${key}[${name}]`, data[name]);
      }
    }
  } else {
    formData.append(key, data);
  }
};
