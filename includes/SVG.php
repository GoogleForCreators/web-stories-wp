<?php
/**
 * Class SVG.
 *
 * @package   Google\Web_Stories
 * @copyright 2020 Google LLC
 * @license   https://www.apache.org/licenses/LICENSE-2.0 Apache License 2.0
 * @link      https://github.com/google/web-stories-wp
 */

/**
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

namespace Google\Web_Stories;

use DOMDocument;
use DOMElement;
use WP_Error;
use Google\Web_Stories_Dependencies\enshrined\svgSanitize\Sanitizer;

/**
 * Class SVG
 *
 * @since 1.3.0
 *
 * @package Google\Web_Stories
 */
class SVG {
	/**
	 * File extension.
	 *
	 * @since 1.3.0
	 *
	 * @var string
	 */
	const EXT = 'svg';

	/**
	 * Mime type.
	 *
	 * @since 1.3.0
	 *
	 * @var string
	 */
	const MIME_TYPE = 'image/svg+xml';

	/**
	 * Cached list of SVG files and their contents.
	 * Speeds up access during the same request.
	 *
	 * @since 1.3.0
	 *
	 * @var string[]
	 */
	protected $svgs = [];

	/**
	 * Experiments instance.
	 *
	 * @since 1.3.0
	 *
	 * @var Experiments Experiments instance.
	 */
	private $experiments;

	/**
	 * SVG constructor.
	 *
	 * @since 1.3.0
	 *
	 * @param Experiments $experiments Experiments instance.
	 *
	 * @return void
	 */
	public function __construct( Experiments $experiments ) {
		$this->experiments = $experiments;
	}

	/**
	 * Register filters and actions.
	 *
	 * @since 1.3.0
	 *
	 * @return void
	 */
	public function init() {
		if ( ! $this->experiments->is_experiment_enabled( 'enableSVG' ) ) {
			return;
		}

		add_filter( 'web_stories_allowed_mime_types', [ $this, 'web_stories_allowed_mime_types' ] );

		// Check if svg uploads, already enabled.
		if ( $this->svg_already_enabled() ) {
			add_filter( 'mime_types', [ $this, 'mime_types_add_svg' ] );
			return;
		}

		add_filter( 'upload_mimes', [ $this, 'upload_mimes_add_svg' ] ); // phpcs:ignore WordPressVIPMinimum.Hooks.RestrictedHooks.upload_mimes
		add_filter( 'mime_types', [ $this, 'mime_types_add_svg' ] );
		add_filter( 'wp_handle_upload_prefilter', [ $this, 'wp_handle_upload' ] );
		add_filter( 'wp_generate_attachment_metadata', [ $this, 'wp_generate_attachment_metadata' ], 10, 3 );
		add_filter( 'wp_check_filetype_and_ext', [ $this, 'wp_check_filetype_and_ext' ], 10, 5 );
		add_filter( 'site_option_upload_filetypes', [ $this, 'filter_list_of_allowed_filetypes' ] );
	}

	/**
	 * Helper function to check if svg uploads are already enabled.
	 *
	 * @since 1.3.0
	 *
	 * @return bool
	 */
	private function svg_already_enabled() {
		$allowed_mime_types = get_allowed_mime_types();
		$mime_types         = array_values( $allowed_mime_types );

		return in_array( self::MIME_TYPE, $mime_types, true );
	}

	/**
	 * Enable SVG upload.
	 *
	 * @since 1.3.0
	 *
	 * @param array $mime_types Mime types keyed by the file extension regex corresponding to those types.
	 *
	 * @return mixed
	 */
	public function upload_mimes_add_svg( array $mime_types ) {
		// allow SVG file upload.
		$mime_types['svg']  = self::MIME_TYPE;
		$mime_types['svgz'] = self::MIME_TYPE;

		return $mime_types;
	}

