const functions = require('firebase-functions');
const admin = require('firebase-admin');
const semver = require('semver');

admin.initializeApp();

const BUCKET_NAME = 'web-stories-wp-plugin-assets';

// TODO: Handle thumbnails.
exports.handleCdnRequests = functions.https.onRequest(async (req, res) => {
  // "/static/1.1.0-beta.2+1234567/images/path/to/image.png" => "1.1.0-beta.2+1234567", "images/path/to/image.png".
  const [,requestedPluginVersion, fileName] = req.path.match(/staticnew\/([^/]+)\/(.*)/);

  const version = semver.parse(requestedPluginVersion, {loose: true});

  if (!version) {
    return res.status(404).send();
  }

  version.build = '';
  version.prerelease = '';

  const versionsToTry = [ version.format() ];

  while ( version.patch > 0 ) {
    version.patch -= 1;
    versionsToTry.push(version.format());
  }

  while ( version.minor > 0 ) {
    version.minor -= 1;
    versionsToTry.push(version.format());
  }

  versionsToTry.push('main');

  const bucket = admin.storage().bucket(BUCKET_NAME);

  // Fall through: 1.1.1-beta.2+1234567 -> 1.1.1 -> 1.1.0 -> 1.0.0 -> main
  for ( const version of versionsToTry ) {
    const fileNameToTry = `${version}/${fileName}`;
    try {
      const file = bucket.file( fileNameToTry );
      // TODO: no-await-in-loop
      //eslint-disable-next-line no-await-in-loop
      if ( (await file.exists())[0] ) {
        const stream = file.createReadStream();
        return stream.pipe( res );
      }
    } catch(err) {
      // TODO: Logging?
    }
  }

  return res.status(404).send();
});
