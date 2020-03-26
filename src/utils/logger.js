import * as bunyan from 'bunyan';
import bformat from 'bunyan-format';
import * as serverConfigs from './serverConfigs';
import FileUtils from './fileUtils';

let platformConfig = FileUtils.loadConfigs(serverConfigs.CONFIGS["PLATFORM"]),
  loggerConfig = FileUtils.loadConfigs(serverConfigs.CONFIGS["LOGGER"]),
  loggerEnv = platformConfig[serverConfigs.LOGGER_CONFIG],
  config = loggerConfig[loggerEnv],
  formatOut = bformat({outputMode: 'short'});

//Format the bunyan logger
config["streams"].push({
  "stream": formatOut
});

export default bunyan.createLogger(config);
