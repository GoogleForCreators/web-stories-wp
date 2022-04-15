<?php
namespace Google\Web_Stories\Tests\Integration;

use Helmich\JsonAssert\JsonAssertions;
use PHPUnit\Framework\TestCase;

class Shopping extends TestCase
{
  use JsonAssertions;

  public function testJsonDocumentIsValid()
  {
    $jsonDocument = [
      'id'          => 1000,
      'username'    => 'mhelmich',
      'given_name'  => 'Martin',
      'family_name' => 'Helmich',
      'age'         => 27,
      'hobbies'     => [
        "Heavy Metal",
        "Science Fiction",
        "Open Source Software"
      ]
    ];

    $this->assertJsonValueEquals($jsonDocument, '$.username', 'mhelmich1');
    $this->assertJsonValueEquals($jsonDocument, '$.hobbies[*]', 'Open Source Software');
  }
}