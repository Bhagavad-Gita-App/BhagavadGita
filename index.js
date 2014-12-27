'use strict';

var fs = require('fs');
var mkdirp = require('mkdirp');
var _ = require('lodash');
var env = require('jsdom').env;
var gita = require('./javascripts/gita.json');

var title, description, url;

var baseUrl = 'http://floydpink.github.io/BhagavadGita/share/';
var outputPath = './output/';

var readTemplateAndProcessCallback = function (callback) {
  env('./templates/share.html', function (errors, window) {
    if (errors) {
      console.log('!!!ERRORS:');
      console.error(errors);
    } else {
      var $ = require('jquery')(window);
      callback($);
    }
  });
};

var writeFile = function (path, content) {
  mkdirp(path, function (err) {
    if (err) {
      throw err;
    }
    var filePath = path + 'index.html';
    fs.writeFile(filePath, content, function (err) {
      if (err) {
        throw err;
      }
      console.log('File saved at %s', filePath);
    });
  });
};

var getSlokaNumber = function (s, sloka) {
  var slokaNumber = parseInt(s, 10) + 1;
  var re = /\(([0-9]+)\)/gm;
  if (sloka.Content.match(re)) {
    var regexExecResult, slokaNumbers = [];
    while ((regexExecResult = re.exec(sloka.Content)) !== null) {
      slokaNumbers.push(regexExecResult[1]);
    }
    slokaNumber = slokaNumbers.join(', ');
  }
  return ((slokaNumber.toString().indexOf(',') > -1) ? 'ശ്ലോകങ്ങൾ ' : 'ശ്ലോകം ') + slokaNumber;
};

var processChapter = function (chapterIndex, chapter) {
  var chapterCallback = function ($) {
    var sectionClone = $('#section').detach();
    $.each(chapter.Sections, function (sectionIndex, sloka) {
      var slokaCopy = sectionClone.clone().attr('id', 'section' + sectionIndex).addClass('slokaSection').appendTo('#sections');
      slokaCopy.find('.speaker').html(sloka.Speaker || '');
      slokaCopy.find('.sloka').html(sloka.Content);
      slokaCopy.find('.meaning').html(sloka.Meaning);
      slokaCopy.find('.detailLink').attr('href', sectionIndex + '/');
    });
    if (chapter.Intro) {
      $('#intro').text(chapter.Intro);
    } else {
      $('#intro').remove();
    }
    $('#title').html(chapter.Title);
    if (chapter.Outro) {
      $('#outro').text(chapter.Outro);
    } else {
      $('#outro').remove();
    }

    title = 'ശ്രീമദ് ഭഗവദ്ഗീത - ' + chapter.Title;
    description = $('#section0').find('.sloka').html().replace(/\n/g, ' ');
    description = description.length > 117 ? description.substring(0, 117) + '...' : description;
    url = baseUrl + chapterIndex + '/';

    var html = $('html').html().replace(/%TITLE%/g, title);
    html = html.replace(/%DESCRIPTION%/g, description);
    html = html.replace(/%URL%/g, url);
    var chapterPageContent = '<!DOCTYPE html>\n<html>\n' + html + '\n</html>\n';
    writeFile(outputPath + chapterIndex + '/', chapterPageContent);
  };
  readTemplateAndProcessCallback(chapterCallback);
};

var writeSectionFile = function (chapterIndex, chapter, sectionIndex, section) {
  var sectionCallback = function ($) {
    $('.speaker').html(section.Speaker || '');
    $('.sloka').html(section.Content);
    $('.meaning').html(section.Meaning);
    $('#subtitle').html(chapter.Subtitle ? chapter.Subtitle + ' - ' : '');

    $('#title').html($('<a></a>').attr('href', '../').attr('title', 'View Adhyaya').text(chapter.Title));

    var slokaNumber = getSlokaNumber(sectionIndex, section);
    $('#slokaNumber').html(' - ' + slokaNumber);

    title = 'ശ്രീമദ് ഭഗവദ്ഗീത - ' + chapter.Title + $('#slokaNumber').html();
    description = section.Content.replace(/\n/g, ' ');
    description = description.length > 117 ? description.substring(0, 117) + '...' : description;
    url = baseUrl + chapterIndex + '/' + sectionIndex + '/';

    var html = $('html').html().replace(/%TITLE%/g, title);
    html = html.replace(/%DESCRIPTION%/g, description);
    html = html.replace(/%URL%/g, url);
    var sectionPageContent = '<!DOCTYPE html>\n<html>\n' + html + '\n</html>\n';
    writeFile(outputPath + chapterIndex + '/' + sectionIndex + '/', sectionPageContent);
  };
  readTemplateAndProcessCallback(sectionCallback);
};

_.forEach(gita.Chapters, function (chapter, chapterIndex) {
  processChapter(chapterIndex, chapter);
  _.forEach(chapter.Sections, function (section, sectionIndex) {
    writeSectionFile(chapterIndex, chapter, sectionIndex, section);
  });
});


