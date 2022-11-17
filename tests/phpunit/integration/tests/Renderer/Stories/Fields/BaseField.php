<?php
/**
 * BaseField Class.
 */

namespace Google\Web_Stories\Tests\Integration\Renderer\Stories\Fields;

use Google\Web_Stories\Renderer\Stories\Fields\BaseField as Testee;
use Google\Web_Stories\Tests\Integration\TestCase;

/**
 * Class BaseField.
 *
 * @coversDefaultClass \Google\Web_Stories\Renderer\Stories\Fields\BaseField
 */
class BaseField extends TestCase {

	/**
	 * Object of class in test.
	 */
	private static Testee $testee;

	/**
	 * Runs before any test in class is executed.
	 */
	public static function wpSetUpBeforeClass(): void {
		self::$testee = new Testee(
			[
				'label'  => 'Test Label',
				'hidden' => true,
			]
		);
	}

	/**
	 * @covers ::label
	 */
	public function test_label(): void {
		$this->assertSame( 'Test Label', self::$testee->label() );
	}

	/**
	 * @covers ::hidden
	 */
	public function test_hidden(): void {
		$this->assertTrue( self::$testee->hidden() );
	}

	/**
	 * @covers ::show
	 */
	public function test_show(): void {
		$this->assertTrue( self::$testee->show() );
	}
}

