/*
 * Copyright 2023 Google LLC
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

const WP_ADMIN_USER = {
  username: 'admin',
  password: 'password',
};

const {
  WP_USERNAME = WP_ADMIN_USER.username,
  WP_PASSWORD = WP_ADMIN_USER.password,
  WP_BASE_URL = 'http://localhost:8889',
} = process.env;

export { WP_ADMIN_USER, WP_USERNAME, WP_PASSWORD, WP_BASE_URL };
