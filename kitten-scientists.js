
// Reconfigure static page display
// ========================

var container = $('#game');
var column = $('.column');

container.css({
    fontFamily: 'Courier New',
    fontSize: '12px',
    minWidth: '1300px',
    top: '32px'
});

column.css({
    minHeight: 'inherit',
    maxWidth: 'inherit',
    padding: '1%',
    margin: 0
});

var left = $('#leftColumn');
var middle = $('#midColumn');
var right = $('#rightColumn');

left.css({
    overflowY: 'hidden',
    height: '94%',
    width: '26%'
});

middle.css({
    marginTop: '1%',
    height: '94%',
    width: '48%'
});

right.css({
    height: '94%',
    width: '19%'
});

// Reconfigure dynamic page display
// ================================

var addRule = function (rule) {
    var sheets = document.styleSheets;

    for (var i = 0; i < sheets.length; i++) {
        var sheet = sheets[i];

        sheet.insertRule(rule, 0);
    }
};

addRule('#gameLog .msg {' +
'display: block;' +
'}');

addRule('#game .btn {' +
'border-radius: 0px;' +
'font-family: "Courier New";' +
'font-size: "10px";' +
'margin: 0 0 5px 0;' +
'}');

// Add options element
// ===================

var optionsElement = $('<div/>', {css: {marginBottom: '10px'}});
var toggleEngine = $('<input/>', {
    id: 'toggle-engine',
    type: 'checkbox',
    checked: 'checked'
});
var toggleEngineLabel = $('<label/>', {
    'for': 'toggle-engine',
    text: 'Toggle Kitten Scientists!'
});

right.prepend(optionsElement.append(toggleEngine, toggleEngineLabel));