	/**
	 * Adds SVG to list of mime types and file extensions
	 *
	 * @since 1.3.0
	 *
	 * @param string[] $mime_types     Mime types keyed by the file extension regex
	 *                                 corresponding to those types.
	 *
	 * @return array
	 */
	public function mime_types_add_svg( array $mime_types ) {
		// allow SVG files.
		$mime_types['svg'] = self::MIME_TYPE;

		return array_unique( $mime_types );
	}

	/**
	 * Add SVG to allowed mime types.
	 *
	 * @since 1.3.0
	 *
	 * @param array $mime_types Associative array of allowed mime types per media type (image, audio, video).
	 *
	 * @return array
	 */
	public function web_stories_allowed_mime_types( array $mime_types ) {
		$mime_types['image'][] = self::MIME_TYPE;

		return $mime_types;
	}

	/**
	 * Add svg file type to allow file in multisite.
	 *
	 * @since 1.3.0
	 *
	 * @param string $value List of allowed file types.
	 *
	 * @return string List of allowed file types.
	 */
	public function filter_list_of_allowed_filetypes( $value ) {
		$filetypes = explode( ' ', $value );
		if ( ! in_array( self::EXT, $filetypes, true ) ) {
			$filetypes[] = self::EXT;
			$value       = implode( ' ', $filetypes );
		}

		return $value;
	}

	/**
	 * Hook into metadata generation and get height and width for SVG file.
	 *
	 * @since 1.3.0
	 *
	 * @param array  $metadata      An array of attachment meta data.
	 * @param int    $attachment_id Current attachment ID.
	 * @param string $context       Additional context. Can be 'create' when metadata was initially created for new
	 *                              attachment.
	 *
	 * @return array
	 */
	public function wp_generate_attachment_metadata( $metadata, $attachment_id, $context ) {
		if ( 'create' !== $context ) {
			return $metadata;
		}
		$attachment = get_post( $attachment_id );
		$mime_type  = get_post_mime_type( $attachment );

		if ( self::MIME_TYPE !== $mime_type ) {
			return $metadata;
		}
		$file = get_attached_file( $attachment_id );
		if ( false === $file ) {
			return $metadata;
		}

		$size = $this->get_svg_size( $file );
		// Check if image size failed to generate and return if so.
		if ( is_wp_error( $size ) ) {
			return $metadata;
		}

		return [
			'width'    => $size['width'],
			'height'   => $size['height'],
			'file'     => _wp_relative_upload_path( $file ),
			'filesize' => (int) filesize( $file ),
			'sizes'    => [],
		];
	}

	/**
	 * Hook into upload and error if size could not be generated.
	 *
	 * @since 1.3.0
	 *
	 * @param array $upload {
	 *      Array of upload data.
	 *
	 *      @type string $file   Filename of the newly-uploaded file.
	 *      @type string $url    URL of the newly-uploaded file.
	 *      @type string $type   Mime type of the newly-uploaded file.
	 * }
	 *
	 * @return string[]
	 */
	public function wp_handle_upload( $upload ) {
		if ( self::MIME_TYPE !== $upload['type'] ) {
			return $upload;
		}

		$sanitized = $this->sanitize( $upload['tmp_name'] );
		if ( is_wp_error( $sanitized ) ) {
			return [ 'error' => $sanitized->get_error_message() ];
		}

		$size = $this->get_svg_size( $upload['tmp_name'] );
		if ( is_wp_error( $size ) ) {
			return [ 'error' => $size->get_error_message() ];
		}

		return $upload;
	}


	/**
	 * Get SVG image size.
	 *
	 * @since 1.3.0
	 *
	 * @SuppressWarnings(PHPMD.NPathComplexity)
	 *
	 * @param string $file Path to SVG file.
	 *
	 * @return array|WP_Error
	 */
	protected function get_svg_size( $file ) {
		$svg = $this->get_svg_data( $file );
		$xml = $this->get_xml( $svg );

		if ( false === $xml ) {
			return new WP_Error( 'invalid_xml_svg', __( 'Invalid xml in SVG.', 'web-stories' ) );
		}

		$width  = (int) $xml->getAttribute( 'width' );
		$height = (int) $xml->getAttribute( 'height' );

		// If height and width are not set, try the viewport attribute.
		if ( ! $width || ! $height ) {
			$view_box = $xml->getAttribute( 'viewBox' );
			if ( empty( $view_box ) ) {
				$view_box = $xml->getAttribute( 'viewbox' );
			}
			$pieces = explode( ' ', $view_box );
			if ( 4 === count( $pieces ) ) {
				list (, , $width, $height ) = $pieces;
			}
		}

		if ( ! $width || ! $height ) {
			return new WP_Error( 'invalid_svg_size', __( 'Unable to generate SVG image size.', 'web-stories' ) );
		}

		return compact( 'width', 'height' );
	}

