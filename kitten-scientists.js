
// ==============================
// Configure overall page display
// ==============================

var version = 'Kitten Scientists version 1.1.0';
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
    height: '92%',
    width: '26%'
});

middle.css({
    marginTop: '1%',
    height: '92%',
    width: '48%'
});

right.css({
    height: '92%',
    width: '19%'
});

// Reconfigure dynamic page display
// ================================

var addRule = function (rule) {
    var sheets = document.styleSheets;
    sheets[0].insertRule(rule, 1);
};

addRule('#gameLog .msg {'
+ 'display: block;'
+ '}');

addRule('#resContainer .maxRes {'
+ 'color: #676766;'
+ '}');

addRule('#game .btn {'
+ 'border-radius: 0px;'
+ 'font-family: "Courier New";'
+ 'font-size: "10px";'
+ 'margin: 0 0 5px 0;'
+ '}');

addRule('#ks-options ul {'
+ 'list-style: none;'
+ 'margin: 0;'
+ 'padding: 0;'
+ '}');

// Add options element
// ===================

var getToggle = function (name, text) {
    var li = $('<li/>');

    var label = $('<label/>', {
        'for': 'toggle-' + name,
        text: text
    });

    var toggle = $('<input/>', {
        id: 'toggle-' + name,
        type: 'checkbox',
        checked: 'checked'
    });

    return li.append(toggle, label);
};

var optionsElement = $('<div/>', {id: 'ks-options', css: {marginBottom: '10px'}});
var optionsListElement = $('<ul/>');
var optionsTitleElement = $('<div/>', {
    css: { borderBottom: '1px solid gray', marginBottom: '5px' },
    text: version
});

optionsElement.append(optionsTitleElement);

optionsListElement.append(getToggle('engine', 'Freeze Scientists'));
optionsListElement.append(getToggle('craft', 'Auto Craft'));
optionsListElement.append(getToggle('build', 'Auto Build'));
optionsListElement.append(getToggle('housing', 'Auto Housing'));
optionsListElement.append(getToggle('hunt', 'Auto Hunt'));
optionsListElement.append(getToggle('praise', 'Auto Praise'));

// add the options above the game log
right.prepend(optionsElement.append(optionsListElement));

// ==========================================
// Begin Kitten Scientist's Automation Engine
// ==========================================

var game = gamePage;

var options = {
    interval: 500,
    amount: {
        craft: 0.5
    },
    auto: {
        build: true,
        builds: [
            {build: 'field', require: 'catnip'},
            {build: 'pasture', require: 'catnip'},
            {build: 'library', require: 'wood'},
            {build: 'academy', require: 'wood'},
            {build: 'mine', require: 'wood'},
            {build: 'barn', require: 'wood'},
            {build: 'aqueduct', require: 'minerals'},
            {build: 'lumberMill', require: 'minerals'},
            {build: 'workshop', require: 'minerals'},
            {build: 'unicornPasture', require: false}
        ],
        housing: true,
        housings: [
            {housing: 'hut', require: 'wood'},
            {housing: 'logHouse', require: 'minerals'}
        ],
        craft: true,
        crafts: [
            {craft: 'wood', require: 'catnip'},
            {craft: 'beam', require: 'wood'},
            {craft: 'slab', require: 'minerals'},
            {craft: 'plate', require: 'iron'},
            {craft: 'steel', require: 'coal'}
        ],
        hunt: true,
        praise: true
    },
    gameLog: {
        color: '#aa50fe' // dark purple
    },
    limit: {
        build: 0.75,
        housing: 0.85,
        craft: 0.95,
        hunt: 0.95,
        faith: 0.95
    },
    stock: {
        compendium: 500,
        manuscript: 500,
        parchment: 2500
    }
};

// GameLog Modification
// ====================

var gameLog = com.nuclearunicorn.game.log.Console().static;

var message = function () {
    var args = Array.prototype.slice.call(arguments);
    args[1] = args[1] || 'ks-default';

    // update the color of the message immediately after adding
    gameLog.msg.apply(gameLog, args);
    $('.type_' + args[1]).css('color', options.gameLog.color);
};

// Engine manager
// ==============

var Engine = function () {
    this.builds = new Builds();
    this.crafts = new Crafts();
    this.housings = new Builds();
};

