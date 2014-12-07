'use strict';
var AR = window.AR = window.AR || {};
AR.fullProfileFields = [
  'last-modified-timestamp',
  'proposal-comments',
  'associations',
  'interests',
  'publications',
  'patents',
  'languages',
  'skills',
  'certifications',
  'educations',
  'courses',
  'volunteer',
  'three-current-positions',
  'three-past-positions',
  'num-recommenders',
  'recommendations-received',
  'date-of-birth',
  'member-url-resources',
  'related-profile-views',
  'honors-awards',
  'phone-numbers',
  'bound-account-types',
  'im-accounts',
  'main-address',
  'twitter-accounts',
  'primary-twitter-account'
];

AR.renderDate = function(date) {
  var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return months[date.month-1] + " " + date.year;
};