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

// See https://github.com/moroshko/shallow-equal/issues/13
// and https://github.com/moroshko/shallow-equal/pull/16

declare module 'shallow-equal' {
  export function shallowEqualArrays(
    arr1: any[] | null | undefined,
    arr2: any[] | null | undefined
  ): boolean;

  export function shallowEqualObjects(
    obj1: Record<string, any> | null | undefined,
    obj2: Record<string, any> | null | undefined
  ): boolean;
}
