// ==========================================
// Begin Kitten Scientist's Automation Engine
// ==========================================

var version = 'Kitten Scientists version 1.1.5';
var game = gamePage;

var options = {
    interval: 3000,
    color: '#aa50fe', // dark purple
    amount: {
        consume: 0.5
    },
    auto: {
        build: [
            // Priorities:
            // 1. Max science
            {name: 'library',      require: 'wood',     limit: 0.75},
            {name: 'academy',      require: 'wood',     limit: 0.75},
            {name: 'observatory',  require: 'wood',     limit: 0.75},
            // 2. Craft bonuses
            {name: 'workshop',     require: 'minerals', limit: 0.75},
            // 3. Raw production
            {name: 'field',        require: 'catnip',   limit: 0.75},
            {name: 'mine',         require: 'wood',     limit: 0.75},
            {name: 'lumberMill',   require: 'iron',     limit: 0.75},
            {name: 'oilWell',      require: 'coal',     limit: 0.75},
            {name: 'quarry',       require: 'coal',     limit: 0.75},
            // 4. Conversion (the require keeps them from consuming too much)
            {name: 'smelter',      require: 'minerals', limit: 0.75},
            {name: 'magneto',      require: 'oil',      limit: 0.75},
            {name: 'calciner',     require: 'oil',      limit: 0.95},
            {name: 'steamworks',   require: 'coal',     limit: 0.75},
            // 5. Storage
            {name: 'harbor',       require: 'iron',     limit: 0.90},
            {name: 'barn',         require: 'wood',     limit: 0.90},
            {name: 'warehouse',    require: 'minerals', limit: 0.94},
            // 6. Housing
            {name: 'hut',          require: 'wood',     limit: 0.85},
            {name: 'logHouse',     require: 'minerals', limit: 0.85},
            {name: 'mansion',      require: 'titanium', limit: 0.85},
            // 7. Other
            {name: 'pasture',      require: 'catnip',   limit: 0.75},
            {name: 'amphitheatre', require: 'minerals', limit: 0.94},
            {name: 'aqueduct',     require: 'minerals', limit: 0.94},
            {name: 'temple',       require: 'gold',     limit: 0.99},
            {name: 'tradepost',    require: 'gold',     limit: 0.99},
            {name: 'ziggurat',     require: 'minerals', limit: 0.94},
            {name: 'unicornPasture', require: false}
            // Not present: accelerator, biolab, chapel, chronosphere,
            // factory, mint, reactor
        ],
        craft: [
            {name: 'wood', require: 'catnip'},
            {name: 'beam', require: 'wood'},
            {name: 'slab', require: 'minerals'},
            {name: 'steel', require: 'coal'},
            {name: 'plate', require: 'iron'}
        ],
        luxury: [
            {name: 'manuscript', require: 'culture'},
            {name: 'compendium', require: 'science'}
        ]
    },
    limit: {
        build: 0.75,
        craft: 0.95,
        hunt: 0.95,
        luxury: 0.99,
        faith: 0.99
    },
    stock: {
        compendium: 500,
        manuscript: 1000,
        parchment: 3000
    },
    toggle: {
        building: true,
        crafting: true,
        hunting: true,
        luxury: true,
        praising: true
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

// Stop having the game log erase messages.
gameLog.msg = function(message, type) {
    var gameLog = dojo.byId("gameLog");

    var span = dojo.create("span", { innerHTML: message, className: "msg" }, gameLog, "first");

    if (type){
    	dojo.addClass(span, "type_"+type);
    }

    var spans = this.spans;
    spans.push(span);

    return span;
};

// Core Engine for Kitten Scientists
// =================================

var Engine = function () {
    this.buildManager = new BuildManager();
    this.craftManager = new CraftManager();
};

Engine.prototype = {
    buildManager: undefined,
    craftManager: undefined,
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
        if (options.toggle.hunting) this.sendHunters();
        if (options.toggle.crafting) this.startCrafts('craft', options.auto.craft);
        if (options.toggle.building) this.startBuilds('build', options.auto.build);
    },
    observeGameLog: function () {
        $('#gameLog').find('input').click();
    },
    praiseSun: function () {
        var currentTab = game.activeTabId;
        var faith = this.craftManager.getResource('faith');

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
        var catpower = this.craftManager.getResource('manpower');
        var workshop = game.workshop;
        var parchment = workshop.getCraft('parchment');

        if (catpower.value / catpower.maxValue > options.limit.hunt) {
            if (parchment.unlocked) {
                game.craftAll(parchment.name);
                message('Auto Hunt: crafted all parchments');
            }

            if (options.toggle.luxury) this.startCrafts('luxury', options.auto.luxury);

            message('Kittens Hunt: Hunters deployed!');
            $("a:contains('Send hunters')").click();
        }
    },
    startBuilds: function (type, builds) {
        var buildManager = this.buildManager;
        var craftManager = this.craftManager;
        var globalLimit = options.limit[type];
        buildManager.triggerLateBuild();

        for (i in builds) {
            var build = builds[i];
            var require = !build.require ? !build.require : craftManager.getResource(build.require);
            var limit = build.limit || globalLimit;

            if (require === true || limit <= require.value / require.maxValue) {
                buildManager.build(build.name);
            }
        }
    },
    startCrafts: function (type, crafts) {
        var limit = options.limit[type];
        var manager = this.craftManager;

        for (i in crafts) {
            var craft = crafts[i];
            var require = manager.getResource(craft.require);

            if (limit <= require.value / require.maxValue) {
                manager.craft(craft.name, manager.getLowestCraftAmount(craft.name));
            }
        }
    }
};

// Building manager
// ================

var BuildManager = function () {
    this.craftManager = new CraftManager();
    this.lateBuilds = [];
};

BuildManager.prototype = {
    craftManager: undefined,
    triggerLateBuild: function () {
      var arr = this.lateBuilds;
      this.lateBuilds = [];
      for (i in arr)
        this.build(arr[i]);
    },
    build: function (name) {
        if (!this.isBuildable(name)) return;

        // Craft the resources to build this.
        var manager = this.craftManager;
        var prices = this.getPrices(name);
        for (i in prices) {
            var price = prices[i];
            manager.deepCraft(price.name, price.val);
        }

        // We may have just enabled it.
        var label = this.getBuild(name).label;
        var button = $(".nosel:not('.disabled'):contains('" + label + "')");

        if (button.length === 0) {
            this.lateBuilds.push(name);
            return;
        }

        button.click();
        message('Kittens Build: +1 ' + label);
    },
    isBuildable: function (name) {
        var buildable = this.getBuild(name).unlocked;

        if (buildable) {
            var manager = this.craftManager;
            var prices = this.getPrices(name);
            var usage = {};

            for (i in prices) {
                var price = prices[i];
                if (!manager.getCraftUsage(price.name, price.val, usage)) {
                    return false;
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
    isCraftable: function (name) {
        var res = this.getResource(name);
        return res.craftable && this.getCraft(name).unlocked;
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
        // adjust for spelling bug in core game logic
        if ('compendium' === name) name = 'compedium';

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
    },
    getCraftUsage: function (name, desiredAmount, accounted) {
        name = this.getResource(name).name; // Normalize the name.
        var unusable = accounted[name] || 0;
        var value = this.getValue(name);

        value -= unusable;

        if (desiredAmount < value) {
            accounted[name] = desiredAmount + unusable;
            return true;
        }

        if (!this.isCraftable(name)) {
            return false;
        }

        accounted[name] = value + unusable;

        var amountToCraft = Math.ceil((desiredAmount - value) /
            game.getResCraftRatio(name));

        var materials = this.getMaterials(name);
        for (i in materials) {
            var usable = this.getCraftUsage(i,
                amountToCraft * materials[i], accounted);
            if (!usable)
                return false;
        }

        return true;
    },
    deepCraft: function (name, desiredAmount) {
        var value = this.getValue(name);

        if (desiredAmount < value) return
        if (!this.isCraftable(name))
            return this.craft(name, desiredAmount - value);

        var ratio = game.getResCraftRatio(this.getCraft(name).name);
        var amountToCraft = Math.ceil((desiredAmount - value) / ratio);

        var materials = this.getMaterials(name);
        for (i in materials) {
            this.deepCraft(i, amountToCraft * materials[i]);
        }

        this.craft(name, amountToCraft);
    },
};

// ==============================
// Configure overall page display
// ==============================

var container = $('#game');
var column = $('.column');

container.css({
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

addRule('#rightColumn {'
+ 'display: inline-flex;'
+ 'flex-direction: column;'
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

optionsListElement.append(getToggle('engine', 'Engine').css('width', '100%'));
optionsListElement.append(getToggle('crafting', 'Crafting'));
optionsListElement.append(getToggle('building', 'Building'));
optionsListElement.append(getToggle('praising', 'Faith'));
optionsListElement.append(getToggle('hunting', 'Hunting'));
optionsListElement.append(getToggle('luxury', 'Luxury'));

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

var autoOptions = ['building', 'crafting', 'hunting', 'luxury', 'praising'];

var ucfirst = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

$.each(autoOptions, function (event, option) {
    var toggle = $('#toggle-' + option);

    toggle.on('change', function () {
        if (toggle.is(':checked')) {
            options.toggle[option] = true;
            message('Enabled Auto ' + ucfirst(option));
        } else {
            options.toggle[option] = false;
            message('Disable Auto ' + ucfirst(option));
        }
    });
});
