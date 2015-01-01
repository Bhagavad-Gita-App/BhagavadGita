var gita = {};  // bring the content from the previous version of the JSON

// has a dependency of lodash

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

var getSlokaCount = function (s, sloka) {
    var slokaCount = 1;
    var re = /\(([0-9]+)\)/gm;
    if (sloka.Content.match(re)) {
        var regexExecResult, slokaNumbers = [];
        while ((regexExecResult = re.exec(sloka.Content)) !== null) {
            slokaNumbers.push(regexExecResult[1]);
        }
        slokaCount = slokaNumbers.length;
    }
    return slokaCount;
};

var output = {};

var processGita = function (gita, output) {
    var chapters = [];
    _.forEach(gita.Chapters, function (originalChapter, chapterIndex) {
        var chapter = originalChapter;
        var sections = [];
        var chapterSlokasCount = 0;
        _.forEach(chapter.Sections, function (originalSection, sectionIndex) {
            var section = originalSection;
            section.SectionSerial = section.SlokaCount;
            delete section.SlokaCount;
            section.SlokasCount = getSlokaCount(sectionIndex, section);
            section.SlokaNumber = getSlokaNumber(sectionIndex, section);
            chapterSlokasCount += section.SlokasCount;
            sections.push(section);
        });
        chapter.Sections = sections;
        chapter.ChapterSerial = chapter.ChapterCount;
        delete chapter.ChapterCount;
        chapter.SlokasCount = chapterSlokasCount;
        chapters.push(chapter);
    });
    output.Chapters = chapters;
    output.OriginalBookTitle = gita.OriginalBookTitle;
    output.BookTitle = gita.BookTitle;
    return output;
}

output = processGita(gita, output);

document.getElementById('output').innerHTML = JSON.stringify(output, null, 4);
