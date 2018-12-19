// ==UserScript==
// @name        Kitten Scientists
// @namespace   http://www.reddit.com/r/kittensgame/comments/34gb2u/kitten_scientists_automation_script/
// @description Launch Kitten Scientists
// @include     *bloodrizer.ru/games/kittens/*
// @include     file:///*kitten-game*
// @version     1.3.2
// @grant       none
// @copyright   2015, cameroncondry
// ==/UserScript==

// ==========================================
// Begin Kitten Scientist's Automation Engine
// ==========================================

var version = 'Kitten Scientists version 1.3.2';
var address = '19ZBVyaXQhikcuUszY2MVRb1MGL2YqicDX';

// Game will be referenced in loadTest function
var game = null;

var run = function() {

    var options = {
        // When debug is enabled, messages that go to the game log are also logged using window.console.
        debug: false,

        // The interval at which the internal processing loop is run, in milliseconds.
        interval: 2000,

        // The default color for KS messages in the game log (like enabling and disabling items).
        msgcolor: '#aa50fe', // dark purple
        // The color for activity summaries.
        summarycolor: '#009933', // light green
        // The color for log messages that are about activities (like festivals and star observations).
        activitycolor: '#E65C00', // orange
        // The color for resources with stock counts higher than current resource max
        stockwarncolor: '#DD1E00',

        // Should activity be logged to the game log?
        showactivity: true,

        // The default consume rate.
        consume: 0.6,

        // How many messages to keep in the game log.
        logMessages:   100,

        // The default settings for game automation.
        auto: {
            // Settings related to KS itself.
            engine: {
                // Should any automation run at all?
                enabled: false
            },
            crypto: {
                // Should crypto exchange be automated?
                enabled: true,
                // At what percentage of the relic storage capacity should KS exchange?
                trigger: 10000
            },
			explore: {
				// Should exploring be automated?
                enabled: true,
			},
            faith: {
                // Should praising be automated?
                enabled: true,
                // At what percentage of the faith storage capacity should KS praise the sun?
                trigger: 0.99,
                // Which religious upgrades should be researched?
                items: {
                    // Order of the Sun
                    solarchant:      {require: 'faith', enabled: true},
                    scholasticism:   {require: 'faith', enabled: true},
                    goldenSpire:     {require: 'faith', enabled: true},
                    sunAltar:        {require: 'faith', enabled: true},
                    stainedGlass:    {require: 'faith', enabled: true},
                    solarRevolution: {require: 'faith', enabled: true},
                    basilica:        {require: 'faith', enabled: true},
                    templars:        {require: 'faith', enabled: true},
                    apocripha:       {require: 'faith', enabled: false},
                    transcendence:   {require: 'faith', enabled: true},
                }
            },
            festival: {
                // Should festivals be held automatically?
                enabled: true
            },
            hunt: {
                // Should hunters be sent on hunts automatically?
                enabled: true,
                // At what percentage of the catpower storage capacity should KS send hunters on hunts?
                trigger: 0.6
            },
            build: {
                // Should buildings be built automatically?
                enabled: true,
                // When a building requires a certain resource (this is what their *require* property refers to), then
                // this is the percentage of the storage capacity of that resource, that has to be met for the building
                // to be built.
                trigger: 0.75,
                // The items that be automatically built.
                // Every item can define a required resource. This resource has to be available at a certain capacity for
                // the building to be built. The capacity requirement is defined by the trigger value set for the section.
                //
                // Additionally, for upgradeable buildings, the item can define which upgrade stage it refers to.
                // For upgraded buildings, the ID (or internal name) of the building can be controlled through the *name*
                // property. For other buildings, the key of the item itself is used.
                items: {
                    // housing
                    hut:            {require: 'wood',        enabled: false},
                    logHouse:       {require: 'minerals',    enabled: false},
                    mansion:        {require: 'titanium',    enabled: false},

                    // craft bonuses
                    workshop:       {require: 'minerals',    enabled: true},
                    factory:        {require: 'titanium',    enabled: true},

                    // production
                    field:          {require: 'catnip',      enabled: true},
                    pasture:        {require: 'catnip',      enabled: true, stage: 0},
                    solarFarm:      {require: 'titanium',    enabled: true, stage: 1, name: 'pasture'},
                    mine:           {require: 'wood',        enabled: true},
                    lumberMill:     {require: 'minerals',    enabled: true},
                    aqueduct:       {require: 'minerals',    enabled: true, stage: 0},
                    hydroPlant:     {require: 'titanium',    enabled: true, stage: 1, name: 'aqueduct'},
                    oilWell:        {require: 'coal',        enabled: true},
                    quarry:         {require: 'coal',        enabled: true},

                    // conversion
                    smelter:        {require: 'minerals',    enabled: true},
                    biolab:         {require: 'science',     enabled: false},
                    calciner:       {require: 'titanium',    enabled: false},
                    reactor:        {require: 'titanium',    enabled: false},
                    accelerator:    {require: 'titanium',    enabled: false},
                    steamworks:     {require: false,         enabled: false},
                    magneto:        {require: false,         enabled: false},

                    // science
                    library:        {require: 'wood',        enabled: true},
                    academy:        {require: 'wood',        enabled: true},
                    observatory:    {require: 'iron',        enabled: true},

                    // other
                    amphitheatre:   {require: 'minerals',    enabled: true, stage: 0},
                    broadcastTower: {require: 'titanium',    enabled: true, stage: 1, name: 'amphitheatre'},
                    tradepost:      {require: 'gold',        enabled: true},
                    chapel:         {require: 'minerals',    enabled: true},
                    temple:         {require: 'gold',        enabled: true},
                    mint:           {require: false,         enabled: false},
                    unicornPasture: {require: false,         enabled: true},
                    ziggurat:       {require: false,         enabled: true},
                    chronosphere:   {require: 'unobtainium', enabled: true},
                    aiCore:         {require: false,         enabled: false},

                    // storage
                    barn:           {require: 'wood',        enabled: true},
                    harbor:         {require: false,         enabled: false},
                    warehouse:      {require: false,         enabled: false}
                }
            },
            space: {
                // Should space buildings be built automatically?
                enabled: false,
                // The functionality of the space section is identical to the build section. It just needs to be treated
                // seperately, because the game internals are slightly different.
                trigger: 0.95,
                items: {
                    // Cath
                    spaceElevator:  {require: 'unobtainium', enabled: false},
                    sattelite:      {require: 'titanium',    enabled: false},
                    spaceStation:   {require: 'oil',         enabled: false},

                    // Moon
                    moonOutpost:    {require: 'uranium',     enabled: false},
                    moonBase:       {require: 'unobtainium', enabled: false},

                    // Dune
                    planetCracker:  {require: 'science',     enabled: false},
                    hydrofracturer: {require: 'science',     enabled: false},
                    spiceRefinery:  {require: 'science',     enabled: false},

                    // Piscine
                    researchVessel: {require: 'titanium',    enabled: false},
                    orbitalArray:   {require: 'eludium',     enabled: false},

                    // Helios
                    sunlifter:          {require: 'eludium', enabled: false},
                    containmentChamber: {require: 'science', enabled: false},
                    heatsink:           {require: 'thorium', enabled: false},
                    sunforge:           {require: false,     enabled: false},

                    // T-Minus
                    cryostation:    {require: 'eludium',     enabled: false},

                    // Kairo
                    spaceBeacon:    {require: 'antimatter',  enabled: false},

                    // Yarn
                    terraformingStation: {require: 'antimatter',  enabled: false},
                    hydroponics:         {require: 'kerosene',    enabled: false},

                    // Umbra
                    hrHarvester:    {require: 'antimatter',  enabled: false},

                    // Charon
                    entangler:    {require: 'antimatter',  enabled: false},

                    // Centaurus
                    tectonic: {require: 'antimatter', enabled: false}
                }
            },
            craft: {
                // Should resources be crafted automatically?
                enabled: true,
                // Every item can define a required resource with the *require* property.
                // At what percentage of the storage capacity of that required resource should the listed resource be crafted?
                trigger: 0.95,
                // The items that can be crafted.
                // In addition to the *require* property, which is explained above, items can also define a *max*. If they
                // do, no more than that resource will be automatically produced. This feature can not be controlled through
                // the UI and is not used for any resource by default.
                // The *limited* property tells KS to only craft the resource once per season.
                items: {
                    wood:       {require: 'catnip',      max: 0, limited: false, enabled: true},
                    beam:       {require: 'wood',        max: 0, limited: false, enabled: true},
                    slab:       {require: 'minerals',    max: 0, limited: false, enabled: true},
                    steel:      {require: 'coal',        max: 0, limited: false, enabled: true},
                    plate:      {require: 'iron',        max: 0, limited: false, enabled: true},
                    alloy:      {require: 'titanium',    max: 0, limited: true,  enabled: false},
                    concrete:   {require: false,         max: 0, limited: true,  enabled: false},
                    gear:       {require: false,         max: 0, limited: true,  enabled: false},
                    scaffold:   {require: false,         max: 0, limited: true,  enabled: false},
                    ship:       {require: false,         max: 0, limited: true,  enabled: false},
                    tanker:     {require: false,         max: 0, limited: true,  enabled: false},
                    parchment:  {require: false,         max: 0, limited: true,  enabled: true},
                    manuscript: {require: 'culture',     max: 0, limited: true,  enabled: true},
                    compendium: {require: 'science',     max: 0, limited: true,  enabled: true},
                    blueprint:  {require: 'science',     max: 0, limited: true,  enabled: false},
                    kerosene:   {require: 'oil',         max: 0, limited: true,  enabled: false},
                    megalith:   {require: false,         max: 0, limited: true,  enabled: false},
                    eludium:    {require: 'unobtainium', max: 0, limited: true,  enabled: false},
                    thorium:    {require: 'uranium',     max: 0, limited: true,  enabled: false}
                }
            },
            trade: {
                // Should KS automatically trade?
                enabled: true,
                // Every trade can define a required resource with the *require* property.
                // At what percentage of the storage capacity of that required resource should the trade happen?
                trigger: 0.95,
                // Trades can be limited to only happen during specific seasons. This is because trades with certain races
                // are more effective during specific seasons.
                // The *allowcapped* property allows us to trade even if the sold resources are at their cap.
                items: {
                    dragons:    {enabled: false,  require: 'titanium',    allowcapped: false,
                        summer:  true,  autumn:  true,  winter:  true,          spring:      true},

                    zebras:     {enabled: true,  require: false,         allowcapped: false,
                        summer:  true,  autumn:  true,  winter:  true,          spring:      true},

                    lizards:    {enabled: false,  require: 'minerals',    allowcapped: false,
                        summer:  true,  autumn:  false, winter:  false,         spring:      false},

                    sharks:     {enabled: false,  require: 'iron',        allowcapped: false,
                        summer:  false, autumn:  false, winter:  true,          spring:      false},

                    griffins:   {enabled: false,  require: 'wood',        allowcapped: false,
                        summer:  false, autumn:  true,  winter:  false,         spring:      false},

                    nagas:      {enabled: false,  require: false,         allowcapped: false,
                        summer:  false, autumn:  false, winter:  false,         spring:      true},

                    spiders:    {enabled: false,  require: false,         allowcapped: false,
                        summer:  false, autumn:  true,  winter:  false,         spring:      false},

                    leviathans: {enabled: false,  require: 'unobtainium', allowcapped: true,
                        summer:  true,  autumn:  true,  winter:  true,          spring:      true}
                }
            },
            resources: {
                furs:        {stock: 1000},
                unobtainium: {consume: 1.0}
            }
        }
    };

    // GameLog Modification
    // ====================

    // Add a message filter for trades
    if (!game.console.filters.trade){
        game.console.filters.trade = {
            title: "Trades",
            enabled: true,
            unlocked: true
        };
        game.ui.renderFilters();
    }

    // Increase messages displayed in log
    game.console.maxMessages = 1000;

    var printoutput = function (args) {
        var color = args.pop();
        args[1] = args[1] || 'ks-default';

        // update the color of the message immediately after adding
        var msg = game.msg.apply(game, args);
        $(msg.span).css('color', color);

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
            var activityClass = args.length > 1 ? ' type_' + args.pop() : '';
            args.push('ks-activity' + activityClass);
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
        this.spaceManager = new SpaceManager();
        this.craftManager = new CraftManager();
        this.tradeManager = new TradeManager();
        this.religionManager = new ReligionManager();
        this.explorationManager = new ExplorationManager();
        this.villageManager = new TabManager('Village');
    };

    Engine.prototype = {
        buildManager: undefined,
        spaceManager: undefined,
        craftManager: undefined,
        tradeManager: undefined,
        religionManager: undefined,
        explorationManager: undefined,
        villageManager: undefined,
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
            this.observeStars();
            if (options.auto.festival.enabled) this.holdFestival();
            if (options.auto.build.enabled) this.build();
            if (options.auto.space.enabled) this.space();
            if (options.auto.craft.enabled) this.craft();
            if (options.auto.trade.enabled) this.trade();
            if (options.auto.hunt.enabled) this.hunt();
            if (options.auto.faith.enabled) this.worship();
            if (options.auto.crypto.enabled) this.crypto();
            if (options.auto.explore.enabled) this.explore();
        },
		crypto: function () {
            var coinPrice = game.calendar.cryptoPrice;
            var previousRelic = game.resPool.get('relic').value;
            var previousCoin = game.resPool.get('blackcoin').value;
            var exchangedCoin = 0.0;
            var exchangedRelic = 0.0;
			var waitForBestPrice = false;

            // Only exchange if it's enabled
            if (!options.auto.crypto.enabled) return;

			// Waits for coin price to drop below a certain treshold before starting the exchange process
			if (waitForBestPrice == true && coinPrice < 860.0) { waitForBestPrice = false; }

			// Exchanges up to a certain threshold, in order to keep a good exchange rate, then waits for a higher treshold before exchanging for relics.
            if (waitForBestPrice == false && coinPrice < 950.0 && previousRelic > options.auto.crypto.trigger) {
                var currentCoin;

                game.diplomacy.buyEcoin();

                currentCoin = game.resPool.get('blackcoin').value;
                exchangedCoin = Math.round(currentCoin - previousCoin);
                activity('Kittens sold your Relics and bought '+ exchangedCoin +' Blackcoins');
            }
            else if (coinPrice > 1050.0 && game.resPool.get('blackcoin').value > 0) {
                var currentRelic;

				waitForBestPrice = true;

                game.diplomacy.sellEcoin();

                currentRelic = game.resPool.get('blackcoin').value;
                exchangedRelic = Math.round(currentRelic - previousRelic);

                activity('Kittens sold your Blackcoins and bought '+ exchangedRelic +' Relics');
            }
        },
		explore: function () {
			var manager = this.explorationManager;
			var expeditionNode = game.village.map.expeditionNode;

			// Only exchange if it's enabled
            if (!options.auto.explore.enabled) return;

			if( expeditionNode == null) {
				manager.getCheapestNode();

				manager.explore(manager.cheapestNodeX, manager.cheapestNodeY);

				activity('Your kittens started exploring node '+ manager.cheapestNodeX +'-'+ manager.cheapestNodeY +' of the map.');
			}
		},
        worship: function () {
            var builds = options.auto.faith.items;
            var buildManager = this.religionManager;
            var craftManager = this.craftManager;
            var trigger = options.auto.faith.trigger;

            // Render the tab to make sure that the buttons actually exist in the DOM. Otherwise we can't click them.
            buildManager.manager.render();

            for (var name in builds) {
                if (!builds[name].enabled) continue;

                var build = builds[name];
                var require = !build.require ? false : craftManager.getResource(build.require);

                if (!require || trigger <= require.value / require.maxValue) {
                    buildManager.build(name);
                }
            }

            // Praise the sun with any faith left over
            var faith = craftManager.getResource('faith');

            if (options.auto.faith.trigger <= faith.value / faith.maxValue) {
                storeForSummary('faith', faith.value * (1 + game.religion.getFaithBonus()));
                activity('Praised the sun!', 'ks-praise');
                game.religion.praise();
            }
        },
        build: function () {
            var builds = options.auto.build.items;
            var buildManager = this.buildManager;
            var craftManager = this.craftManager;
            var trigger = options.auto.build.trigger;

            // Render the tab to make sure that the buttons actually exist in the DOM. Otherwise we can't click them.
            buildManager.manager.render();

            // Using labeled for loop to break out of a nested loop
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/label
            buildLoop:
            for (var name in builds) {
                if (!builds[name].enabled) continue;

                var build = builds[name];
                var require = !build.require ? false : craftManager.getResource(build.require);

                if (!require || trigger <= require.value / require.maxValue) {
                    // verify that the building prices is within the current stock settings
                    var prices = game.bld.getPrices(build.name || name);
                    for (var p = 0; p < prices.length; p++) {
                        if (craftManager.getValueAvailable(prices[p].name, true) < prices[p].val) continue buildLoop;
                    }

                    // If the build overrides the name, use that name instead.
                    // This is usually true for buildings that can be upgraded.
                    buildManager.build(build.name || name, build.stage);
                }
            }
        },
        space: function () {
            var builds = options.auto.space.items;
            var buildManager = this.spaceManager;
            var craftManager = this.craftManager;
            var trigger = options.auto.space.trigger;

            // Render the tab to make sure that the buttons actually exist in the DOM. Otherwise we can't click them.
            buildManager.manager.render();

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
                var season = game.calendar.season;

                // Ensure that we have reached our cap
                if (current && current.value > craft.max) continue;

                // Craft the resource if we meet the trigger requirement
                if (!require || trigger <= require.value / require.maxValue) {
                    var amount = manager.getLowestCraftAmount(name,craft.limited);

                    if (amount > 0) {
                        manager.craft(name, amount);
                    }
                }
            }
        },
        holdFestival: function () {
            // Render the tab to make sure that the buttons actually exist in the DOM. Otherwise we can't click them.
            this.villageManager.render();

            if (game.science.get('drama').researched && game.calendar.festivalDays === 0 && game.villageTab.festivalBtn.model.enabled) {
                game.villageTab.festivalBtn.onClick();
                if (game.calendar.festivalDays !== 0) {
                    storeForSummary('festival');
                    activity('Kittens begin holding a festival', 'ks-festival');
                }
            }
        },
        observeStars: function () {
            if (game.calendar.observeBtn != null){
                game.calendar.observeHandler();
                activity('Kitten Scientists have observed a star', 'ks-star');
                storeForSummary('stars', 1);
            }
        },
        hunt: function () {
            var catpower = this.craftManager.getResource('catpower');

            if (options.auto.hunt.trigger <= catpower.value / catpower.maxValue && catpower.value >= 100) {
                // No way to send only some hunters. Thus, we hunt with everything
                var hunters = game.village.getJob('hunter').value;
                storeForSummary('hunt', hunters);
                activity('Sent ' + game.getDisplayValueExt(hunters) + ' kitten' + (hunters == 1 ? '' : 's') + ' on the hunt', 'ks-hunt');
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
                var requireTrigger = options.auto.trade.trigger;

                // If we have enough to trigger the check, then attempt to trade
                if (!require || requireTrigger <= require.value / require.maxValue) {
                    trades.push(name);
                }
            }

            // Figure out how much we can currently trade
            var maxTrades = tradeManager.getLowestTradeAmount(undefined);

            // Try our best not to starve any single race
            maxTrades = (trades.length > 0) ? Math.floor(maxTrades / trades.length) : 0;

            if (maxTrades < 1) return;

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
            if (this.tab && game.ui.activeTabId !== this.tab.tabId) this.tab.render();

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

	// Exploration Manager
	// ===================

	var ExplorationManager = function () {
		this.manager = new TabManager('Village');
	};

	ExplorationManager.prototype = {
		manager: undefined,
		currentCheapestNode: null,
		currentCheapestNodeValue: null,
		cheapestNodeX: null,
		cheapestNodeY: null,
		explore: function(x, y) {
			game.village.map.expeditionNode = {x, y};
			game.village.map.explore(x, y);
		},
		getCheapestNode: function () {
			var tileArray = game.village.map.villageData;
			var tileKey = "";

			this.currentCheapestNode = null;

			for (var i in tileArray) {
				tileKey = i;

				// Discards locked nodes
				if (i.unlocked == false) { break; }

				// Discards junk nodes
				if(tileKey.includes('-')) { break; }

				// Acquire node coordinates
				var regex = /(\d).(\d*)/g;
				var keyMatch = regex.exec(tileKey);
				var xCoord = parseInt(keyMatch[1]);
				var yCoord = parseInt(keyMatch[2]);

				if(this.currentCheapestNode == null) {
					this.currentCheapestNodeValue = this.getNodeValue(xCoord, yCoord)
					this.currentCheapestNode = i;
					this.cheapestNodeX = xCoord;
					this.cheapestNodeY = yCoord;
				}

				if (this.currentCheapestNode != null && this.getNodeValue(xCoord, yCoord) < this.currentCheapestNodeValue) {
					this.currentCheapestNodeValue = this.getNodeValue(xCoord, yCoord)
					this.currentCheapestNode = i;
					this.cheapestNodeX = xCoord;
					this.cheapestNodeY = yCoord;
				}
			}
		},
		getNodeValue: function (x, y){
			var nodePrice = game.village.map.toLevel(x, y);
			var exploreCost = game.village.map.getExplorationPrice(x,y);

			var tileValue = nodePrice / exploreCost;

			return tileValue;
		}
	};

    // Religion manager
    // ================

    var ReligionManager = function () {
        this.manager = new TabManager('Religion');
        this.crafts = new CraftManager();
    };

    ReligionManager.prototype = {
        manager: undefined,
        crafts: undefined,
        build: function (name) {
            var build = this.getBuild(name);
            var button = this.getBuildButton(name);

            if (!button || !button.model.enabled) return;

            //need to simulate a click so the game updates everything properly
            button.domNode.click(build);
            storeForSummary(name, 1, 'faith');

            activity('Kittens have discovered ' + build.label, 'ks-faith');
        },
        getBuild: function (name) {
            return game.religion.getRU(name);
        },
        getBuildButton: function (name) {
            var buttons = this.manager.tab.rUpgradeButtons;
            var build = this.getBuild(name);

            for (var i in buttons) {
                var haystack = buttons[i].model.name;
                if (haystack.indexOf(build.label) !== -1){
                    return buttons[i];
                }
            }
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
        build: function (name, stage) {
            var build = this.getBuild(name);
            var button = this.getBuildButton(name, stage);

            if (!button || !button.model.enabled) return;

            //need to simulate a click so the game updates everything properly
            button.domNode.click(build);
            storeForSummary(name, 1, 'build');

            var label = build.meta.label ? build.meta.label : build.meta.stages[0].label;
            activity('Kittens have built a new ' + label, 'ks-build');
        },
        getBuild: function (name) {
            return game.bld.getBuildingExt(name);
        },
        getBuildButton: function (name, stage) {
            var buttons = this.manager.tab.buttons;
            var build = this.getBuild(name);
            var label = typeof stage !== 'undefined' ? build.meta.stages[stage].label : build.meta.label;

            for (var i in buttons) {
                var haystack = buttons[i].model.name;
                if (haystack.indexOf(label) !== -1){
                    return buttons[i];
                }
            }
        }
    };

    // Space manager
    // ================

    var SpaceManager = function () {
        this.manager = new TabManager('Space');
        this.crafts = new CraftManager();
    };

    SpaceManager.prototype = {
        manager: undefined,
        crafts: undefined,
        build: function (name) {
            var build = this.getBuild(name);
            var button = this.getBuildButton(name);

            if (!build.unlocked || !button || !button.model.enabled || !options.auto.space.items[name].enabled) return;

            //need to simulate a click so the game updates everything properly
            button.domNode.click(build);
            storeForSummary(name, 1, 'build');

            var label = build.label;
            activity('Kittens have built a new ' + label, 'ks-build');
        },
        getBuild: function (name) {
            return game.space.getProgram(name);
        },
        getBuildButton: function (name) {
            var panels = this.manager.tab.planetPanels;

            for (var panel in panels) {
                for (var child in panels[panel].children) {
                    if (panels[panel].children[child].id === name) return panels[panel].children[child];
                }
            }
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
            var ratio = game.getResCraftRatio(craft);

            game.craft(craft.name, amount);

            // determine actual amount after crafting upgrades
            amount = (amount * (1 + ratio)).toFixed(2);

            storeForSummary(name, amount, 'craft');
            activity('Kittens have crafted ' + game.getDisplayValueExt(amount) + ' ' + ucfirst(name), 'ks-craft');
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
        getLowestCraftAmount: function (name, limited) {
            var amount = Number.MAX_VALUE;
            var materials = this.getMaterials(name);

            // Safeguard if materials for craft cannot be determined.
            if (!materials) return 0;

            var res = this.getResource(name);

            for (var i in materials) {
                var delta = undefined;
                if(this.getResource(i).maxValue > 0 || ! limited) {
                    // If there is a storage limit, we can just use everything returned by getValueAvailable, since the regulation happens there
                    delta = this.getValueAvailable(i) / materials[i];
                } else {
                    // Take the currently present amount of material to craft into account
                    // Only craft "half" (TODO: document this behaviour)
                    delta = (this.getValueAvailable(i) - materials[i] * this.getValueAvailable(res.name)) / (2 * materials[i]);
                }

                amount = Math.min(delta,amount);
            }

            // If we have a maximum value, ensure that we don't produce more than
            // this value. This should currently only impact wood crafting, but is
            // written generically to ensure it works for any craft that produces a
            // good with a maximum value.
            if (res.maxValue > 0 && amount > (res.maxValue - res.value))
                amount = res.maxValue - res.value;

            return Math.floor(amount);
        },
        getMaterials: function (name) {
            var materials = {};
            var craft = this.getCraft(name);

            // Safeguard against craft items that aren't actually available yet.
            if (!craft) return;

            var prices = craft.prices;

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
        getStock: function (name) {
            var res = options.auto.resources[this.getName(name)];
            var stock = res ? res.stock : 0;

            return !stock ? 0 : stock;
        },
        getValueAvailable: function (name, all) {
            var value = this.getValue(name);
            var stock = this.getStock(name);

            if ('catnip' === name) {
                var resPerTick = game.getResourcePerTick(name, false, {
                    modifiers: {
                        'catnip': 0.10 - game.calendar.getWeatherMod()
                    }});

                if (resPerTick < 0) stock -= resPerTick * 202 * 5;
            }

            value = Math.max(value - stock, 0);

            // If we have a maxValue, and user hasn't requested all, check
            // consumption rate
            if (!all && this.getResource(name).maxValue > 0) {
                var res = options.auto.resources[name];
                var consume = res && (res.consume != undefined) ? res.consume : options.consume;

                value *= consume;
            }

            return value;
        }
    };

    // Trading Manager
    // ===============

    var TradeManager = function () {
        this.craftManager = new CraftManager();
        this.manager = new TabManager('Trade');

        this.manager.render();
    };

    TradeManager.prototype = {
        craftManager: undefined,
        manager: undefined,
        trade: function (name, amount) {

            if (!name || 1 > amount) return;

            var race = this.getRace(name);

            if (!race.unlocked) return;

            var button = this.getTradeButton(race.title);

            if (!button.model.enabled || !options.auto.trade.items[name].enabled) return;

            game.diplomacy.tradeMultiple(race, amount);
            storeForSummary(name, amount, 'trade');
            activity('Kittens have traded ' + amount + 'x with ' + ucfirst(name), 'ks-trade');
        },
        getLowestTradeAmount: function (name) {
            var amount = undefined;
            var highestCapacity = undefined;
            var materials = this.getMaterials(name);
            var race = this.getRace(name);

            for (var i in materials) {
                var total = this.craftManager.getValueAvailable(i) / materials[i];

                amount = (amount === undefined || total < amount) ? total : amount;
            }

            if (race === null || options.auto.trade.items[name].allowcapped) return Math.floor(amount);

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
                    var tratio = game.getEffect("tradeRatio");
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
            for (var i in this.manager.tab.racePanels) {
                var panel = this.manager.tab.racePanels[i];

                if (panel.name.indexOf(race) > -1) return panel.tradeBtn;
            }

            warning('unable to find trade button for ' + name);
        }
    };

    // ==============================
    // Configure overall page display
    // ==============================

    var container = $('#game');
    var column = $('.column');
    var body = $('body');
    var button = $('.btn.modern');
    var left = $('#leftColumn');
    var middle = $('#midColumn');
    var right = $('#rightColumn');

    var addRule = function (rule) {
        var sheets = document.styleSheets;
        sheets[0].insertRule(rule, 0);
    };

    if (game.colorScheme !== 'sleek') {
        container.css({
            fontFamily: 'monospace',
            fontSize: '12px',
            minWidth: '1300px',
            top: '32px'
        });

        body.css({
            fontFamily: 'monospace',
            fontSize: '12px'
        });

        button.css({
            fontFamily: 'monospace',
            fontSize: '12px',
            width: '290px'
        });

        column.css({
            minHeight: 'inherit',
            maxWidth: 'inherit',
            padding: '1%',
            margin: 0,
            overflowY: 'auto'
        });

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
            + 'font-family: monospace;'
            + 'font-size: 12px !important;'
            + 'margin: 0 5px 7px 0;'
            + 'width: 290px;'
            + '}');

        addRule('#game .map-viewport {'
            + 'height: 340px;'
            + 'max-width: 500px;'
            + 'overflow: visible;'
            + '}');

        addRule('#game .map-dashboard {'
            + 'height: 120px;'
            + 'width: 292px;'
            + '}');
    }

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

    addRule('#ks-options #toggle-list-resources .stockWarn {'
        + 'color: ' + options.stockwarncolor + ';'
        + '}');

    // Local Storage
    // =============

    var kittenStorageVersion = 1;

    var kittenStorage = {
        version: kittenStorageVersion,
        items: {},
        resources: {},
        triggers: {}
    };

    var initializeKittenStorage = function () {
        $("#items-list-build, #items-list-craft, #items-list-trade").find("input[id^='toggle-']").each(function () {
            kittenStorage.items[$(this).attr("id")] = $(this).prop("checked");
        });

        saveToKittenStorage();
    };

    var saveToKittenStorage = function () {
        kittenStorage.resources = options.auto.resources;
        kittenStorage.triggers = {
            faith: options.auto.faith.trigger,
            hunt: options.auto.hunt.trigger,
            build: options.auto.build.trigger,
            space: options.auto.space.trigger,
            craft: options.auto.craft.trigger,
            crypto: options.auto.crypto.trigger,
            explore: options.auto.explore.trigger,
            trade: options.auto.trade.trigger
        };
        localStorage['cbc.kitten-scientists'] = JSON.stringify(kittenStorage);
    };

    var loadFromKittenStorage = function () {
        var saved = JSON.parse(localStorage['cbc.kitten-scientists'] || 'null');
        if (saved && saved.version == kittenStorageVersion) {
            kittenStorage = saved;

            for (var item in kittenStorage.items) {
                var value = kittenStorage.items[item];
                var el = $('#' + item);
                var option = el.data('option');
                var name = item.split('-');

                el.prop('checked', value);

                if (name.length == 2) {
                    option.enabled = value;
                } else {
                    if (name[1] == 'limited') {
                        option.limited = value;
                    } else {
                        option[name[2]] = value;
                    }
                }
            }

            var list = $("#toggle-list-resources");
            for (var resource in kittenStorage.resources) {
                var res = kittenStorage.resources[resource];

                if ($('#resource-' + resource).length === 0) {
                    list.append(addNewResourceOption(resource));
                }
                if ('stock' in res) {
                    setStockValue(resource, res.stock);
                }
                if ('consume' in res) {
                    setConsumeRate(resource, res.consume);
                }
            }

            if (saved.triggers) {
                options.auto.faith.trigger = saved.triggers.faith;
                options.auto.hunt.trigger = saved.triggers.hunt;
                options.auto.build.trigger = saved.triggers.build;
                options.auto.space.trigger = saved.triggers.space;
                options.auto.craft.trigger = saved.triggers.craft;
                options.auto.trade.trigger = saved.triggers.trade;
                options.auto.crypto.trigger = saved.triggers.crypto;
                options.auto.explore.trigger = saved.triggers.explore;

                $('#trigger-faith')[0].title = options.auto.faith.trigger;
                $('#trigger-hunt')[0].title = options.auto.hunt.trigger;
                $('#trigger-build')[0].title = options.auto.build.trigger;
                $('#trigger-space')[0].title = options.auto.space.trigger;
                $('#trigger-craft')[0].title = options.auto.craft.trigger;
                $('#trigger-trade')[0].title = options.auto.trade.trigger;
                $('#trigger-crypto')[0].title = options.auto.crypto.trigger;				
            }

        } else {
            initializeKittenStorage();
        }
    };

    // Add options element
    // ===================

    var ucfirst = function (string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    var roundToTwo = function (n) {
        return +(Math.round(n + "e+2") + "e-2")
    };

    var setStockWarning = function(name, value) {
        // simplest way to ensure it doesn't stick around too often; always do 
        // a remove first then re-add only if needed
        $("#resource-" + name).removeClass("stockWarn");

        var maxValue = game.resPool.resources.filter(i => i.name == name)[0].maxValue;
        if (value > maxValue && !(maxValue === 0)) $("#resource-" + name).addClass("stockWarn");
    }

    var setStockValue = function (name, value) {
        var n = Number(value);

        if (isNaN(n) || n < 0) {
            warning('ignoring non-numeric or invalid stock value ' + value);
            return;
        }

        if (!options.auto.resources[name]) options.auto.resources[name] = {};
        options.auto.resources[name].stock = n;
        $('#stock-value-' + name).text('Stock: ' + game.getDisplayValueExt(n));

        setStockWarning(name, n);
    };

    var setConsumeRate = function (name, value) {
        var n = parseFloat(value);

        if (isNaN(n) || n < 0.0 || n > 1.0) {
            warning('ignoring non-numeric or invalid consume rate ' + value);
            return;
        }

        if (!options.auto.resources[name]) options.auto.resources[name] = {};
        options.auto.resources[name].consume = n;
        $('#consume-rate-' + name).text('Consume: ' + n.toFixed(2));
    };

    var removeResourceControl = function (name) {
        delete options.auto.resources[name];
    };

    var addNewResourceOption = function (name, title) {
        var res = options.auto.resources[name];
        var stock = res && (res.stock != undefined) ? res.stock : 0;
        var consume = res && (res.consume != undefined) ? res.consume : options.consume;

        var container = $('<div/>', {
            id: 'resource-' + name,
            css: {display: 'inline-block', width: '100%'},
        });

        var label = $('<div/>', {
            id: 'resource-label-' + name,
            text: ucfirst(title ? title : name),
            css: {display: 'inline-block', width: '95px'},
        });

        var stock = $('<div/>', {
            id: 'stock-value-' + name,
            text: 'Stock: ' + game.getDisplayValueExt(stock),
            css: {cursor: 'pointer', display: 'inline-block', width: '80px'},
        });

        var consume = $('<div/>', {
            id: 'consume-rate-' + name,
            text: 'Consume: ' + consume.toFixed(2),
            css: {cursor: 'pointer', display: 'inline-block'},
        });

        var del = $('<div/>', {
            id: 'resource-delete-' + name,
            text: 'del',
            css: {cursor: 'pointer',
                display: 'inline-block',
                float: 'right',
                paddingRight: '5px',
                textShadow: '3px 3px 4px gray'},
        });

        container.append(label, stock, consume, del);

        // once created, set color if relevant
        if (res != undefined && res.stock != undefined) setStockWarning(name, res.stock);

        stock.on('click', function () {
            var value = window.prompt('Stock for ' + ucfirst(title ? title : name));
            if (value !== null) {
                setStockValue(name, value);
                saveToKittenStorage();
            }
        });

        consume.on('click', function () {
            var value = window.prompt('Consume rate for ' + ucfirst(title ? title : name));
            if (value !== null) {
                setConsumeRate(name, value);
                saveToKittenStorage();
            }
        });

        del.on('click', function () {
            if (window.confirm('Delete resource controls for ' + ucfirst(title ? title : name) + '?')) {
                container.remove();
                removeResourceControl(name);
                saveToKittenStorage();
            }
        });

        return container;
    };

    var getAvailableResourceOptions = function () {
        var items = [];

        for (var i in game.resPool.resources) {
            var res = game.resPool.resources[i];

            // Show only new resources that we don't have in the list and that are
            // visible. This helps cut down on total size.
            if (res.name && $('#resource-' + res.name).length === 0) {
                var item = $('<div/>', {
                    id: 'resource-add-' + res.name,
                    text: ucfirst(res.title ? res.title : res.name),
                    css: {cursor: 'pointer',
                        textShadow: '3px 3px 4px gray'},
                });

                // Wrapper function needed to make closure work
                (function (res, item) {
                    item.on('click', function () {
                        item.remove();
                        if (!options.auto.resources[res.name]) options.auto.resources[res.name] = {};
                        options.auto.resources[res.name].stock = 0;
                        options.auto.resources[res.name].consume = options.consume;
                        $('#toggle-list-resources').append(addNewResourceOption(res.name, res.title));
                    });
                })(res, item);

                items.push(item);
            }
        }

        return items;
    };

    var getResourceOptions = function () {
        var list = $('<ul/>', {
            id: 'toggle-list-resources',
            css: {display: 'none', paddingLeft: '20px'}
        });

        var add = $('<div/>', {
            id: 'resources-add',
            text: 'add resources',
            css: {cursor: 'pointer',
                display: 'inline-block',
                textShadow: '3px 3px 4px gray',
                borderBottom: '1px solid rgba(185, 185, 185, 0.7)' },
        });

        var clearunused = $('<div/>', {
            id: 'resources-clear-unused',
            text: 'clear unused',
            css: {cursor: 'pointer',
                display: 'inline-block',
                float: 'right',
                paddingRight: '5px',
                textShadow: '3px 3px 4px gray' },
        });

        clearunused.on('click', function () {
            for (var name in options.auto.resources) {
                // Only delete resources with unmodified values. Require manual
                // removal of resources with non-standard values.
                if (!options.auto.resources[name].stock &&
                    options.auto.resources[name].consume == options.consume ||
                    options.auto.resources[name].consume == undefined) {
                    $('#resource-' + name).remove();
                }
            }
        });

        allresources = $('<ul/>', {
            id: 'available-resources-list',
            css: {display: 'none', paddingLeft: '20px'}
        });

        add.on('click', function () {
            allresources.toggle();
            allresources.empty();
            allresources.append(getAvailableResourceOptions());
        });

        list.append(add, clearunused, allresources);

        // Add all the current resources
        for (var name in options.auto.resources) {
            list.append(addNewResourceOption(name));
        }

        return list;
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
            input.prop('checked', true);
        }

        // engine needs a custom toggle
        if (toggleName !== 'engine') {
            input.on('change', function () {
                if (input.is(':checked') && auto.enabled == false) {
                    auto.enabled = true;
                    message('Enabled Auto ' + ucfirst(text));
                } else if (input.not(':checked') && auto.enabled == true) {
                    auto.enabled = false;
                    message('Disabled Auto ' + ucfirst(text));
                }
            });
        }

        element.append(input, label);

        if (auto.items) {
            // Add a border on the element
            element.css('borderBottom', '1px  solid rgba(185, 185, 185, 0.7)');

            var toggle = $('<div/>', {
                css: {display: 'inline-block', float: 'right'}
            });

            var button = $('<div/>', {
                id: 'toggle-items-' + toggleName,
                text: 'items',
                css: {cursor: 'pointer',
                    display: 'inline-block',
                    paddingRight: '5px',
                    textShadow: '3px 3px 4px gray'}
            });

            toggle.append(button);

            var list = $('<ul/>', {
                id: 'items-list-' + toggleName,
                css: {display: 'none', paddingLeft: '20px'}
            });

            var disableall = $('<div/>', {
                id: 'toggle-all-items-' + toggleName,
                text: 'disable all',
                css: {cursor: 'pointer',
                    display: 'inline-block',
                    textShadow: '3px 3px 4px gray',
                    marginRight: '8px'}
            });

            disableall.on('click', function () {
                // can't use find as we only want one layer of checkboxes
                var items = list.children().children(':checkbox');
                items.prop('checked', false);
                items.change();
                list.children().children(':checkbox').change();
            });

            list.append(disableall);

            var enableall = $('<div/>', {
                id: 'toggle-all-items-' + toggleName,
                text: 'enable all',
                css: {cursor: 'pointer',
                    display: 'inline-block',
                    textShadow: '3px 3px 4px gray'}
            });

            enableall.on('click', function () {
                // can't use find as we only want one layer of checkboxes
                var items = list.children().children(':checkbox');
                items.prop('checked', true);
                items.change();
                list.children().children(':checkbox').change();
            });

            list.append(enableall);

            // fill out list with toggle items
            for (var itemName in auto.items) {
                if (toggleName === 'trade')
                    list.append(getTradeOption(itemName, auto.items[itemName]));
                else if (toggleName === 'craft')
                    list.append(getCraftOption(itemName, auto.items[itemName]));
                else
                    list.append(getOption(itemName, auto.items[itemName]));
            }

            button.on('click', function () {
                list.toggle();
            });

            element.append(toggle, list);

            // Add resource controls for crafting, sort of a hack
            if (toggleName === 'craft') {
                var resources = $('<div/>', {
                    id: 'toggle-resource-controls',
                    text: 'resources',
                    css: {cursor: 'pointer',
                        display: 'inline-block',
                        paddingRight: '5px',
                        textShadow: '3px 3px 4px gray'},
                });

                var resourcesList = getResourceOptions();

                // When we click the items button, make sure we clear resources
                button.on('click', function () {
                    resourcesList.toggle(false);
                });

                resources.on('click', function () {
                    list.toggle(false);
                    resourcesList.toggle();
                });

                toggle.prepend(resources);

                element.append(resourcesList);
            }

        }

        if (auto.trigger) {
            var triggerButton = $('<div/>', {
                id: 'trigger-' + toggleName,
                text: 'trigger',
                title: auto.trigger,
                css: {cursor: 'pointer',
                    display: 'inline-block',
                    float: 'right',
                    paddingRight: '5px',
                    textShadow: '3px 3px 4px gray'}
            });

            triggerButton.on('click', function () {
                var value;
                if (text == 'Crypto'){value = window.prompt('Enter a new trigger value for ' + text + '. Corresponds to the amount of Relics needed before the exchange is made.', auto.trigger);}
                else{value = window.prompt('Enter a new trigger value for ' + text + '. Should be in the range of 0 to 1.', auto.trigger);}

                if (value !== null) {
                    auto.trigger = parseFloat(value);
                    saveToKittenStorage();
                    triggerButton[0].title = auto.trigger;
                }
            });

            element.append(triggerButton);
        }

        return element;
    };

    var getTradeOption = function (name, option) {
        var element = getOption(name, option);
        element.css('borderBottom', '1px solid rgba(185, 185, 185, 0.7)');

        var button = $('<div/>', {
            id: 'toggle-seasons-' + name,
            text: 'seasons',
            css: {cursor: 'pointer',
                display: 'inline-block',
                float: 'right',
                paddingRight: '5px',
                textShadow: '3px 3px 4px gray'},
        });

        var list = $('<ul/>', {
            id: 'seasons-list-' + name,
            css: {display: 'none', paddingLeft: '20px'}
        });

        // fill out the list with seasons
        list.append(getSeason(name, 'spring', option));
        list.append(getSeason(name, 'summer', option));
        list.append(getSeason(name, 'autumn', option));
        list.append(getSeason(name, 'winter', option));

        button.on('click', function () {
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
        }).data('option', option);

        if (option[season]) {
            input.prop('checked', true);
        }

        input.on('change', function () {
            if (input.is(':checked') && option[season] == false) {
                option[season] = true;
                message('Enabled trading with ' + ucfirst(name) + ' in the ' + ucfirst(season));
            } else if (input.not(':checked') && option[season] == true) {
                option[season] = false;
                message('Disabled trading ' + ucfirst(name) + ' in the ' + ucfirst(season));
            }
            kittenStorage.items[input.attr('id')] = option[season];
            saveToKittenStorage();
        });

        element.append(input, label);

        return element;
    };

    var getOption = function (name, option) {
        var element = $('<li/>');
        var elementLabel = option.label || ucfirst(name);

        var label = $('<label/>', {
            'for': 'toggle-' + name,
            text: elementLabel,
            css: {display: 'inline-block', minWidth: '80px'}
        });

        var input = $('<input/>', {
            id: 'toggle-' + name,
            type: 'checkbox'
        }).data('option', option);

        if (option.enabled) {
            input.prop('checked', true);
        }

        input.on('change', function () {
            if (input.is(':checked') && option.enabled == false) {
                option.enabled = true;
                message('Enabled Auto ' + elementLabel);
            } else if (input.not(':checked') && option.enabled == true) {
                option.enabled = false;
                message('Disabled Auto ' + elementLabel);
            }
            kittenStorage.items[input.attr('id')] = option.enabled;
            saveToKittenStorage();
        });

        element.append(input, label);

        return element;
    };

    var getCraftOption = function (name, option) {
        var element = getOption(name, option);

        var label = $('<label/>', {
            'for': 'toggle-limited-' + name,
            text: 'Limited'
        });

        var input = $('<input/>', {
            id: 'toggle-limited-' + name,
            type: 'checkbox'
        }).data('option', option);

        if (option.limited) {
            input.prop('checked', true);
        }

        input.on('change', function () {
            if (input.is(':checked') && option.limited == false) {
                option.limited = true;
                message('Crafting ' + ucfirst(name) + ': limited once per season');
            } else if (input.not(':checked') && option.limited == true) {
                option.limited = false;
                message('Crafting ' + ucfirst(name) + ': unlimited');
            }
            kittenStorage.items[input.attr('id')] = option.limited;
            saveToKittenStorage();
        });

        element.append(input, label);

        return element;
    };

    // Grab button labels for religion options
    var religionManager = new ReligionManager();
    for (var buildOption in options.auto.faith.items) {
        var buildItem = options.auto.faith.items[buildOption];
        var build = religionManager.getBuild(buildItem.name || buildOption);
        if (build) {
            options.auto.faith.items[buildOption].label = build.label;
        }
    }

    // Grab button labels for build options
    var buildManager = new BuildManager();
    for (var buildOption in options.auto.build.items) {
        var buildItem = options.auto.build.items[buildOption];
        var build = buildManager.getBuild(buildItem.name || buildOption);
        if (build) {
            if ("stage" in buildItem) {
                options.auto.build.items[buildOption].label = build.meta.stages[buildItem.stage].label;
            } else {
                options.auto.build.items[buildOption].label = build.meta.label;
            }
        }
    }

    // Grab button labels for space options
    var spaceManager = new SpaceManager();
    for (var spaceOption in options.auto.space.items) {
        var build = spaceManager.getBuild(spaceOption);
        if (build) {
            // It's changed to label in 1.3.0.0
            var title = build.title ? build.title : build.label;
            options.auto.space.items[spaceOption].label = title;
        }
    }

    var optionsElement = $('<div/>', {id: 'ks-options', css: {marginBottom: '10px'}});
    var optionsListElement = $('<ul/>');
    var optionsTitleElement = $('<div/>', {
        css: { bottomBorder: '1px solid gray', marginBottom: '5px' },
        text: version
    });

    optionsElement.append(optionsTitleElement);

    optionsListElement.append(getToggle('engine',   'Enable Scientists'));
    optionsListElement.append(getToggle('build',    'Building'));
    optionsListElement.append(getToggle('space',    'Space'));
    optionsListElement.append(getToggle('craft',    'Crafting'));
    optionsListElement.append(getToggle('trade',    'Trading'));
    optionsListElement.append(getToggle('hunt',     'Hunting'));
    optionsListElement.append(getToggle('faith',    'Religion'));
    optionsListElement.append(getToggle('festival', 'Festival'));
    optionsListElement.append(getToggle('crypto',   'Crypto'));
    optionsListElement.append(getToggle('explore',  'Explore'));

    // add activity button
    // ===================

    activitySummary = {};
    var resetActivitySummary = function () {
        activitySummary = {
            lastyear: game.calendar.year,
            lastday:  game.calendar.day,
            craft:    {},
            trade:    {},
            build:    {},
            other:    {}
        };
    };

    var storeForSummary = function (name, amount, section) {
        if (amount === undefined) amount = 1;
        if (section === undefined) section = 'other';

        if (activitySummary[section] === undefined)
            activitySummary[section] = {};

        if (activitySummary[section][name] === undefined) {
            activitySummary[section][name] = parseInt(amount, 10);
        } else {
            activitySummary[section][name] += parseInt(amount, 10);
        }
    };

    var displayActivitySummary = function () {
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
            summary('Sent ' + game.getDisplayValueExt(activitySummary.other.hunt) + ' adorable kitten hunter' + (activitySummary.other.hunt == 1 ? '' : 's'));
        }

        // Buildings
        for (var name in activitySummary.build) {
            summary('Built: +' + game.getDisplayValueExt(activitySummary.build[name]) + ' ' + ucfirst(name));
        }

        // Crafts
        for (var name in activitySummary.craft) {
            summary('Crafted: +' + game.getDisplayValueExt(activitySummary.craft[name]) + ' ' + ucfirst(name));
        }

        // Trading
        for (var name in activitySummary.trade) {
            summary('Traded: ' + game.getDisplayValueExt(activitySummary.trade[name]) + 'x ' + ucfirst(name));
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
    };

    resetActivitySummary();

    var activityBox = $('<div/>', {
        id: 'activity-box',
        css: {
            display: 'inline-block',
            float: 'right',
            verticalAlign: 'top'
        }
    });

    var showActivity = $('<a/>', {
        id: 'showActivityHref',
        text: 'Show activity',
        href: '#',
        css: {
            verticalAlign: 'top'
        }
    });

    var activityCheckbox = $('<input/>', {
        id: 'enable-activity',
        type: 'checkbox',
        css: {
            verticalAlign: 'top'
        }
    });

    var activityLabel = $('<label/>', {
        for: 'enable-activity'
    });

    if (options.showactivity)
        activityCheckbox.prop('checked', true);

    activityCheckbox.on('change', function () {
        if (activityCheckbox.is(':checked') && options.showactivity == false) {
            options.showactivity = true;
            message('Showing Kitten Scientists activity live');
        } else if (activityCheckbox.not(':checked') && options.showactivity == true) {
            options.showactivity = false;
            message('Hiding updates of Kitten Scientists activity');
        }
    });

    showActivity.on('click', displayActivitySummary);

    activityBox.append(activityCheckbox, activityLabel, showActivity);

    $('#clearLog').append(activityBox);

    // Donation Button
    // ===============

    var donate = $('<li/>').append($('<a/>', {
        href: 'bitcoin:' + address + '?amount=0.005&label=Kittens Donation',
        target: '_blank',
        text: address
    })).prepend($('<img/>', {
        css: {
            height: '15px',
            width: '15px',
            padding: '3px 4px 0 4px',
            verticalAlign: 'bottom'
        },
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

    loadFromKittenStorage();

    if (console && console.log) console.log(version + " loaded");

}

var loadTest = function() {
    if (typeof gamePage === 'undefined') {
        // Test if kittens game is already loaded or wait 2s and try again
        setTimeout(function(){
            loadTest();
        }, 2000);
    } else {
        // Kittens loaded, run Kitten Scientist's Automation Engine
        game = gamePage;
        run();
    }
}

loadTest();
