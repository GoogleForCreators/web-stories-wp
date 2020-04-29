<?php
/**
 * The story editor.
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

// don't load directly.
if ( ! defined( 'ABSPATH' ) ) {
	die( '-1' );
}

require_once ABSPATH . 'wp-admin/admin-header.php';

?>

<div id="edit-story">
	<h1 class="loading-message"><?php esc_html_e( 'Please wait...', 'web-stories' ); ?></h1>
</div>

<script>
(function() {
    var script = document.createElement('script');
    script.onload = function() {
        var stats = new Stats();
        var node = document.body.appendChild(stats.dom)
        node.style.zIndex = 2147483647;
        node.style.left = 'calc(50% + 109px)';
        requestAnimationFrame(function loop() {
            stats.update();
            requestAnimationFrame(loop)
        });
    };
    script.src = '//mrdoob.github.io/stats.js/build/stats.min.js';
    document.head.appendChild(script);
})();

(function() {
    var script = document.createElement('script');
    script.onload = function() {
        var meter = new FPSMeter(document.body, { left: '80px', top: 0, left: '50%', heat: 1, graph: 1, theme: 'colorful', zIndex: 2147483647 });
        requestAnimationFrame(function loop() {
            meter.tick();
            requestAnimationFrame(loop)
        });
    };
    script.src = '//cdnjs.cloudflare.com/ajax/libs/fpsmeter/0.3.1/fpsmeter.min.js';
    document.head.appendChild(script);
})();
</script>
