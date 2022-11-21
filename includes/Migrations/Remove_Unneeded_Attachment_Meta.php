<?php
/**
 * Class Remove_Unneeded_Attachment_Meta
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

namespace Google\Web_Stories\Migrations;

use Google\Web_Stories\Media\Video\Poster;

/**
 * Class Remove_Unneeded_Attachment_Meta
 */
class Remove_Unneeded_Attachment_Meta extends Migrate_Base {
	/**
	 * Delete old attachment post meta.
	 *
	 * @since 1.7.0
	 *
	 * @global \wpdb $wpdb WordPress database abstraction object.
	 */
	public function migrate(): void {
		delete_post_meta_by_key( Poster::POSTER_POST_META_KEY );
	}
}
