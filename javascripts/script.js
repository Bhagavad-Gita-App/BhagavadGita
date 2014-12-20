'use strict'; // jshint ignore:line

var getQ           = function (name) {
      var match = new RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
      return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    },
    getSlokaNumber = function (s, sloka) {
      var slokaNumber = parseInt(s, 10) + 1;
      var re = /\(([0-9]+)\)/gm;
      if (sloka.Content.match(re)) {
        var regexExecResult, slokaNumbers = [];
        while ((regexExecResult = re.exec(sloka.Content)) !== null) {
          slokaNumbers.push(regexExecResult[1]);
        }
        slokaNumber = slokaNumbers.join(', ');
      }
      return ((slokaNumber.toString().indexOf(',') > -1) ? 'ശ്ലോകങ്ങൾ' : 'ശ്ലോകം') + ' ' + slokaNumber;
    },
    shareReady     = function () { // jshint ignore:line
      $.getJSON('../javascripts/gita.json', function (gita) {
        var c = getQ('c'), s = getQ('s');
        var chapter = gita.Chapters[c];
        if (c && s && chapter && gita.Chapters[c].Sections[s]) {
          var sloka = chapter.Sections[s];
          $('.speaker').html(sloka.Speaker || '');
          $('.sloka').html(sloka.Content);
          $('.meaning').html(sloka.Meaning);
          $('#subtitle').html(chapter.Subtitle ? chapter.Subtitle + ' - ' : '');
          $('#title').html(chapter.Title);
          var slokaNumber = getSlokaNumber(s, sloka);
          $('#slokaNumber').html(' - ' + slokaNumber);
          document.title = 'ശ്രീമദ് ഭഗവദ്ഗീത - ' + $('#title').html() + $('#slokaNumber').html();
          $('#fbsharebutton').attr('data-href', location.href);
          $('#share').fadeIn();
        } else if (c && chapter) {
          var sectionClone = $('#section').detach();
          $.each(chapter.Sections, function (sectionIndex, sloka) {
            var slokaCopy = sectionClone.clone().attr('id', 'section' + sectionIndex).appendTo('#chapter');
            slokaCopy.find('.speaker').html(sloka.Speaker || '');
            slokaCopy.find('.sloka').html(sloka.Content);
            slokaCopy.find('.meaning').html(sloka.Meaning);
          });
          $('#title').html(chapter.Title);
          document.title = 'ശ്രീമദ് ഭഗവദ്ഗീത - ' + $('#title').html();
          $('#fbsharebutton').attr('data-href', location.href);
          $('#share').fadeIn();
        }
      });
    },
    allReady       = function () { // jshint ignore:line
      $(function () {
        $.getJSON('../javascripts/gita.json', function (gita) {
          var links = [];
          $.each(gita.Chapters, function (chapterIndex, chapter) {
            links.push('<li class="title"><a href="./?c=' + chapterIndex + '">' + chapter.Title + '</a></li>');
            $.each(chapter.Sections, function (sectionIndex, section) {
              var linkText = getSlokaNumber(sectionIndex, section);
              links.push('<li><a href="./?c=' + chapterIndex + '&s=' + sectionIndex + '">' + linkText + '</a></li>');
            });
          });
          $('#links').append(links.join(''));
        });
      });
    };
