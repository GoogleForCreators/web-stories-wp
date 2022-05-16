#!/usr/bin/env bash

# Exit if any command fails.
set -e

# Common variables.
WP_DEBUG=${WP_DEBUG-true}
SCRIPT_DEBUG=${SCRIPT_DEBUG-true}
WEBSTORIES_DEV_MODE=${WEBSTORIES_DEV_MODE-true}
MEDIA_TRASH=${MEDIA_TRASH-false}
WP_VERSION=${WP_VERSION-"latest"}

# Include useful functions
. "$(dirname "$0")/includes.sh"

# Make sure Docker containers are running
dc up -d >/dev/null 2>&1

# Get the host port for the WordPress container.
HOST_PORT=$(dc port $CONTAINER 80 | awk -F : '{printf $2}')

# Wait until the WordPress site is responding to requests.
echo -en $(status_message "Attempting to connect to WordPress...")
until $(curl -L http://localhost:$HOST_PORT -so - 2>&1 | grep -q "WordPress"); do
	echo -n '.'
	sleep 5
done
echo ''

# Wait until the database container is ready.
echo -en $(status_message "Waiting for database connection...")
until $(container bash -c "echo -n > /dev/tcp/mysql/3306" >/dev/null 2>&1); do
    echo -n '.'
    sleep 5
done
echo ''

# Create the database if it doesn't exist.
echo -e $(status_message "Creating the database (if it does not exist)...")
mysql -e 'CREATE DATABASE IF NOT EXISTS wordpress;'

# If this is the test site, we reset the database so no posts/comments/etc.
# dirty up the tests.
if [ "$1" == '--reset-site' ]; then
	echo -e $(status_message "Resetting test database...")
	wp db reset --yes --quiet
fi

if [ ! -z "$WP_VERSION" ] && [ "$WP_VERSION" != "latest" ]; then
	# Potentially downgrade WordPress
	echo -e $(status_message "Downloading WordPress version $WP_VERSION...")
	wp core download --version=${WP_VERSION} --force --quiet
fi

# Install WordPress.
echo -e $(status_message "Installing WordPress...")
wp core install --title="$SITE_TITLE" --admin_user=admin --admin_password=password --admin_email=test@test.com --skip-email --url=http://localhost:$HOST_PORT --quiet

if [ "$WP_VERSION" == "latest" ]; then
	# Potentially update WordPress
	echo -e $(status_message "Updating WordPress")
	wp core update --force --quiet
fi

# Create additional users.
echo -e $(status_message "Creating additional users...")

if [[ $(wp user get editor --field=login 2>&1) != "editor" ]]; then
	wp user create editor editor@example.com --role=editor --user_pass=password
	echo -e $(status_message "Editor created! Username: editor Password: password")
else
 echo -e $(status_message "Editor already exists, skipping...")
fi

if [[ $(wp user get author --field=login 2>&1) != "author" ]]; then
	wp user create author author@example.com --role=author --user_pass=password --quiet
	echo -e $(status_message "Author created! Username: author Password: password")
else
 echo -e $(status_message "Author already exists, skipping...")
fi
if [[ $(wp user get contributor --field=login 2>&1) != "contributor" ]]; then
	wp user create contributor contributor@example.com --role=contributor --user_pass=password --quiet
	echo -e $(status_message "Contributor created! Username: contributor Password: password")
else
 echo -e $(status_message "Contributor already exists, skipping...")
fi
if [[ $(wp user get subscriber --field=login 2>&1) != "subscriber" ]]; then
	wp user create subscriber subscriber@example.com --role=subscriber --user_pass=password --quiet
	echo -e $(status_message "Subscriber created! Username: subscriber Password: password")
else
 echo -e $(status_message "Subscriber already exists, skipping...")
fi

# Make sure the uploads and upgrade folders exist and we have permissions to add files.
echo -e $(status_message "Ensuring that files can be uploaded...")
container mkdir -p \
	/var/www/html/wp-content/uploads \
	/var/www/html/wp-content/upgrade
container chmod 767 \
	/var/www/html/wp-content \
	/var/www/html/wp-content/plugins \
	/var/www/html/wp-config.php \
	/var/www/html/wp-settings.php \
	/var/www/html/wp-content/uploads \
	/var/www/html/wp-content/upgrade


CURRENT_WP_VERSION=$(wp core version | tr -d '\r')
echo -e $(status_message "Current WordPress version: $CURRENT_WP_VERSION...")

if [ "$WP_VERSION" == "latest" ]; then
	# Check for WordPress updates, to make sure we're running the very latest version.
	echo -e $(status_message "Updating WordPress to the latest version...")
	wp core update --quiet
	echo -e $(status_message "Updating The WordPress Database...")
	wp core update-db --quiet
fi

# If the 'wordpress' volume wasn't during the down/up earlier, but the post port has changed, we need to update it.
echo -e $(status_message "Checking the site's url...")
CURRENT_URL=$(wp option get siteurl)
if [ "$CURRENT_URL" != "http://localhost:$HOST_PORT" ]; then
	wp option update home "http://localhost:$HOST_PORT" --quiet
	wp option update siteurl "http://localhost:$HOST_PORT" --quiet
fi

# Activate Web Stories plugin.
echo -e $(status_message "Activating Web Stories plugin...")
wp plugin activate web-stories --quiet

# Install & activate testing plugins.

# Only install gutenberg on latest version of WordPress.
if [ "$WP_VERSION" == "latest" ]; then
  echo -e $(status_message "Installing Gutenberg plugin...")
  wp plugin install gutenberg --force --quiet
fi

echo -e $(status_message "Installing and activating RTL Tester plugin...")
wp plugin install rtl-tester --activate --force --quiet

echo -e $(status_message "Installing WordPress importer...")
wp plugin install wordpress-importer --activate --force --quiet

# Only install woocommerce on latest version of WordPress.
if [ "$WP_VERSION" == "latest" ] || [ "$WP_VERSION" == "6.0-RC2" ]; then
	echo -e $(status_message "Installing WooCommerce plugin...")
	wp plugin install woocommerce --activate --force --quiet
fi

echo -e $(status_message "Installing AMP plugin...")
wp plugin install amp --force --quiet

echo -e $(status_message "Installing Classic editor plugin...")
wp plugin install classic-editor --force --quiet

echo -e $(status_message "Installing Classic Widgets plugin...")
wp plugin install classic-widgets --force --quiet

echo -e $(status_message "Activating Twenty Twenty theme...")
wp theme activate twentytwenty --quiet

# Set pretty permalinks.
echo -e $(status_message "Setting permalink structure...")
wp rewrite structure '%postname%' --hard --quiet

# Configure site constants.
echo -e $(status_message "Configuring site constants...")
WP_DEBUG_CURRENT=$(wp config get --type=constant --format=json WP_DEBUG | tr -d '\r')

if [[ "$WP_DEBUG" != $WP_DEBUG_CURRENT ]]; then
	wp config set WP_DEBUG $WP_DEBUG --raw --type=constant --quiet --anchor="That's all, stop editing"
	WP_DEBUG_RESULT=$(wp config get --type=constant --format=json WP_DEBUG | tr -d '\r')
	echo -e $(status_message "WP_DEBUG: $WP_DEBUG_RESULT...")
fi

SCRIPT_DEBUG_CURRENT=$(wp config get --type=constant --format=json SCRIPT_DEBUG | tr -d '\r')
if [[ "$SCRIPT_DEBUG" != $SCRIPT_DEBUG_CURRENT ]]; then
	wp config set SCRIPT_DEBUG $SCRIPT_DEBUG --raw --type=constant --quiet --anchor="That's all, stop editing"
	SCRIPT_DEBUG_RESULT=$(wp config get --type=constant --format=json SCRIPT_DEBUG | tr -d '\r')
	echo -e $(status_message "SCRIPT_DEBUG: $SCRIPT_DEBUG_RESULT...")
fi

WEBSTORIES_DEV_MODE_CURRENT=!$WEBSTORIES_DEV_MODE;
if [[ "$(wp config has --type=constant WEBSTORIES_DEV_MODE)" ]]; then
  WEBSTORIES_DEV_MODE_CURRENT=$(wp config get --type=constant --format=json WEBSTORIES_DEV_MODE | tr -d '\r')
fi

if [[ "$WEBSTORIES_DEV_MODE" != $WEBSTORIES_DEV_MODE_CURRENT ]]; then
  wp config set WEBSTORIES_DEV_MODE $WEBSTORIES_DEV_MODE --raw --type=constant --quiet --anchor="That's all, stop editing"
  WEBSTORIES_DEV_MODE_RESULT=$(wp config get --type=constant --format=json WEBSTORIES_DEV_MODE | tr -d '\r')
  echo -e $(status_message "WEBSTORIES_DEV_MODE: $WEBSTORIES_DEV_MODE_RESULT...")
fi

MEDIA_TRASH_CURRENT=!MEDIA_TRASH;
if [[ "$(wp config has --type=constant MEDIA_TRASH)" ]]; then
  $MEDIA_TRASH_CURRENT=$(wp config get --type=constant --format=json MEDIA_TRASH | tr -d '\r')
fi

if [[ "$MEDIA_TRASH" != $MEDIA_TRASH_CURRENT ]]; then
  wp config set MEDIA_TRASH $MEDIA_TRASH --raw --type=constant --quiet --anchor="That's all, stop editing"
  MEDIA_TRASH_RESULT=$(wp config get --type=constant --format=json MEDIA_TRASH | tr -d '\r')
  echo -e $(status_message "MEDIA_TRASH: $MEDIA_TRASH_RESULT...")
fi

# Let's make sure we have some media in the media library to work with.
echo -e $(status_message "Import default set of media assets...")
# TODO: use glob pattern to import items. See https://developer.wordpress.org/cli/commands/media/import/.

WEBM_VIDEO_ID=$(wp media import /var/www/html/wp-content/e2e-assets/small-video.webm --porcelain)
WEBM_VIDEO_POSTER_ID=$(wp media import /var/www/html/wp-content/e2e-assets/small-video-poster.jpg --post_id=$WEBM_VIDEO_ID --featured_image --porcelain)

# So the poster is marked as such and hidden in the editor.
wp post term add $WEBM_VIDEO_POSTER_ID web_story_media_source "poster-generation" --quiet
wp post meta add $WEBM_VIDEO_ID web_stories_poster_id $WEBM_VIDEO_POSTER_ID --quiet

wp media import /var/www/html/wp-content/e2e-assets/example-1.jpg --quiet
wp media import /var/www/html/wp-content/e2e-assets/example-2.jpg --quiet
wp media import /var/www/html/wp-content/e2e-assets/example-3.png --quiet

# Ensures that the patch command below always works.
wp option update web_stories_experiments '{}' --format=json

wp option patch insert web_stories_experiments enableSVG 1
wp media import /var/www/html/wp-content/e2e-assets/video-play.svg
wp option patch insert web_stories_experiments enableSVG 0

wp user list --format=yaml
wp post list --post_type=attachment --format=yaml
wp plugin list --format=yaml

# Only install woocommerce on latest version of WordPress.
if [ "$WP_VERSION" == "latest" ] || [ "$WP_VERSION" == "6.0-RC2" ]; then
	echo -e $(status_message "Import sample woocommerce products...")
	wp import /var/www/html/wp-content/plugins/woocommerce/sample-data/sample_products.xml --authors=skip --quiet
	# deactivate test etc... can activate as needed
	wp plugin deactivate woocommerce
fi
