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
        hunt: {enabled: true, require: 0.95},
        faith: {enabled: true, require: 0.99},
        build: {
            enabled: true, require: 0.75, items: {
                // science
                library: {require: 'wood', enabled: true},
                academy: {require: 'wood', enabled: true},
                observatory: {require: 'iron', enabled: true},

                // craft bonuses
                workshop: {require: 'minerals', enabled: true},
                factory: {require: 'titanium', enabled: true},

                // production
                field: {require: 'catnip', enabled: true},
                pasture: {require: 'catnip', enabled: true},
                mine: {require: 'wood', enabled: true},
                lumberMill: {require: 'minerals', enabled: true},
                aqueduct: {require: 'minerals', enabled: true},
                oilWell: {require: 'coal', enabled: true},
                quarry: {require: 'coal', enabled: true},

                // conversion
                smelter: {require: 'minerals', enabled: true},

                // storage
                barn: {require: 'wood', enabled: true},
                harbor: {require: false, enabled: false},
                warehouse: {require: false, enabled: false},

                // housing
                hut: {require: 'wood', enabled: true},
                logHouse: {require: 'minerals', enabled: true},
                mansion: {require: 'titanium', enabled: true},

                // other
                amphitheatre: {require: 'minerals', enabled: true},
                tradepost: {require: 'gold', enabled: true},
                chapel: {require: 'minerals', enabled: true},
                temple: {require: 'gold', enabled: true},
                unicornPasture: {require: false, enabled: true},
                ziggurat: {require: false, enabled: true}
            }
        },
        craft: {
            enabled: true, require: 0.95, items: {
                // raw
                wood: {require: 'catnip', stock: 0, enabled: true},
                beam: {require: 'wood', stock: 0, enabled: true},
                slab: {require: 'minerals', stock: 0, enabled: true},
                steel: {require: 'coal', stock: 0, enabled: true},
                plate: {require: 'iron', stock: 0, enabled: true},

                // complex
                alloy: {require: 'titanium', stock: 0, enabled: false},
                concrete: {require: false, stock: 0, enabled: false},
                gear: {require: false, stock: 0, enabled: false},
                scaffold: {require: false, stock: 0, enabled: false},
                ship: {require: false, stock: 0, enabled: false},
                tanker: {require: false, stock: 0, enabled: false},
                megalith: {require: false, stock: 0, enabled: false}
            }
        },
        luxury: {
            enabled: true, require: 0.99, items: {
                parchment: {require: 'furs', stock: 0, enabled: true},
                manuscript: {require: 'culture', stock: 0, enabled: true},
                compendium: {require: 'science', stock: 0, enabled: true},
                blueprint: {require: false, stock: 0, enabled: false}
            }
        },
        trade: {
            enabled: true, require: 0.99, items: {
                zebras: {max: 'titanium', require: 'slab', season: 'summer'}
            }
        }
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
    var args = Array.prototype.slice.call(arguments);
    args.unshift('Warning!');

    if (this.console) console.log(args);
};

// Core Engine for Kitten Scientists
// =================================

var Engine = function () {
};

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
    iterate: function () {
    }
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
























