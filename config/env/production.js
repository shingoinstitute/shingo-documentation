/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  models: {
    connection: 'someMysqlServer'
  },

  /***************************************************************************
   * Set the port in the production environment to 80                        *
   ***************************************************************************/

  port: 80,

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

  log: {
    level: "info"
  },

  /***************************************************************************
   * Set the timeout for the grunt hook higher for use on DO                 *
   ***************************************************************************/

  grunt: {
    _hookTimeout: 100000
  },

  /***************************************************************************
   * Set up the session store to use                                         *
   **************************************************************************/

  session: {
    adapter: 'redis'
  },


  /***************************************************************************
   * For use when application is not behind a proxy                          *
   ***************************************************************************/

/*  ssl: {
    ca: require('fs').readFileSync('/etc/ssl/certs/ca-certificates.crt'),
    key: require('fs').readFileSync('/etc/ssl/private/server.key'),
    cert: require('fs').readFileSync('/etc/ssl/certs/server.crt')
  }
*/
};
