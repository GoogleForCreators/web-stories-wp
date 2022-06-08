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
function getAllProducts(pages) {
  const products = pages
    .map((page) =>
      page?.elements
        ?.filter(({ type }) => type === 'product')
        .map(({ product }) => product)
    )
    .flat()
    .filter(Boolean);

  const list = products.map((product) => JSON.stringify(product));
  return Array.from(new Set(list)).map((product) => JSON.parse(product));
}

export default getAllProducts;
