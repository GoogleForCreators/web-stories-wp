# Web Stories Embeds

Theme developers can add varying degrees of support for Web Stories based on their requirements since version 1.5.

## Basic Integration

This basic integration guide will walk you through the simplest integration steps with which you can integrate web stories in your theme within 5 minutes and a couple of lines of code.

Web Stories provides a customizer settings panel named Web Stories Options to accept admin user’s choices.

### Add Theme Support for Web Stories

This is the mandatory step to integrate web stories into the theme. Theme developers need to add theme support for the web stories in their theme.

Add the following line of code to the theme’s functions.php file.

```php
add_theme_support( 'web-stories' );
```

This is the minimal code which is required to get the "Web Stories" visible in the customizer settings panel. This will work with the default settings options provided by the plugin which can be changed.

![Customizer Web Story Options](https://user-images.githubusercontent.com/6906779/112966823-3793ee00-9168-11eb-850f-aee953814217.png)


### Display Stories in Theme

Based on the customizer settings provided by a site admin, a theme can display stories in appropriate place with the following code:

```php
<?php
if( function_exists( '\Google\Web_Stories\render_theme_stories' ) ) {
   \Google\Web_Stories\render_theme_stories();
}
?>
```

## Advance Integration

### Configuring Customizer Web Story options

You can override the default options by passing/overriding the arguments while adding theme support. Below is a list of all options with their defaults values.

```php
add_theme_support('web-stories',
      [
          'customizer' => [
              'view_type'       => [
                  'enabled' => [ 'circles' ], // possible values — circles, grid, carousel, list
                  'default' => 'circles',
              ],
              'title'             => [
                  'enabled' => true,
                  'default' => true,
              ],
              'excerpt'           => [
                  'enabled' => true,
                  'default' => false,
              ],
              'author'            => [
                  'enabled' => true,
                  'default' => true,
              ],
              'date'              => [
                  'enabled' => false,
                  'default' => true,
              ],
              'archive_link'      => [
                  'enabled' => true,
                  'default' => true,
                  'label'   => __( 'View all stories', 'web-stories' ),
              ],
              'sharp_corners'     => [
                  'enabled' => false,
                  'default' => false,
              ],
              'order'             => [
                  'default' => 'DESC', // asc
              ],
              'orderby'           => [
                  'default' => 'post_date', // post_title
              ],
              'circle_size'       => [
                  'default' => 150, // 80 to 200
              ],
              'number_of_stories' => [
                  'default' => 10,
              ],
              'number_of_columns' => [
                  'default' => 2,
              ],
              'image_alignment'   => [
                  'default' => is_rtl() ? 'right' : 'left',
              ],
          ],
      ]
);
```

### Displaying Stories

#### Display stories based on customizer settings

As with basic integration, you can use the following template tag for displaying stories based on Customizer settings.

```php
<?php
if( function_exists( '\Google\Web_Stories\render_theme_stories' ) ) {
   \Google\Web_Stories\render_theme_stories();
}
?>
```

#### Template Tag

If you want to display web stories anywhere in your theme, unrelated to customizer Web Story Option settings, you can use the following template tag. It will display 10 stories in grid format:

```php
<?php
if ( function_exists( '\Google\Web_Stories\render_stories' ) ) {
    $attrs = [
		'view_type'          => 'grid', // possible values — circles, grid, carousel, list
		'number_of_columns'  => 2,
		'show_title'         => false,
		'show_author'        => false,
		'show_date'          => false,
		'show_excerpt'       => false,
		'show_archive_link'  => false,
		'sharp_corners'      => false,
		'archive_link_label' => __( 'View all stories', 'web-stories' ),
		'class'              => 'mythemecls',
    ];

    $args = [
		'posts_per_page'   => 10,
		'post_status'      => 'publish',
		'suppress_filters' => false,
		'no_found_rows'    => true,
    ];

    \Google\Web_Stories\render_stories( $attrs, $args );
}
?>
```

## Writing your own renderer classes

Renderers are the concrete implementations of Renderer Interface. Renderer classes must implement an interface defined at the [Renderer Interface](https://github.com/google/web-stories-wp/blob/main/includes/Interfaces/Renderer.php).

Renderer classes are primarily responsible for Rendering Stories. Generally rendering decisions are taken based on the view type.

Web Stories plugin have two concrete implementations of Renderer:

* **Generic Renderer** - Used for all view types, but Carousel and Circles views.
* **Carousel Renderer** - Used for displaying stories in Carousel and Circles view mode.

Both of these classes extend the Renderer class which implements Renderer interface and takes care of some common operations for those concrete implementations to avoid code repetition.

### **Renderer Interface and Methods**

Renderer Interface is already depicted in the above section. Following is the description of methods:

1. **init**
This is used to perform any operations when the Renderer object is created. This method can be used to some essential properties, add hooks etc.

2. **render**
This method is used to render the stories and its markup.

3. **render_single_story_content**
This method should be used to return the markup of a single story. This is useful while we iterate over the list of stories to get the accumulative markup.


### Creating your own Renderer Classes

As mentioned in the previous section you can write your own Renderer classes to generate custom markup for stories.

Renderer classes need to implement Renderer interface.

Following is an example of a custom Renderer class.

```php
<?php

use Google\Web_Stories\Interfaces\Renderer;
use Google\Web_Stories\Story_Query;

/**
 * Class ExampleRenderer
 *
 * Custom Renderer implementation.
 */
class ExampleRenderer implements Renderer {

	/**
	 * Current Story in the loop.
	 *
	 * @var array Story data.
	 */
	private $current_story = null;

	/**
	 * Story posts.
	 *
	 * @var array An array of story posts.
	 */
	protected $stories = [];

	/**
	 * Constructor
	 *
	 * @param Story_Query $query Story_Query instance.
	 */
	public function __construct( Story_Query $query ) {
		$this->stories = $query->get_stories();
	}

	/**
	 * Initialization actions.
	 */
	public function init(): void {
		add_action( 'some_action', [ $this, 'some_callback' ] );
	}

	/**
	 * Return the stories markup as string which needs to be
	 * echoed further.
	 *
	 * @param array $args Rendering args like height, width etc.
	 *
	 * @return string
	 */
	public function render( array $args = array() ): string {
		ob_start();
		?>
		<div class="web-stories">
		<div class="web-stories__inner-wrapper">
			<ul class="web-stories-list">
				<?php
				if ( ! empty( $this->stories ) ) {
					foreach ( $this->stories as $story ) {
						$this->current_story = $story;
						$this->render_single_story_content();
					}
				}
				?>
			</ul>
		</div>
		</div>
		<?php
		return ob_get_clean();

	}

	/**
	 * Render single story markup inside the method itself.
	 *
	 * @return void
	 */
	public function render_single_story_content(): void {
		printf( '<li class="web-story">%s</li>', esc_html( $this->current_story->post_title ) );
	}

}

```

Once the Renderer class is ready, you can use this Render to display stories as follows.

```php
$story_query_attrs = [ 'view' => 'circles' ];
$story_query_args  = [ 'posts_per_page' => 8 ];
$story_query       = new \Google\Web_Stories\Story_Query( $story_query_attrs, $story_query_args );

$renderer = new ExampleRenderer( $story_query );
echo $renderer->render();
```

## **CSS Guide**

Web Stories use minimal required HTML to render stories based on selected view type. This block has four view types in total, which are as follows:

* Generic View
    1. Grid View
    2. List View
* Carousel View
    1. Box Carousel
    2. Circles Carousel

As mentioned above, these four view types have further been divided into two types of renderers. Following are the general full structure of the rendered web stories for each renderer type. Some of these elements are conditional and will only render if dependent conditions are met, like the excerpt ( ‘.story-content-overlay__excerpt’ ) will only be shown for the list view type and if control to show the excerpt is set to true.

**Generic View:**

```html
<div class="web-stories-list">
  <div class="web-stories-list__inner-wrapper">
    <div class="web-stories-list__story">
      <div class="web-stories-list__story-poster">
        <!-- For non-AMP pages. -->
        <img />

        <!-- or -->

        <!-- For AMP pages. -->
        <amp-img></amp-img>
      </div>
      <div class="web-stories-list__story-content-overlay">
        <div class="story-content-overlay__title"></div>
        <div class="story-content-overlay__excerpt"></div>
        <div class="story-content-overlay__author"></div>
        <div class="story-content-overlay__date"></div>
      </div>
    </div>
    <div class="web-stories-list__archive-link"></div>
  </div>
</div>

<!-- one lightbox wrapper for each instance of web stories on the page, rendered on 'wp_footer' action. -->

<div class="web-stories-list__lightbox-wrapper"></div> <!-- For non-AMP pages. -->

<amp-lightbox></amp-lightbox> <!-- For AMP pages. -->
```

**Carousel View:**

```html
<div class="web-stories-list">
  <div class="web-stories-list__inner-wrapper">
    <div class="web-stories-list__carousel"> <!-- For AMP requests the carousel wrapper will be <amp-carousel> -->
      <div class="web-stories-list__story">
        <div class="web-stories-list__story-poster">
          <!-- For non-AMP pages. -->
          <img />

          <!-- or -->

          <!-- For AMP pages. -->
          <amp-img></amp-img>
        </div>
        <div class="web-stories-list__story-content-overlay">
          <div class="story-content-overlay__title"></div>
          <div class="story-content-overlay__author"></div>
          <div class="story-content-overlay__date"></div>
        </div>
      </div>
    </div>
    <div class="web-stories-list__archive-link"></div>
  </div>
</div>

<!-- one lightbox wrapper for each instance of web stories on the page, rendered on 'wp_footer' action. -->

<div class="web-stories-list__lightbox-wrapper"></div> <!-- For non-AMP pages. -->

<amp-lightbox></amp-lightbox> <!-- For AMP pages. -->
```

## Elements

### **Block root classes**

Following classes are present on the root element.

#### **.web-stories-list**

Default class added to the block’s main container.


#### **.align{$alignment_option}**

If the block has alignment set it will add this class with the one of the `[ ‘none’, ‘wide’, ‘full’, ‘left’, ‘center’, ‘right’ ]` values, i.e., if alignment is set to `wide` the class will be `alignwide`. Defaults to `alignnone`.

Also adds any extra classes passed to the renderer with a story attribute named ‘class’.


#### **.has-archive-link**

If the block is showing an archive link.


#### **View specific classes added to the root:**


##### **.is-view-type-{$view_type}**

$view_type will be one of the four view types i.e., for Circles Carousel the class name will be `is-view-type-circles`.


##### **.columns-{$column_number}**

$column_number will range from 1-4, i.e., if the block is set to have 2 columns the resulting class will be columns-2.


##### **.is-style-squared**

if showing sharp corners for the story elements.


##### **.is-style-default**

if showing curved corners for the story elements, default for the block.


##### **.has-title**

This class is added for the circles carousel view, if it is showing the story titles.


##### **.is-carousel**

Added for the Carousel view types.


### **Inner wrapper**


#### **.web-stories-list__inner-wrapper**

Added to the inner container which holds the story elements. For the generic view types, this will have story elements as direct children.

This element also adds CSS variables as inline styles based on the view type as mentioned here:

* `--ws-circle-size`: Circle size value when using the circle carousel.
* `--ws-story-max-width`: For the box carousel this adds the max-width for the story items.


### **Story element**

This element encompases the story elements like poster, title, author name etc.


#### **.web-stories-list__story**

Story element root.


#### **.image-align-right**

For list view show image on right.


### **Story poster**


#### **.web-stories-list__story-poster**

Story poster elements encapsulate either `<img />` or `<amp-img>` based on the type of request, whether it is AMP or non-AMP.


### **Story content overlay**


#### **.web-stories-list__story-content-overlay**

Content overlay container.


#### **.story-content-overlay__title**

Story title element.


#### **.story-content-overlay__excerpt**

Story excerpt.


#### **.story-content-overlay__author**

Story author name.


#### **.story-content-overlay__date**

Story publish date.


### **Story lightbox**

A story opens in a lightbox upon clicking it. This element contains the `<amp-story-player />` which embeds the story. There will be one lightbox wrapper per instance of Web Stories rendered on the page.

Lightbox renders a bit differently on AMP vs non-AMP pages. On non-AMP pages it uses a single lightbox container and renders all the stories as links in `<amp-story-player>`. This enables some of the extra features on non-AMP pages like skip through stories, auto-play next story.

While on AMP pages it uses one `<amp-lightbox>` component for each story in the block.


#### **.web-stories-list__lightbox-wrapper**

Lightbox wrapper will have an extra class to identify which instance it relates to. I.e., `ws-lightbox-{$i}` where `$i` is an integer, number of the instance.


#### **.web-stories-list__lightbox**

Main lightbox container.


#### **.story-lightbox__close-button**

Only present on AMP pages, this is the lightbox close button element.
