<?php

/**
 * @return bool
 */
function is_amp_endpoint() {
}

class Document extends \DOMDocument {
	/**
	 * @var DOMXPath
	 */
	protected $xpath;

	/**
	 * @var DOMElement
	 */
	protected $html;

	/**
	 * @var DOMElement
	 */
	protected $head;

	/**
	 * @var DOMElement
	 */
	protected $body;

	/**
	 * @var DOMNodeList
	 */
	protected $ampElements;
}

class AMP_Base_Sanitizer {
	/**
	 * @var Document
	 */
	protected $dom;

	/**
	 * @var array
	 */
	protected $args;
}
