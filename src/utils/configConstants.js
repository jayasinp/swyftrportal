/**
 * This file loads and exports frequently used configuration constants for ease of reference
 */

import FileUtils from './fileUtils';
import * as serverConfigs from './serverConfigs';

let platformConfig = FileUtils.loadConfigs(serverConfigs.CONFIGS.PLATFORM),
    loggerConfig = FileUtils.loadConfigs(serverConfigs.CONFIGS.LOGGER);

// Constants from Platform config
export const HTTPS_PORT = process.env.PORT || platformConfig[serverConfigs.HTTPS_PORT];
export const SSL_CONFIG = platformConfig[serverConfigs.SSL_CONFIG];
export const EXTERNAL_API_TIMEOUT = platformConfig[serverConfigs.EXTERNAL_API_TIMEOUT];
export const SOURCE_MAPS_SUPPORT = platformConfig[serverConfigs.SOURCE_MAPS_SUPPORT];

// logger
export const LOGGER_CONFIG = loggerConfig[platformConfig[serverConfigs.LOGGER_CONFIG]];
