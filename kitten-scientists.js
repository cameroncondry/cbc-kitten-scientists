// ==========================================
// Begin Kitten Scientist's Automation Engine
// ==========================================

var version = 'Kitten Scientists version 1.1.8';
var address = '1AQ1AC9W5CEAPgG5739XGXC5vXqyafhoLp';
var game = gamePage;

var options = {
    interval: 2000,
    color: '#aa50fe', // dark purple
    consume: 0.5,
    auto: {
        engine: {enabled: true},
        faith: {enabled: true, trigger: 0.99},
        festival: {enabled: false},
        hunt: {enabled: true, trigger: 0.95},
        luxury: {enabled: true, trigger: 0.99, items: ['parchment', 'manuscript', 'compendium', 'blueprint']},
        build: {
            enabled: true, trigger: 0.75, items: {
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
            enabled: true, trigger: 0.95, items: {
                wood: {require: 'catnip', stock: 0, enabled: true},
                beam: {require: 'wood', stock: 0, enabled: true},
                slab: {require: 'minerals', stock: 0, enabled: true},
                steel: {require: 'coal', stock: 0, enabled: true},
                plate: {require: 'iron', stock: 0, enabled: true},
                alloy: {require: 'titanium', stock: 0, enabled: false},
                concrete: {require: false, stock: 0, enabled: false},
                gear: {require: false, stock: 0, enabled: false},
                scaffold: {require: false, stock: 0, enabled: false},
                ship: {require: false, stock: 0, enabled: false},
                tanker: {require: false, stock: 0, enabled: false},
                parchment: {require: false, stock: 0, enabled: true},
                manuscript: {require: 'culture', stock: 0, enabled: true},
                compendium: {require: 'science', stock: 0, enabled: true},
                blueprint: {require: false, stock: 0, enabled: false},
                megalith: {require: false, stock: 0, enabled: false}
            }
        },
        trade: {
            enabled: true, trigger: 0.99, items: {
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

    if (console) console.log(args);
};

// Core Engine for Kitten Scientists
// =================================

var Engine = function () {
    this.craftManager = new CraftManager();
};

Engine.prototype = {
    craftManager: undefined,
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
        this.observeGameLog();
        if (options.auto.craft.enabled) this.startCrafts();
    },
    observeGameLog: function () {
        // @TODO: determine if this can be accomplished outside the interface
        $('#gameLog').find('input').click();
    },
    startCrafts: function () {
        var crafts = options.auto.craft.items;
        var trigger = options.auto.craft.trigger;
        var manager = this.craftManager;

        for (var name in crafts) {
            // luxury items are crafted during different triggers
            if (options.auto.luxury.items.indexOf(name) !== -1) continue;

            var craft = crafts[name];
            var require = !craft.require ? false : manager.getResource(craft.require);

            if (!require || trigger <= require.value / require.maxValue) {
                manager.craft(name, manager.getLowestCraftAmount(name));
            }
        }
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

// Crafting Manager
// ================

var CraftManager = function () {};

CraftManager.prototype = {
    craft: function (name, amount) {
        amount = Math.floor(amount);

        if (undefined === name || 1 > amount) return;
        if (!this.canCraft(name, amount)) return;

        var craft = this.getCraft(name);
        var ratio = ('wood' === name) ? 'refineRatio' : 'craftRatio';

        game.craft(craft.name, amount);

        // determine actual amount after crafting upgrades
        amount = (amount * (game.bld.getEffect(ratio) + 1)).toFixed(2);

        message('Kittens Craft: +' + amount + ' ' + name);
    },
    canCraft: function (name, amount) {
        var craft = this.getCraft(name);
        var enabled = options.auto.craft.items[name].enabled;
        var result = false;

        if (enabled && craft.unlocked) {
            result = true;

            for (var i in craft.prices) {
                var price = craft.prices[i];
                var value = this.getValueAvailable(price.name);

                if (value < price.val * amount) {
                    result = false;
                }
            }
        }

        return result;
    },
    getCraft: function (name) {
        // adjust for spelling discrepancies in core game logic
        if ('compendium' === name) name = 'compedium';
        if ('concrete' === name) name = 'concrate';

        return game.workshop.getCraft(name);
    },
    getLowestCraftAmount: function (name) {
        var amount = 0;
        var consume = options.consume;
        var materials = this.getMaterials(name);

        for (var i in materials) {
            var total = this.getValueAvailable(i) * consume / materials[i];

            amount = (0 === amount || total < amount) ? total : amount;
        }

        return amount;
    },
    getMaterials: function (name) {
        var materials = {};
        var prices = this.getCraft(name).prices;

        for (var i in prices) {
            var price = prices[i];

            materials[price.name] = price.val;
        }

        return materials;
    },
    getResource: function (name) {
        // adjust for spelling discrepancies in core game logic
        if ('catpower' === name) name = 'manpower';
        if ('compendium' === name) name = 'compedium';
        if ('concrete' === name) name = 'concrate';

        return game.resPool.get(name);
    },
    getValue: function (name) {
        return this.getResource(name).value;
    },
    getValueAvailable: function (name) {
        var value = this.getValue(name);
        var stock = !options.auto.craft.items[name] ? 0 : options.auto.craft.items[name].stock;

        if ('catnip' === name) {
            var resPerTick = game.getResourcePerTick(name, false, {
                modifiers: {
                    'catnip': 0.10 - game.calendar.getWeatherMod()
                }});

            if (resPerTick < 0) stock -= resPerTick * 202 * 5;
        }

        return value - stock;
    }
};






















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
+ 'margin: 0 0 7px 0;'
+ '}');

addRule('#ks-options ul {'
+ 'list-style: none;'
+ 'margin: 0 0 5px;'
+ 'padding: 0;'
+ '}');

addRule('#ks-options ul:after {'
+ 'clear: both;'
+ 'content: " ";'
+ 'display: block;'
+ 'height: 0;'
+ '}');

addRule('#ks-options ul li {'
+ 'display: block;'
+ 'float: left;'
+ 'width: 50%;'
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
        type: 'checkbox'
    });

    if (options.auto[name].enabled) {
        toggle.prop('checked', 'checked');
    }

    return li.append(toggle, label);
};

var optionsElement = $('<div/>', {id: 'ks-options', css: {marginBottom: '10px'}});
var optionsListElement = $('<ul/>');
var optionsTitleElement = $('<div/>', {
    css: { borderBottom: '1px solid gray', marginBottom: '5px' },
    text: version
});

optionsElement.append(optionsTitleElement);

optionsListElement.append(getToggle('engine', 'Engine').css('width', '100%'));
optionsListElement.append(getToggle('craft', 'Crafting'));
optionsListElement.append(getToggle('hunt', 'Hunting'));
optionsListElement.append(getToggle('build', 'Building'));
optionsListElement.append(getToggle('luxury', 'Luxury'));
optionsListElement.append(getToggle('trade', 'Trading'));
optionsListElement.append(getToggle('festival', 'Festival'));

// add the options above the game log
right.prepend(optionsElement.append(optionsListElement));

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

var ucfirst = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

$.each(Object.keys(options.auto), function (event, option) {
    var toggle = $('#toggle-' + option);

    toggle.on('change', function () {
        if (toggle.is(':checked')) {
            options.auto[option].enabled = true;
            message('Enabled Auto ' + ucfirst(option));
        } else {
            options.auto[option].enabled = false;
            message('Disabled Auto ' + ucfirst(option));
        }
    });
});