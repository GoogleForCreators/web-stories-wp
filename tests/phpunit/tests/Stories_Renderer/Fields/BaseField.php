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
				'label'    => 'Test Label',
				'readonly' => true,
			]
		);
	}

	/**
	 * @covers ::__construct
	 */
	public function test_instance() {
		$this->assertInstanceOf( Testee::class, self::$testee );
	}

	/**
	 * @covers ::label
	 */
	public function test_label() {
		$this->assertSame( 'Test Label', self::$testee->label() );
	}

	/**
	 * @covers ::readonly
	 */
	public function test_readonly() {
		$this->assertSame( true, self::$testee->readonly() );
	}

	/**
	 * @covers ::show
	 */
	public function test_show() {
		$this->assertSame( true, self::$testee->show() );
	}
}

