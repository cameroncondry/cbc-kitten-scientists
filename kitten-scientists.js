// ==========================================
// Begin Kitten Scientist's Automation Engine
// ==========================================

var version = 'Kitten Scientists version 1.1.8';
var address = '1AQ1AC9W5CEAPgG5739XGXC5vXqyafhoLp';
var game = gamePage;

var options = {
    interval: 2000,
    color: '#aa50fe', // dark purple
    auto: {
        build: [
            // max science
            {name: 'library', require: 'wood'},
            {name: 'academy', require: 'wood'},
            {name: 'observatory', require: 'iron'},

            // craft bonuses
            {name: 'workshop', require: 'minerals'},
            {name: 'factory', require: 'titanium'},

            // raw production
            {name: 'field', require: 'catnip'},
            {name: 'pasture', require: 'catnip'},
            {name: 'mine', require: 'wood'},
            {name: 'lumberMill', require: 'minerals'},
            {name: 'aqueduct', require: 'minerals'},
            {name: 'oilWell', require: 'coal'},
            {name: 'quarry', require: 'coal'},

            // conversion
            {name: 'smelter', require: 'minerals'},

            // storage
            {name: 'barn', require: 'wood'},
            {name: 'harbor', require: false},
            {name: 'warehouse', require: false},

            // other
            {name: 'amphitheatre', require: 'minerals'},
            {name: 'tradepost', require: 'gold'},
            {name: 'chapel', require: 'minerals'},
            {name: 'temple', require: 'gold'},
            {name: 'unicornPasture', require: false},
            {name: 'ziggurat', require: false}
        ],
        craft: [
            {name: 'wood', require: 'catnip'},
            {name: 'beam', require: 'wood'},
            {name: 'slab', require: 'minerals'},
            {name: 'steel', require: 'coal'},
            {name: 'plate', require: 'iron'},
            {name: 'alloy', require: 'titanium'}
        ],
        house: [
            {name: 'hut', require: 'wood'},
            {name: 'logHouse', require: 'minerals'},
            {name: 'mansion', require: 'titanium'}
        ],
        luxury: [
            {name: 'parchment', require: 'furs'},
            {name: 'manuscript', require: 'culture'},
            {name: 'compendium', require: 'science'},
            {name: 'blueprint', require: false}
        ],
        trade: [
            {name: 'zebras', require: 'slab', season: 'summer'}
        ]
    },

    enabled: {
        tab: {
            build: true,
            craft: true,
            house: true,
            hunt: true,
            luxury: true,
            praising: true,
            trading: true,
            festival: true
        },
        build: {
            library: true,
            academy: true,
            observatory: true,
            workshop: true,
            factory: true,
            field: true,
            pasture: true,
            mine: true,
            lumberMill: true,
            aqueduct: true,
            oilWell: true,
            quarry: true,
            smelter: true,
            barn: true,
            harbor: true,
            warehouse: true,
            ampitheater: true,
            tradepost: true,
            chapel: true,
            temple: true,
            unicornPasture: true,
            ziggurat: true
        },
        craft: {
            wood: true,
            beam: true,
            slab: true,
            steel: true,
            plate: true,
            alloy: true
        }
    },
    stock: { // all items default to 0
    },
    require: {
        build: 0.75,
        craft: 0.95,
        house: 0.85,
        hunt: 0.95,
        luxury: 0.99,
        faith: 0.99,
        trade: 0.99
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
    $('.type_' + args[1]).css('color', options.color);
};

var warning = function () {
    var args =  Array.prototype.slice.call(arguments);
    args.unshift('Warning!');

    if (this.console) console.log(args);
};

// Core Engine for Kitten Scientists
// =================================

var Engine = function () {};

Engine.prototype = {
    loop: undefined,
    start: function () {
        if (this.loop) return;

        this.loop = setInterval(this.iterate.bind(this), options.interval);
        message('Enabling the kitten scientists!');
    },
    stop: function () {
        if (!this.loop) return;

        clearInterval(this.loop);
        this.loop = undefined;
        message('Disabling the kitten scientists!');
    },
    iterate: function () {}
};

// Tab Manager
// ===========

var TabManager = function (name) {
    this.setTab(name);
};

TabManager.prototype = {
    tab: undefined,
    getButtons: function () {
        if (this.tab) return this.tab.buttons;
    },
    render: function () {
        if (this.tab && game.activeTabId !== this.tab.tabId) this.tab.render();
    },
    setTab: function (name) {
        for (var i in game.tabs) {
            if (game.tabs[i].tabId === name) {
                this.tab = game.tabs[i];
                break;
            }
        }

        if (!this.tab) warning('unable to find tab ' + name);
    }
};

// Building manager
// ================

var BuildManager = function () {
    this.manager = new TabManager('Bonfire');
};

BuildManager.prototype = {
    manager: undefined,
    getBuild: function (name) {
        return game.bld.getBuilding(name);
    },
    getBuildButton: function (name) {
        var buttons = this.manager.getButtons();
        var label = this.getBuild(name).label;

        for (var i in buttons) {
            if (buttons[i].name === label) return buttons[i];
        }
    }
};
























