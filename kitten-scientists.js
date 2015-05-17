// ==========================================
// Begin Kitten Scientist's Automation Engine
// ==========================================

var version = 'Kitten Scientists version 1.2.4';
var address = '1AQ1AC9W5CEAPgG5739XGXC5vXqyafhoLp';
var game = gamePage;

var options = {
    debug: false,
    interval: 2000,
    msgcolor: '#aa50fe', // dark purple
    summarycolor: '#009933', // light green
    activitycolor: '#E65C00', // orange
    showactivity: true,
    consume: 0.5,
    logMessages: 100,
    auto: {
        engine: {enabled: false},
        faith: {enabled: true, trigger: 0.99},
        festival: {enabled: true},
        hunt: {enabled: true, trigger: 0.6},
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
                biolab: {require: 'science', enabled: false},
                calciner: {require: 'titanium', enabled: false},
                reactor: {require: 'titanium', enabled: false},
                accelerator: {require: 'titanium', enabled: false},
                steamworks: {require: false, enabled: false},
                magneto: {require: false, enabled: false},

                // storage
                barn: {require: 'wood', enabled: true},
                harbor: {require: false, enabled: false},
                warehouse: {require: false, enabled: false},

                // housing
                hut: {require: 'wood', enabled: false},
                logHouse: {require: 'minerals', enabled: false},
                mansion: {require: 'titanium', enabled: false},

                // other
                amphitheatre: {require: 'minerals', enabled: true},
                tradepost: {require: 'gold', enabled: true},
                chapel: {require: 'minerals', enabled: true},
                temple: {require: 'gold', enabled: true},
                mint: {require: false, enabled: false},
                unicornPasture: {require: false, enabled: true},
                ziggurat: {require: false, enabled: true},
                chronosphere: {require: 'unobtanium', enabled: true},
            }
        },
        craft: {
            enabled: true, trigger: 0.95, items: {
                wood: {require: 'catnip', max: 0, limited: false, enabled: true},
                beam: {require: 'wood', max: 0, limited: false, enabled: true},
                slab: {require: 'minerals', max: 0, limited: false, enabled: true},
                steel: {require: 'coal', max: 0, limited: false, enabled: true},
                plate: {require: 'iron', max: 0, limited: false, enabled: true},
                alloy: {require: 'titanium', max: 0, limited: true, enabled: false},
                concrete: {require: false, max: 0, limited: true, enabled: false},
                gear: {require: false, max: 0, limited: true, enabled: false},
                scaffold: {require: false, max: 0, limited: true, enabled: false},
                ship: {require: false, max: 0, limited: true, enabled: false},
                tanker: {require: false, max: 0, limited: true, enabled: false},
                parchment: {require: false, max: 0,  limited: true, enabled: true},
                manuscript: {require: 'culture', max: 0, limited: true, enabled: true},
                compendium: {require: 'science', max: 0, limited: true, enabled: true},
                blueprint: {require: 'science', max: 0, limited: true, enabled: false},
                megalith: {require: false, max: 0, limited: true, enabled: false},
                eludium: {require: 'unobtanium', max: 0,  limited: true, enabled: false},
            }
        },
        trade: {
            enabled: true, trigger: 0.95, items: {
                dragons: {enabled: false, trigger: 0.80, require: 'titanium', allowcapped: false,
                          summer: true, autumn: true, winter: true, spring: true},

                zebras: {enabled: true, trigger: 0.80, require: false, allowcapped: false,
                         summer: true, autumn: true, winter: true, spring: true},

                lizards: {enabled: false, trigger: 0.80, require: 'minerals', allowcapped: false,
                          summer: true, autumn: false, winter: false, spring: false},

                sharks: {enabled: false, trigger: 0.80, require: 'iron', allowcapped: false,
                         summer: false, autumn: false, winter: true, spring: false},

                griffins: {enabled: false, trigger: 0.80, require: 'wood', allowcapped: false,
                           summer: false, autumn: true, winter: false, spring: false},

                nagas: {enabled: false, trigger: 0.80, require: false, allowcapped: false,
                        summer: false, autumn: false, winter: false, spring: true},

                spiders: {enabled: false, trigger: 0.80, require: false, allowcapped: false,
                          summer: false, autumn: true, winter: false, spring: false},

                leviathans: {enabled: false, trigger: 0.80, require: 'unobtainium', allowcapped: true,
                             summer: true, autumn: true, winter: true, spring: true},
            }
        },
        stock: {
            furs: 1000,
        },
    }
};

// GameLog Modification
// ====================

var gameLog = com.nuclearunicorn.game.log.Console().static;

// Increase the game log's message capacity
gameLog.msg = function(message, type) {
    var gameLog = dojo.byId("gameLog");
    var span = dojo.create("span", { innerHTML: message, className: "msg" }, gameLog, "first");

    if (type){
        dojo.addClass(span, "type_"+type);
    }

    var spans = this.spans;
    spans.push(span);
    if (spans.length > options.logMessages){
        dojo.destroy(spans.shift()); //remove the first element from the array and destroy it
    }

    return span;
};

