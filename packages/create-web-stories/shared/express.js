/**
 * External dependencies.
 */
const express = require( 'express' );

const app = express();
const SOURCE_DIR = 'dist';
const PORT = process.env.PORT || 8080;

app.use( express.static( SOURCE_DIR ) );

app.get( '/editor', ( req, res ) => {
  res.sendFile( __dirname + '/' + SOURCE_DIR + '/index.html' );
} );

app.get( '/preview', ( req, res ) => {
  res.sendFile( __dirname + '/' + SOURCE_DIR + '/index.html' );
} );

app.listen( PORT, () => {
  console.log( `Web Server started at: http://localhost:${ PORT }` );
} );
