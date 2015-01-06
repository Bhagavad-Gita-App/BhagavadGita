'use strict'; // jshint ignore:line

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
    },
    allReady       = function () { // jshint ignore:line
      $.getJSON('./javascripts/gita.json', function (gita) {
        var links = [];
        $.each(gita.Chapters, function (chapterIndex, chapter) {
          links.push('<li class="title"><a href="./share/' + chapterIndex + '/">' + chapter.Title + '</a></li>');
          $.each(chapter.Sections, function (sectionIndex, section) {
            var linkText = getSlokaNumber(sectionIndex, section);
            links.push('<li><a href="./share/' + chapterIndex + '/' + sectionIndex + '/">' + linkText + '</a></li>');
          });
        });
        $('#links').append(links.join(''));
      });
    };
