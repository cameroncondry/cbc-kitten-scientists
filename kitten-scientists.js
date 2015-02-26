
// ==============================
// Configure overall page display
// ==============================

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

    for (var i = 0; i < sheets.length; i++) {
        var sheet = sheets[i];

        sheet.insertRule(rule, 0);
    }
};

addRule('#gameLog .msg { display: block; }');

addRule('#game .btn {'
+ 'border-radius: 0px;'
+ 'font-family: "Courier New";'
+ 'font-size: "10px";'
+ 'margin: 0 0 5px 0;'
+ '}');

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

optionsElement.append(toggleEngine, toggleEngineLabel);
right.prepend(optionsElement);

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
            {build: 'aqueduct', require: 'minerals'},
            {build: 'lumberMill', require: 'minerals'},
            {build: 'workshop', require: 'minerals'},
            {build: 'unicornPasture', require: false}
        ],
        craft: true,
        crafts: [
            {craft: 'wood', require: 'catnip'},
            {craft: 'beam', require: 'wood'},
            {craft: 'slab', require: 'minerals'},
            {craft: 'steel', require: 'coal'},
            {craft: 'plate', require: 'iron'}
        ],
        hunt: true,
        praise: true
    },
    limit: {
        build: 0.75,
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

// Engine manager
// ==============

var Engine = function () {
    this.builds = new Builds();
    this.crafts = new Crafts();
};

Engine.prototype = {
    builds: undefined,
    crafts: undefined,
    interval: false,
    start: function () {
        if (this.loop) return;

        this.loop = setInterval(this.iteration.bind(this), options.interval);
        console.log('Starting the kitten scientists!');
    },
    stop: function () {
        if (!this.loop) return;

        clearInterval(this.loop);
        this.loop = false;
        console.log('Letting the kitten scientists rest!');
    },
    iteration: function () {
        this.observeGameLog();
        if (options.auto.praise) this.praiseSun();
        if (options.auto.hunt) this.sendHunters();
        if (options.auto.build) this.startBuilds();
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

            $(".nosel:contains('Praise the sun!')").click();
            console.log('The sun has been praised!');

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
            if (parchment.unlocked) game.craftAll(parchment.name);

            if (manuscript.unlocked && crafts.getResource(parchment.name).value > stock.parchment) {
                game.craftAll(manuscript.name);
            }

            if (compendium.unlocked && crafts.getResource(manuscript.name).value > stock.manuscript) {
                game.craftAll(compendium.name);
            }

            $("a:contains('Send hunters')").click();
            console.log('Hunters have been sent!');
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
        //console.log('Built: ' + label);
    },
    isBuildable: function (name) {
        return this.getBuild(name).unlocked;
    },
    getBuild: function (name) {
        return game.bld.getBuilding(name);
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
        console.log('Craft: ' + name + ' (' + amount + ')');
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

toggleEngine.on('change', function () {
    if (toggleEngine.is(':checked')) {
        engine.start();
    } else {
        engine.stop();
    }
});

toggleEngine.trigger('change');
