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
        engine: {enabled: false},
        faith: {enabled: true, trigger: 0.99},
        festival: {enabled: true},
        hunt: {enabled: true, trigger: 0.95},
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
                wood: {require: 'catnip', stock: 0, type: 'craft', enabled: true},
                beam: {require: 'wood', stock: 0, type: 'craft', enabled: true},
                slab: {require: 'minerals', stock: 0, type: 'craft', enabled: true},
                steel: {require: 'coal', stock: 0, type: 'craft', enabled: true},
                plate: {require: 'iron', stock: 0, type: 'craft', enabled: true},
                alloy: {require: 'titanium', stock: 0, type: 'craft', enabled: false},
                concrete: {require: false, stock: 0, type: 'craft', enabled: false},
                gear: {require: false, stock: 0, type: 'craft', enabled: false},
                scaffold: {require: false, stock: 0, type: 'craft', enabled: false},
                ship: {require: false, stock: 0, type: 'craft', enabled: false},
                tanker: {require: false, stock: 0, type: 'craft', enabled: false},
                parchment: {require: false, stock: 0, type: 'luxury', enabled: true},
                manuscript: {require: 'culture', stock: 0, type: 'luxury', enabled: true},
                compendium: {require: 'science', stock: 0, type: 'luxury', enabled: true},
                blueprint: {require: false, stock: 0, type: 'luxury', enabled: false},
                megalith: {require: false, stock: 0, type: 'craft', enabled: false}
            }
        },
        trade: {
            enabled: false, trigger: 0.99, items: {
                zebras: {max: 'titanium', require: false, season: 'summer', enabled: true}
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
    this.tradeManager = new TradeManager();
};

Engine.prototype = {
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
        if (options.auto.hunt.enabled) this.sendHunters();
        if (options.auto.craft.enabled) this.craftType('craft');
        if (options.auto.trade.enabled) this.startTrade();
    },
    craftType: function (type) {
        var crafts = options.auto.craft.items;
        var trigger = options.auto.craft.trigger;
        var manager = this.craftManager;

        for (var name in crafts) {
            var craft = crafts[name];
            var require = !craft.require ? false : manager.getResource(craft.require);

            if (craft.type === type && (!require || trigger <= require.value / require.maxValue)) {
                manager.craft(name, manager.getLowestCraftAmount(name));
            }
        }
    },
    holdFestival: function () {
        var villageManager = new TabManager('Small village');

        if (game.calendar.festivalDays === 0 && villageManager.tab.festivalBtn.hasResources()) {
            villageManager.tab.festivalBtn.onClick();
            message('A festival has been held!');
        }
    },
    observeGameLog: function () {
        // @TODO: determine if this can be accomplished outside the interface
        $('#gameLog').find('input').click();
    },
    praiseSun: function () {
        var faith = this.craftManager.getResource('faith');

        if (options.auto.faith.trigger <= faith.value / faith.maxValue) {
            game.religion.praise();
            message('The sun has been praised!');
        }
    },
    sendHunters: function () {
        var catpower = this.craftManager.getResource('catpower');

        if (options.auto.hunt.trigger <= catpower.value / catpower.maxValue) {
            // Generate luxury goods before sending hunters
            this.craftType('luxury');

            game.village.huntAll();
            message('Kittens Hunt: Hunters deployed!');
        }
    },
    startTrade: function () {
        var trades = options.auto.trade.items;
        var trigger = options.auto.trade.trigger;
        var craftManager = this.craftManager;
        var tradeManager = this.tradeManager;

        for (var name in trades) {
            var trade = trades[name];
            var max = !trade.max ? false : craftManager.getResource(trade.max);
            var require = !trade.require ? false : craftManager.getResource(trade.require);

            if ((!max || 1 !== max.value / max.maxValue) &&
                (!require || trigger <= require.value / require.maxValue)) {
                tradeManager.trade(name, tradeManager.getLowestTradeAmount(name));
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
    render: function () {
        if (this.tab && game.activeTabId !== this.tab.tabId) this.tab.render();

        return this;
    },
    setTab: function (name) {
        for (var i in game.tabs) {
            if (game.tabs[i].tabId === name) {
                this.tab = game.tabs[i];
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
};

BuildManager.prototype = {
    manager: undefined,
    getBuild: function (name) {
        return game.bld.getBuilding(name);
    },
    getBuildButton: function (name) {
        //var buttons = this.manager.getButtons();
        //var label = this.getBuild(name).label;
        //
        //for (var i in buttons) {
        //    if (buttons[i].name === label) return buttons[i];
        //}
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
        return game.resPool.get(this.getName(name));
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
        amount = Math.floor(amount);

        if (!name || 1 > amount) return;

        var race = this.getRace(name);
        var tradeBtn = this.getTradeButton(race.title);

        if (!race.unlocked || !tradeBtn.hasResources() || !options.auto.trade.items[name].enabled) return;

        tradeBtn.tradeMultiple(amount);
        message('Kittens Trade: ' + amount + 'x ' + race.title);
    },
    getLowestTradeAmount: function (name) {
        var amount = 0;
        var consume = options.consume;
        var materials = this.getMaterials(name);

        for (var i in materials) {
            var total = this.craftManager.getValueAvailable(i) * consume / materials[i];

            amount = (0 === amount || total < amount) ? total : amount;
        }

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
    getRace: function (name) {
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

var getToggle = function (toggleName, text) {
    var auto = options.auto[toggleName];
    var element = $('<li/>');

    var label = $('<label/>', {
        'for': 'toggle-' + toggleName,
        text: text
    });

    var input = $('<input/>', {
        id: 'toggle-' + toggleName,
        type: 'checkbox'
    });

    if (auto.enabled) {
        input.prop('checked', 'checked');
    }

    element.append(input, label);

    if (auto.items) {
        var button = $('<div/>', {
            id: 'toggle-options-' + toggleName,
            text: 'toggle options',
            css: {cursor: 'pointer', display: 'inline-block', float: 'right', paddingRight: '5px'}
        });

        var list = $('<ul/>', {
            id: 'toggle-options-list-' + toggleName,
            css: {display: 'none', paddingLeft: '20px', width: '100%'}
        });

        // fill out list with toggle items
        for (var itemName in auto.items) {
            list.append(getOption(itemName, auto.items[itemName]));
        }

        button.on('click', function () {
            list.toggle();
        });

        element.append(button, list);
    }

    return element;
};

var getOption = function (name, option) {
    var element = $('<li/>');

    var label = $('<label/>', {
        'for': 'toggle-' + name,
        text: ucfirst(name)
    });

    var input = $('<input/>', {
        id: 'toggle-' + name,
        type: 'checkbox'
    });

    if (option.enabled) {
        input.prop('checked', 'checked');
    }

    element.append(input, label);

    return element;
};

var optionsElement = $('<div/>', {id: 'ks-options', css: {marginBottom: '10px'}});
var optionsListElement = $('<ul/>');
var optionsTitleElement = $('<div/>', {
    css: { borderBottom: '1px solid gray', marginBottom: '5px' },
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

// add donation address to bottom of list
var donate = $('<li/>').append($('<a/>', {
    href: 'bitcoin:' + address + '?amount=0.005&label=Kittens Donation',
    text: address
})).prepend($('<img/>', {
    css: {height: '15px', width: '15px', padding: '3px 4px 0 4px', verticalAlign: 'bottom'},
    src: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmVyc2lvbj0iMS4xIgogICB3aWR0aD0iNTEycHgiCiAgIGhlaWdodD0iNTEycHgiCiAgIHZpZXdCb3g9IjAgMCAxIDEiCiAgIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZTWlkIgogICBpZD0ic3ZnMiIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMC40OC4yIHI5ODE5IgogICBzb2RpcG9kaTpkb2NuYW1lPSJiaXRjb2luLWxvZ28tbm9zaGFkb3cuc3ZnIj4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGEyMiI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxIgogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiCiAgICAgZ3VpZGV0b2xlcmFuY2U9IjEwIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxNDQ3IgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9Ijg2MSIKICAgICBpZD0ibmFtZWR2aWV3MjAiCiAgICAgc2hvd2dyaWQ9ImZhbHNlIgogICAgIGlua3NjYXBlOnpvb209IjAuOTIxODc1IgogICAgIGlua3NjYXBlOmN4PSIyMTIuNTE0MzciCiAgICAgaW5rc2NhcGU6Y3k9IjIzMy4yNDYxNyIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIwIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzIiIC8+CiAgPCEtLSBBbmRyb2lkIGxhdW5jaGVyIGljb25zOiB2aWV3Qm94PSItMC4wNDUgLTAuMDQ1IDEuMDkgMS4wOSIgLS0+CiAgPGRlZnMKICAgICBpZD0iZGVmczQiPgogICAgPGZpbHRlcgogICAgICAgaWQ9Il9kcm9wLXNoYWRvdyIKICAgICAgIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CiAgICAgIDxmZUdhdXNzaWFuQmx1cgogICAgICAgICBpbj0iU291cmNlQWxwaGEiCiAgICAgICAgIHJlc3VsdD0iYmx1ci1vdXQiCiAgICAgICAgIHN0ZERldmlhdGlvbj0iMSIKICAgICAgICAgaWQ9ImZlR2F1c3NpYW5CbHVyNyIgLz4KICAgICAgPGZlQmxlbmQKICAgICAgICAgaW49IlNvdXJjZUdyYXBoaWMiCiAgICAgICAgIGluMj0iYmx1ci1vdXQiCiAgICAgICAgIG1vZGU9Im5vcm1hbCIKICAgICAgICAgaWQ9ImZlQmxlbmQ5IiAvPgogICAgPC9maWx0ZXI+CiAgICA8bGluZWFyR3JhZGllbnQKICAgICAgIGlkPSJjb2luLWdyYWRpZW50IgogICAgICAgeDE9IjAlIgogICAgICAgeTE9IjAlIgogICAgICAgeDI9IjAlIgogICAgICAgeTI9IjEwMCUiPgogICAgICA8c3RvcAogICAgICAgICBvZmZzZXQ9IjAlIgogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojZjlhYTRiIgogICAgICAgICBpZD0ic3RvcDEyIiAvPgogICAgICA8c3RvcAogICAgICAgICBvZmZzZXQ9IjEwMCUiCiAgICAgICAgIHN0eWxlPSJzdG9wLWNvbG9yOiNmNzkzMWEiCiAgICAgICAgIGlkPSJzdG9wMTQiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8ZwogICAgIHRyYW5zZm9ybT0ic2NhbGUoMC4wMTU2MjUpIgogICAgIGlkPSJnMTYiPgogICAgPHBhdGgKICAgICAgIGlkPSJjb2luIgogICAgICAgZD0ibSA2My4wMzU5LDM5Ljc0MSBjIC00LjI3NCwxNy4xNDMgLTIxLjYzNywyNy41NzYgLTM4Ljc4MiwyMy4zMDEgLTE3LjEzOCwtNC4yNzQgLTI3LjU3MSwtMjEuNjM4IC0yMy4yOTUsLTM4Ljc4IDQuMjcyLC0xNy4xNDUgMjEuNjM1LC0yNy41NzkgMzguNzc1LC0yMy4zMDUgMTcuMTQ0LDQuMjc0IDI3LjU3NiwyMS42NCAyMy4zMDIsMzguNzg0IHoiCiAgICAgICBzdHlsZT0iZmlsbDp1cmwoI2NvaW4tZ3JhZGllbnQpIiAvPgogICAgPHBhdGgKICAgICAgIGlkPSJzeW1ib2wiCiAgICAgICBkPSJtIDQ2LjEwMDksMjcuNDQxIGMgMC42MzcsLTQuMjU4IC0yLjYwNSwtNi41NDcgLTcuMDM4LC04LjA3NCBsIDEuNDM4LC01Ljc2OCAtMy41MTEsLTAuODc1IC0xLjQsNS42MTYgYyAtMC45MjMsLTAuMjMgLTEuODcxLC0wLjQ0NyAtMi44MTMsLTAuNjYyIGwgMS40MSwtNS42NTMgLTMuNTA5LC0wLjg3NSAtMS40MzksNS43NjYgYyAtMC43NjQsLTAuMTc0IC0xLjUxNCwtMC4zNDYgLTIuMjQyLC0wLjUyNyBsIDAuMDA0LC0wLjAxOCAtNC44NDIsLTEuMjA5IC0wLjkzNCwzLjc1IGMgMCwwIDIuNjA1LDAuNTk3IDIuNTUsMC42MzQgMS40MjIsMC4zNTUgMS42NzksMS4yOTYgMS42MzYsMi4wNDIgbCAtMS42MzgsNi41NzEgYyAwLjA5OCwwLjAyNSAwLjIyNSwwLjA2MSAwLjM2NSwwLjExNyAtMC4xMTcsLTAuMDI5IC0wLjI0MiwtMC4wNjEgLTAuMzcxLC0wLjA5MiBsIC0yLjI5Niw5LjIwNSBjIC0wLjE3NCwwLjQzMiAtMC42MTUsMS4wOCAtMS42MDksMC44MzQgMC4wMzUsMC4wNTEgLTIuNTUyLC0wLjYzNyAtMi41NTIsLTAuNjM3IGwgLTEuNzQzLDQuMDE5IDQuNTY5LDEuMTM5IGMgMC44NSwwLjIxMyAxLjY4MywwLjQzNiAyLjUwMywwLjY0NiBsIC0xLjQ1Myw1LjgzNCAzLjUwNywwLjg3NSAxLjQzOSwtNS43NzIgYyAwLjk1OCwwLjI2IDEuODg4LDAuNSAyLjc5OCwwLjcyNiBsIC0xLjQzNCw1Ljc0NSAzLjUxMSwwLjg3NSAxLjQ1MywtNS44MjMgYyA1Ljk4NywxLjEzMyAxMC40ODksMC42NzYgMTIuMzg0LC00LjczOSAxLjUyNywtNC4zNiAtMC4wNzYsLTYuODc1IC0zLjIyNiwtOC41MTUgMi4yOTQsLTAuNTI5IDQuMDIyLC0yLjAzOCA0LjQ4MywtNS4xNTUgeiBtIC04LjAyMiwxMS4yNDkgYyAtMS4wODUsNC4zNiAtOC40MjYsMi4wMDMgLTEwLjgwNiwxLjQxMiBsIDEuOTI4LC03LjcyOSBjIDIuMzgsMC41OTQgMTAuMDEyLDEuNzcgOC44NzgsNi4zMTcgeiBtIDEuMDg2LC0xMS4zMTIgYyAtMC45OSwzLjk2NiAtNy4xLDEuOTUxIC05LjA4MiwxLjQ1NyBsIDEuNzQ4LC03LjAxIGMgMS45ODIsMC40OTQgOC4zNjUsMS40MTYgNy4zMzQsNS41NTMgeiIKICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmYiIC8+CiAgPC9nPgo8L3N2Zz4='
}));

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

toggleEngine.trigger('change');

// Add toggles for options
// =======================

var getOptionItem = function (option) {
    return options.auto[option] ||
        options.auto.build.items[option] ||
        options.auto.craft.items[option] ||
        options.auto.trade.items[option];
};

var keys = Object.keys(options.auto);

keys = keys.concat(
    Object.keys(options.auto.craft.items),
    Object.keys(options.auto.build.items),
    Object.keys(options.auto.trade.items)
);

$.each(keys, function (event, option) {
    var toggle = $('#toggle-' + option);

    toggle.on('change', function () {
        var item = getOptionItem(option);

        if (toggle.is(':checked')) {
            item.enabled = true;
            message('Enabled Auto ' + ucfirst(option));
        } else {
            item.enabled = false;
            message('Disabled Auto ' + ucfirst(option));
        }
    });
});