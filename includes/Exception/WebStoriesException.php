<?php
/**
 * Interface WebStoriesException.
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2021 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
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

declare(strict_types = 1);

namespace Google\Web_Stories\Exception;

/**
 * This is a "marker interface" to mark all the exceptions that come with this
 * plugin with this one interface.
 *
 * This allows you to not only catch individual exceptions, but also catch "all
 * exceptions from the Web_Stories plugin".
 *
 * @internal
 *
 * @since 1.6.0
 */
interface WebStoriesException {

}
