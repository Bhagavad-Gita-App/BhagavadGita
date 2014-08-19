'use strict';

var _ = require('lodash');
var fs = require('fs');
var gita = require('./gita.json');

var output = {},
    currentChapter,
    currentContent,
    slokaCount,
    contentCount = 0,
    chapterCount = 0,
    beginningNotFound = true,
    pushContent = function () {
      if (currentContent && currentContent.type) {
        currentChapter.content.push(currentContent);
      }
      currentContent = {};
    },
    pushChapter = function () {
      pushContent();
      output.chapters.push(currentChapter);
      currentChapter = {};
    };

output.chapters = [];


_.forEach(gita, function (snippet) {
  switch (snippet.type) {
    case 'bookTitle':
      output.bookTitle = snippet.content.content.text;
      break;
    case 'h2':
      if (currentChapter && beginningNotFound) {
        beginningNotFound = true;
        pushChapter();
      } else if (beginningNotFound) {
        currentChapter = {};
      }
      currentContent = null;
      slokaCount = 0;
      currentChapter.name = snippet.content[0].attrs.name;
      currentChapter.title = snippet.content[0].content.text;
      currentChapter.content = [];
      currentChapter.chapterCount = ++chapterCount;
      break;
    case 'sloka':
      pushContent();
      currentContent.type = 'sloka';
      currentContent.contentCount = ++contentCount;
      currentContent.slokaCount = ++slokaCount;
      currentContent.sloka = snippet.content.text;
      break;
    case 'meaning':
      if (!currentContent) {
        throw new Error('Uninitialized sloka with meaning');
      }
      currentContent.meaning = snippet.content.text;
      break;
    case 'chapterBeginning':
      beginningNotFound = false;
      pushChapter();
      currentChapter.intro = snippet.content.text;
      break;
    case 'uvaacha':
      pushContent();
      currentChapter.content.push({
        type         : 'uvaacha',
        contentCount : ++contentCount,
        uvaacha      : snippet.content.text
      });
      break;
    case 'chapterEnding':
      pushContent();
      currentChapter.outro = snippet.content.text;
      break;
  }
});

pushChapter();

var outputFilename = './output.json';
fs.writeFile(outputFilename, JSON.stringify(output, null, 4), function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Output saved to ' + outputFilename);
  }
});
