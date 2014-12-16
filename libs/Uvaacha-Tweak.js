'use strict';

/**
 * Created by Haridas on 8/22/2014.
 */
var _ = require('lodash');
var fs = require('fs');
var gita = require('./gita-final.json');
var tweakedOutput = {};
tweakedOutput.Chapters = [];
tweakedOutput.BookTitle = gita.BookTitle;
var contentCount = 0;
_.forEach(gita.Chapters, function (chapter) {
  var tweakedChapter = {
    "Intro"        : chapter.Intro,
    "Name"         : chapter.Name,
    "Title"        : chapter.Title,
    "ChapterCount" : chapter.ChapterCount,
    "Subtitle"     : chapter.Subtitle,
    "Outro"        : chapter.Outro,
    "Contents"     : []
  };
  var previousContent;
  _.forEach(chapter.Contents, function (content) {
    if (content.Type === "Verse") {
      content.ContentCount = ++contentCount;
      if (previousContent && previousContent.Type === "Speaker") {
        content.Speaker = previousContent.Content;
      }
      tweakedChapter.Contents.push(content);
    }
    previousContent = content;
  });
  tweakedOutput.Chapters.push(tweakedChapter);
});

var outputFilename = './tweaked-output.json';
fs.writeFile(outputFilename, JSON.stringify(tweakedOutput, null, 4), function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Output saved to ' + outputFilename);
  }
});
