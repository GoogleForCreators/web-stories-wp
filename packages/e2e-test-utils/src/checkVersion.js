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
function checkVersion(a, b) {
  const x = a.split('.').map((e) => parseInt(e));
  const y = b.split('.').map((e) => parseInt(e));

  // eslint-disable-next-line guard-for-in
  for (const i in x) {
    y[i] = y[i] || 0;
    if (x[i] === y[i]) {
      continue;
    } else if (x[i] > y[i]) {
      return true;
    } else {
      return false;
    }
  }
  return !(y.length > x.length);
}
export default checkVersion;
