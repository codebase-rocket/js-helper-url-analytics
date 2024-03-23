# v1.0 #

------------
AWS DynamoDB
------------


---------------------------
Create table - URL Analytics
---------------------------
Url Analysis data

* Table Name: test_url_analytics
* Partition Key: p [string]
* Sort Key: id [string]

* Secondary Index: [NONE]
* Read/write capacity mode: On-demand

Table Structure [For Url-Analytics-Data]
---------------

* p (String)          -> [Partition Key] Domain for this URL
* id (String)         -> [Sort Key] Path for this Url (initial '/' followed by the path of the URL, not including the query string or fragment ('/abc/pqr/query'))

* c_m_p (String)      -> Counter for All Mobile (iPhone) Visitors
* c_m_a (String)      -> Counter for All Mobile (android) Visitors
* c_m_u (String)      -> Counter for All Mobile (unknown) Visitors
* c_d_m (String)      -> Counter for All Desktop (mac) Visitors
* c_d_w (String)      -> Counter for All Desktop (windows) Visitors
* c_d_l (String)      -> Counter for All Desktop (linux) Visitors
* c_d_u (String)      -> Counter for All Desktop (unknown) Visitors
* c_t_p (String)      -> Counter for All Tablet (ipad) Visitors
* c_t_a (String)      -> Counter for All Tablet (android) Visitors
* c_t_u (String)      -> Counter for All Tablet (unknown) Visitors
* c_u (String)        -> Counter for Unknown-Device Visitors (visitors from Unknown device)
* toc (Number)        -> Time of Creation of this Url (Unix Time)
* tol (Number)        -> Time of last Visit (or Updates) to this Url (Unix Time)
