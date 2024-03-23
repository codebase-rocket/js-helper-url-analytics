// Info: Url-Analytics management SDK.
'use strict';

// Shared Dependencies (Managed by Loader)
var Lib = {};


// Ua-Parser-Js Lib Library (Private scope)
const UserAgentParser = require('ua-parser-js');


// Private Dependencies - Parts of same library (Managed by Loader)
var UrlAnalyticsData;
var UrlAnalyticsInput;

// Exclusive Dependencies
var CONFIG = require('./config'); // Loader can override it with Custom-Config

/////////////////////////// Module-Loader START ////////////////////////////////

  /********************************************************************
  Load dependencies and configurations

  @param {Set} shared_libs - Reference to libraries already loaded in memory by other modules
  @param {Set} config - Custom configuration in key-value pairs

  @return nothing
  *********************************************************************/
  const loader = function(shared_libs, config){

    // Shared Dependencies (Must be loaded in memory already)
    Lib.Utils = shared_libs.Utils;
    Lib.Debug = shared_libs.Debug;
    Lib.DynamoDB = shared_libs.DynamoDB;
    Lib.Instance = shared_libs.Instance;

    // Override default configuration
    if( !Lib.Utils.isNullOrUndefined(config) ){
      Object.assign(CONFIG, config); // Merge custom configuration with defaults
    }

    // Private Dependencies
    UrlAnalyticsData = require('./url_analytics_data')(Lib, CONFIG);
    UrlAnalyticsInput = require('./url_analytics_input')(Lib, CONFIG);

    // Additional Shared Dependencies
    Lib.UrlAnalyticsData = UrlAnalyticsData;
    Lib.UrlAnalyticsInput = UrlAnalyticsInput;


  };

//////////////////////////// Module-Loader END /////////////////////////////////

///////////////////////////// Module Exports START /////////////////////////////
module.exports = function(shared_libs, config){

  // Run Loader
  loader(shared_libs, config);

  // Return Public Funtions of this module
  return [UrlAnalytics, UrlAnalyticsInput, UrlAnalyticsData];

};//////////////////////////// Module Exports END //////////////////////////////



///////////////////////////Public Functions START//////////////////////////////
const UrlAnalytics = { // Public functions accessible by other modules

  /********************************************************************
  Record Visit

  @param {reference} instance - Request Instance object reference
  @param {Function} cb - Callback function to be invoked once async execution of this function is finished

  @param {String} domain - Namespace-ID (Brand-ID/Store-ID/...)
  @param {String} path - initial '/' followed by the path of the URL, not including the query string or fragment ('/abc/pqr/query')
  @param {String} user_agent - User-Agent String Object (which is to be Parsed, to get User-Agent Data)

  @callback - Request Callback(err, url_analytics_data)
  * @callback {Error} err - Database Error
  * @callback {Set} url_analytics_data - Url-Analytics Data
  *********************************************************************/
  recordVisit: function(
    instance, cb,
    domain, path,
    user_agent
  ){

    // Deconstruct User-Agent String to Data
    var user_agent_data = UrlAnalytics.getUserAgentDataFromUserAgentString(user_agent);

    // Determine Counter-Name From User-Agent
    var counter_name = _UrlAnalytics.determineCounterNameFromUserAgent(user_agent_data);


    // Create or Increment Counter in Database
    _UrlAnalytics.createOrIncrementCounterInDynamoDb(
      instance, cb,
      domain, path,
      counter_name
    );

  },


  /********************************************************************
  Get Url Data by Short-ID from database

  @param {reference} instance - Request Instance object reference
  @param {Function} cb - Callback function to be invoked once async execution of this function is finished

  @param {String} domain - Namespace-ID (Brand-ID/Store-ID/...)
  @param {String} path - initial '/' followed by the path of the URL, not including the query string or fragment ('/abc/pqr/query')

  @return Thru request Callback.

  @callback - Request Callback(err, url_analytics_data)
  * @callback {Error} err - In case of error
  * @callback {Boolean} url_analytics_data - false if URL Data Not Found
  * @callback {Set} url_analytics_data - URL Data
  *********************************************************************/
  getData: function(
    instance, cb,
    domain, path
  ){

    // Get Data from DB
    _UrlAnalytics.getDataFromDynamoDB(
      instance, cb,
      domain, path
    );

  },


  /********************************************************************
  Returns parsed USER-AGENT Object from USER-AGENT String

  @param {String} user_agent_string - USER-AGENT String

  @return {Set} user_agent_data - User-Agent Data
  *********************************************************************/
  getUserAgentDataFromUserAgentString: function(user_agent_string){

    // Get Parsed User-Agent
    var parsed_user_agent = UserAgentParser( user_agent_string );


    // Return User-Agent-Data Object (in key-value pair)
    return UrlAnalyticsData.createUserAgentData(
      parsed_user_agent['device']['type'], // Device Type
      parsed_user_agent['device']['model'], // Device Model
      parsed_user_agent['os']['name'], // OS Name
      parsed_user_agent['os']['version'], // OS Version
      parsed_user_agent['browser']['name'], // Browser Name
      parsed_user_agent['browser']['version'] // Browser Version
    );

  },

};///////////////////////////Public Functions END//////////////////////////////



