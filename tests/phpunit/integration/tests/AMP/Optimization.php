<?php
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

namespace Google\Web_Stories\Tests\Integration\AMP;

use Google\Web_Stories\Tests\Integration\TestCase;
use Google\Web_Stories_Dependencies\AmpProject\Dom\Document;
use Google\Web_Stories_Dependencies\AmpProject\Optimizer\Configuration;
use Google\Web_Stories_Dependencies\AmpProject\Optimizer\Transformer\AmpBoilerplate;
use Google\Web_Stories_Dependencies\AmpProject\Optimizer\Transformer\AmpBoilerplateErrorHandler;
use Google\Web_Stories_Dependencies\AmpProject\Optimizer\Transformer\AmpRuntimePreloads;
use Google\Web_Stories_Dependencies\AmpProject\Optimizer\Transformer\AmpStoryCssOptimizer;
use Google\Web_Stories_Dependencies\AmpProject\Optimizer\Transformer\GoogleFontsPreconnect;
use Google\Web_Stories_Dependencies\AmpProject\Optimizer\Transformer\MinifyHtml;
use Google\Web_Stories_Dependencies\AmpProject\Optimizer\Transformer\OptimizeViewport;
use Google\Web_Stories_Dependencies\AmpProject\Optimizer\Transformer\ReorderHead;

/**
 * @coversDefaultClass \Google\Web_Stories\AMP\Optimization
 */
class Optimization extends TestCase {
	/**
	 * @covers ::optimize_document
	 * @covers ::get_optimizer
	 */
	public function test_optimize_document(): void {
		ob_start();
		?>
		<html amp lang="en">
		<head>
			<meta charset="utf-8">
			<script async src="https://cdn.ampproject.org/v0.js"></script>
			<script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"></script>
			<title>My Story</title>
			<meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
			<link rel="canonical" href="helloworld.html">
			<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		</head>
		<body>
		<amp-story standalone="" publisher="Web Stories" title="Example Story" publisher-logo-src="https://example.com/image.png" poster-portrait-src="https://example.com/image.png">
			<amp-story-page id="foo">
				<amp-story-grid-layer template="fill">
				</amp-story-grid-layer>
			</amp-story-page>
		</amp-story>
		</body>
		</html>

		<?php
		$original_html = ob_get_clean();

		$document = Document::fromHtml( $original_html );

		$optimization = new \Google\Web_Stories\AMP\Optimization();
		$optimization->optimize_document( $document );

		$actual = $document->saveHTML();

		$this->assertStringContainsString( 'transformed="self;v=1', $actual );
		$this->assertStringNotContainsString( 'Cannot remove boilerplate because of an unsupported layout: amp-story', $actual );
	}

	/**
	 * @covers ::get_optimizer_configuration
	 */
	public function test_get_optimizer_configuration(): void {
		$optimization  = new \Google\Web_Stories\AMP\Optimization();
		$configuration = $this->call_private_method( $optimization, 'get_optimizer_configuration' );
		$config_array  = $this->get_private_property( $configuration, 'configuration' );

		$transformers   = Configuration::DEFAULT_TRANSFORMERS;
		$transformers[] = AmpStoryCssOptimizer::class;

		$this->assertCount( 3, $config_array );
		$this->assertArrayHasKey( 'transformers', $config_array );
		$this->assertEqualSets( $transformers, $config_array['transformers'] );
	}

	/**
	 * @covers ::get_optimizer_configuration
	 */
	public function test_get_optimizer_configuration_no_ssr(): void {
		add_filter( 'web_stories_enable_ssr', '__return_false' );
		$optimization  = new \Google\Web_Stories\AMP\Optimization();
		$configuration = $this->call_private_method( $optimization, 'get_optimizer_configuration' );
		$config_array  = $this->get_private_property( $configuration, 'configuration' );
		remove_filter( 'web_stories_enable_ssr', '__return_false' );

		$transformers = [
			AmpBoilerplate::class,
			AmpRuntimePreloads::class,
			AmpBoilerplateErrorHandler::class,
			GoogleFontsPreconnect::class,
			MinifyHtml::class,
			OptimizeViewport::class,
			ReorderHead::class,
		];

		$this->assertCount( 3, $config_array );
		$this->assertArrayHasKey( 'transformers', $config_array );
		$this->assertEqualSets( $transformers, $config_array['transformers'] );
	}
}
