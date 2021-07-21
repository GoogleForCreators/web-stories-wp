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
 * The high priority section of the checklist will show once
 * the story reaches 5 pages
 */
export default async function triggerHighPriorityChecklistSection() {
  await expect(page).toClick('button[aria-label="Add New Page"]');
  await expect(page).toClick('button[aria-label="Add New Page"]');
  await expect(page).toClick('button[aria-label="Add New Page"]');
  await expect(page).toClick('button[aria-label="Add New Page"]');
}