var printoutput = function (args) {
    var color = args.pop();
    args[1] = args[1] || 'ks-default';

    // update the color of the message immediately after adding
    gameLog.msg.apply(gameLog, args);
    $('.type_' + args[1]).css('color', color);

    if (options.debug && console) console.log(args);
};

// Used for option change messages and other special notifications
var message = function () {
    var args = Array.prototype.slice.call(arguments);
    args.push('ks-default');
    args.push(options.msgcolor);
    printoutput(args);
};

var activity = function () {
    if (options.showactivity) {
        var args = Array.prototype.slice.call(arguments);
        args.push('ks-activity');
        args.push(options.activitycolor);
        printoutput(args);
    }
};

var summary = function () {
    var args = Array.prototype.slice.call(arguments);
    args.push('ks-summary');
    args.push(options.summarycolor);
    printoutput(args);
};

var warning = function () {
    var args = Array.prototype.slice.call(arguments);
    args.unshift('Warning!');

    if (console) console.log(args);
};

// Core Engine for Kitten Scientists
// =================================

var Engine = function () {
    this.buildManager = new BuildManager();
    this.craftManager = new CraftManager();
    this.tradeManager = new TradeManager();
};

Engine.prototype = {
    buildManager: undefined,
    craftManager: undefined,
    tradeManager: undefined,
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
        if (options.auto.faith.enabled) this.praiseSun();
        if (options.auto.festival.enabled) this.holdFestival();
        if (options.auto.build.enabled) this.build();
        if (options.auto.craft.enabled) this.craft();
        if (options.auto.trade.enabled) this.trade();
        if (options.auto.hunt.enabled) this.hunt();
    },
    build: function () {
        var builds = options.auto.build.items;
        var buildManager = this.buildManager;
        var craftManager = this.craftManager;
        var trigger = options.auto.build.trigger;

        for (var name in builds) {
            var build = builds[name];
            var require = !build.require ? false : craftManager.getResource(build.require);

            if (!require || trigger <= require.value / require.maxValue) {
                buildManager.build(name);
            }
        }
    },
    craft: function () {
        var crafts = options.auto.craft.items;
        var manager = this.craftManager;
        var trigger = options.auto.craft.trigger;

        for (var name in crafts) {
            var craft = crafts[name];
            var current = !craft.max ? false : manager.getResource(name);
            var require = !craft.require ? false : manager.getResource(craft.require);
            var season = game.calendar.getCurSeason().name;

            // Ensure that we have reached our cap
            if (current && current.value > craft.max) continue;

            // Enforce season limited on specific crafts
            if (craft.limited && craft.lastSeason === season) continue;

            // Craft the resource if we meet the trigger requirement
            if (!require || trigger <= require.value / require.maxValue) {
                manager.craft(name, manager.getLowestCraftAmount(name));

                // Store the season for future reference
                craft.lastSeason = season;
            }
        }
    },
    holdFestival: function () {
        var villageManager = new TabManager('Small village');

        if (game.calendar.festivalDays === 0 && villageManager.tab.festivalBtn.hasResources()) {
            villageManager.tab.festivalBtn.onClick();

            if (game.calendar.festivalDays !== 0) {
                storeForSummary('festival');
                activity('Kittens begin holding a festival');
            }
        }
    },
    observeGameLog: function () {
        // @TODO: determine if this can be accomplished outside the interface
        var stars = $('#gameLog').find('input');
        if (stars.length) {
            storeForSummary('stars', stars.length);
            activity('Kitten Scientists have observed a star');
            stars.click();
        }
    },
    praiseSun: function () {
        var faith = this.craftManager.getResource('faith');

        if (options.auto.faith.trigger <= faith.value / faith.maxValue) {
            storeForSummary('faith', faith.value);
            activity('Praised the sun!');
            game.religion.praise();
        }
    },
    hunt: function () {
        var catpower = this.craftManager.getResource('catpower');

        if (options.auto.hunt.trigger <= catpower.value / catpower.maxValue) {
            // No way to send only some hunters. Thus, we hunt with everything
            storeForSummary('hunt', catpower.value);
            activity('Sent ' + game.getDisplayValueExt(catpower.value) + ' kittens on the hunt');
            game.village.huntAll();
        }
    },
    trade: function () {
        var craftManager = this.craftManager;
        var tradeManager = this.tradeManager;
        var gold = craftManager.getResource('gold');
        var trades = [];

        // Only trade if it's enabled
        if (!options.auto.trade.enabled) return;

        // Trade when we have enough gold. Don't worry about catpower.
        if (options.auto.trade.trigger >= gold.value / gold.maxValue) return;

        // Determine how many races we will trade this cycle
        for (var name in options.auto.trade.items) {
            var trade = options.auto.trade.items[name];
            var season = game.calendar.getCurSeason().name;

            // Only check if we are in season and enabled
            if (!trade.enabled) continue;
            if (!trade[season]) continue;

            var require = !trade.require ? false : craftManager.getResource(trade.require);
            var requireTrigger = trade.trigger;

            // If we have enough to trigger the check, then attempt to trade
            if (!require || requireTrigger <= require.value / require.maxValue) {
                trades.push(name);
            }
        }

        // Figure out how much we can currently trade
        var maxTrades = tradeManager.getLowestTradeAmount(undefined);

        // Try our best not to starve any single race
        maxTrades = (trades.length > 0) ? Math.floor(maxTrades / trades.length) : 0;

        for (var i in trades) {
            var name = trades[i];
            tradeManager.trade(name, Math.min(tradeManager.getLowestTradeAmount(name), maxTrades));
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
    render: function () {
        if (this.tab && game.activeTabId !== this.tab.tabId) this.tab.render();

        return this;
    },
    setTab: function (name) {
        for (var tab in game.tabs) {
            if (game.tabs[tab].tabId === name) {
                this.tab = game.tabs[tab];
                break;
            }
        }

        this.tab ? this.render() : warning('unable to find tab ' + name);
    }
};

// Building manager
// ================

var BuildManager = function () {
    this.manager = new TabManager('Bonfire');
    this.crafts = new CraftManager();
};

BuildManager.prototype = {
    manager: undefined,
    crafts: undefined,
    build: function (name) {
        var build = this.getBuild(name);
        var button = this.getBuildButton(name);

        if (!button || !button.enabled || !this.hasResources(name) || !options.auto.build.items[name].enabled) return;

        button.build(build);
        storeForSummary(name, 1, 'build');
        activity('Kittens have built a new ' + build.label);
    },
    getBuild: function (name) {
        return game.bld.getBuilding(name);
    },
    getBuildButton: function (name) {
        var manager = this.manager.render();

        var buttons = manager.tab.buttons;
        var label = this.getBuild(name).label;

        for (var i in buttons) {
            if (buttons[i].name === label) return buttons[i];
        }
    },
    hasResources: function (name) {
        var prices = game.bld.getPrices(name);

        for (var i in prices) {
            var price = prices[i];
            var res = this.crafts.getValueAvailable(price.name);
            if (res < price.val) return false;
        }

        return true;
    }
};

// Crafting Manager
// ================

var CraftManager = function () {};

CraftManager.prototype = {
    craft: function (name, amount) {
        amount = Math.floor(amount);

        if (!name || 1 > amount) return;
        if (!this.canCraft(name, amount)) return;

        var craft = this.getCraft(name);
        var ratio = ('wood' === name) ? 'refineRatio' : 'craftRatio';

        game.craft(craft.name, amount);

        // determine actual amount after crafting upgrades
        amount = (amount * (game.bld.getEffect(ratio) + 1)).toFixed(2);

        storeForSummary(name, amount, 'craft');
        activity('Kittens have crafted ' + game.getDisplayValueExt(amount) + ' ' + ucfirst(name));
    },
    canCraft: function (name, amount) {
        var craft = this.getCraft(name);
        var enabled = options.auto.craft.items[name].enabled;
        var result = false;

        if (craft.unlocked && enabled) {
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
        return game.workshop.getCraft(this.getName(name));
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
    getName: function (name) {
        // adjust for spelling discrepancies in core game logic
        if ('catpower' === name) name = 'manpower';
        if ('compendium' === name) name = 'compedium';
        if ('concrete' === name) name = 'concrate';

        return name;
    },
    getResource: function (name) {
        for (var i in game.resPool.resources) {
            var res = game.resPool.resources[i];
            if (res.name === this.getName(name)) return res;
        }
        warning('unable to find resource ' + name);
        return null;
    },
    getValue: function (name) {
        return this.getResource(name).value;
    },
    getValueAvailable: function (name) {
        var value = this.getValue(name);
        var stock = !options.auto.stock[name] ? 0 : options.auto.stock[name];

        if ('catnip' === name) {
            var resPerTick = game.getResourcePerTick(name, false, {
                modifiers: {
                    'catnip': 0.10 - game.calendar.getWeatherMod()
                }});

            if (resPerTick < 0) stock -= resPerTick * 202 * 5;
        }

        return Math.max(value - stock, 0);
    }
};

// Trading Manager
// ===============

var TradeManager = function () {
    this.craftManager = new CraftManager();
    this.manager = new TabManager('Trade');
};

TradeManager.prototype = {
    craftManager: undefined,
    manager: undefined,
    trade: function (name, amount) {

        if (!name || 1 > amount) return;

        var race = this.getRace(name);

        if (!race.unlocked) return;

        var button = this.getTradeButton(race.title);

        if (!button.hasResources() || !options.auto.trade.items[name].enabled) return;

        button.tradeMultiple(amount);
        storeForSummary(name, amount, 'trade');
        activity('Kittens have traded ' + amount + 'x with ' + ucfirst(name));
    },
    getLowestTradeAmount: function (name) {
        var amount = -1;
        var highestCapacity = undefined;
        var consume = options.consume;
        var materials = this.getMaterials(name);
        var race = this.getRace(name);

        for (var i in materials) {
            var total = this.craftManager.getValueAvailable(i) * consume / materials[i];

            amount = (-1 === amount || total < amount) ? total : amount;
        }

        if (race === null || options.auto.trade.items[name].allowuncapped) return Math.floor(amount);

        // Loop through the items obtained by the race, and determine
        // which good has the most space left. Once we've determined this,
        // reduce the amount by this capacity. This ensures that we continue to trade
        // as long as at least one resource has capacity, and we never over-trade.
        for (var s in race.sells) {
            var item = race.sells[s];
            var resource = this.craftManager.getResource(item.name);
            var max = 0;

            // No need to process resources that don't cap
            if (!resource.maxValue) continue;

            // Zebras special cased titanium taken directly from game code
            if (race.name == "zebras" && item.name == "titanium") {
                var val = 1.5 + (1.5 * game.resPool.get("ship").value / 100 * 2);
                max = Math.ceil(val);
            } else {
                var sratio = item.seasons[game.calendar.getCurSeason().name];
                var tratio = self.game.bld.getEffect("tradeRatio");
                var val = item.value + item.value * tratio;

                max = val * sratio * (1 + item.delta/2);
            }

            capacity = (resource.maxValue - resource.value) / max;

            highestCapacity = (capacity < highestCapacity) ? highestCapacity : capacity;
        }

        // We must take the ceiling of capacity so that we will trade as long
        // as there is any room, even if it doesn't have exact space. Otherwise
        // we seem to starve trading altogether.
        highestCapacity = Math.ceil(highestCapacity);

        // Now that we know the most we *should* trade for, check to ensure that
        // we trade for our max cost, or our max capacity, whichever is lower.
        // This helps us prevent trading for resources we can't store. Note that we
        // essentially ignore blueprints here. In addition, if highestCapacity was never set,
        // then we just
        amount = (highestCapacity < amount) ? highestCapacity : amount;

        return Math.floor(amount);
    },
    getMaterials: function (name) {
        var materials = {catpower: 50, gold: 15};

        if (name === undefined)
            return materials;

        var prices = this.getRace(name).buys;

        for (var i in prices) {
            var price = prices[i];

            materials[price.name] = price.val;
        }

        return materials;
    },
    getRace: function (name) {
        if (name === undefined)
            return null;
        else
            return game.diplomacy.get(name);
    },
    getTradeButton: function (race) {
        var manager = this.manager.render();

        for (var i in manager.tab.racePanels) {
            var panel = manager.tab.racePanels[i];

            if (panel.name === race) return panel.tradeBtn;
        }

        warning('unable to find trade button for ' + name);
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
    height: '90%',
    width: '48%'
});

right.css({
    overflowY: 'scroll',
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

addRule('#gameLog {'
+ 'overflow-y: hidden !important;'
+ 'width: 100% !important;'
+ 'padding-top: 5px !important;'
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
+ 'width: 100%;'
+ '}');

// Add options element
// ===================

var ucfirst = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

var roundToTwo = function (n) {
        return +(Math.round(n + "e+2") + "e-2")
};

var setStockValue = function (name, value) {
    var label = $('#stock-' + name);
    var n = Number(value);

    if (n === NaN || n < 0) {
       warning('ignoring non-numeric or invalid stock value ' + value);
       return;
    }

    options.auto.stock[name] = n;
    $('#stock-value-' + name).text(ucfirst(name) + ': ' + game.getDisplayValueExt(n));
};

var addNewStockOption = function (name) {
    var stock = options.auto.stock[name];

    var container = $('<div/>', {
        id: 'stock-' + name,
        css: {display: 'inline-block', width: '100%'},
    });

    var label = $('<div/>', {
        id: 'stock-value-' + name,
        text: ucfirst(name) + ': ' + game.getDisplayValueExt(stock),
        css: {cursor: 'pointer', display: 'inline-block'},
    });

    var del = $('<div/>', {
        id: 'stock-delete-' + name,
        text: 'delete',
        css: {cursor: 'pointer', display: 'inline-block', float: 'right', paddingRight: '5px'}
    });

    container.append(label, del);

    label.on('click', function () {
        var value = window.prompt('Stock for ' + ucfirst(name));
        if (value !== null) setStockValue(name, value);
    });

    del.on('click', function () {
        if (window.confirm('Delete stock for ' + name + '?')) {
            container.remove();
            setStockValue(name, 0);
        }
    });

    return container;
};

var getStockOptions = function () {
    var list = $('<ul/>', {
        id: 'toggle-list-stocks',
        css: {display: 'none', paddingLeft: '20px'}
    });

    var add = $('<div/>', {
        id: 'stock-add',
        text: 'add stock',
        css: {cursor: 'pointer', display: 'inline-block'},
    });

    add.on('click', function () {
        var name = window.prompt('New stock name');
        if (name !== null) {
            var manager = new CraftManager();
            var lcname = name.toLowerCase();
            if (manager.getResource(lcname) !== null) {
                    options.auto.stock[name] = 0;
                    if ($('#stock-'+lcname).length === 0)
                        list.append(addNewStockOption(lcname));
            } else {
                message('Kittens know nothing of that resource.');
            }
        }
    });

    list.append(add);

    // Add all the default stocks
    for (var name in options.auto.stock) {
        list.append(addNewStockOption(name));
    }

    return list;
};

var getToggle = function (toggleName, text) {
    var auto = options.auto[toggleName];
    var element = $('<li/>');

    var label = $('<div/>', {
        id: 'toggle-label-' + toggleName,
        text: text,
        css: {cursor: 'pointer', display: 'inline-block'},
    });

    var input = $('<input/>', {
        id: 'toggle-' + toggleName,
        type: 'checkbox',
        css: {cursor: 'pointer', display: 'inline-block'},
    });

    if (auto.enabled) {
        input.prop('checked', 'checked');
    }

    // engine needs a custom toggle
    if (toggleName !== 'engine') {
        input.on('change', function () {
            if (input.is(':checked')) {
                auto.enabled = true;
                message('Enabled Auto ' + ucfirst(text));
            } else {
                auto.enabled = false;
                message('Disabled Auto ' + ucfirst(text));
            }
        });
    }

    element.append(input, label);

    if (auto.items) {
        // Add a border on the element
        element.css('borderBottom', '1px  solid gray');

        var toggle = $('<div/>', {
            css: {display: 'inline-block', float: 'right'},
        });

        var button = $('<div/>', {
            id: 'toggle-items-' + toggleName,
            text: 'items',
            css: {cursor: 'pointer', display: 'inline-block', paddingRight: '5px'}
        });

        toggle.append(button);

        var list = $('<ul/>', {
            id: 'items-list-' + toggleName,
            css: {display: 'none', paddingLeft: '20px'}
        });

        // fill out list with toggle items
        for (var itemName in auto.items) {
            if (toggleName === 'trade')
                list.append(getTradeToggle(itemName, auto.items[itemName]));
            else if (toggleName === 'craft')
                list.append(getCraftOption(itemName, auto.items[itemName]));
            else
                list.append(getOption(itemName, auto.items[itemName]));
        }

        button.on('click', function () {
            list.toggle();
        });

        label.on('click', function () {
            list.toggle();
        });

        element.append(toggle, list);

        // Add stocks for crafting, sort of a hack
        if (toggleName === 'craft') {
            var stocks = $('<div/>', {
                id: 'toggle-stocks-craft',
                text: 'stocks',
                css: {cursor: 'pointer', display: 'inline-block', paddingRight: '5px'}
            });

            var stocksList = getStockOptions();

            // When we click the items button, make sure we clear stocks
            button.on('click', function () {
                stocksList.toggle(false);
            });

            stocks.on('click', function () {
                list.toggle(false);
                stocksList.toggle();
            });

            toggle.prepend(stocks);

            element.append(stocksList);
        }

    }

    return element;
};

var getTradeToggle = function (name, option) {
    var element = $('<li/>', {
        css: { borderBottom: '1px solid gray' },
    });

    var label = $('<div/>', {
        id: 'toggle-label-' + name,
        text: ucfirst(name),
        css: {cursor: 'pointer', display: 'inline-block'},

    });

    var input = $('<input/>', {
        id: 'toggle-' + name,
        type: 'checkbox',
        css: {cursor: 'pointer', display: 'inline-block'},
    });

    if (option.enabled) {
        input.prop('checked', 'checked');
    }

    element.append(input, label);

    var button = $('<div/>', {
        id: 'toggle-seasons-' + name,
        text: 'seasons',
        css: {cursor: 'pointer', display: 'inline-block', float: 'right', paddingRight: '5px'}
    });

    var list = $('<ul/>', {
        id: 'seasons-list-' + name,
        css: {display: 'none', paddingLeft: '20px'}
    });

    // fill out the list with seasons
    list.append(getSeason(name, 'spring', option));
    list.append(getSeason(name, 'summer', option));
    list.append(getSeason(name, 'autunn', option));
    list.append(getSeason(name, 'winter', option));

    button.on('click', function () {
        list.toggle();
    });

    label.on('click', function () {
        list.toggle();
    });

    element.append(button, list);

    return element;
};

var getSeason = function (name, season, option) {
    var element = $('<li/>');

    var label = $('<label/>', {
        'for': 'toggle-' + name + '-' + season,
        text: ucfirst(season)
    });

    var input = $('<input/>', {
        id: 'toggle-' + name + '-' + season,
        type: 'checkbox'
    });

    if (option[season]) {
        input.prop('checked', 'checked');
    }

    input.on('change', function () {
        if (input.is(':checked')) {
            option[season] = true;
            message('Enabled trading with ' + ucfirst(name) + ' in the ' + ucfirst(season));
        } else {
            option[season] = false;
            message('Disabled trading ' + ucfirst(name) + ' in the ' + ucfirst(season));
        }
    });

    element.append(input, label);

    return element;
};

var getOption = function (name, option) {
    var element = $('<li/>');

    var label = $('<label/>', {
        'for': 'toggle-' + name,
        text: ucfirst(name),
        css: {display: 'inline-block', minWidth: '80px'}
    });

    var input = $('<input/>', {
        id: 'toggle-' + name,
        type: 'checkbox'
    });

    if (option.enabled) {
        input.prop('checked', 'checked');
    }

    input.on('change', function() {
        if (input.is(':checked')) {
            option.enabled = true;
            message('Enabled Auto ' + ucfirst(name));
        } else {
            option.enabled = false;
            message('Disabled Auto ' + ucfirst(name));
        }
    });

    element.append(input, label);

    return element;
};

var getCraftOption = function (name, option) {
    var element = getOption(name, option)

    var label = $('<label/>', {
        'for': 'toggle-limited-' + name,
        text: 'Limited'
    });

    var input = $('<input/>', {
        id: 'toggle-limited-' + name,
        type: 'checkbox'
    });

    if (option.limited) {
        input.prop('checked', 'checked');
    }

    input.on('change', function () {
        if (input.is(':checked')) {
            option.limited = true;
            message('Crafting ' + ucfirst(name) + ': limited once per season');
        } else {
            option.limited = false;
            message('Crafting ' + ucfirst(name) + ': unlimited');
        }
    });

    element.append(input, label);

    return element;
}

var optionsElement = $('<div/>', {id: 'ks-options', css: {marginBottom: '10px'}});
var optionsListElement = $('<ul/>');
var optionsTitleElement = $('<div/>', {
    css: { bottomBorder: '1px solid gray', marginBottom: '5px' },
    text: version
});

optionsElement.append(optionsTitleElement);

optionsListElement.append(getToggle('engine', 'Engine'));
optionsListElement.append(getToggle('build', 'Building'));
optionsListElement.append(getToggle('craft', 'Crafting'));
optionsListElement.append(getToggle('trade', 'Trading'));
optionsListElement.append(getToggle('hunt', 'Hunting'));
optionsListElement.append(getToggle('faith', 'Praising'));
optionsListElement.append(getToggle('festival', 'Festival'));

// add activity button
// ===================

activitySummary = {};
var resetActivitySummary = function () {
    activitySummary = { lastyear: game.calendar.year, lastday: game.calendar.day, craft: {}, trade: {}, build: {}, other: {} };
}

var storeForSummary = function(name, amount, section) {
    if (amount === undefined) amount = 1;
    if (section === undefined) section = 'other';

    if (activitySummary[section] === undefined)
        activitySummary[section] = {};

    if (activitySummary[section][name] === undefined) {
        activitySummary[section][name] = parseInt(amount, 10);
    } else {
        activitySummary[section][name] += parseInt(amount, 10);
    }
}

var displayActivitySummary = function() {
    // Festivals
    if (activitySummary.other.festival) {
        summary('Held ' + game.getDisplayValueExt(activitySummary.other.festival) + ' festivals');
    }

    // Observe stars
    if (activitySummary.other.stars) {
        summary('Observed ' + game.getDisplayValueExt(activitySummary.other.stars) + ' stars');
    }

    // Praise the Sun
    if (activitySummary.other.faith) {
        summary('Accumulated ' + game.getDisplayValueExt(activitySummary.other.faith) + ' by praising the sun');
    }

    // Hunters
    if (activitySummary.other.hunt) {
        summary('Sent ' + game.getDisplayValueExt(activitySummary.other.hunt / 100) + ' adorable kitten hunters');
    }

    // Buildings
    for (var name in activitySummary.build) {
        summary('Build: +' + game.getDisplayValueExt(activitySummary.build[name]) + ' ' + ucfirst(name));
    }

    // Crafts
    for (var name in activitySummary.craft) {
        summary('Craft: +' + game.getDisplayValueExt(activitySummary.craft[name]) + ' ' + ucfirst(name));
    }

    // Trading
    for (var name in activitySummary.trade) {
        summary('Trade: ' + game.getDisplayValueExt(activitySummary.trade[name]) + 'x ' + ucfirst(name));
    }

    // Show time since last run. Assumes that the day and year are always higher.
    if (activitySummary.lastyear && activitySummary.lastday) {
        var years = game.calendar.year - activitySummary.lastyear;
        var days = game.calendar.day - activitySummary.lastday;

        if (days < 0) {
            years -= 1;
            days += 400;
        }

        var duration = '';
        if (years > 0) {
            duration += years + ' ';
            duration += (years == 1) ? 'year' : 'years';
        }

        if (days >= 0) {
            if (years > 0) duration += ' and ';
            duration += roundToTwo(days) + ' ';
            duration += (days == 1) ? 'day' : 'days';
        }

        summary('Summary of the last ' + duration);
    }

    // Clear out the old activity
    resetActivitySummary()
}

resetActivitySummary();

var activityBox = $('<div/>', {
    id: 'activity-box',
    css: { display: 'inline-block', float: 'right', verticalAlign: 'top' },
});

var showActivity = $('<a/>', {
    id: 'showActivityHref',
    text: 'Show activity',
    href: '#',
    css: { verticalAlign: 'top' },
});

var activityCheckbox = $('<input/>', {
    id: 'enable-activity',
    type: 'checkbox',
    css: { verticalAlign: 'top' },
});

if (options.showactivity)
    activityCheckbox.prop('checked', 'checked');

activityCheckbox.on('change', function () {
    if (activityCheckbox.is(':checked')) {
        options.showactivity = true;
        message('Showing Kitten Scientists activity live');
    } else {
        options.showactivity = false;
        message('Hiding updates of Kitten Scientists activity');
    }
});

showActivity.on('click', displayActivitySummary);

activityBox.append(activityCheckbox, showActivity);

$('#clearLog').append(activityBox);

// add donation address to bottom of list
var donate = $('<li/>').append($('<a/>', {
    href: 'bitcoin:' + address + '?amount=0.005&label=Kittens Donation',
    target: '_blank',
    text: address
})).prepend($('<img/>', {
    css: {height: '15px', width: '15px', padding: '3px 4px 0 4px', verticalAlign: 'bottom'},
    src: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmVyc2lvbj0iMS4xIgogICB3aWR0aD0iNTEycHgiCiAgIGhlaWdodD0iNTEycHgiCiAgIHZpZXdCb3g9IjAgMCAxIDEiCiAgIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIgogICBpZD0ic3ZnMiIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMC40OC4yIHI5ODE5IgogICBzb2RpcG9kaTpkb2NuYW1lPSJiaXRjb2luLWxvZ28tbm9zaGFkb3cuc3ZnIj4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGEyMiI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxIgogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiCiAgICAgZ3VpZGV0b2xlcmFuY2U9IjEwIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxNDQ3IgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9Ijg2MSIKICAgICBpZD0ibmFtZWR2aWV3MjAiCiAgICAgc2hvd2dyaWQ9ImZhbHNlIgogICAgIGlua3NjYXBlOnpvb209IjAuOTIxODc1IgogICAgIGlua3NjYXBlOmN4PSIyMTIuNTE0MzciCiAgICAgaW5rc2NhcGU6Y3k9IjIzMy4yNDYxNyIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIwIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzIiIC8+CiAgPCEtLSBBbmRyb2lkIGxhdW5jaGVyIGljb25zOiB2aWV3Qm94PSItMC4wNDUgLTAuMDQ1IDEuMDkgMS4wOSIgLS0+CiAgPGRlZnMKICAgICBpZD0iZGVmczQiPgogICAgPGZpbHRlcgogICAgICAgaWQ9Il9kcm9wLXNoYWRvdyIKICAgICAgIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CiAgICAgIDxmZUdhdXNzaWFuQmx1cgogICAgICAgICBpbj0iU291cmNlQWxwaGEiCiAgICAgICAgIHJlc3VsdD0iYmx1ci1vdXQiCiAgICAgICAgIHN0ZERldmlhdGlvbj0iMSIKICAgICAgICAgaWQ9ImZlR2F1c3NpYW5CbHVyNyIgLz4KICAgICAgPGZlQmxlbmQKICAgICAgICAgaW49IlNvdXJjZUdyYXBoaWMiCiAgICAgICAgIGluMj0iYmx1ci1vdXQiCiAgICAgICAgIG1vZGU9Im5vcm1hbCIKICAgICAgICAgaWQ9ImZlQmxlbmQ5IiAvPgogICAgPC9maWx0ZXI+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJjb2luLWdyYWRpZW50IgogICAgICAgeDE9IjAlIgogICAgICAgeTE9IjAlIgogICAgICAgeDI9IjAlIgogICAgICAgeTI9IjEwMCUiPgogICAgICA8c3RvcAogICAgICAgICBvZmZzZXQ9IjAlIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZjlhYTRiIgogICAgICAgICBpZD0ic3RvcDEyIiAvPgogICAgICA8c3RvcAogICAgICAgICBvZmZzZXQ9IjEwMCUiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmNzkzMWEiCiAgICAgICAgIGlkPSJzdG9wMTQiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8ZwogICAgIHRyYW5zZm9ybT0ic2NhbGUoMC4wMTU2MjUpIgogICAgIGlkPSJnMTYiPgogICAgPHBhdGgKICAgICAgIGlkPSJjb2luIgogICAgICAgZD0ibSA2My4wMzU5LDM5Ljc0MSBjIC00LjI3NCwxNy4xNDMgLTIxLjYzNywyNy41NzYgLTM4Ljc4MiwyMy4zMDEgLTE3LjEzOCwtNC4yNzQgLTI3LjU3MSwtMjEuNjM4IC0yMy4yOTUsLTM4Ljc4IDQuMjcyLC0xNy4xNDUgMjEuNjM1LC0yNy41NzkgMzguNzc1LC0yMy4zMDUgMTcuMTQ0LDQuMjc0IDI3LjU3NiwyMS42NCAyMy4zMDIsMzguNzg0IHoiCiAgICAgICBzdHlsZT0iZmlsbDp1cmwoI2NvaW4tZ3JhZGllbnQpIiAvPgogICAgPHBhdGgKICAgICAgIGlkPSJzeW1ib2wiCiAgICAgICBkPSJtIDQ2LjEwMDksMjcuNDQxIGMgMC42MzcsLTQuMjU4IC0yLjYwNSwtNi41NDcgLTcuMDM4LC04LjA3NCBsIDEuNDM4LC01Ljc2OCAtMy41MTEsLTAuODc1IC0xLjQsNS42MTYgYyAtMC45MjMsLTAuMjMgLTEuODcxLC0wLjQ0NyAtMi44MTMsLTAuNjYyIGwgMS40MSwtNS42NTMgLTMuNTA5LC0wLjg3NSAtMS40MzksNS43NjYgYyAtMC43NjQsLTAuMTc0IC0xLjUxNCwtMC4zNDYgLTIuMjQyLC0wLjUyNyBsIDAuMDA0LC0wLjAxOCAtNC44NDIsLTEuMjA5IC0wLjkzNCwzLjc1IGMgMCwwIDIuNjA1LDAuNTk3IDIuNTUsMC42MzQgMS40MjIsMC4zNTUgMS42NzksMS4yOTYgMS42MzYsMi4wNDIgbCAtMS42MzgsNi41NzEgYyAwLjA5OCwwLjAyNSAwLjIyNSwwLjA2MSAwLjM2NSwwLjExNyAtMC4xMTcsLTAuMDI5IC0wLjI0MiwtMC4wNjEgLTAuMzcxLC0wLjA5MiBsIC0yLjI5Niw5LjIwNSBjIC0wLjE3NCwwLjQzMiAtMC42MTUsMS4wOCAtMS42MDksMC44MzQgMC4wMzUsMC4wNTEgLTIuNTUyLC0wLjYzNyAtMi41NTIsLTAuNjM3IGwgLTEuNzQzLDQuMDE5IDQuNTY5LDEuMTM5IGMgMC44NSwwLjIxMyAxLjY4MywwLjQzNiAyLjUwMywwLjY0NiBsIC0xLjQ1Myw1LjgzNCAzLjUwNywwLjg3NSAxLjQzOSwtNS43NzIgYyAwLjk1OCwwLjI2IDEuODg4LDAuNSAyLjc5OCwwLjcyNiBsIC0xLjQzNCw1Ljc0NSAzLjUxMSwwLjg3NSAxLjQ1MywtNS44MjMgYyA1Ljk4NywxLjEzMyAxMC40ODksMC42NzYgMTIuMzg0LC00LjczOSAxLjUyNywtNC4zNiAtMC4wNzYsLTYuODc1IC0zLjIyNiwtOC41MTUgMi4yOTQsLTAuNTI5IDQuMDIyLC0yLjAzOCA0LjQ4MywtNS4xNTUgeiBtIC04LjAyMiwxMS4yNDkgYyAtMS4wODUsNC4zNiAtOC40MjYsMi4wMDMgLTEwLjgwNiwxLjQxMiBsIDEuOTI4LC03LjcyOSBjIDIuMzgsMC41OTQgMTAuMDEyLDEuNzcgOC44NzgsNi4zMTcgeiBtIDEuMDg2LC0xMS4zMTIgYyAtMC45OSwzLjk2NiAtNy4xLDEuOTUxIC05LjA4MiwxLjQ1NyBsIDEuNzQ4LC03LjAxIGMgMS45ODIsMC40OTQgOC4zNjUsMS40MTYgNy4zMzQsNS41NTMgeiIKICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmYiIC8+CiAgPC9nPgo8L3N2Zz4='
}));

// Add some padding above the donation item
donate.css('padding', '5px');

optionsListElement.append(donate);

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
