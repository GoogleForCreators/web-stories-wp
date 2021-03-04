<?php
/**
 * BaseField Class.
 *
 * @package Google\Web_Stories
 */

namespace Google\Web_Stories\Tests\Stories_Renderer\Fields;

use PHPUnit\Framework\TestCase;
use Google\Web_Stories\Stories_Renderer\Fields\BaseField as Testee;

/**
 * Class BaseField.
 *
 * @package Google\Web_Stories\Tests\Stories_Renderer\Fields
 *
 * @coversDefaultClass \Google\Web_Stories\Stories_Renderer\Fields\BaseField
 */
class BaseField extends \WP_UnitTestCase_Base {

	/**
	 * Object of class in test.
	 *
	 * @var Testee
	 */
	private static $testee;

	/**
	 * Runs before any test in class is executed.
	 */
	public static function wpSetUpBeforeClass() {
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
	public function test_label() {
		$this->assertSame( 'Test Label', self::$testee->label() );
	}

	/**
	 * @covers ::hidden
	 */
	public function test_hidden() {
		$this->assertTrue( self::$testee->hidden() );
	}

	/**
	 * @covers ::show
	 */
	public function test_show() {
		$this->assertTrue( self::$testee->show() );
	}
}

