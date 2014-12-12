'use strict';
var AR = window.AR = window.AR || {};
AR.fullProfileFields = [
  'first-name',
  'last-name',
  'email-address',
  'summary',
  'specialties',
  'location',
  'picture-url',
  'public-profile-url',
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

AR.renderDate = function(date, fmt) {
  if (!date) return "not set";
  var month = "", day = "", year = "";
  if (date.month) {
    var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    month = months[date.month-1];
  }
  if (date.day) {
    day = date.day;
  }
  if (date.year) {
    year = date.year;
  }
  if (!fmt) fmt = "%m %d, %Y";
  if (!date.day) {
    fmt = "%m %Y";
  } else if (!date.year) {
    fmt = "%m %d";
  }
  return fmt.replace("%Y", year).replace("%m", month).replace("%d", day);
};

AR.getPhone = function(phoneNumbers) {
  if (!phoneNumbers || phoneNumbers.length < 1) return "Provide upon request";
  var order = ['mobile', 'work', 'home'];
  for (var i = 0; i < phoneNumbers.length; i++) {
    var num = phoneNumbers[i];
    num.index = order.indexOf(num.type);
  }
  return phoneNumbers.sort(function(a, b){return a.index-b.index;})[0].phoneNumber;
}

AR.LatexText = function(text, options) {
  if (!text) return 'TBD';
  /**
   * Latex escape library by dangmai
   * https://github.com/dangmai/escape-latex/
   */
  var escapes = {
    '\n': '\\\\',
    '{': '\\{',
    '}': '\\}',
    '\\': '\\textbackslash{}',
    '#': '\\#',
    '$': '\\$',
    '%': '\\%',
    '&': '\\&',
    '^': '\\textasciicircum{}',
    '_': '\\_',
    '~': '\\textasciitilde{}'
  };
  if (options && options.linebreak === false) {
    delete escapes['\n'];
  }

  /**
   * Escape a string to be used in JS regular expression.
   * Code from http://stackoverflow.com/a/6969486
   * @param str the string to be used in a RegExp
   * @return the escaped string, ready to be used for RegExp
   */
  var escapeRegExp = function (str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
  },
  escapeKeys = Object.keys(escapes), // as it is reused later on
  escapeKeyRegExps = escapeKeys.map(function (key) {
    return escapeRegExp(key);
  });


  /**
  * Escape a string to be used in LaTeX documents.
  * @param str the string to be escaped.
  * @return the escaped string, ready to be used in LaTeX.
  */
  function lescape(str) {
    var pos, match, regExp,
        regExpFound = false,
        result = str;
    // Algorithm: Find the character(s) to escape, then break the string up at
    // that/those character(s) and repeat the process recursively.
    // We can't just sequentially replace each character(s), because the result
    // of an earlier step might be escaped again by a later step.
    escapeKeys.forEach(function (key, index) {
      if (regExpFound) {
        // This is here to avoid breaking up strings unnecessarily: In every
        // repetition step, we only need to find ONE special character(s) to
        // break up the string; after it is done, there is no need to look
        // further.
        return;
      }
        pos = str.search(escapeKeyRegExps[index]);
        match = str.match(escapeKeyRegExps[index]);
        if (pos !== -1) {
          result = lescape(str.slice(0, pos)) + escapes[escapeKeys[index]] + lescape(str.slice(pos + match.length));
          regExpFound = true;
        }
    });
    // Found nothing else to escape
    return result;
  }

  return lescape(text);
};

AR.processProfile = function(profile) {
  profile = profile || {};

  // combine current positions and past positions
  profile.positions = {_total: 0, values: []};
  if (profile.threeCurrentPositions && profile.threeCurrentPositions.values) {
    for (var i = 0; i < profile.threeCurrentPositions.values.length; i++) {
      profile.positions.values.push(profile.threeCurrentPositions.values[i]);
      profile.positions._total++;
    }
  }
  if (profile.threePastPositions && profile.threePastPositions.values) {
    for (var i = 0; i < profile.threePastPositions.values.length; i++) {
      profile.positions.values.push(profile.threePastPositions.values[i]);
      profile.positions._total++;
    }
  }
  return profile;
};