Engine.prototype = {
    builds: undefined,
    crafts: undefined,
    interval: false,
    start: function () {
        if (this.loop) return;

        this.loop = setInterval(this.iterate.bind(this), options.interval);
        message('Starting the kitten scientists!');
    },
    stop: function () {
        if (!this.loop) return;

        clearInterval(this.loop);
        this.loop = false;
        message('Freezing the kitten scientists!');
    },
    iterate: function () {
        this.observeGameLog();
        if (options.auto.praise) this.praiseSun();
        if (options.auto.hunt) this.sendHunters();
        if (options.auto.build) this.startBuilds();
        if (options.auto.housing) this.startHousings();
        if (options.auto.craft) this.startCrafts();
    },
    observeGameLog: function () {
        $('#gameLog').find('input').click();
    },
    praiseSun: function () {
        var currentTab = game.activeTabId;
        var faith = this.crafts.getResource('faith');

        if (faith.value / faith.maxValue >= options.limit.faith) {
            game.activeTabId = 'Religion';
            game.render();

            message('The sun has been praised!');
            $(".nosel:contains('Praise the sun!')").click();

            game.activeTabId = currentTab;
            game.render();
        }
    },
    sendHunters: function () {
        var catpower = this.crafts.getResource('manpower');
        var crafts = this.crafts;
        var stock = options.stock;
        var workshop = game.workshop;
        var parchment = workshop.getCraft('parchment');
        var manuscript = workshop.getCraft('manuscript');
        var compendium = workshop.getCraft('compedium');
        var blueprint = workshop.getCraft('blueprint');

        if (catpower.value / catpower.maxValue > options.limit.hunt) {
            if (parchment.unlocked) {
                game.craftAll(parchment.name);
            }

            if (manuscript.unlocked && crafts.getResource(parchment.name).value > stock.parchment) {
                game.craftAll(manuscript.name);
            }

            if (compendium.unlocked && crafts.getResource(manuscript.name).value > stock.manuscript) {
                game.craftAll(compendium.name);
                message('Auto Hunt: crafted parchments, manuscripts, and compendiums');
            }

            message('Auto Hunt: Hunters deployed!');
            $("a:contains('Send hunters')").click();
        }
    },
    startBuilds: function () {
        var builds = this.builds;
        var crafts = this.crafts;
        var limits = options.limit.build;
        var build, require;

        for (i in options.auto.builds) {
            build = options.auto.builds[i];
            require = !build.require ? build.require : crafts.getResource(build.require);

            if (!require || require.value / require.maxValue >= limits) {
                builds.build(build.build);
            }
        }
    },
    startHousings: function () {
        var housings = this.housings;
        var crafts = this.crafts;
        var limits = options.limit.housing;
        var housing, require;

        for (i in options.auto.housings) {
            housing = options.auto.housings[i];
            require = !housing.require ? housing.require : crafts.getResource(housing.require);

            if (!require || require.value / require.maxValue >= limits) {
                housings.build(housing.housing);
            }
        }
    },
    startCrafts: function () {
        var crafts = this.crafts;
        var amount = options.amount.craft;
        var limits = options.limit.craft;
        var cost, craft, require;

        for (i in options.auto.crafts) {
            craft = options.auto.crafts[i];
            require = crafts.getResource(craft.require);
            cost = crafts.getMaterials(craft.craft)[require.name];

            if (require.value / require.maxValue >= limits) {
                crafts.craft(craft.craft, (require.value * amount / cost));
            }
        }
    }
};

// Building manager
// ================

var Builds = function () {
    this.crafts = new Crafts();
};

Builds.prototype = {
    crafts: undefined,
    build: function (name) {
        if (!this.isBuildable(name)) return;

        var label = this.getBuild(name).label;
        var button = $(".nosel:not('.disabled'):contains('" + label + "')");

        if (button.length === 0) return;

        button.click();
        message('Auto Build: +1 ' + label);
    },
    isBuildable: function (name) {
        var buildable = this.getBuild(name).unlocked;

        if (buildable) {
            var crafts = this.crafts;
            var prices = this.getPrices(name);

            for (i in prices) {
                var price = prices[i];

                if (crafts.getValue(price.name) < price.val) {
                    buildable = false;
                }
            }
        }

        return buildable;
    },
    getBuild: function (name) {
        return game.bld.getBuilding(name);
    },
    getPrices: function (name) {
        return game.bld.getPrices(name);
    }
};

// Crafting manager
// ================

var Crafts = function () {};

Crafts.prototype = {
    craft: function (name, amount) {
        if (name === undefined || amount < 1) return;
        if (!this.isCraftable(name, amount)) return;

        amount = Math.floor(amount);

        game.craft(name, amount);

        // determine actual amount after crafting upgrades
        var ratio = ('wood' === name) ? 'refineRatio' : 'craftRatio';
        amount = (amount * (game.bld.getEffect(ratio) + 1)).toFixed(2);

        message('Auto Craft: +' + amount + ' ' + name);
    },
    isCraftable: function (name, amount) {
        var craftable = false;
        var craft = this.getCraft(name);

        if (craft.unlocked) {
            craftable = true;

            for (i in craft.prices) {
                var price = craft.prices[i];

                if (this.getValue(price.name) < price.val * amount) {
                    craftable = false;
                }
            }
        }

        return craftable;
    },
    getCraft: function (name) {
        return game.workshop.getCraft(name);
    },
    getMaterials: function (name) {
        var materials = {};
        var prices = this.getCraft(name).prices;

        for (i in prices) {
            var price = prices[i];

            materials[price.name] = price.val;
        }

        return materials;
    },
    getResource: function (name) {
        return game.resPool.get(name);
    },
    getValue: function (name) {
        return this.getResource(name).value;
    }
};

// Initialize and set toggles for Engine
// =====================================

var engine = new Engine();
var toggleEngine = $('#toggle-engine');

toggleEngine.on('change', function () {
    if (toggleEngine.is(':checked')) {
        engine.start();
    } else {
        engine.stop();
    }
});

toggleEngine.trigger('change');

// Add toggles for options
// =======================

var autoOptions = ['build', 'craft', 'hunt', 'praise'];

var ucfirst = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

$.each(autoOptions, function (event, option) {
    var toggle = $('#toggle-' + option);

    toggle.on('change', function () {
        if (toggle.is(':checked')) {
            options.auto[option] = true;
            message('Enabled Auto ' + ucfirst(option));
        } else {
            options.auto[option] = false;
            message('Disable Auto ' + ucfirst(option));
        }
    });
});
