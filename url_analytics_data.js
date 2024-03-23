// Info: Contains Functions Related to UrlRedirector Data-Structures
'use strict';

// Shared Dependencies (Managed by Main Entry Module & Loader)
var Lib;

// Exclusive Dependencies
var CONFIG; // (Managed by Main Entry Module & Loader)


/////////////////////////// Module-Loader START ////////////////////////////////

  /********************************************************************
  Load dependencies and configurations

  @param {Set} shared_libs - Reference to libraries already loaded in memory by other modules
  @param {Set} config - Custom configuration in key-value pairs

  @return nothing
  *********************************************************************/
  const loader = function(shared_libs, config){

    // Shared Dependencies (Managed my Main Entry Module)
    Lib = shared_libs;

    // Configuration (Managed my Main Entry Module)
    CONFIG = config;

  };

//////////////////////////// Module-Loader END /////////////////////////////////



///////////////////////////// Module Exports START /////////////////////////////
module.exports = function(shared_libs, config){

  // Run Loader
  loader(shared_libs, config);

  // Return Public Funtions of this module
  return UrlAnalyticsData;

};//////////////////////////// Module Exports END //////////////////////////////



///////////////////////////Public Functions START///////////////////////////////
const UrlAnalyticsData = { // Public functions accessible by other modules

  /********************************************************************
  Return a Url-Analysis Data object

  @param {String} domain - Namespace-ID (Brand-ID/Store-ID/...)
  @param {String} path - Original Url, which is to be Mapped
  @param {Integer} time_of_creation - Time of Creation of this Url-Info Data (Unix Time)
  @param {Integer} time_of_last_visit - Time of last Visit (or Updates) to this Url (Unix Time)
  @param {Number} counter_mobile_iphone - Counter for All Mobile (iPhone) Visitors
  @param {Number} counter_mobile_android - Counter for All Mobile (Android) Visitors
  @param {Number} counter_mobile_unknown - Counter for All Mobile (Unknown) Visitors
  @param {Number} counter_desktop_ios - Counter for All Mobile (Mac) Visitors
  @param {Number} counter_desktop_windows - Counter for All Mobile (Windows) Visitors
  @param {Number} counter_desktop_linux - Counter for All Mobile (Linux) Visitors
  @param {Number} counter_desktop_unknown - Counter for All Mobile (Unknown) Visitors
  @param {Number} counter_tablet_ipad - Counter for All Tablet (iPad) Visitors
  @param {Number} counter_tablet_android - Counter for All Tablet (Android) Visitors
  @param {Number} counter_tablet_unknown - Counter for All Tablet (Unknown) Visitors
  @param {Number} counter_unknown - Counter for Unknown-Device Visitors (visitors from Unknown device)

  @return {Set} url_analytics_data - Url-Analytics-Data Object in key-value
  *********************************************************************/
  createData: function(
    domain,
    path,
    time_of_creation, time_of_last_visit,
    counter_mobile_iphone=0, counter_mobile_android=0, counter_mobile_unknown=0, // Visitors from Mobile Platform
    counter_desktop_ios=0, counter_desktop_windows=0, counter_desktop_linux=0, counter_desktop_unknown=0, // Visitors from Desktop Platform
    counter_tablet_ipad=0, counter_tablet_android=0, counter_tablet_unknown=0, // Visitors from Tablet Platform
    counter_unknown=0 // Visitors from Unknown Platform
  ){

    return {
      'domain': Lib.Utils.fallback(domain),
      'path': Lib.Utils.fallback(path),
      'time_of_creation': Lib.Utils.fallback(time_of_creation),
      'time_of_last_visit': Lib.Utils.fallback(time_of_last_visit),
      'counter_mobile_iphone': counter_mobile_iphone,
      'counter_mobile_android': counter_mobile_android,
      'counter_mobile_unknown': counter_mobile_unknown,
      'counter_mobile': counter_mobile_iphone + counter_mobile_android + counter_mobile_unknown, // Derived Keys
      'counter_desktop_ios': counter_desktop_ios,
      'counter_desktop_windows': counter_desktop_windows,
      'counter_desktop_linux': counter_desktop_linux,
      'counter_desktop_unknown': counter_desktop_unknown,
      'counter_desktop': counter_desktop_ios + counter_desktop_windows + counter_desktop_linux + counter_desktop_unknown, // Derived Keys
      'counter_tablet_ipad': counter_tablet_ipad,
      'counter_tablet_android': counter_tablet_android,
      'counter_tablet_unknown': counter_tablet_unknown,
      'counter_tablet': counter_tablet_ipad + counter_tablet_android + counter_tablet_unknown, // Derived Keys
      'counter_unknown': counter_unknown,
      'counter': counter_unknown + (counter_mobile_iphone + counter_mobile_android + counter_mobile_unknown) + (counter_desktop_ios + counter_desktop_windows + counter_desktop_linux + counter_desktop_unknown) + (counter_tablet_ipad + counter_tablet_android + counter_tablet_unknown) // Derived Keys
    };

  },


  /********************************************************************
  Return a User-Agent Data object

  @param {String} device_type - Device Type (mobile|desktop|tablet|...)
  @param {String} device_model - Device Model (iPhone|...)
  @param {Number} os_name - OS Name (ios|android|windows|...)
  @param {Number} os_version - OS Version (eg. '10.15.7)'
  @param {Number} app_name - Browser Name  (Chrome|FireFox|Safari|IE|...)
  @param {Number} app_version - Browser Version (eg. '98.0.4758.109')

  @return {Set} urser_agent_data - Url-Agent-Data Object in key-value
  *********************************************************************/
  createUserAgentData: function(
    device_type, device_model,
    os_name, os_version,
    app_name, app_version
  ){

    return {
      'device_type': Lib.Utils.fallback(device_type),
      'device_model': Lib.Utils.fallback(device_model),
      'os_name': Lib.Utils.fallback(os_name),
      'os_version': Lib.Utils.fallback(os_version),
      'app_name': Lib.Utils.fallback(app_name),
      'app_version': Lib.Utils.fallback(app_version),
    };

  },



  /********************************************************************
  Create Transaction Data from Database Record Data

  @param {Set} data - Database Record Data

  @return - Transaction Data
  *********************************************************************/
  createDataFromDbData: function(data){

    // Construct Data
    return UrlAnalyticsData.createData(
      data['p'], // Domain
      data['id'], // Path
      Lib.Utils.fallback(data['toc']), // Time of Creation of this Data
      Lib.Utils.fallback(data['tol']), // time of last-visit to this link
      Lib.Utils.fallback(data['c_m_p']), // iphone visitors
      Lib.Utils.fallback(data['c_m_a']), // android visitors
      Lib.Utils.fallback(data['c_m_u']), // mobile unknown visitors
      Lib.Utils.fallback(data['c_d_m']), // mac visitors
      Lib.Utils.fallback(data['c_d_w']), // windows visitors
      Lib.Utils.fallback(data['c_d_l']), // linux visitors
      Lib.Utils.fallback(data['c_d_u']), // desktop unknown visitors
      Lib.Utils.fallback(data['c_t_p']), // iPad visitors
      Lib.Utils.fallback(data['c_t_a']), // android visitors
      Lib.Utils.fallback(data['c_t_u']), // mobile unknown visitors
      Lib.Utils.fallback(data['c_u']), // Total unknown_visitors to this link
    );

  },


  /********************************************************************
  Create Database Record Data from Transaction Data

  @param {Set} data - Transaction Data

  @return - Database Record Data
  *********************************************************************/
  createDbDataFromData: function(data){

    // Create Record Object
    var db_record = {};


    // Add optional keys to Record-Object (Make All Keys Optional for partial Updates)
    if( !Lib.Utils.isEmpty(data['domain']) ){
      db_record['p'] = data['domain'];
    }

    if( !Lib.Utils.isEmpty(data['path']) ){
      db_record['id'] = data['path'];
    }


    if( !Lib.Utils.isEmpty(data['counter_mobile_iphone']) ){
      db_record['c_m_p'] = data['counter_mobile_iphone'];
    }

    if( !Lib.Utils.isEmpty(data['counter_mobile_android']) ){
      db_record['c_m_a'] = data['counter_mobile_android'];
    }

    if( !Lib.Utils.isEmpty(data['counter_mobile_unknown']) ){
      db_record['c_m_u'] = data['counter_mobile_unknown'];
    }


    if( !Lib.Utils.isEmpty(data['counter_desktop_ios']) ){
      db_record['c_d_m'] = data['counter_desktop_ios'];
    }

    if( !Lib.Utils.isEmpty(data['counter_desktop_windows']) ){
      db_record['c_d_w'] = data['counter_desktop_windows'];
    }

    if( !Lib.Utils.isEmpty(data['counter_desktop_linux']) ){
      db_record['c_d_l'] = data['counter_desktop_linux'];
    }

    if( !Lib.Utils.isEmpty(data['counter_desktop_unknown']) ){
      db_record['c_d_u'] = data['counter_desktop_unknown'];
    }


    if( !Lib.Utils.isEmpty(data['counter_tablet_ipad']) ){
      db_record['c_t_p'] = data['counter_tablet_ipad'];
    }

    if( !Lib.Utils.isEmpty(data['counter_tablet_android']) ){
      db_record['c_t_a'] = data['counter_tablet_android'];
    }

    if( !Lib.Utils.isEmpty(data['counter_tablet_unknown']) ){
      db_record['c_t_u'] = data['counter_tablet_unknown'];
    }


    if( !Lib.Utils.isEmpty(data['counter_unknown']) ){
      db_record['c_u'] = data['counter_unknown'];
    }

    if( !Lib.Utils.isEmpty(data['time_of_creation']) ){
      db_record['toc'] = data['time_of_creation'];
    }

    if( !Lib.Utils.isEmpty(data['time_of_last_visit']) ){
      db_record['tol'] = data['time_of_last_visit'];
    }


    // Return this DB Record
    return db_record;

  },

};///////////////////////////Public Functions END///////////////////////////////



//////////////////////////Private Functions START///////////////////////////////
const _UrlAnalyticsData = { // Private functions accessible within this modules only
// None
};/////////////////////////Private Functions END////////////////////////////////
