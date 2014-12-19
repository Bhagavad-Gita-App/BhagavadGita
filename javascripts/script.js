var getQ           = function (name) {
      var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
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
    shareReady     = function () {
      $.getJSON('../javascripts/gita.json', function (data) {
        gita = data;
        var c = getQ('c'), s = getQ('s');
        if (c && s && gita.Chapters[c] && gita.Chapters[c].Sections[s]) {
          var chapter = gita.Chapters[c];
          var sloka = chapter.Sections[s];
          $('.speaker').html(sloka.Speaker || "");
          $('.sloka').html(sloka.Content);
          $('.meaning').html(sloka.Meaning);
          $('#subtitle').html(chapter.Subtitle ? chapter.Subtitle + ' - ' : '');
          $('#title').html(chapter.Title);
          var slokaNumber = getSlokaNumber(s, sloka);
          $('#slokaNumber').html(' - ' + slokaNumber);
          document.title = 'ശ്രീമദ് ഭഗവദ്ഗീത - ' + $('#title').html() + $('#slokaNumber').html();
          $('#fbsharebutton').attr('data-href', location.href);
          $('#share').fadeIn();
        } else if (c && gita.Chapters[c]) {
          var chapter = gita.Chapters[c];
          var sectionClone = $('#section').detach();
          $.each(chapter.Sections, function(sectionIndex, sloka){
            var sectionId = 'section' + sectionIndex;
            var slokaCopy = sectionClone.clone().attr('id',sectionId).appendTo('#chapter');
            $('#' + sectionId).find('.speaker').html(sloka.Speaker || "");
            $('#' + sectionId).find('.sloka').html(sloka.Content);
            $('#' + sectionId).find('.meaning').html(sloka.Meaning);
          });
          $('#title').html(chapter.Title);
          document.title = 'ശ്രീമദ് ഭഗവദ്ഗീത - ' + $('#title').html();
          $('#fbsharebutton').attr('data-href', location.href);
          $('#share').fadeIn();
        }
      });
    },
    allReady       = function () {
      $(function () {
        $.getJSON('../javascripts/gita.json', function (gita) {
          var links = [];
          $.each(gita.Chapters, function (chapterIndex, chapter) {
            links.push('<li class="title"><a href="./?c=' + chapterIndex + '">'+ chapter.Title + '</a></li>')
            $.each(chapter.Sections, function (sectionIndex, section) {
              var linkText = getSlokaNumber(sectionIndex, section);
              links.push('<li><a href="./?c=' + chapterIndex + '&s=' + sectionIndex + '">' + linkText + '</a></li>');
            });
          });
          $('#links').append(links.join(''));
        });
      });
    };
