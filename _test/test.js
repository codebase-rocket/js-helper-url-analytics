// Info: Test Cases
'use strict';

// Shared Dependencies
var Lib = {};

// Set Configration for DynamoDB Library
const config_dynamodb = {
  KEY: 'todo',
  SECRET: 'todo',
  REGION: 'us-east-1'
};

// Set Configrations
const url_analytics_config = {
  DB_SOURCE: 'test_url_analytics',
};

// Set Configrations
const http_config = {
 'TIMEOUT': 10000, // In milliseconds (140 second). 0 means no timeout
 'USER_AGENT': 'Test App 1.0' // Not used by browser
};

// Dependencies
Lib.Utils = require('js-helper-utils');
Lib.Debug = require('js-helper-debug')(Lib);
Lib.Instance = require('js-helper-instance')(Lib);
Lib.NoDB = require('js-helper-aws-dynamodb')(Lib, config_dynamodb);

// This Module
const [UrlAnalytics, UrlAnalyticsInput, UrlAnalyticsData] = require('js-helper-url-analytics')(Lib, url_analytics_config);

////////////////////////////SIMILUTATIONS//////////////////////////////////////

function test_output_simple(err, response){ // Result are from previous function

  if(err){
    Lib.Debug.logErrorForResearch(err);
  }

  Lib.Debug.log('response', response);

};


function test_output2(err, response, response2){ // Result are from previous function

  if(err){
    Lib.Debug.logErrorForResearch(err);
  }

  Lib.Debug.log('response', response);
  Lib.Debug.log('response2', response2);

};

///////////////////////////////////////////////////////////////////////////////


/////////////////////////////STAGE SETUP///////////////////////////////////////

// Initialize 'instance'
var instance = Lib.Instance.initialize();
var domain = 'example';
var path = '/testing.in';

// USER-AGENT Data
var user_agent_data_mac = {
  device_type: null,
  device_model: null,
  os_name: 'Mac OS',
  os_version: '10.15.7',
  app_name: 'Chrome',
  app_version: '98.0.4758.109'
}
var user_agent_data_windows = {
  device_type: null,
  device_model: null,
  os_name: 'Windows',
  os_version: '10',
  app_name: 'Edge',
  app_version: '97.0.1072.55'
}
var user_agent_data_mobile = {
  device_type: 'mobile',
  device_model: 'Moto G (5S) Plus',
  os_name: 'Android',
  os_version: '8.1.0',
  app_name: 'Chrome',
  app_version: '97.0.4692.87'
}

// USER-AGENT String
var user_agent_string_mac = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.109 Safari/537.36";
var user_agent_string_windows = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36 Edg/97.0.1072.55";
var user_agent_string_mobile = "Mozilla/5.0 (Linux; Android 8.1.0; Moto G (5S) Plus) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.87 Mobile Safari/537.36";
///////////////////////////////////////////////////////////////////////////////

/////////////////////////////////TESTS/////////////////////////////////////////

// Test recordVisit()
// Lib.Debug.log( // Output: object
//   'recordVisit(...)',
//   UrlAnalytics.recordVisit(
//     instance,
//     test_output_simple,
//     domain, // domain
//     path, // path,
//     user_agent_string_mobile // user-agent-string
//   )
// );


// Test getUserAgentDataFromUserAgentString()
// Lib.Debug.log( // Output: String
//   'getUserAgentDataFromUserAgentString(...)',
//   UrlAnalytics.getUserAgentDataFromUserAgentString(
//     'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
//   )
// );


// Test determineCounterNameFromUserAgent()
// Lib.Debug.log( // Output: String
//   'determineCounterNameFromUserAgent(...)',
//   UrlAnalytics.determineCounterNameFromUserAgent(user_agent_data_mobile)
// );


// Test getData()
// Lib.Debug.log( // Output: String
//   'getData(...)',
//   UrlAnalytics.getData(
//     instance,
//     test_output_simple,
//     domain, // domain
//     path // path
//   )
// );



// Test updateData()
// Lib.Debug.log( // Output: String
//   'updateData(...)',
//   UrlAnalytics.updateData(
//     instance,
//     test_output_simple,
//     namespace_id,
//     domain, // domain
//     'wfg53m8', // key
//     1, // link_expiry
//     false, // remove_expiry
//     {'test': 'tester...'} // supplementary_data
//   )
// );

///////////////////////////////////////////////////////////////////////////////