//////////////////////////Private Functions START//////////////////////////////
const _UrlAnalytics = { // Private functions accessible within this modules only

  /********************************************************************
  If URL-Data already exists in Database just Increment the Counter else set whole Data in Database

  @param {reference} instance - Request Instance object reference
  @param {Function} cb - Callback function to be invoked once async execution of this function is finished

  @param {String} domain - Namespace-ID (Brand-ID/Store-ID/...)
  @param {String} path - initial '/' followed by the path of the URL, not including the query string or fragment ('/abc/pqr/query')
  @param {String} counter_name - Counetr Name to be Increment in Database

  @return Thru request Callback.

  @callback - Request Callback. (err, url_analytics_data)
  * @callback {Error} err - Unable to reach UrlAnalytics database
  * @callback {Set} url_analytics_data - Url-Analytics Data
  *********************************************************************/
  createOrIncrementCounterInDynamoDb: function(
    instance, cb,
    domain, path,
    counter_name
  ){

    // Create Record ID
    var record_id = {
      'p': domain,
      'id': path
    };


    // Keys to be Updated
    var updated_data = {
      'tol': instance['time']
    };

    var increment_record = CONFIG.COUNTER_KEYS_TO_DB[counter_name]


    // Key to be Incremented
    const increment_data = {};
    increment_data[CONFIG.COUNTER_KEYS_TO_DB[counter_name]] = 1



    // Update in DynamoDB
    Lib.DynamoDB.updateRecord(
      instance,
      function(err, response){


        // Error means Record not Found in Database to Update. Hence, Add New record in Database.
        if(err){

          // Create Record in Database
          return cb(
            null,
            _UrlAnalytics.createRecordInDynamoDb(
              instance, cb,
              domain, path,
              counter_name
            )
          );

        }


        // Translate Record and Return
        cb(
          null,
          UrlAnalyticsData.createDataFromDbData(response)
        );

      },
      CONFIG.DB_SOURCE, // Table Name
      record_id, // Partition Key and Sort Key
      updated_data, // Updated Data
      null, // remove_keys
      increment_data, // increment_data increment
      null, // decrement
      'ALL_NEW' // return_state
    );

  },


  /********************************************************************
  Create a New Record in Database

  @param {reference} instance - Request Instance object reference
  @param {Function} cb - Callback function to be invoked once async execution of this function is finished

  @param {String} domain - Namespace-ID (Brand-ID/Store-ID/...)
  @param {String} path - initial '/' followed by the path of the URL, not including the query string or fragment ('/abc/pqr/query')
  @param {String} counter_name - Counetr Name to be Increment in Database

  @return Thru request Callback.

  @callback - Request Callback. (err, url_analytics_data)
  * @callback {Error} err - Unable to reach UrlAnalytics database
  * @callback {Set} url_analytics_data - Url-Analytics Data
  *********************************************************************/
  createRecordInDynamoDb: function(
    instance, cb,
    domain, path,
    counter_name
  ){

    // Construct URL-Analytics-Data
    var url_analytics_data = UrlAnalyticsData.createData(
      domain,
      path,
      instance['time'], // Time of Creation (Unixtime)
      instance['time'] // Time of Lats Visit (Unixtime)
    );

    // Set Counter
    url_analytics_data[counter_name] = 1;


    // Translate Analytics-Data to DB-Data
    const db_record = UrlAnalyticsData.createDbDataFromData(url_analytics_data);

    // Set data in dynamodb
    Lib.DynamoDB.addRecord(
      instance,
      function(err, is_success){ // Callback function

        if(err){ // Database Error
          return cb(err); // Invoke callback with error
        }

        if(!is_success){ // Transaction Database Error
          return cb( Lib.Utils.error(CONFIG.ERR_DATABASE_WRITE_FAILED) ); // Invoke callback with error
        }


        // Return
        cb(
          null,
          url_analytics_data
        );

      },
      CONFIG.DB_SOURCE, // Table Name
      db_record // Record to be saved in database
    );

  },


  /********************************************************************
  Get Record from Database

  @param {reference} instance - Request Instance object reference
  @param {Function} cb - Callback function to be invoked once async execution of this function is finished

  @param {String} domain - Domain of this URL
  @param {String} path - initial '/' followed by the path of the URL, not including the query string or fragment ('/abc/pqr/query')

  @return Thru request Callback.

  @callback - Request Callback(err, url_analytics_data)
  * @callback {Error} err - In case of error
  * @callback {Boolean} url_analytics_data - 'false' if Url-Analytics Data Not Found
  * @callback {Set} url_analytics_data - Url-Analytics Data
  *********************************************************************/
  getDataFromDynamoDB: function(
    instance, cb,
    domain, path
  ){

    // Create Record-ID
    var record_id = {
      'p': domain,
      'id': path
    };


    // Get Data from dynamodb
    Lib.DynamoDB.getRecord(
      instance,
      function(err, url_analytics_data){ // Callback function

        if(err){ // Print Database Error
          return cb(err); // Invoke callback with error
        }

        // Check If Transaction Not found
        if(!url_analytics_data){
          return cb(null, false)
        }


        // Reach here means All Good

        // Translate Record and Return
        return cb(
          null, // No error
          UrlAnalyticsData.createDataFromDbData(url_analytics_data) // Url-Analytics-Data
        );

      },
      CONFIG.DB_SOURCE, // Table Name
      record_id, // record_id]
    );

  },




  /********************************************************************
  Generate a new Key (Recursively check if Generated-Key already exists in DB or Not, else Keep creating New Unique Key)

  @param {Set} user_agent_data - User-Agent Data

  @return {Array} [platform, os] - Device-Platform and OS
  *********************************************************************/
  determineCounterNameFromUserAgent: function(user_agent_data){

    // Initialize Platform and OS
    var platform;
    var os;

    // Determine Platform(Device) and OS
    if( user_agent_data['device_type'] == 'mobile' ){ // Mobile Platform
      platform = 'mobile';
      os = Lib.Utils.fallback(
        CONFIG.MOBILE_OS[user_agent_data['os_name']],
        'unknown'
      );
    }
    else if( user_agent_data['device_type'] == 'tablet' ){ // Tablet Platform
      platform = 'tablet';
      os = Lib.Utils.fallback(
        CONFIG.TABLET_OS[user_agent_data['os_name']],
        'unknown'
      );
    }
    else if(
      user_agent_data['device_type'] == 'desktop' || // 'Desktop' is not recognized by 'ua-parser' Lib, so we have to take assumption on the basis of OS (giving 'undefined' for device 'desktop')
      user_agent_data['os_name'] in CONFIG.DESKTOP_OS
    ){
      platform = 'desktop';
      os = CONFIG.DESKTOP_OS[user_agent_data['os_name']];
    }
    else{ // Unknown Platform
      platform = 'unknown';
      os = 'unknown';
    }


    // Determine Counter-Name from Platform and OS
    var counter_name = 'counter_';

    if(platform === 'unknown'){
      counter_name += 'unknown';
    }
    else{
      counter_name += platform + '_' + os;
    }


    // Return Counter-Name
    return counter_name;

  },

};//////////////////////////Private Functions END//////////////////////////////
