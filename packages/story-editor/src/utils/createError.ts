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

class CustomError extends Error {
  public file = '';
  public isUserError = false;
}
/**
 * Helper function to get create a js error.
 *
 * @param name Error name.
 * @param fileName File name.
 * @param message Message in error.
 * @return Error Object.
 */
function createError(name: string, fileName: string, message: string) {
  const validError = new CustomError();

  validError.name = name;
  validError.file = fileName;
  validError.isUserError = true;
  validError.message = message;

  return validError;
}

export default createError;