	/**
	 * Sanitize the SVG
	 *
	 * @since 1.3.0
	 *
	 * @param string $file File path.
	 *
	 * @return true|WP_Error
	 */
	protected function sanitize( $file ) {
		$dirty     = $this->get_svg_data( $file );
		$sanitizer = new Sanitizer();
		$clean     = $sanitizer->sanitize( $dirty );

		if ( empty( $clean ) ) {
			return new WP_Error( 'invalid_xml_svg', __( 'Invalid xml in SVG.', 'web-stories' ) );
		}

		$errors = $sanitizer->getXmlIssues();
		if ( count( $errors ) > 1 ) {
			return new WP_Error( 'insecure_svg_file', __( "Sorry, this file couldn't be sanitized so for security reasons wasn't uploaded.", 'web-stories' ) );
		}

		return true;
	}

	/**
	 * Work around for incorrect mime type.
	 *
	 * @since 1.3.0
	 *
	 * @param array       $wp_check_filetype_and_ext {
	 *                                               Values for the extension, mime type, and corrected filename.
	 *
	 * @type string|false $ext                       File extension, or false if the file doesn't match a mime type.
	 * @type string|false $type                      File mime type, or false if the file doesn't match a mime type.
	 * @type string|false $proper_filename           File name with its correct extension, or false if it cannot be
	 *       determined.
	 * }
	 *
	 * @param string      $file                      Full path to the file.
	 * @param string      $filename                  The name of the file (may differ from $file due to
	 *                                               $file being in a tmp directory).
	 * @param string[]    $mimes                     Array of mime types keyed by their file extension regex.
	 * @param string|bool $real_mime                 The actual mime type or false if the type cannot be determined.
	 *
	 * @return array
	 */
	public function wp_check_filetype_and_ext( $wp_check_filetype_and_ext, $file, $filename, $mimes, $real_mime ) {
		if ( 'image/svg' === $real_mime ) {
			$wp_check_filetype_and_ext = [
				'ext'             => self::EXT,
				'type'            => self::MIME_TYPE,
				'proper_filename' => false,
			];
		}

		return $wp_check_filetype_and_ext;
	}

	/**
	 * Get xml document.
	 *
	 * @since 1.3.0
	 *
	 * @param string $svg String of xml.
	 *
	 * @return DOMElement|false
	 */
	protected function get_xml( $svg ) {
		$dom                      = new DOMDocument();
		$dom->preserveWhiteSpace  = false;
		$dom->strictErrorChecking = false;

		$errors = libxml_use_internal_errors( true );
		$loaded = $dom->loadXML( $svg );
		if ( ! $loaded ) {
			return false;
		}

		$node = $dom->getElementsByTagName( 'svg' )->item( 0 );

		libxml_clear_errors();
		libxml_use_internal_errors( $errors );

		if ( ! $node ) {
			return false;
		}

		return $node;
	}

	/**
	 * Get SVG data.
	 *
	 * @since 1.3.0
	 *
	 * @param string $file File path.
	 *
	 * @return string File contents.
	 */
	protected function get_svg_data( $file ) {
		$key = md5( $file );
		if ( ! isset( $this->svgs[ $key ] ) ) {
			if ( is_readable( $file ) ) {
				$this->svgs[ $key ] = (string) file_get_contents( $file ); // phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown
			} else {
				$this->svgs[ $key ] = '';
			}
		}

		return $this->svgs[ $key ];
	}
}
