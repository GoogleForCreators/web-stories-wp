<?php


namespace Google\Web_Stories\Tests;

use Google\Web_Stories\KSES;

trait KsesSetup {
	public $kses;

	protected function kses_int() {
		$this->kses = new KSES();
		$this->kses->init();
	}

	protected function kses_remove_filters() {
		if ( ! current_user_can( 'unfiltered_html' ) ) {
			remove_filter( 'safe_style_css', [ $this->kses, 'filter_safe_style_css' ] );
			remove_filter( 'wp_kses_allowed_html', [ $this->kses, 'filter_kses_allowed_html' ], 10 );
			remove_filter( 'content_save_pre', [ $this->kseshis, 'filter_content_save_pre_before_kses' ], 0 );
			remove_filter( 'content_save_pre', [ $this->kses, 'filter_content_save_pre_after_kses' ], 20 );
		}
		kses_init();
	}
}
