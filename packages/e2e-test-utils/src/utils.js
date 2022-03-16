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
/**
 * External dependencies
 */
import { getDocument, queries } from 'pptr-testing-library';

export const getByTestId = async (page, testId) => {
  const $document = await getDocument(page);
  return queries.getByTestId($document, testId);
};

export const getByAltText = async (page, testId) => {
  const $document = await getDocument(page);
  return queries.getByAltText($document, testId);
};

export const getByText = async (page, testId) => {
  const $document = await getDocument(page);
  return queries.getByText($document, testId);
};

export const getByLabelText = async (page, testId) => {
  const $document = await getDocument(page);
  return queries.getByLabelText($document, testId);
};
