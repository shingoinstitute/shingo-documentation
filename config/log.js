/**
 * Built-in Log Configuration
 * (sails.config.log)
 *
 * Configure the log level for your app, as well as the transport
 * (Underneath the covers, Sails uses Winston for logging, which
 * allows for some pretty neat custom transports/adapters for log messages)
 *
 * For more information on the Sails logger, check out:
 * http://sailsjs.org/#!/documentation/concepts/Logging
 */

var winston = require('winston');
var path = require('path');

/**
 * A wrapper for the winston logger
 * @param log_level :: { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }. If empty the env var LOG_LEVEL will be checked. Defaults to debug.
 * @param log_file :: The path to a general log file. If empty the env var LOG_FILE will be checked. Defaults to 'logs/info.log' (requires logs dir to exist).
 * @param log_error_file :: Similar to log_file execpt it only logs errors.
 * @member logger :: the actual logger to use. Reference https://github.com/winstonjs/winston#instantiating-your-own-logger.
 */
function Logger(log_level, log_path, log_file){
    this.log_level = log_level || process.env.LOG_LEVEL || 'debug';
    this.log_path = log_path || process.env.LOG_PATH || 'logs';
    this.log_file = log_file || process.env.LOG_FILE || 'documentation.log';

    this.logger = new (winston.Logger)({
        level: this.log_level,
        levels: winston.config.npm.levels,
        colors: winston.config.npm.colors,
        transports: [
            new (winston.transports.Console)({
                colorize: true,
                prettyPrint: true,
                timestamp: true
            }),
            new (winston.transports.File)({ 
                name: 'info-log',
                filename: path.normalize(path.join(this.log_path, this.log_file)),
                level: this.log_level,
                prettyPrint: false,
                timestamp: true,
                tailable: true,
                json: true
            })
        ],
        exitOnError: false
    });
}

var customLogger = new Logger();

module.exports.log = {

  /***************************************************************************
  *                                                                          *
  * Valid `level` configs: i.e. the minimum log level to capture with        *
  * sails.log.*()                                                            *
  *                                                                          *
  * The order of precedence for log levels from lowest to highest is:        *
  * silly, verbose, info, debug, warn, error                                 *
  *                                                                          *
  * You may also set the level to "silent" to suppress all logs.             *
  *                                                                          *
  ***************************************************************************/
 
 custom: customLogger.logger,
 level: 'info',

 // Disable Sails' Captain's Log
 inspect: false

};
