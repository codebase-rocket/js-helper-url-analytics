// Info: Configuration file
'use strict';


// Export configration as key-value Map
module.exports = {

  // Database Table Name
  DB_SOURCE           : 'test_url_analytics',


  // All Possible Platforms
  MOBILE_PLATFORMS : {
    'iPhone': 'mip',
    'android': 'man',
    'unknown': 'mun'
  },

  DESKTOP_PLATFORMS : {
    'mac': 'dmc',
    'windows': 'dw',
    'linux': 'dl',
    'unknown': 'dun',
  },

  TABLET_PLATFORMS : {
    'ipad': 'p',
    'unknown': 'tun',
  },


  // Map Counters to short Keys
  COUNTER_KEYS_TO_DB : {
    'counter_mobile_iphone': 'c_m_p',
    'counter_mobile_android': 'c_m_a',
    'counter_mobile_unknown': 'c_m_u',

    'counter_desktop_ios': 'c_d_m',
    'counter_desktop_windows': 'c_d_w',
    'counter_desktop_linux': 'c_d_l',
    'counter_desktop_unknown': 'c_d_u',

    'counter_tablet_ipad': 'c_t_p',
    'counter_tablet_android': 'c_t_a',
    'counter_tablet_unknown': 'c_t_u',

    'counter_unknown': 'c_u'
  },



  // Known OS to be Tracked
  DESKTOP_OS : {
    'Mac OS': 'ios',
    'Windows': 'windows',
    'Linux': 'linux'
  },

  TABLET_OS : {
    'iOS': 'ios',
    'Android': 'android',
  },

  MOBILE_OS : {
    'iOS': 'ios',
    'Android': 'android',
  },


  // Error Codes
  ERR_DATABASE_WRITE_FAILED: {
    code: 'DATABASE_WRITE_FAILED',
    message: 'Failed to write into Url-Redirect database'
  },

}
