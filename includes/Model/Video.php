<?php
/**
 * Class Video
 *
 * @link      https://github.com/googleforcreators/web-stories-wp
 *
 * @copyright 2022 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 */

/**
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

namespace Google\Web_Stories\Model;

/**
 * Class Video.
 *
 * @phpstan-type VideoData array{
 *   src: string,
 *   alt: string,
 *   creationDate: string,
 *   poster: string,
 *   length: int,
 * }
 */
class Video {
	/**
	 * URL.
	 *
	 * @var string
	 */
	protected $url = '';

	/**
	 * Title.
	 *
	 * @var string
	 */
	protected $title = '';

	/**
	 * Date for the story.
	 *
	 * @var string
	 */
	protected $date = '';

	/**
	 * Poster url.
	 *
	 * @var string
	 */
	protected $poster = '';

	/**
	 * Duration.
	 *
	 * @var int
	 */
	protected $duration = 0;

	/**
	 * Video constructor.
	 *
	 * @since 1.26.0
	 *
	 * @param array<string,mixed> $video Array of attributes.
	 */
	public function __construct( array $video = [] ) {
		foreach ( $video as $key => $value ) {
			if ( property_exists( $this, $key ) ) {
				$this->$key = $value;
			}
		}
	}

	/**
	 * Convert array to object properties.
	 *
	 * @since 1.26.0
	 *
	 * @param array<string, mixed> $data Array of video.
	 * @return Video video.
	 *
	 * @phpstan-param VideoData $data
	 */
	public static function load_from_array( array $data ): Video {
		$video = new self();

		$video->set_duration( $data['length'] );
		$video->set_url( $data['src'] );
		$video->set_title( $data['alt'] );
		$video->set_poster( $data['poster'] );
		$video->set_date( $data['creationDate'] );

		return $video;
	}

	/**
	 * Set URL.
	 *
	 * @param string $url URL.
	 */
	public function set_url( string $url ): void {
		$this->url = $url;
	}

	/**
	 * Get URL.
	 */
	public function get_url(): string {
		return $this->url;
	}

	/**
	 * Set title.
	 *
	 * @param string $title Title.
	 */
	public function set_title( string $title ): void {
		$this->title = $title;
	}

	/**
	 * Get title.
	 */
	public function get_title(): string {
		return $this->title;
	}

	/**
	 * Set date.
	 *
	 * @param string $date Date.
	 */
	public function set_date( string $date ): void {
		$this->date = $date;
	}

	/**
	 * Get date.
	 */
	public function get_date(): string {
		return $this->date;
	}

	/**
	 * Set poster.
	 *
	 * @param string $poster Poster.
	 */
	public function set_poster( string $poster ): void {
		$this->poster = $poster;
	}

	/**
	 * Get poster.
	 */
	public function get_poster(): string {
		return $this->poster;
	}

	/**
	 * Set duration.
	 *
	 * @param int $duration Duration.
	 */
	public function set_duration( int $duration ): void {
		$this->duration = $duration;
	}

	/**
	 * Get duration.
	 */
	public function get_duration(): int {
		return $this->duration;
	}


}
