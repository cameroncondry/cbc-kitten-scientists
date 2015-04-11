// ==========================================
// Begin Kitten Scientist's Automation Engine
// ==========================================

var version = 'Kitten Scientists version 1.1.7';
var game = gamePage;

var options = {
    interval: 3000,
    color: '#aa50fe', // dark purple
    amount: {
        consume: 0.5
    },
    auto: {
        build: [
            {name: 'field', require: 'catnip'},
            {name: 'pasture', require: 'catnip'},
            {name: 'mine', require: 'wood'},
            {name: 'library', require: 'wood'},
            {name: 'academy', require: 'wood'},
            {name: 'barn', require: 'wood'},
            {name: 'workshop', require: 'minerals'},
            {name: 'lumberMill', require: 'minerals'},
            {name: 'aqueduct', require: 'minerals'},
            {name: 'unicornPasture', require: 'unicorns'},
            {name: 'tradepost', require: 'gold'}
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
            //{name: 'parchment', require: 'furs'},
            {name: 'manuscript', require: 'culture'},
            {name: 'compendium', require: 'science'}
        ],
        trade: [
            {name: 'zebras', require: 'slab', season: 'summer', amount: 0.25 },
            {name: 'zebras', require: 'slab', season: 'winter', amount: 0.25 }
        ]
    },
    limit: {
        build: 0.75,
        craft: 0.95,
        house: 0.85,
        hunt: 0.95,
        luxury: 0.99,
        faith: 0.99,
        trade: 0.95
    },
    stock: {
        steel: 1000,
        furs: 1000,
        compendium: 500,
        manuscript: 500,
        parchment: 500
    },
    toggle: {
        building: true,
        crafting: true,
        housing: true,
        hunting: true,
        luxury: true,
        praising: true,
        trading: true,
        festival: false
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

// Core Engine for Kitten Scientists
// =================================

var Engine = function () {
    this.buildManager = new BuildManager();
    this.craftManager = new CraftManager();
    this.tradeManager = new TradeManager();

    // Game Tabs
    this.religionTab = new ReligionTab();
    this.villageTab = new VillageTab();
};

Engine.prototype = {
    buildManager: undefined,
    craftManager: undefined,
    tradeManager: undefined,
    religionTab: undefined,
    villageTab: undefined,
    loop: undefined,
    start: function () {
        if (this.loop) return;

        this.loop = setInterval(this.iterate.bind(this), options.interval);
        message('Starting the kitten scientists!');
    },
    stop: function () {
        if (!this.loop) return;

        clearInterval(this.loop);
        this.loop = undefined;
        message('Freezing the kitten scientists!');
    },
    iterate: function () {
        this.observeGameLog();
        if (options.toggle.praising) this.praiseSun();
        if (options.toggle.festival) this.holdFestival();
        if (options.toggle.trading) this.startTrades('trade', options.auto.trade);
        if (options.toggle.hunting) this.sendHunters();
        if (options.toggle.building) this.startBuilds('build', options.auto.build);
        if (options.toggle.housing) this.startBuilds('house', options.auto.house);
        if (options.toggle.crafting) this.startCrafts('craft', options.auto.craft);
    },
    observeGameLog: function () {
        $('#gameLog').find('input').click();
    },
    praiseSun: function () {
        var faith = this.craftManager.getResource('faith');

        if (faith.value / faith.maxValue >= options.limit.faith) {
            this.religionTab.clickPraiseBtn();
            message('The sun has been praised!');
        }
    },
    holdFestival: function () {
        if (game.calendar.festivalDays === 0) {
            this.villageTab.clickFestivalBtn();
            message('A festival has been held!');
        }
    },
    sendHunters: function () {
        var catpower = this.craftManager.getResource('manpower');
        var workshop = game.workshop;
        var parchment = workshop.getCraft('parchment');

        if (catpower.value / catpower.maxValue > options.limit.hunt) {
            if (parchment.unlocked) {
                game.craftAll(parchment.name);
                message('Auto Hunt: crafted all parchments');
            }

            // Generate luxury goods before sending hunters
            if (options.toggle.luxury) this.startCrafts('luxury', options.auto.luxury);

            message('Kittens Hunt: Hunters deployed!');
            $("a:contains('Send hunters')").click();
        }
    },
    startBuilds: function (type, builds) {
        var buildManager = this.buildManager;
        var craftManager = this.craftManager;
        var limit = options.limit[type];

        for (i in builds) {
            var build = builds[i];
            var require = !build.require ? false : craftManager.getResource(build.require);

            if (require === false || limit <= require.value / require.maxValue) {
                buildManager.build(build.name);
            }
        }
    },
    startCrafts: function (type, crafts) {
        var limit = options.limit[type];
        var craftManager = this.craftManager;

        for (i in crafts) {
            var craft = crafts[i];
            var require = !craft.require ? false : craftManager.getResource(craft.require);

            if (limit <= require.value / require.maxValue) {
                craftManager.craft(craft.name, craftManager.getLowestCraftAmount(craft.name));
            }
        }
    },
    startTrades: function(type, trades) {
        var limit = options.limit[type];
        var tradeManager = this.tradeManager;
        var craftManager = this.craftManager;
        var totalAmount = tradeManager.getLowestTradeAmount();
        var gold = craftManager.getResource('gold');
        var catpower = craftManager.getResource('catpower');

        // Ensure we have enough gold and catpower to start trading
        if (limit > gold.value / gold.maxValue) return;
        if (limit > catpower.value / catpower.maxValue) return;

        for (i in trades) {
            var trade = trades[i];
            var require = !trade.require ? false : craftManager.getResource(trade.require);
            var season = game.calendar.getCurSeason().name;

            if (season == trade.season && (require === false || limit <= require.value/ require.maxValue)) {

                var tradeAmount = totalAmount * trade.amount;
                tradeManager.trade(trade.name,
                                   tradeManager.getLowestTradeAmount(trade.name, tradeAmount));
            }
        }
    }
};

// Tab manager
// ===========

var TabManager = function (name) {
    var tab = undefined;
    for (var i = 0; i < game.tabs.length; i++) {
        if (game.tabs[i].tabId === name) {
            tab = game.tabs[i];
        }
    }

    // Throw an exception if we failed to find the tab
    if (tab === undefined)
        throw "'" + name + "' tab not found";

    this.tab = tab;
}

TabManager.prototype = {
    tab: undefined,
    render: function () {
        // Only render if it's not the active tab
        if (game.activeTabId !== name) {
            this.tab.render();
        }
    }
}

// Religion Tab
// ============

var ReligionTab = function () {
    TabManager.call(this, 'Religion');
}

ReligionTab.prototype = Object.create(TabManager.prototype);
ReligionTab.prototype.constructor = ReligionTab;

ReligionTab.prototype.clickPraiseBtn = function () {
    this.render();
    if (!this.tab.praiseBtn.enabled) return;

    this.tab.praiseBtn.onClick();
}

// Village Tab
// ===========

var VillageTab = function () {
    TabManager.call(this, 'Small village');
}

VillageTab.prototype = Object.create(TabManager.prototype);
VillageTab.prototype.constructor = VillageTab;

VillageTab.prototype.clickFestivalBtn = function () {
    this.render();
    if (!this.tab.festivalBtn.enabled) return;

    this.tab.festivalBtn.onClick();
}

// Bonfire Tab
// ===========

var BonfireTab = function() {
    TabManager.call(this, 'Bonfire');
}

BonfireTab.prototype = Object.create(TabManager.prototype);
BonfireTab.prototype.constructor = BonfireTab;

BonfireTab.prototype.getBuildingBtn = function(label) {
    this.render();

    for (i in this.tab.buttons) {
        var button = this.tab.buttons[i];
        if (button.name === label) return button;
    }

    throw "'" + label + "' building not found";

}

// Trade Tab
// =========

var TradeTab = function() {
    TabManager.call(this, 'Trade');
}

TradeTab.prototype = Object.create(TabManager.prototype);
TradeTab.prototype.constructor = TradeTab;

TradeTab.prototype.getTradeBtn = function(race) {
    this.render();

    for (i in this.tab.racePanels) {
        var panel = this.tab.racePanels[i];
        if (panel.name === race) return panel.tradeBtn;
    }

    throw "'" + race + "' race not found";
}

// Building manager
// ================

var BuildManager = function () {
    this.craftManager = new CraftManager();
    this.bonfireTab = new BonfireTab();
};

BuildManager.prototype = {
    craftManager: undefined,
    bonfireTab: undefined,
    build: function (name) {
        if (!this.isBuildable(name)) return;

        var label = this.getBuilding(name).label;
        var button = this.bonfireTab.getBuildingBtn(label);

        if (!button.enabled) return;

        button.onClick();
        message('Kittens Build: +1 ' + button.name);
    },
    isBuildable: function (name) {
        var buildable = this.getBuilding(name).unlocked;

        if (buildable) {
            var manager = this.craftManager;
            var prices = this.getPrices(name);

            for (i in prices) {
                var price = prices[i];

                if (manager.getValueAvailable(price.name) < price.val) {
                    buildable = false;
                }
            }
        }

        return buildable;
    },
    getBuilding: function (name) {
        return game.bld.getBuilding(name);
    },
    getPrices: function (name) {
        return game.bld.getPrices(name);
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
        var result = false;

        if (craft.unlocked) {
            result = true;

            for (i in craft.prices) {
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
        // adjust for spelling bug in core game logic
        if ('compendium' === name) name = 'compedium';

        return game.workshop.getCraft(name);
    },
    getLowestCraftAmount: function (name) {
        var amount = 0;
        var consume = options.amount.consume;
        var materials = this.getMaterials(name);

        for (i in materials) {
            var total = this.getValueAvailable(i) * consume / materials[i];

            amount = (0 === amount || total < amount) ? total : amount;
        }

        return amount;
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
        // adjust for spelling discrepancies in core game logic
        if ('compendium' === name) name = 'compedium';
        if ('catpower' === name) name = 'manpower';

        return game.resPool.get(name);
    },
    getValue: function (name) {
        return this.getResource(name).value;
    },
    getValueAvailable: function (name) {
        var value = this.getValue(name);
        var stock = options.stock[name] || 0;

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

// Trading Manager
// ================

var TradeManager = function () {
    this.craftManager = new CraftManager();
    this.tradeTab = new TradeTab();
};

TradeManager.prototype = {
    craftManager: undefined,
    tradeTab: undefined,
    trade: function (name, amount) {
        amount = Math.floor(amount);

        if (undefined === name || 1 > amount) return;
        if (!this.canTrade(name, amount)) return;

        var button = this.tradeTab.getTradeBtn(name);
        button.tradeMultiple(amount);

        message('Kittens Trade: ' + amount + 'x ' + name);
    },
    canTrade: function (name, amount) {
        var materials = this.getMaterials(name);
        var result = false;

        if (this.getRace(name).unlocked) {
            result = true;

            for (i in materials) {
                var value = this.craftManager.getValueAvailable(i);

                if (value < materials[i] * amount) {
                    result = false;
                }
            }
        }

        return result;
    },
    getRace: function (name) {
        return game.diplomacy.get(name);
    },
    getLowestTradeAmount: function (name, max) {
        var amount = 0;
        var consume = options.amount.consume;
        var materials = this.getMaterials(name);

        for (i in materials) {
            var total = this.craftManager.getValueAvailable(i) * consume / materials[i];

            amount = (0 === amount || total < amount) ? total : amount;
        }

        if (max < amount)
            return max;
        else
            return amount;
    },
    getMaterials: function (name) {
        var materials = {catpower: 50, gold: 15};

        if (name === undefined)
            return materials;

        var prices = prices = this.getRace(name).buys;

        for (i in prices) {
            var price = prices[i];

            materials[price.name] = price.val;
        }

        return materials;
    },
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
        type: 'checkbox',
    });

    if ( options.toggle[name] ) {
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
optionsListElement.append(getToggle('crafting', 'Crafting'));
optionsListElement.append(getToggle('housing', 'Housing'));
optionsListElement.append(getToggle('building', 'Building'));
optionsListElement.append(getToggle('praising', 'Faith'));
optionsListElement.append(getToggle('hunting', 'Hunting'));
optionsListElement.append(getToggle('luxury', 'Luxury'));
optionsListElement.append(getToggle('trading', 'Trading'));
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

$.each(Object.keys(options.toggle), function (event, option) {
    var toggle = $('#toggle-' + option);

    toggle.on('change', function () {
        if (toggle.is(':checked')) {
            options.toggle[option] = true;
            message('Enabled Auto ' + ucfirst(option));
        } else {
            options.toggle[option] = false;
            message('Disabled Auto ' + ucfirst(option));
        }
    });
});
