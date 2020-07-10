// ==UserScript==
// @name        Kitten Scientists
// @namespace   http://www.reddit.com/r/kittensgame/comments/34gb2u/kitten_scientists_automation_script/
// @description Launch Kitten Scientists
// @include     *bloodrizer.ru/games/kittens/*
// @include     file:///*kitten-game*
// @include     *kittensgame.com/web/*
// @version     1.4.2
// @grant       none
// @copyright   2015, cameroncondry
// ==/UserScript==

// ==========================================
// Begin Kitten Scientist's Automation Engine
// ==========================================

var version = 'Kitten Scientists version 1.4.2';
var address = '1MC7Vj5ovpq3mzn9JhyhYMPEBRFoRZgDwa';

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

        // The default consume rate.
        consume: 0.6,

        // The default settings for game automation.
        auto: {
            // Settings related to KS itself.
            engine: {
                // Should any automation run at all?
                enabled: false
            },
            faith: {
                // Should religion building be automated?
                enabled: true,
                // At what percentage of the storage capacity should KS build faith buildings?
                trigger: 0,
                // Which religious upgrades should be researched?
                items: {
                    // Variant denotes which category the building or upgrade falls within in the Religion tab.
                    // Ziggurats are variant z.
                    unicornTomb:        {require: false,         enabled: false, variant: 'z'},
                    ivoryTower:         {require: false,         enabled: false, variant: 'z'},
                    ivoryCitadel:       {require: false,         enabled: false, variant: 'z'},
                    skyPalace:          {require: false,         enabled: false, variant: 'z'},
                    unicornUtopia:      {require: 'gold',        enabled: false, variant: 'z'},
                    sunspire:           {require: 'gold',        enabled: false, variant: 'z'},
                    marker:             {require: 'unobtainium', enabled: false, variant: 'z'},
                    unicornGraveyard:   {require: false,         enabled: false, variant: 'z'},
                    unicornNecropolis:  {require: false,         enabled: false, variant: 'z'},
                    blackPyramid:       {require: 'unobtainium', enabled: false, variant: 'z'},
                    // Order of the Sun is variant s.
                    solarchant:         {require: 'faith',       enabled: true,  variant: 's'},
                    scholasticism:      {require: 'faith',       enabled: true,  variant: 's'},
                    goldenSpire:        {require: 'faith',       enabled: true,  variant: 's'},
                    sunAltar:           {require: 'faith',       enabled: true,  variant: 's'},
                    stainedGlass:       {require: 'faith',       enabled: true,  variant: 's'},
                    solarRevolution:    {require: 'faith',       enabled: true,  variant: 's'},
                    basilica:           {require: 'faith',       enabled: true,  variant: 's'},
                    templars:           {require: 'faith',       enabled: true,  variant: 's'},
                    apocripha:          {require: 'faith',       enabled: false, variant: 's'},
                    transcendence:      {require: 'faith',       enabled: true,  variant: 's'},
                    // Cryptotheology is variant c.
                    blackObelisk:       {require: false,         enabled: false, variant: 'c'},
                    blackNexus:         {require: false,         enabled: false, variant: 'c'},
                    blackCore:          {require: false,         enabled: false, variant: 'c'},
                    singularity:        {require: false,         enabled: false, variant: 'c'},
                    blackLibrary:       {require: false,         enabled: false, variant: 'c'},
                    blackRadiance:      {require: false,         enabled: false, variant: 'c'},
                    blazar:             {require: false,         enabled: false, variant: 'c'},
                    darkNova:           {require: false,         enabled: false, variant: 'c'},
                    holyGenocide:       {require: false,         enabled: false, variant: 'c'},
                }
            },
            build: {
                // Should buildings be built automatically?
                enabled: true,
                // When a building requires a certain resource (this is what their *require* property refers to), then
                // this is the percentage of the storage capacity of that resource, that has to be met for the building
                // to be built.
                trigger: 0,
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
                    library:        {require: 'wood',        enabled: true, stage: 0},
                    dataCenter:     {require: false,         enabled: true, stage: 1, name: 'library'},
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
                trigger: 0,
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
                    tectonic:   {require: 'antimatter', enabled: false},
                    moltenCore: {require: 'uranium',    enabled: false}
                }
            },
            time: {
                // Should time upgrades be built automatically?
                enabled: false,
                trigger: 0,
                items: {
                    // Variants denote whether these buildings fall within the Chronoforge or Void categories.
                    // Chronoforge has variant chrono.
                    temporalBattery:     {require: false,          enabled: false, variant: 'chrono'},
                    blastFurnace:        {require: false,          enabled: false, variant: 'chrono'},
                    temporalAccelerator: {require: false,          enabled: false, variant: 'chrono'},
                    temporalImpedance:   {require: false,          enabled: false, variant: 'chrono'},
                    ressourceRetrieval:  {require: false,          enabled: false, variant: 'chrono'},

                    // Void Space has variant void.
                    cryochambers:        {require: false,          enabled: false, variant: 'void'},
                    voidHoover:          {require: 'antimatter',   enabled: false, variant: 'void'},
                    voidRift:            {require: false,          enabled: false, variant: 'void'},
                    chronocontrol:       {require: 'temporalFlux', enabled: false, variant: 'void'},
                    voidResonator:       {require: false,          enabled: false, variant: 'void'}
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
                // The *limited* property tells KS to craft resources whenever the ratio of the component cost of the stored resources
                // to the number of stored components is greater than the limit ratio "limRat".
                // This means that if limRat is 0.5, then if you have 1000 beams and 500 beams worth of scaffolds, 250 of the beams
                // will be crafted into scaffolds. If instead limRat is 0.75, 625 of the beams will be crafted into scaffolds for a final result
                // of 1125 beams-worth of scaffolds and 375 remaining beams.
                // Currently, limRat is not modifiable through the UI, though if there is demand, perhaps this will be added in the future.
                // Limited has a few other effects like balancing plates and steel while minimizing iron waste

                // TLDR: The purpose of the limited property is to proportionally distribute raw materials
                // across all crafted resources without wasting raw materials.

                items: {
                    wood:       {require: 'catnip',      max: 0, limited: true,  limRat: 0.5, enabled: true},
                    beam:       {require: 'wood',        max: 0, limited: true,  limRat: 0.5, enabled: true},
                    slab:       {require: 'minerals',    max: 0, limited: true,  limRat: 0.5, enabled: true},
                    steel:      {require: 'coal',        max: 0, limited: true,  limRat: 0.5, enabled: true},
                    plate:      {require: 'iron',        max: 0, limited: true,  limRat: 0.5, enabled: true},
                    alloy:      {require: 'titanium',    max: 0, limited: true,  limRat: 0.5, enabled: true},
                    concrete:   {require: false,         max: 0, limited: true,  limRat: 0.5, enabled: true},
                    gear:       {require: false,         max: 0, limited: true,  limRat: 0.5, enabled: true},
                    scaffold:   {require: false,         max: 0, limited: true,  limRat: 0.5, enabled: true},
                    ship:       {require: false,         max: 0, limited: true,  limRat: 0.5, enabled: true},
                    tanker:     {require: false,         max: 0, limited: true,  limRat: 0.5, enabled: true},
                    parchment:  {require: false,         max: 0, limited: false, limRat: 0.5, enabled: true},
                    manuscript: {require: 'culture',     max: 0, limited: true,  limRat: 0.5, enabled: true},
                    compendium: {require: 'science',     max: 0, limited: true,  limRat: 0.5, enabled: true},
                    blueprint:  {require: 'science',     max: 0, limited: true,  limRat: 0.5, enabled: true},
                    kerosene:   {require: 'oil',         max: 0, limited: true,  limRat: 0.5, enabled: true},
                    megalith:   {require: false,         max: 0, limited: true,  limRat: 0.5, enabled: true},
                    eludium:    {require: 'unobtainium', max: 0, limited: true,  limRat: 0.5, enabled: true},
                    thorium:    {require: 'uranium',     max: 0, limited: true,  limRat: 0.5, enabled: true}
                }
            },
            trade: {
                // Should KS automatically trade?
                enabled: true,
                // Every trade can define a required resource with the *require* property.
                // At what percentage of the storage capacity of that required resource should the trade happen?
                trigger: 0.98,
                // Trades can be limited to only happen during specific seasons. This is because trades with certain races
                // are more effective during specific seasons.
                // The *allowcapped* property allows us to trade even if the sold resources are at their cap.
                items: {
                    dragons:    {enabled: true,  require: 'titanium',    allowcapped: false,    limited: true,
                        summer:  true,  autumn:  true,  winter:  true,          spring:      true},

                    zebras:     {enabled: true,  require: false,         allowcapped: false,    limited: true,
                        summer:  true,  autumn:  true,  winter:  true,          spring:      true},

                    lizards:    {enabled: true,  require: 'minerals',    allowcapped: false,    limited: true,
                        summer:  true,  autumn:  false, winter:  false,         spring:      false},

                    sharks:     {enabled: true,  require: 'iron',        allowcapped: false,    limited: true,
                        summer:  false, autumn:  false, winter:  true,          spring:      false},

                    griffins:   {enabled: true,  require: 'wood',        allowcapped: false,    limited: true,
                        summer:  false, autumn:  true,  winter:  false,         spring:      false},

                    nagas:      {enabled: true,  require: false,         allowcapped: false,    limited: true,
                        summer:  false, autumn:  false, winter:  false,         spring:      true},

                    spiders:    {enabled: true,  require: false,         allowcapped: false,    limited: true,
                        summer:  false, autumn:  true,  winter:  false,         spring:      false},

                    leviathans: {enabled: true,  require: 'unobtainium', allowcapped: true,     limited: true,
                        summer:  true,  autumn:  true,  winter:  true,          spring:      true}
                }
            },
            upgrade: {
                //Should KS automatically upgrade?
                enabled: false,
                items: {
                    upgrades:  {enabled: true},
                    techs:     {enabled: true},
                    races:     {enabled: true},
                    missions:  {enabled: true},
                    buildings: {enabled: true}
                }
            },
            options: {
                //Which misc options should be enabled?
                enabled: true,
                items: {
                    observe:            {enabled: true,                    misc: true, label: 'Observe Astro Events'},
                    festival:           {enabled: true,                    misc: true, label: 'Hold Festivals'},
                    autoPraise:         {enabled: true,                    misc: true, label: 'Auto Praise'},
                    shipOverride:       {enabled: true,                    misc: true, label: 'Force Ships to 243'},
                    autofeed:           {enabled: true,                    misc: true, label: 'Feed Leviathans'},
                    hunt:               {enabled: true, subTrigger: 0.98,  misc: true, label: 'Hunt'},
                    crypto:             {enabled: true, subTrigger: 10000, misc: true, label: 'Trade Blackcoin'},
                    buildEmbassies:     {enabled: true, subTrigger: 0.9,   misc: true, label: 'Build Embassies (Beta)'},
                    explore:            {enabled: false,                   misc: true, label: 'Explore (Deprecated)'}
                }
            },
            filter: {
                //What log messages should be filtered?
                enabled: false,
                items: {
                    buildFilter:     {enabled: false, filter: true, label: 'Building',            variant: "ks-activity type_ks-build"},
                    craftFilter:     {enabled: false, filter: true, label: 'Crafting',            variant: "ks-activity type_ks-craft"},
                    upgradeFilter:   {enabled: false, filter: true, label: 'Upgrading',           variant: "ks-activity type_ks-upgrade"},
                    researchFilter:  {enabled: false, filter: true, label: 'Researching',         variant: "ks-activity type_ks-research"},
                    tradeFilter:     {enabled: false, filter: true, label: 'Trading',             variant: "ks-activity type_ks-trade"},
                    huntFilter:      {enabled: false, filter: true, label: 'Hunting',             variant: "ks-activity type_ks-hunt"},
                    praiseFilter:    {enabled: false, filter: true, label: 'Praising',            variant: "ks-activity type_ks-praise"},
                    faithFilter:     {enabled: false, filter: true, label: 'Order of the Sun',    variant: "ks-activity type_ks-faith"},
                    festivalFilter:  {enabled: false, filter: true, label: 'Festivals',           variant: "ks-activity type_ks-festival"},
                    starFilter:      {enabled: false, filter: true, label: 'Astronomical Events', variant: "ks-activity type_ks-star"},
                    miscFilter:      {enabled: false, filter: true, label: 'Miscellaneous',       variant: "ks-activity"}
                }
            },
            resources: {
                furs:   {stock: 1000}
            },
            cache: {
                cache:    [],
                cacheSum: {}
            }
        }
    };

    // GameLog Modification
    // ====================

    // Increase messages displayed in log
    game.console.maxMessages = 1000;

    var printoutput = function (args) {
        if (options.auto.filter.enabled) {
            for (var filt in options.auto.filter.items) {
                var filter = options.auto.filter.items[filt]
                if (filter.enabled && filter.variant === args[1]) {return;}
            }
        }
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
        var args = Array.prototype.slice.call(arguments);
        var activityClass = args.length > 1 ? ' type_' + args.pop() : '';
        args.push('ks-activity' + activityClass);
        args.push(options.activitycolor);
        printoutput(args);
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
        this.upgradeManager = new UpgradeManager();
        this.buildManager = new BuildManager();
        this.spaceManager = new SpaceManager();
        this.craftManager = new CraftManager();
        this.bulkManager = new BulkManager();
        this.tradeManager = new TradeManager();
        this.religionManager = new ReligionManager();
        this.timeManager = new TimeManager();
        this.explorationManager = new ExplorationManager();
        this.villageManager = new TabManager('Village');
        this.cacheManager = new CacheManager();
    };

    Engine.prototype = {
        upgradeManager: undefined,
        buildManager: undefined,
        spaceManager: undefined,
        craftManager: undefined,
        bulkManager: undefined,
        tradeManager: undefined,
        religionManager: undefined,
        timeManager: undefined,
        explorationManager: undefined,
        villageManager: undefined,
        cacheManager: undefined,
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
            var subOptions = options.auto.options;
            if (subOptions.enabled && subOptions.items.observe.enabled)  {this.observeStars()};
            if (options.auto.upgrade.enabled)                            {this.upgrade()};
            if (subOptions.enabled && subOptions.items.festival.enabled) {this.holdFestival()};
            if (options.auto.build.enabled)                              {this.build()};
            if (options.auto.space.enabled)                              {this.space()};
            if (options.auto.craft.enabled)                              {this.craft()};
            if (subOptions.enabled && subOptions.items.hunt.enabled)     {this.hunt()};
            if (options.auto.trade.enabled)                              {this.trade()};
            if (options.auto.faith.enabled)                              {this.worship()};
            if (options.auto.time.enabled)                               {this.chrono()};
            if (subOptions.enabled && subOptions.items.crypto.enabled)   {this.crypto()};
            if (subOptions.enabled && subOptions.items.explore.enabled)  {this.explore()};
            if (subOptions.enabled && subOptions.items.autofeed.enabled) {this.autofeed()};
            if (subOptions.enabled)                                      {this.miscOptions()};
        },
        autofeed: function () {
            var levi = game.diplomacy.get("leviathans");
            var nCorn = game.resPool.get("necrocorn");
            if (!(levi.unlocked && nCorn.value > 0)) {return;}
            if (nCorn.value >= 1) {
                if (levi.energy < game.religion.getZU("marker").val * 5 + 5) {
                    game.diplomacy.feedElders();
                    activity('Kittens fed the Elders. The elders are pleased');
                    storeForSummary('feed', 1);
                }
            } else {
                if (0.25 * (1 + game.getEffect("corruptionBoostRatio")) < 1) {
                    storeForSummary('feed', nCorn.value);
                    game.diplomacy.feedElders();
                    activity('Kittens disposed of inefficient necrocorns.');
                }
            }
        },
        crypto: function () {
            var coinPrice = game.calendar.cryptoPrice;
            var previousRelic = game.resPool.get('relic').value;
            var previousCoin = game.resPool.get('blackcoin').value;
            var exchangedCoin = 0.0;
            var exchangedRelic = 0.0;
            var waitForBestPrice = false;

            // Waits for coin price to drop below a certain treshold before starting the exchange process
            if (waitForBestPrice == true && coinPrice < 860.0) { waitForBestPrice = false; }

            // Exchanges up to a certain threshold, in order to keep a good exchange rate, then waits for a higher treshold before exchanging for relics.
            if (waitForBestPrice == false && coinPrice < 950.0 && previousRelic > options.auto.options.items.crypto.subTrigger) {
                var currentCoin;

                // function name changed in v1.4.8.0
                if (typeof game.diplomacy.buyEcoin === 'function') {
                  game.diplomacy.buyEcoin();
                } else {
                  game.diplomacy.buyBcoin();
                }

                currentCoin = game.resPool.get('blackcoin').value;
                exchangedCoin = Math.round(currentCoin - previousCoin);
                activity('Kittens sold your Relics and bought '+ exchangedCoin +' Blackcoins');
            }
            else if (coinPrice > 1050.0 && game.resPool.get('blackcoin').value > 0) {
                var currentRelic;

                waitForBestPrice = true;

                // function name changed in v1.4.8.0
                if (typeof game.diplomacy.sellEcoin === 'function') {
                  game.diplomacy.sellEcoin();
                } else {
		  game.diplomacy.sellBcoin();
                }

                currentRelic = game.resPool.get('relic').value;
                exchangedRelic = Math.round(currentRelic - previousRelic);

                activity('Kittens sold your Blackcoins and bought '+ exchangedRelic +' Relics');
            }
        },
        explore: function () {
            var manager = this.explorationManager;
            var expeditionNode = game.village.map.expeditionNode;

            if ( expeditionNode == null) {
                manager.getCheapestNode();

                manager.explore(manager.cheapestNodeX, manager.cheapestNodeY);

                activity('Your kittens started exploring node '+ manager.cheapestNodeX +'-'+ manager.cheapestNodeY +' of the map.');
            }
        },
        worship: function () {
            var builds = options.auto.faith.items;
            var buildManager = this.religionManager;
            var craftManager = this.craftManager;
            var bulkManager = this.bulkManager;
            var trigger = options.auto.faith.trigger;

            // Render the tab to make sure that the buttons actually exist in the DOM. Otherwise we can't click them.
            buildManager.manager.render();

            var metaData = {};
            for (var name in builds) {
                var build = builds[name]
                metaData[name] = buildManager.getBuild(name, build.variant);
                if (!buildManager.getBuildButton(name, build.variant)) {
                    metaData[name].rHidden = true;
                } else {
                    var model = buildManager.getBuildButton(name, build.variant).model;
                    var panel = (build.variant === 'c') ? game.science.techs[58].researched : true;
                    metaData[name].rHidden = !(model.visible && model.enabled && panel);
                }
            }

            var buildList = bulkManager.bulk(builds, metaData, trigger);

            var refreshRequired = false;
            for (var entry in buildList) {
                if (buildList[entry].count > 0) {
                    buildManager.build(buildList[entry].id, buildList[entry].variant, buildList[entry].count);
                    refreshRequired = true;
                }
            }

            if (refreshRequired) {game.ui.render();}
        },
        chrono: function () {
            if (!game.timeTab.visible) {return;}
            var builds = options.auto.time.items;
            var buildManager = this.timeManager;
            var craftManager = this.craftManager;
            var bulkManager = this.bulkManager;
            var trigger = options.auto.time.trigger;

            // Render the tab to make sure that the buttons actually exist in the DOM. Otherwise we can't click them.
            buildManager.manager.render();

            var metaData = {};
            for (var name in builds) {
                var build = builds[name]
                metaData[name] = buildManager.getBuild(name, build.variant);
                var model = buildManager.getBuildButton(name, build.variant).model;
                var panel = (build.variant === 'chrono') ? game.tabs[7].cfPanel : game.tabs[7].vsPanel;
                metaData[name].tHidden = (!model.visible || !model.enabled || !panel.visible);
            }

            var buildList = bulkManager.bulk(builds, metaData, trigger);

            var refreshRequired = false;
            for (var entry in buildList) {
                if (buildList[entry].count > 0) {
                    buildManager.build(buildList[entry].id, buildList[entry].variant, buildList[entry].count);
                    refreshRequired = true;
                }
            }

            if (refreshRequired) {game.ui.render();}
        },
        upgrade: function () {
            var upgrades = options.auto.upgrade.items;
            var upgradeManager = this.upgradeManager;
            var craftManager = this.craftManager;
            var bulkManager = this.bulkManager;
            var buildManager = this.buildManager;

            upgradeManager.workManager.render();
            upgradeManager.sciManager.render();
            upgradeManager.spaManager.render();

            if (upgrades.upgrades.enabled && gamePage.tabs[3].visible) {
                var work = game.workshop.upgrades;
                workLoop:
                for (var upg in work) {
                    if (work[upg].researched || !work[upg].unlocked) {continue;}

                    var prices = work[upg].prices;
                    for (var resource in prices) {
                        if (craftManager.getValueAvailable(prices[resource].name, true) < prices[resource].val) {continue workLoop;}
                    }
                    upgradeManager.build(work[upg], 'workshop');
                }
            }

            if (upgrades.techs.enabled && gamePage.tabs[2].visible) {
                var tech = game.science.techs;
                techLoop:
                for (var upg in tech) {
                    if (tech[upg].researched || !tech[upg].unlocked) {continue;}

                    var prices = tech[upg].prices;
                    for (var resource in prices) {
                        if (craftManager.getValueAvailable(prices[resource].name, true) < prices[resource].val) {continue techLoop;}
                    }
                    upgradeManager.build(tech[upg], 'science');
                }
            }

            if (upgrades.missions.enabled && gamePage.tabs[6].visible) {
                var missions = game.space.meta[0].meta;
                missionLoop:
                for (var i = 0; i < missions.length; i++) {
                    if (!(missions[i].unlocked && missions[i].val < 1)) {continue;}

                    var model = game.tabs[6].GCPanel.children[i];
                    var prices = model.model.prices;
                    for (var resource in prices) {
                        if (craftManager.getValueAvailable(prices[resource].name, true) < prices[resource].val) {continue missionLoop;}
                    }
                    model.domNode.click();
                    if (i === 7 || i === 12) {
                        activity('Kittens conducted a mission to ' + missions[i].label, 'ks-upgrade');
                    } else {
                        activity('Kittens conducted a ' + missions[i].label, 'ks-upgrade');
                    }
                }
            }

            if (upgrades.races.enabled && gamePage.tabs[4].visible) {
                var maxRaces = (game.diplomacy.get('leviathans').unlocked) ? 8 : 7;
                if (game.diplomacyTab.racePanels.length < maxRaces) {
                    var manpower = craftManager.getValueAvailable('manpower', true);
                    if (!game.diplomacy.get('lizards').unlocked) {
                        if (manpower >= 1000) {
                            game.resPool.get('manpower').value -= 1000;
                            activity('Kittens met the ' + game.diplomacy.unlockRandomRace().name, 'ks-upgrade');
                            manpower -= 1000;
                            game.ui.render();
                        }
                    }
                    if (!game.diplomacy.get('sharks').unlocked) {
                        if (manpower >= 1000) {
                            game.resPool.get('manpower').value -= 1000;
                            activity('Kittens met the ' + game.diplomacy.unlockRandomRace().name, 'ks-upgrade');
                            manpower -= 1000;
                            game.ui.render();
                        }
                    }
                    if (!game.diplomacy.get('griffins').unlocked) {
                        if (manpower >= 1000) {
                            game.resPool.get('manpower').value -= 1000;
                            activity('Kittens met the ' + game.diplomacy.unlockRandomRace().name, 'ks-upgrade');
                            manpower -= 1000;
                            game.ui.render();
                        }
                    }
                    if (!game.diplomacy.get('nagas').unlocked && game.resPool.get("culture").value >= 1500) {
                        if (manpower >= 1000) {
                            game.resPool.get('manpower').value -= 1000;
                            activity('Kittens met the ' + game.diplomacy.unlockRandomRace().name, 'ks-upgrade');
                            manpower -= 1000;
                            game.ui.render();
                        }
                    }
                    if (!game.diplomacy.get('zebras').unlocked && game.resPool.get("ship").value >= 1) {
                        if (manpower >= 1000) {
                            game.resPool.get('manpower').value -= 1000;
                            activity('Kittens met the ' + game.diplomacy.unlockRandomRace().name, 'ks-upgrade');
                            manpower -= 1000;
                            game.ui.render();
                        }
                    }
                    if (!game.diplomacy.get('spiders').unlocked && game.resPool.get("ship").value >= 100 && game.resPool.get("science").maxValue > 125000) {
                        if (manpower >= 1000) {
                            game.resPool.get('manpower').value -= 1000;
                            activity('Kittens met the ' + game.diplomacy.unlockRandomRace().name, 'ks-upgrade');
                            manpower -= 1000;
                            game.ui.render();
                        }
                    }
                    if (!game.diplomacy.get('dragons').unlocked && game.science.get("nuclearFission").researched) {
                        if (manpower >= 1000) {
                            game.resPool.get('manpower').value -= 1000;
                            activity('Kittens met the ' + game.diplomacy.unlockRandomRace().name, 'ks-upgrade');
                            manpower -= 1000;
                            game.ui.render();
                        }
                    }
                }
            }

            if (upgrades.buildings.enabled) {
                var pastures = (game.bld.getBuildingExt('pasture').meta.stage === 0) ? game.bld.getBuildingExt('pasture').meta.val: 0;
                var aqueducts = (game.bld.getBuildingExt('aqueduct').meta.stage === 0) ? game.bld.getBuildingExt('aqueduct').meta.val: 0;

                var pastureMeta = game.bld.getBuildingExt('pasture').meta;
                if (pastureMeta.stage === 0) {
                    if (pastureMeta.stages[1].stageUnlocked) {
                        if (craftManager.getPotentialCatnip(true, 0, aqueducts) > 0) {
                            var prices = pastureMeta.stages[1].prices;
                            var priceRatio = bulkManager.getPriceRatio(pastureMeta, true);
                            if (bulkManager.singleBuildPossible(pastureMeta, prices, 1)) {
                                var button = buildManager.getBuildButton('pasture', 0);
                                button.controller.sellInternal(button.model, 0);
                                pastureMeta.on = 0;
                                pastureMeta.val = 0;
                                pastureMeta.stage = 1;
                                activity('Upgraded pastures to solar farms!', 'ks-upgrade');
                                game.ui.render();
                                buildManager.build('pasture', 1, 1);
                                game.ui.render();
                                return;
                            }
                        }
                    }
                }

                var aqueductMeta = game.bld.getBuildingExt('aqueduct').meta;
                if (aqueductMeta.stage === 0) {
                    if (aqueductMeta.stages[1].stageUnlocked) {
                        if (craftManager.getPotentialCatnip(true, pastures, 0) > 0) {
                            var prices = aqueductMeta.stages[1].prices;
                            var priceRatio = bulkManager.getPriceRatio(aqueductMeta, true);
                            if (bulkManager.singleBuildPossible(aqueductMeta, prices, 1)) {
                                var button = buildManager.getBuildButton('aqueduct', 0);
                                button.controller.sellInternal(button.model, 0);
                                aqueductMeta.on = 0
                                aqueductMeta.val = 0
                                aqueductMeta.stage = 1
                                aqueductMeta.calculateEffects(aqueductMeta, game)
                                activity('Upgraded aqueducts to hydro plants!', 'ks-upgrade');
                                game.ui.render();
                                buildManager.build('aqueduct', 1, 1);
                                game.ui.render();
                                return;
                            }
                        }
                    }
                }

                var libraryMeta = game.bld.getBuildingExt('library').meta;
                if (libraryMeta.stage === 0) {
                    if (libraryMeta.stages[1].stageUnlocked) {
                        var enCon = (game.workshop.get('cryocomputing').researched) ? 1 : 2;
                        if (game.challenges.currentChallenge == 'energy') {enCon *= 2;}
                        var libToDat = 3;
                        if (game.workshop.get('uplink').researched) {
                            libToDat *= (1 + game.bld.get('biolab').val * game.getEffect('uplinkDCRatio'));
                        }
                        if (game.workshop.get('machineLearning').researched) {
                            libToDat *= (1 + game.bld.get('aiCore').on * game.getEffect('dataCenterAIRatio'));
                        }
                        if (game.resPool.energyProd >= game.resPool.energyCons + enCon*libraryMeta.val/libToDat) {
                            var prices = libraryMeta.stages[1].prices;
                            var priceRatio = bulkManager.getPriceRatio(libraryMeta, true);
                            if (bulkManager.singleBuildPossible(libraryMeta, prices, 1)) {
                                var button = buildManager.getBuildButton('library', 0);
                                button.controller.sellInternal(button.model, 0);
                                libraryMeta.on = 0
                                libraryMeta.val = 0
                                libraryMeta.stage = 1
                                libraryMeta.calculateEffects(libraryMeta, game)
                                activity('Upgraded libraries to data centers!', 'ks-upgrade');
                                game.ui.render();
                                buildManager.build('library', 1, 1);
                                game.ui.render();
                                return;
                            }
                        }
                    }

                }

                var amphitheatreMeta = game.bld.getBuildingExt('amphitheatre').meta;
                if (amphitheatreMeta.stage === 0) {
                    if (amphitheatreMeta.stages[1].stageUnlocked) {
                        var prices = amphitheatreMeta.stages[1].prices;
                        var priceRatio = bulkManager.getPriceRatio(amphitheatreMeta, true);
                        if (bulkManager.singleBuildPossible(amphitheatreMeta, prices, 1)) {
                            var button = buildManager.getBuildButton('amphitheatre', 0);
                            button.controller.sellInternal(button.model, 0);
                            amphitheatreMeta.on = 0
                            amphitheatreMeta.val = 0
                            amphitheatreMeta.stage = 1
                            activity('Upgraded amphitheatres to broadcast towers!', 'ks-upgrade');
                            game.ui.render();
                            buildManager.build('amphitheatre', 1, 1);
                            game.ui.render();
                            return;
                        }
                    }
                }
            }
        },
        build: function () {
            var builds = options.auto.build.items;
            var buildManager = this.buildManager;
            var craftManager = this.craftManager;
            var bulkManager = this.bulkManager;
            var trigger = options.auto.build.trigger;

            // Render the tab to make sure that the buttons actually exist in the DOM. Otherwise we can't click them.
            buildManager.manager.render();

            var metaData = {};
            for (var name in builds) {
                var build = builds[name]
                metaData[name] = buildManager.getBuild(build.name || name).meta;
            }

            var buildList = bulkManager.bulk(builds, metaData, trigger, 'bonfire');

            var refreshRequired = false;
            for (var entry in buildList) {
                if (buildList[entry].count > 0) {
                    buildManager.build(buildList[entry].name || buildList[entry].id, buildList[entry].stage, buildList[entry].count);
                    refreshRequired = true;
                }
            }
            if (refreshRequired) {game.ui.render();}
        },
        space: function () {
            var builds = options.auto.space.items;
            var buildManager = this.spaceManager;
            var craftManager = this.craftManager;
            var bulkManager = this.bulkManager;
            var trigger = options.auto.space.trigger;

            // Render the tab to make sure that the buttons actually exist in the DOM. Otherwise we can't click them.
            buildManager.manager.render();

            var metaData = {};
            for (var name in builds) {
                var build = builds[name]
                metaData[name] = buildManager.getBuild(name);
            }

            var buildList = bulkManager.bulk(builds, metaData, trigger, 'space');

            var refreshRequired = false;
            for (var entry in buildList) {
                if (buildList[entry].count > 0) {
                    buildManager.build(buildList[entry].id, buildList[entry].count);
                    refreshRequired = true;
                }
            }
            if (refreshRequired) {game.ui.render();}
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
                var amount = 0;
                // Ensure that we have reached our cap
                if (current && current.value > craft.max) continue;
                if (!manager.singleCraftPossible(name)) {continue;}
                // Craft the resource if we meet the trigger requirement
                if (!require || trigger <= require.value / require.maxValue) {
                    amount = manager.getLowestCraftAmount(name, craft.limited, craft.limRat, true);
                } else if (craft.limited) {
                    amount = manager.getLowestCraftAmount(name, craft.limited, craft.limRat, false);
                }
                if (amount > 0) {
                    manager.craft(name, amount);
                }
            }
        },
        holdFestival: function () {
            if (!(game.science.get('drama').researched && game.calendar.festivalDays < 400)) {return;}
            if (!game.prestige.getPerk('carnivals').researched && game.calendar.festivalDays > 0) {return;}

            var craftManager = this.craftManager;
            if (craftManager.getValueAvailable('manpower', true) < 1500 || craftManager.getValueAvailable('culture', true) < 5000
                || craftManager.getValueAvailable('parchment', true) < 2500) {return;}

            var catpowProf = 4000 * craftManager.getTickVal(craftManager.getResource('manpower'), true) > 1500;
            var cultureProf = 4000 * craftManager.getTickVal(craftManager.getResource('culture'), true) > 5000;
            var parchProf = 4000 * craftManager.getTickVal(craftManager.getResource('parchment'), true) > 2500;

            if (!(catpowProf && cultureProf && parchProf)) {return;}

            // Render the tab to make sure that the buttons actually exist in the DOM. Otherwise we can't click them.
            this.villageManager.render();

            if (game.villageTab.festivalBtn.model.enabled) {
                var beforeDays = game.calendar.festivalDays;
                game.villageTab.festivalBtn.onClick();
                storeForSummary('festival');
                if (beforeDays > 0) {
                    activity('Kittens extend the festival', 'ks-festival');
                } else {
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

            if (options.auto.options.items.hunt.subTrigger <= catpower.value / catpower.maxValue && catpower.value >= 100) {
                // No way to send only some hunters. Thus, we hunt with everything
                var huntCount = Math.floor(catpower.value/100);
                storeForSummary('hunt', huntCount);
                activity('Sent kittens on ' + huntCount + ' hunts', 'ks-hunt');

                var huntCount = Math.floor(catpower.value/100);
                var aveOutput = this.craftManager.getAverageHunt();
                var trueOutput = {};

                for (var out in aveOutput) {
                    var res = this.craftManager.getResource(out);
                    trueOutput[out] = (res.maxValue > 0) ? Math.min(aveOutput[out] * huntCount, Math.max(res.maxValue - res.value, 0)) : aveOutput[out] * huntCount;
                }

                this.cacheManager.pushToCache({'materials': trueOutput, 'timeStamp': game.timer.ticksTotal});

                game.village.huntAll();
            }
        },
        trade: function () {
            var craftManager = this.craftManager;
            var tradeManager = this.tradeManager;
            var cacheManager = this.cacheManager;
            var gold = craftManager.getResource('gold');
            var trades = [];
            var requireTrigger = options.auto.trade.trigger;

            tradeManager.manager.render();

            if (!tradeManager.singleTradePossible(undefined)) {return;}

            var season = game.calendar.getCurSeason().name;

            // Determine how many races we will trade this cycle
            for (var name in options.auto.trade.items) {
                var trade = options.auto.trade.items[name];

                // Check if the race is in season, enabled, unlocked, and can actually afford it
                if (!trade.enabled) continue;
                if (!trade[season]) continue;
                var race = tradeManager.getRace(name);
                if (!race.unlocked) {continue;}
                var button = tradeManager.getTradeButton(race.name);
                if (!button.model.enabled) {continue;}
                if (!tradeManager.singleTradePossible(name)) {continue;}

                var require = !trade.require ? false : craftManager.getResource(trade.require);

                // If we have enough to trigger the check, then attempt to trade
                var prof = tradeManager.getProfitability(name);
                if (trade.limited && prof) {
                    trades.push(name);
                } else if ((!require || requireTrigger <= require.value / require.maxValue) && requireTrigger <= gold.value / gold.maxValue) {
                    trades.push(name);
                }
            }

            if (trades.length === 0) {return;}

            // Figure out how much we can currently trade
            var maxTrades = tradeManager.getLowestTradeAmount(undefined, true, false);

            // Distribute max trades without starving any race

            if (maxTrades < 1) {return;}

            var maxByRace = [];
            for (var i = 0; i < trades.length; i++) {
                var name = trades[i];
                var trade = options.auto.trade.items[name];
                var require = !trade.require ? false : craftManager.getResource(trade.require);
                var trigConditions = ((!require || requireTrigger <= require.value / require.maxValue) && requireTrigger <= gold.value / gold.maxValue);
                var tradePos = tradeManager.getLowestTradeAmount(name, trade.limited, trigConditions);
                if (tradePos < 1) {
                    trades.splice(i, 1);
                    i--;
                    continue;
                }
                maxByRace[i] = tradePos;
            }

            if (trades.length === 0) {return;}

            var tradesDone = {};
            while (trades.length > 0 && maxTrades >= 1) {
                if (maxTrades < trades.length) {
                    var j = Math.floor(Math.random() * trades.length);
                    if (!tradesDone[trades[j]]) {tradesDone[trades[j]] = 0;}
                    tradesDone[trades[j]] += 1;
                    maxTrades -= 1;
                    trades.splice(j, 1);
                    maxByRace.splice(j, 1);
                    continue;
                }
                var minTrades = Math.floor(maxTrades / trades.length);
                var minTradePos = 0;
                for (var i = 0; i < trades.length; i++) {
                    if (maxByRace[i] < minTrades) {
                        minTrades = maxByRace[i];
                        minTradePos = i;
                    }
                }
                if (!tradesDone[trades[minTradePos]]) {tradesDone[trades[minTradePos]] = 0;}
                tradesDone[trades[minTradePos]] += minTrades;
                maxTrades -= minTrades;
                trades.splice(minTradePos, 1);
                maxByRace.splice(minTradePos, 1);
            }
            if (tradesDone.length === 0) {return;}

            var tradeNet = {};
            for (var name in tradesDone) {
                var race = tradeManager.getRace(name);

                var materials = tradeManager.getMaterials(name);
                for (var mat in materials) {
                    if (!tradeNet[mat]) {tradeNet[mat] = 0;}
                    tradeNet[mat] -= materials[mat] * tradesDone[name];
                }

                var meanOutput = tradeManager.getAverageTrade(race);
                for (var out in meanOutput) {
                    var res = craftManager.getResource(out);
                    if (!tradeNet[out]) {tradeNet[out] = 0;}
                    tradeNet[out] += (res.maxValue > 0) ? Math.min(meanOutput[out] * tradesDone[name], Math.max(res.maxValue - res.value, 0)) : meanOutput[out] * tradesDone[name];
                }
            }

            cacheManager.pushToCache({'materials': tradeNet, 'timeStamp': game.timer.ticksTotal});

            for (var name in tradesDone) {
                if (tradesDone[name] > 0) {
                    tradeManager.trade(name, tradesDone[name]);
                }
            }
        },
        miscOptions: function () {
            var craftManager = this.craftManager;
            var optionVals = options.auto.options.items;

            AutoEmbassy:
            if (optionVals.buildEmbassies.enabled && !!game.diplomacy.races[0].embassyPrices) {
                var culture = craftManager.getResource('culture');
                if (optionVals.buildEmbassies.subTrigger <= culture.value / culture.maxValue) {
                    var racePanels = game.diplomacyTab.racePanels;
                    var cultureVal = craftManager.getValueAvailable('culture', true);

                    var embassyBulk = {};
                    var bulkTracker = [];

                    for (var i = 0; i < racePanels.length; i++) {
                        if (!racePanels[i].embassyButton) {continue;}
                        var name = racePanels[i].race.name;
                        var race = game.diplomacy.get(name);
                        embassyBulk[name] = {'val': 0, 'basePrice': race.embassyPrices[0].val, 'currentEm': race.embassyLevel, 'priceSum': 0, 'race': race};
                        bulkTracker.push(name);
                    }

                    if (bulkTracker.length === 0) {break AutoEmbassy;}

                    var refreshRequired = false;

                    while (bulkTracker.length > 0) {
                        for (var i=0; i < bulkTracker.length; i++) {
                            var name = bulkTracker[i];
                            var emBulk = embassyBulk[name];
                            var nextPrice = emBulk.basePrice * Math.pow(1.15, emBulk.currentEm + emBulk.val);
                            if (nextPrice <= cultureVal) {
                                cultureVal -= nextPrice;
                                emBulk.priceSum += nextPrice;
                                emBulk.val += 1;
                                refreshRequired = true;
                            } else {
                                bulkTracker.splice(i, 1);
                                i--;
                            }
                        }
                    }

                    for (var name in embassyBulk) {
                        var emBulk = embassyBulk[name];
                        if (emBulk.val === 0) {continue;}
                        var cultureVal = craftManager.getValueAvailable('culture', true);
                        if (emBulk.priceSum > cultureVal) {warning('Something has gone horribly wrong.' + [emBulk.priceSum, cultureVal]);}
                        game.resPool.resources[13].value -= emBulk.priceSum;
                        emBulk.race.embassyLevel += emBulk.val;
                        storeForSummary('embassy', emBulk.val);
                        if (emBulk.val !== 1) {
                            activity('Built ' + emBulk.val + ' embassies for ' + name, 'ks-trade');
                        } else {
                            activity('Built ' + emBulk.val + ' embassy for ' + name, 'ks-trade');
                        }
                    }

                    if (refreshRequired) {game.ui.render();}
                }
            }

            if (optionVals.autoPraise.enabled) {
                var faith = craftManager.getResource('faith');
                if (0.98 <= faith.value / faith.maxValue) {
                    if (!game.religion.getFaithBonus) {
                        var apocryphaBonus = game.religion.getApocryphaBonus();
                    } else {
                        var apocryphaBonus = game.religion.getFaithBonus();
                    }
                    storeForSummary('faith', faith.value * (1 + apocryphaBonus));
                    activity('Praised the sun!', 'ks-praise');
                    game.religion.praise();
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
                if (tileKey.includes('-')) { break; }

                // Acquire node coordinates
                var regex = /(\d).(\d*)/g;
                var keyMatch = regex.exec(tileKey);
                var xCoord = parseInt(keyMatch[1]);
                var yCoord = parseInt(keyMatch[2]);

                if (this.currentCheapestNode == null) {
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
        this.bulkManager = new BulkManager();
    };

    ReligionManager.prototype = {
        manager: undefined,
        crafts: undefined,
        bulkManager: undefined,
        build: function (name, variant, amount) {
            var build = this.getBuild(name, variant);
            var button = this.getBuildButton(name, variant);

            if (!button || !button.model.enabled) return;

            var amountTemp = amount;
            var label = build.label;
            amount=this.bulkManager.construct(button.model, button, amount);
            if (amount !== amountTemp) {warning(label + ' Amount ordered: '+amountTemp+' Amount Constructed: '+amount);}

            if (variant === "s") {
                storeForSummary(label, amount, 'faith');
                if (amount === 1) {
                    activity('Kittens have discovered ' + label, 'ks-faith');
                } else {
                    activity('Kittens have discovered ' + label + ' ' + amount + ' times.', 'ks-faith');
                }
            } else {
                storeForSummary(label, amount, 'build');
                if (amount === 1) {
                    activity('Kittens have built a new ' + label, 'ks-build');
                } else {
                    activity('Kittens have built a new ' + label + ' ' + amount + ' times.', 'ks-build');
                }
            }
        },
        getBuild: function (name, variant) {
            switch (variant) {
                case 'z':
                    return game.religion.getZU(name);
                case 's':
                    return game.religion.getRU(name);
                case 'c':
                    return game.religion.getTU(name);
            }
        },
        getBuildButton: function (name, variant) {
            switch (variant) {
                case 'z':
                    var buttons = this.manager.tab.zgUpgradeButtons;
                    break;
                case 's':
                    var buttons = this.manager.tab.rUpgradeButtons;
                    break;
                case 'c':
                    var buttons = this.manager.tab.children[0].children[0].children;
            }
            var build = this.getBuild(name, variant);
            for (var i in buttons) {
                var haystack = buttons[i].model.name;
                if (haystack.indexOf(build.label) !== -1) {
                    return buttons[i];
                }
            }
        }
    };

    // Time manager
    // ============

    var TimeManager = function () {
        this.manager = new TabManager('Time');
        this.crafts = new CraftManager();
        this.bulkManager = new BulkManager();
    };

    TimeManager.prototype = {
        manager: undefined,
        crafts: undefined,
        bulkManager: undefined,
        build: function (name, variant, amount) {
            var build = this.getBuild(name, variant);
            var button = this.getBuildButton(name, variant);

            if (!button || !button.model.enabled) return;

            var amountTemp = amount;
            var label = build.label;
            amount=this.bulkManager.construct(button.model, button, amount);
            if (amount !== amountTemp) {warning(label + ' Amount ordered: '+amountTemp+' Amount Constructed: '+amount);}
            storeForSummary(label, amount, 'build');


            if (amount === 1) {
                activity('Kittens have built a new ' + label, 'ks-build');
            } else {
                activity('Kittens have built a new ' + label + ' ' + amount + ' times.', 'ks-build');
            }
        },
        getBuild: function (name, variant) {
            if (variant === 'chrono') {
                return game.time.getCFU(name);
            } else {
                return game.time.getVSU(name);
            }
        },
        getBuildButton: function (name, variant) {
            if (variant === 'chrono') {
                var buttons = this.manager.tab.children[2].children[0].children;
            } else {
                var buttons = this.manager.tab.children[3].children[0].children;
            }
            var build = this.getBuild(name, variant);
            for (var i in buttons) {
                var haystack = buttons[i].model.name;
                if (haystack.indexOf(build.label) !== -1) {
                    return buttons[i];
                }
            }
        }
    };

    // Upgrade manager
    // ============

    var UpgradeManager = function () {
        this.workManager = new TabManager('Workshop');
        this.sciManager = new TabManager('Science');
        this.spaManager = new TabManager('Space');
        this.crafts = new CraftManager();
    };

    UpgradeManager.prototype = {
        manager: undefined,
        crafts: undefined,
        build: function (upgrade, variant) {
            var button = this.getBuildButton(upgrade, variant);

            if (!button || !button.model.enabled) return;

            //need to simulate a click so the game updates everything properly
            button.domNode.click(upgrade);
            var label = upgrade.label;

            if (variant === 'workshop') {
                storeForSummary(label, 1, 'upgrade');
                activity('Kittens have bought the upgrade ' + label, 'ks-upgrade');
            } else {
                storeForSummary(label, 1, 'research');
                activity('Kittens have bought the tech ' + label, 'ks-research');
            }
        },
        getBuildButton: function (upgrade, variant) {
            if (variant === 'workshop') {
                var buttons = this.workManager.tab.buttons;
            } else if (variant === 'science') {
                var buttons = this.sciManager.tab.buttons;
            }
            for (var i in buttons) {
                var haystack = buttons[i].model.name;
                if (haystack === upgrade.label) {
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
        this.bulkManager = new BulkManager();
    };

    BuildManager.prototype = {
        manager: undefined,
        crafts: undefined,
        bulkManager: undefined,
        build: function (name, stage, amount) {
            var build = this.getBuild(name);
            var button = this.getBuildButton(name, stage);

            if (!button || !button.model.enabled) return;
            var amountTemp = amount;
            var label = build.meta.label ? build.meta.label : build.meta.stages[stage].label;
            amount=this.bulkManager.construct(button.model, button, amount);
            if (amount !== amountTemp) {warning(label + ' Amount ordered: '+amountTemp+' Amount Constructed: '+amount);}
            storeForSummary(label, amount, 'build');

            if (amount === 1) {
                activity('Kittens have built a new ' + label, 'ks-build');
            } else {
                activity('Kittens have built a new ' + label + ' ' + amount + ' times.', 'ks-build');
            }
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
        this.bulkManager = new BulkManager();
    };

    SpaceManager.prototype = {
        manager: undefined,
        crafts: undefined,
        bulkManager: undefined,
        build: function (name, amount) {
            var build = this.getBuild(name);
            var button = this.getBuildButton(name);

            if (!build.unlocked || !button || !button.model.enabled || !options.auto.space.items[name].enabled) return;
            var amountTemp = amount;
            var label = build.label;
            amount=this.bulkManager.construct(button.model, button, amount);
            if (amount !== amountTemp) {
                warning(label + ' Amount ordered: '+amountTemp+' Amount Constructed: '+amount);
            }
            storeForSummary(label, amount, 'build');

            if (amount === 1) {
                activity('Kittens have built a new ' + label, 'ks-build');
            } else {
                activity('Kittens have built a new ' + label + ' ' + amount + ' times.', 'ks-build');
            }
        },
        getBuild: function (name) {
            return game.space.getBuilding(name);
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

    var CraftManager = function () {
        this.cacheManager = new CacheManager();
    };

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

            storeForSummary(ucfirst(name), amount, 'craft');
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
        singleCraftPossible: function (name) {
            var materials = this.getMaterials(name);
            for (var mat in materials) {
                if (this.getValueAvailable(mat, true) < materials[mat]) {return false;}
            }
            return true;
        },
        getLowestCraftAmount: function (name, limited, limRat, aboveTrigger) {
            var amount = Number.MAX_VALUE;
            var plateMax = Number.MAX_VALUE;
            var materials = this.getMaterials(name);

            var craft = this.getCraft(name);
            var ratio = game.getResCraftRatio(craft);
            var trigger = options.auto.craft.trigger;
            var optionVal = options.auto.options.enabled && options.auto.options.items.shipOverride.enabled;

            // Safeguard if materials for craft cannot be determined.
            if (!materials) return 0;

            if (name==='steel' && limited) {
                var plateRatio=game.getResCraftRatio(this.getCraft('plate'));
                if (this.getValueAvailable('plate')/this.getValueAvailable('steel') < ((plateRatio+1)/125)/((ratio+1)/100)) {
                    return 0;
                }
            } else if (name==='plate' && limited) {
                var steelRatio=game.getResCraftRatio(this.getCraft('steel'));
                if (game.getResourcePerTick('coal', true) > 0) {
                    if (this.getValueAvailable('plate')/this.getValueAvailable('steel') > ((ratio+1)/125)/((steelRatio+1)/100)) {
                        var ironInTime = ((this.getResource('coal').maxValue*trigger - this.getValue('coal'))/game.getResourcePerTick('coal', true))*Math.max(game.getResourcePerTick('iron', true), 0);
                        plateMax = (this.getValueAvailable('iron') - Math.max(this.getResource('coal').maxValue*trigger - ironInTime,0))/125;
                    }
                }
            }

            var res = this.getResource(name);

            for (var i in materials) {
                var delta = undefined;
                if (! limited || (this.getResource(i).maxValue > 0 && aboveTrigger) || (name === 'ship' && optionVal && (this.getResource('ship').value < 243)) ) {
                    // If there is a storage limit, we can just use everything returned by getValueAvailable, since the regulation happens there
                    delta = this.getValueAvailable(i) / materials[i];
                } else {
                    // Take the currently present amount of material to craft into account
                    // Currently this determines the amount of resources that can be crafted such that base materials are proportionally distributed across limited resources.
                    // This base material distribution is governed by limRat "limited ratio" which defaults to 0.5, corresponding to half of the possible components being further crafted.
                    // If this were another value, such as 0.75, then if you had 10000 beams and 0 scaffolds, 7500 of the beams would be crafted into scaffolds.
                    delta = limRat * ((this.getValueAvailable(i, true) + (materials[i] / (1 + ratio)) * this.getValueAvailable(res.name, true)) / materials[i]) - (this.getValueAvailable(res.name, true) / (1 + ratio));
                }

                amount = Math.min(delta,amount,plateMax);
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

            var prices = game.workshop.getCraftPrice(craft);

            for (var i in prices) {
                var price = prices[i];

                materials[price.name] = price.val;
            }

            return materials;
        },
        getTickVal: function (res, preTrade) {
            var prod = game.getResourcePerTick(res.name, true);
            if (res.craftable) {
                var minProd=Number.MAX_VALUE;
                var materials = this.getMaterials(res.name);
                for (var mat in materials) {
                    var rat = (1+game.getResCraftRatio(res.name))/materials[mat];
                    //Currently preTrade is only true for the festival stuff, so including furs from hunting is ideal.
                    var addProd = this.getTickVal(this.getResource(mat));
                    minProd = Math.min(addProd * rat, minProd);
                }
                prod += (minProd!==Number.MAX_VALUE) ? minProd : 0;
            }
            if (prod <= 0 && (res.name === 'spice' || res.name === 'blueprint')) {return 'ignore';}
            if (!preTrade) {prod += this.cacheManager.getResValue(res.name)};
            return prod;
        },
        getAverageHunt: function() {
            var output = {};
            var hunterRatio = game.getEffect('hunterRatio') + game.village.getEffectLeader('manager', 0);

            output['furs'] = 40 + 32.5 * hunterRatio;

            output['ivory'] = 50 * Math.min(0.225 + 0.01 * hunterRatio, 0.5) + 40 * hunterRatio * Math.min(0.225 + 0.01 * hunterRatio, 0.5);

            output['unicorns'] = 0.05;

            if (this.getValue('zebras') >= 10) {
                output['bloodstone'] = (this.getValue('bloodstone') === 0) ? 0.05 : 0.0005;
            }

            if (game.ironWill && game.workshop.get('goldOre').researched) {
                output['gold'] = 0.625 + 0.625 * hunterRatio;
            }

            return output;
        },
        getName: function (name) {
            // adjust for spelling discrepancies in core game logic
            if ('catpower' === name) name = 'manpower';
            if ('compendium' === name) name = 'compedium';
            if ('concrete' === name) name = 'concrate';

            return name;
        },
        getResource: function (name) {
            if (name === 'slabs') {name = 'slab';} //KG BETA BUGFIX
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
        getValueAvailable: function (name, all, typeTrigger) {
            var value = this.getValue(name);
            var stock = this.getStock(name);

            if (!typeTrigger && typeTrigger !== 0) {
                var trigger = options.auto.craft.trigger;
            }
            else {
              var trigger = typeTrigger;
            }

            if ('catnip' === name) {
                var pastures = (game.bld.getBuildingExt('pasture').meta.stage === 0) ? game.bld.getBuildingExt('pasture').meta.val: 0;
                var aqueducts = (game.bld.getBuildingExt('aqueduct').meta.stage === 0) ? game.bld.getBuildingExt('aqueduct').meta.val: 0;
                var resPerTick = this.getPotentialCatnip(true, pastures, aqueducts)

                if (resPerTick < 0) stock -= resPerTick * 202 * 5;
            }

            value = Math.max(value - stock, 0);

            // If we have a maxValue, and user hasn't requested all, check
            // consumption rate
            if (!all && this.getResource(name).maxValue > 0) {
                var res = options.auto.resources[name];
                var consume = res && (res.consume != undefined) ? res.consume : options.consume;

                value -= Math.min(this.getResource(name).maxValue * trigger, value) * (1 - consume);
            }

            return value;
        },
        getPotentialCatnip: function (worstWeather, pastures, aqueducts) {
            var fieldProd = game.getEffect('catnipPerTickBase');
            if (worstWeather) {
                fieldProd *= 0.1;
            } else {
                fieldProd *= game.calendar.getWeatherMod() + game.calendar.getCurSeason().modifiers['catnip'];
            }
            var vilProd = (game.village.getResProduction().catnip) ? game.village.getResProduction().catnip * (1 + game.getEffect('catnipJobRatio')) : 0;
            var baseProd = fieldProd + vilProd;

            var hydroponics = game.space.getBuilding('hydroponics').val;
            if (game.prestige.meta[0].meta[21].researched) {
                if (game.calendar.cycle === 2) {hydroponics *= 2;}
                if (game.calendar.cycle === 7) {hydroponics *= 0.5;}
            }
            baseProd *= 1 + 0.03 * aqueducts + 0.025 * hydroponics;

            var paragonBonus = (game.challenges.currentChallenge == "winterIsComing") ? 0 : game.prestige.getParagonProductionRatio();
            baseProd *= 1 + paragonBonus;

            baseProd *= 1 + game.religion.getSolarRevolutionRatio();

            if (!game.opts.disableCMBR) {baseProd *= (1 + game.getCMBRBonus());}

            baseProd = game.calendar.cycleEffectsFestival({catnip: baseProd})['catnip'];

            var baseDemand = game.village.getResConsumption()['catnip'];
            var uniPastures = game.bld.getBuildingExt('unicornPasture').meta.val;
            baseDemand *= 1 + (game.getLimitedDR(pastures * -0.005 + uniPastures * -0.0015, 1.0));
            if (game.village.sim.kittens.length > 0 && game.village.happiness > 1) {
                var happyCon = game.village.happiness - 1;
                if (game.challenges.currentChallenge == "anarchy") {
                    baseDemand *= 1 + happyCon * (1 + game.getEffect("catnipDemandWorkerRatioGlobal"));
                } else {
                    baseDemand *= 1 + happyCon * (1 + game.getEffect("catnipDemandWorkerRatioGlobal")) * (1 - game.village.getFreeKittens() / game.village.sim.kittens.length);
                }
            }
            baseProd += baseDemand;

            baseProd += game.getResourcePerTickConvertion('catnip');

            //Might need to eventually factor in time acceleration using game.timeAccelerationRatio().
            return baseProd;
        }
    };

    // Bulk Manager
    // ============

    var BulkManager = function () {
        this.craftManager = new CraftManager();
    };

    BulkManager.prototype = {
        craftManager: undefined,
        bulk: function (builds, metaData, trigger, source) {
            var bList = [];
            var countList = [];
            var counter = 0;
            for (var name in builds) {
                var build = builds[name];
                var data = metaData[name];
                if (!build.enabled) {continue;}
                if (data.tHidden === true) {continue;}
                if (data.rHidden === true) {continue;}
                if ((data.rHidden === undefined) && !data.unlocked) {continue;}
                if (name === 'cryochambers' && (game.time.getVSU('usedCryochambers').val > 0
                    || game.bld.getBuildingExt('chronosphere').meta.val <= data.val)) {continue;}
                if (name === 'ressourceRetrieval' && data.val >= 100) {continue;}
                var prices = (data.stages) ? data.stages[data.stage].prices : data.prices;
                var priceRatio = this.getPriceRatio(data, source);
                if (!this.singleBuildPossible(data, prices, priceRatio, source)) {continue;}
                var require = !build.require ? false : this.craftManager.getResource(build.require);
                if (!require || trigger <= require.value / require.maxValue) {
                    if (typeof(build.stage) !== 'undefined' && build.stage !== data.stage) {
                        continue;
                    }
                    bList.push(new Object());
                    bList[counter].id = name;
                    bList[counter].label = build.label;
                    bList[counter].name = build.name;
                    bList[counter].stage = build.stage;
                    bList[counter].variant = build.variant;
                    countList.push(new Object());
                    countList[counter].id = name;
                    countList[counter].name = build.name;
                    countList[counter].count = 0;
                    countList[counter].spot = counter;
                    countList[counter].prices = prices;
                    countList[counter].priceRatio = priceRatio;
                    countList[counter].source = source;
                    counter++;
                }
            }

            if (countList.length === 0) {return;}

            var tempPool = new Object();
            for (var res in game.resPool.resources) {
                tempPool[game.resPool.resources[res].name]=game.resPool.resources[res].value;
            }
            for (var res in tempPool) {tempPool[res] = this.craftManager.getValueAvailable(res, true);}

            var k = 0;
            while (countList.length !== 0) {
                bulkLoop:
                for (var j = 0; j < countList.length; j++) {
                    var build = countList[j];
                    var data = metaData[build.id];
                    var prices = build.prices;
                    var priceRatio = build.priceRatio;
                    var source = build.source;
                    for (var p = 0; p < prices.length; p++) {

                        var spaceOil = false;
                        var cryoKarma = false;
                        if (source && source === 'space' && prices[p].name === 'oil') {
                            spaceOil = true;
                            var oilPrice = prices[p].val * (1 - game.getLimitedDR(game.getEffect('oilReductionRatio'), 0.75));
                        } else if (build.id === 'cryochambers' && prices[p].name === 'karma') {
                            cryoKarma = true;
                            var karmaPrice = prices[p].val * (1 - game.getLimitedDR(0.01 * game.prestige.getBurnedParagonRatio(), 1.0));
                        }

                        if (spaceOil) {
                            var nextPriceCheck = (tempPool['oil'] < oilPrice * Math.pow(1.05, k + data.val));
                        } else if (cryoKarma) {
                            var nextPriceCheck = (tempPool['karma'] < karmaPrice * Math.pow(priceRatio, k + data.val));
                        } else {
                            var nextPriceCheck = (tempPool[prices[p].name] < prices[p].val * Math.pow(priceRatio, k + data.val));
                        }
                        if (nextPriceCheck || (data.noStackable && (k + data.val)>=1) || (build.id === 'ressourceRetrieval' && k + data.val >= 100)
                          || (build.id === 'cryochambers' && game.bld.getBuildingExt('chronosphere').meta.val <= k + data.val)) {
                            for (var p2 = 0; p2 < p; p2++) {
                                if (source && source === 'space' && prices[p2].name === 'oil') {
                                    var oilPriceRefund = prices[p2].val * (1 - game.getLimitedDR(game.getEffect('oilReductionRatio'), 0.75));
                                    tempPool['oil'] += oilPriceRefund * Math.pow(1.05, k + data.val);
                                } else if (build.id === 'cryochambers' && prices[p2].name === 'karma') {
                                    var karmaPriceRefund = prices[p2].val * (1 - game.getLimitedDR(0.01 * game.prestige.getBurnedParagonRatio(), 1.0));
                                    tempPool['karma'] += karmaPriceRefund * Math.pow(priceRatio, k + data.val);
                                } else {
                                    var refundVal = prices[p2].val * Math.pow(priceRatio, k + data.val);
                                    tempPool[prices[p2].name] += (prices[p2].name === 'void') ? Math.ceil(refundVal) : refundVal;
                                }
                            }
                            bList[countList[j].spot].count = countList[j].count;
                            countList.splice(j, 1);
                            j--;
                            continue bulkLoop;
                        }
                        if (spaceOil) {
                            tempPool['oil'] -= oilPrice * Math.pow(1.05, k + data.val);
                        } else if (cryoKarma) {
                            tempPool['karma'] -= karmaPrice * Math.pow(priceRatio, k + data.val);
                        } else {
                            var pVal = prices[p].val * Math.pow(priceRatio, k + data.val);
                            tempPool[prices[p].name] -= (prices[p].name === 'void') ? Math.ceil(pVal) : pVal;
                        }
                    }
                    countList[j].count++;
                }
                k++;
            }
            return bList;
        },
        construct: function (model, button, amount) {
            var meta = model.metadata;
            var counter = 0;
            if (typeof meta.limitBuild == "number" && meta.limitBuild - meta.val < amount) {
                amount = meta.limitBuild - meta.val;
            }
            if (model.enabled && button.controller.hasResources(model) || game.devMode ) {
                while (button.controller.hasResources(model) && amount > 0) {
                    model.prices=button.controller.getPrices(model);
                    button.controller.payPrice(model);
                    button.controller.incrementValue(model);
                    counter++;
                    amount--;
                }
                if (meta.breakIronWill) {game.ironWill = false;}
                if (meta.unlocks) {game.unlock(meta.unlocks);}
                if (meta.upgrades) {game.upgrade(meta.upgrades);}
            }
            return counter;
        },
        getPriceRatio: function (data, source) {
            var ratio = (!data.stages) ? data.priceRatio : (data.priceRatio || data.stages[data.stage].priceRatio);

            var ratioDiff = 0;
            if (source && source === 'bonfire') {
                ratioDiff = game.getEffect(data.name + "PriceRatio") +
                    game.getEffect("priceRatio") +
                    game.getEffect("mapPriceReduction");

                ratioDiff = game.getLimitedDR(ratioDiff, ratio - 1);
            }
            return ratio + ratioDiff;
        },
        singleBuildPossible: function (data, prices, priceRatio, source) {
            for (var price in prices) {
                if (source && source === 'space' && prices[price].name === 'oil') {
                    var oilPrice = prices[price].val * (1 - game.getLimitedDR(game.getEffect('oilReductionRatio'), 0.75));
                    if (this.craftManager.getValueAvailable('oil', true) < oilPrice * Math.pow(1.05, data.val)) {return false;}
                } else if (data.name === 'cryochambers' && prices[price].name === 'karma') {
                    var karmaPrice = prices[price].val * (1 - game.getLimitedDR(0.01 * game.prestige.getBurnedParagonRatio(), 1.0));
                    if (this.craftManager.getValueAvailable('karma', true) < karmaPrice * Math.pow(priceRatio, data.val)) {return false;}
                } else {
                    if (this.craftManager.getValueAvailable(prices[price].name, true) < prices[price].val * Math.pow(priceRatio, data.val)) {return false;}
                }
            }
            return true;
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

            if (!name || 1 > amount) {warning('KS trade checks are not functioning properly, please create an issue on the github page.');}

            var race = this.getRace(name);

            var button = this.getTradeButton(race.name);

            if (!button.model.enabled || !options.auto.trade.items[name].enabled) {warning('KS trade checks are not functioning properly, please create an issue on the github page.');}

            game.diplomacy.tradeMultiple(race, amount);
            storeForSummary(race.title, amount, 'trade');
            activity('Kittens have traded ' + amount + 'x with ' + ucfirst(name), 'ks-trade');
        },
        getProfitability: function (name) {
            var race = this.getRace(name);

            var materials = this.getMaterials(name);
            var cost = 0;
            for (var mat in materials) {
                var tick = this.craftManager.getTickVal(this.craftManager.getResource(mat));
                if (tick <= 0) {return false;}
                cost += materials[mat]/tick;
            }

            var output = this.getAverageTrade(race);
            var profit = 0;
            for (var prod in output) {
                var res = this.craftManager.getResource(prod);
                var tick = this.craftManager.getTickVal(res);
                if (tick === 'ignore') {continue;}
                if (tick <= 0) {return true;}
                profit += (res.maxValue > 0) ? Math.min(output[prod], Math.max(res.maxValue - res.value, 0))/tick : output[prod]/tick;
            }
            return (cost <= profit);
        },
        getAverageTrade: function (race) {
            var standRat = game.getEffect("standingRatio");
            standRat += (game.prestige.getPerk("diplomacy").researched) ? 10 : 0;
            var rRatio = (race.name === "leviathans") ? (1 + 0.02 * race.energy) : 1;
            var tRatio = 1 + game.diplomacy.getTradeRatio();
            var successRat = (race.attitude === "hostile") ? Math.min(race.standing + standRat/100, 1) : 1;
            var bonusRat = (race.attitude === "friendly") ? Math.min(race.standing + standRat/200, 1) : 0;
            var output = {};
            for (var s in race.sells) {
                var item = race.sells[s];
                if (!this.isValidTrade(item, race)) {continue;}
                var resource = this.craftManager.getResource(item.name);
                var mean = 0;
                var tradeChance = (race.embassyPrices) ? item.chance * (1 + game.getLimitedDR(0.01 * race.embassyLevel, 0.75)) : item.chance;
                if (race.name == "zebras" && item.name == "titanium") {
                    var shipCount = game.resPool.get("ship").value;
                    var titanProb = Math.min(0.15 + shipCount * 0.0035, 1);
                    var titanRat = 1 + shipCount / 50;
                    mean = 1.5 * titanRat * (successRat * titanProb);
                } else {
                    var sRatio = (!item.seasons) ? 1 : item.seasons[game.calendar.getCurSeason().name];
                    var normBought = (successRat - bonusRat) * Math.min(tradeChance/100, 1);
                    var normBonus = bonusRat * Math.min(tradeChance/100, 1);
                    mean = (normBought + 1.25 * normBonus) * item.value * rRatio * sRatio * tRatio;
                }
                output[item.name] = mean;
            }

            var spiceChance = (race.embassyPrices) ? 0.35 * (1 + 0.01 * race.embassyLevel) : 0.35;
            var spiceTradeAmount = successRat * Math.min(spiceChance, 1);
            output['spice'] = 25 * spiceTradeAmount + 50 * spiceTradeAmount * tRatio / 2;

            output['blueprint'] = 0.1 * successRat;

            return output;
        },
        isValidTrade: function (item, race) {
            return (!(item.minLevel && race.embassyLevel < item.minLevel) && (game.resPool.get(item.name).unlocked || item.name === 'titanium' || item.name === 'uranium' || race.name === 'leviathans'));
        },
        getLowestTradeAmount: function (name, limited, trigConditions) {
            var amount = undefined;
            var highestCapacity = undefined;
            var materials = this.getMaterials(name);
            var race = this.getRace(name);

            for (var i in materials) {
                if (i === "catpower") {
                    var total = this.craftManager.getValueAvailable(i, true) / materials[i];
                } else {
                    var total = this.craftManager.getValueAvailable(i, limited, options.auto.trade.trigger) / materials[i];
                }

                amount = (amount === undefined || total < amount) ? total : amount;
            }

            amount = Math.floor(amount);

            if (amount === 0) {return 0;}

            if (race === null || options.auto.trade.items[name].allowcapped) return amount;

            // Loop through the items obtained by the race, and determine
            // which good has the most space left. Once we've determined this,
            // reduce the amount by this capacity. This ensures that we continue to trade
            // as long as at least one resource has capacity, and we never over-trade.

            var tradeOutput = this.getAverageTrade(race);
            for (var s in race.sells) {
                var item = race.sells[s];
                var resource = this.craftManager.getResource(item.name);
                var max = 0;

                // No need to process resources that don't cap
                if (!resource.maxValue) continue;

                max = tradeOutput[item.name];

                var capacity = Math.max((resource.maxValue - resource.value) / max, 0);

                highestCapacity = (capacity < highestCapacity) ? highestCapacity : capacity;
            }

            // We must take the ceiling of capacity so that we will trade as long
            // as there is any room, even if it doesn't have exact space. Otherwise
            // we seem to starve trading altogether.
            highestCapacity = Math.ceil(highestCapacity);

            if (highestCapacity === 0) {return 0;}

            // Now that we know the most we *should* trade for, check to ensure that
            // we trade for our max cost, or our max capacity, whichever is lower.
            // This helps us prevent trading for resources we can't store. Note that we
            // essentially ignore blueprints here. In addition, if highestCapacity was never set,
            // then we just

            amount = (highestCapacity < amount) ? Math.max(highestCapacity - 1, 1) : amount;

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

                if (panel.race.name === race) return panel.tradeBtn;
            }
        },
        singleTradePossible: function (name) {
            var materials = this.getMaterials(name);
            for (var mat in materials) {
                if (this.craftManager.getValueAvailable(mat, true) < materials[mat]) {return false;}
            }
            return true;
        }
    };

    // Cache Manager
    // ===============

    var CacheManager = function () {};

    CacheManager.prototype = {
        pushToCache: function (data) {
            var cache = options.auto.cache.cache;
            var cacheSum = options.auto.cache.cacheSum;
            var materials = data['materials'];
            var currentTick = game.timer.ticksTotal;

            cache.push(data);
            for (var mat in materials) {
                if (!cacheSum[mat]) {cacheSum[mat] = 0;}
                cacheSum[mat] += materials[mat];
            }

            for (var i = 0; i < cache.length; i++) {
                var oldData = cache[i];
                if (cache.length > 10000) {
                    var oldMaterials = oldData['materials'];
                    for (var mat in oldMaterials) {
                        if (!cacheSum[mat]) {cacheSum[mat] = 0;}
                        cacheSum[mat] -= oldMaterials[mat];
                    }
                    cache.shift();
                    i--;
                } else {
                    return;
                }
            }
        },
        getResValue: function (res) {
            var cache = options.auto.cache.cache;
            if (cache.length === 0) {return 0;}
            var cacheSum = options.auto.cache.cacheSum;
            if (!cacheSum[res]) {return 0;}
            var currentTick = game.timer.ticksTotal;
            var startingTick = cache[0].timeStamp;

            return (cacheSum[res] / (currentTick - startingTick));
        }
    };

    // ==============================
    // Configure overall page display
    // ==============================

    var right = $('#rightColumn');

    var addRule = function (rule) {
        var sheets = document.styleSheets;
        sheets[0].insertRule(rule, 0);
    };

    var defaultSelector = 'body[data-ks-style]:not(.scheme_sleek)';

    addRule(defaultSelector + ' #game {'
        + 'font-family: monospace;'
        + 'font-size: 12px;'
        + 'min-width: 1300px;'
        + 'top: 32px;'
        + '}');

    addRule(defaultSelector + ' {'
        + 'font-family: monospace;'
        + 'font-size: 12px;'
        + '}');

    addRule(defaultSelector + ' .column {'
        + 'min-height: inherit;'
        + 'max-width: inherit !important;'
        + 'padding: 1%;'
        + 'margin: 0;'
        + 'overflow-y: auto;'
        + '}');

    addRule(defaultSelector + ' #leftColumn {'
        + 'height: 92%;'
        + 'width: 26%;'
        + '}');

    addRule(defaultSelector + ' #midColumn {'
        + 'margin-top: 1% !important;'
        + 'height: 90%;'
        + 'width: 48%;'
        + '}');

    addRule(defaultSelector + ' #rightColumn {'
        + 'overflow-y: scroll;'
        + 'height: 92%;'
        + 'width: 19%;'
        + '}');

    addRule(defaultSelector + ' #gameLog .msg {'
        + 'display: block;'
        + '}');

    addRule(defaultSelector + ' #gameLog {'
        + 'overflow-y: hidden !important;'
        + 'width: 100% !important;'
        + 'padding-top: 5px !important;'
        + '}');

    addRule(defaultSelector + ' #resContainer .maxRes {'
        + 'color: #676766;'
        + '}');

    addRule(defaultSelector + ' #game .btn {'
        + 'border-radius: 0px;'
        + 'font-family: monospace;'
        + 'font-size: 12px !important;'
        + 'margin: 0 5px 7px 0;'
        + 'width: 290px;'
        + '}');

    addRule(defaultSelector + ' #game .map-viewport {'
        + 'height: 340px;'
        + 'max-width: 500px;'
        + 'overflow: visible;'
        + '}');

    addRule(' #game .map-dashboard {'
        + 'height: 120px;'
        + 'width: 292px;'
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

    addRule('#ks-options #toggle-list-resources .stockWarn {'
        + 'color: ' + options.stockwarncolor + ';'
        + '}');

    document.body.setAttribute("data-ks-style", "");

    // Local Storage
    // =============

    var kittenStorageVersion = 1;

    var kittenStorage = {
        version: kittenStorageVersion,
        toggles: {},
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
        kittenStorage.toggles = {
            build: options.auto.build.enabled,
            space: options.auto.space.enabled,
            craft: options.auto.craft.enabled,
            upgrade: options.auto.upgrade.enabled,
            trade: options.auto.trade.enabled,
            faith: options.auto.faith.enabled,
            time: options.auto.time.enabled,
            options: options.auto.options.enabled,
            filter: options.auto.filter.enabled
        };
        kittenStorage.resources = options.auto.resources;
        kittenStorage.triggers = {
            faith: options.auto.faith.trigger,
            time: options.auto.time.trigger,
            build: options.auto.build.trigger,
            space: options.auto.space.trigger,
            craft: options.auto.craft.trigger,
            trade: options.auto.trade.trigger
        };
        localStorage['cbc.kitten-scientists'] = JSON.stringify(kittenStorage);
    };

    var loadFromKittenStorage = function () {
        var saved = JSON.parse(localStorage['cbc.kitten-scientists'] || 'null');
        if (saved && saved.version == kittenStorageVersion) {
            kittenStorage = saved;

            if (saved.toggles) {
                for (var toggle in saved.toggles) {
                    if (toggle !== 'engine' && options.auto[toggle]) {
                        options.auto[toggle].enabled = !!saved.toggles[toggle];
                        var el = $('#toggle-' + toggle);
                        el.prop('checked', options.auto[toggle].enabled);
                    }
                }
            }

            for (var item in kittenStorage.items) {
                var value = kittenStorage.items[item];
                var el = $('#' + item);
                var option = el.data('option');
                var name = item.split('-');

                if (option === undefined) {
                    delete kittenStorage.items[item];
                    continue;
                }

                if (name[0] == 'set') {
                    el[0].title = value;
                } else {
                    el.prop('checked', value);
                }

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
                options.auto.time.trigger = saved.triggers.time;
                options.auto.build.trigger = saved.triggers.build;
                options.auto.space.trigger = saved.triggers.space;
                options.auto.craft.trigger = saved.triggers.craft;
                options.auto.trade.trigger = saved.triggers.trade;

                $('#trigger-faith')[0].title = options.auto.faith.trigger;
                $('#trigger-time')[0].title = options.auto.time.trigger;
                $('#trigger-build')[0].title = options.auto.build.trigger;
                $('#trigger-space')[0].title = options.auto.space.trigger;
                $('#trigger-craft')[0].title = options.auto.craft.trigger;
                $('#trigger-trade')[0].title = options.auto.trade.trigger;
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

        var allresources = $('<ul/>', {
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
        var element = $('<li/>', {id: 'ks-' + toggleName});

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
                    if (toggleName === 'filter' || toggleName === 'options') {
                        message('Enabled ' + ucfirst(text));
                    } else {
                        message('Enabled Auto ' + ucfirst(text));
                    }
                    saveToKittenStorage();
                } else if ((!input.is(':checked')) && auto.enabled == true) {
                    auto.enabled = false;
                    if (toggleName === 'filter' || toggleName === 'options') {
                        message('Disabled ' + ucfirst(text));
                    } else {
                        message('Disabled Auto ' + ucfirst(text));
                    }
                    saveToKittenStorage();
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
                    float: 'right',
                    paddingRight: '5px',
                    textShadow: '3px 3px 4px gray'}
            });

            element.append(button);

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
                else if (toggleName === 'options')
                    list.append(getOptionsOption(itemName, auto.items[itemName]));
                else
                    list.append(getOption(itemName, auto.items[itemName]));
            }

            button.on('click', function () {
                list.toggle();
            });

            // Add resource controls for crafting, sort of a hack
            if (toggleName === 'craft') {
                var resources = $('<div/>', {
                    id: 'toggle-resource-controls',
                    text: 'resources',
                    css: {cursor: 'pointer',
                        display: 'inline-block',
                        float: 'right',
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

                element.append(resources);
            }

        }

        if (auto.trigger !== undefined) {
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
                value = window.prompt('Enter a new trigger value for ' + text + '. Should be in the range of 0 to 1.', auto.trigger);

                if (value !== null) {
                    auto.trigger = parseFloat(value);
                    saveToKittenStorage();
                    triggerButton[0].title = auto.trigger;
                }
            });

            element.append(triggerButton);
        }

        if (toggleName === 'craft') {element.append(resourcesList);}

        if (auto.items) {element.append(toggle, list);}

        return element;
    };

    var getTradeOption = function (name, option) {
        var element = getOption(name, option);
        element.css('borderBottom', '1px solid rgba(185, 185, 185, 0.7)');

        //Limited Trading
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
                message('Trading with ' + ucfirst(name) + ': limited to only occur when profitable based off relative production time');
            } else if ((!input.is(':checked')) && option.limited == true) {
                option.limited = false;
                message('Trading with ' + ucfirst(name) + ': unlimited');
            }
            kittenStorage.items[input.attr('id')] = option.limited;
            saveToKittenStorage();
        });

        element.append(input, label);
        //Limited Trading End

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
            } else if ((!input.is(':checked')) && option[season] == true) {
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
                if (option.filter) {
                    message('Enabled ' + elementLabel + ' Filter');
                } else if (option.misc) {
                    message('Enabled ' + elementLabel);
                } else {
                    message('Enabled Auto ' + elementLabel);
                }
            } else if ((!input.is(':checked')) && option.enabled == true) {
                option.enabled = false;
                if (option.filter) {
                    message('Disabled ' + elementLabel + ' Filter');
                } else if (option.misc) {
                    message('Disabled ' + elementLabel);
                } else {
                    message('Disabled Auto ' + elementLabel);
                }
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
                message('Crafting ' + ucfirst(name) + ': limited to be proportional to cost ratio');
            } else if ((!input.is(':checked')) && option.limited == true) {
                option.limited = false;
                message('Crafting ' + ucfirst(name) + ': unlimited');
            }
            kittenStorage.items[input.attr('id')] = option.limited;
            saveToKittenStorage();
        });

        element.append(input, label);

        return element;
    };

    var getOptionsOption = function (name, option) {
        var element = getOption(name, option);

        if (option.subTrigger !== undefined) {
            var triggerButton = $('<div/>', {
                id: 'set-' + name +'-subTrigger',
                text: 'trigger',
                title: option.subTrigger,
                css: {cursor: 'pointer',
                    display: 'inline-block',
                    float: 'right',
                    paddingRight: '5px',
                    textShadow: '3px 3px 4px gray'}
            }).data('option', option);

            triggerButton.on('click', function () {
                var value;
                if (name == 'crypto'){value = window.prompt('Enter a new trigger value for ' + option.label + '. Corresponds to the amount of Relics needed before the exchange is made.', option.subTrigger);}
                else{value = window.prompt('Enter a new trigger value for ' + option.label + '. Should be in the range of 0 to 1.', option.subTrigger);}

                if (value !== null) {
                    option.subTrigger = parseFloat(value);
                    kittenStorage.items[triggerButton.attr('id')] = option.subTrigger;
                    saveToKittenStorage();
                    triggerButton[0].title = option.subTrigger;
                }
            });

            element.append(triggerButton);
        }

        return element;
    };

    // Grab button labels for religion options
    var religionManager = new ReligionManager();
    for (var buildOption in options.auto.faith.items) {
        var buildItem = options.auto.faith.items[buildOption];
        var build = religionManager.getBuild(buildItem.name || buildOption, buildItem.variant);
        if (build) {
            options.auto.faith.items[buildOption].label = build.label;
        }
    }

    // Grab button labels for time options
    var timeManager = new TimeManager();
    for (var buildOption in options.auto.time.items) {
        var buildItem = options.auto.time.items[buildOption];
        var build = timeManager.getBuild(buildItem.name || buildOption, buildItem.variant);
        if (build) {
            options.auto.time.items[buildOption].label = build.label;
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
    optionsListElement.append(getToggle('build',    'Bonfire'));
    optionsListElement.append(getToggle('space',    'Space'));
    optionsListElement.append(getToggle('craft',    'Crafting'));
    optionsListElement.append(getToggle('upgrade',  'Unlocking'));
    optionsListElement.append(getToggle('trade',    'Trading'));
    optionsListElement.append(getToggle('faith',    'Religion'));
    optionsListElement.append(getToggle('time',     'Time'));
    optionsListElement.append(getToggle('options',  'Options'));
    optionsListElement.append(getToggle('filter',   'Filters'));

    // add activity button
    // ===================

    var activitySummary = {};
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
            activitySummary[section][name] = parseFloat(amount);
        } else {
            activitySummary[section][name] += parseFloat(amount);
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
            summary('Sent adorable kitten hunters on ' + game.getDisplayValueExt(activitySummary.other.hunt) + ' hunts');
        }

        // Embassies
        if (activitySummary.other.embassy) {
            summary('Built ' + game.getDisplayValueExt(activitySummary.other.embassy) + ' embassies');
        }

        // Necrocorns
        if (activitySummary.other.feed) {
            summary('Fed the elders ' + game.getDisplayValueExt(activitySummary.other.feed) + ' necrocorns');
        }

        // Techs
        for (var name in activitySummary.research) {
            summary('Researched: ' + ucfirst(name));
        }

        // Upgrades
        for (var name in activitySummary.upgrade) {
            summary('Upgraded: ' + ucfirst(name));
        }

        // Buildings
        for (var name in activitySummary.build) {
            summary('Built: +' + game.getDisplayValueExt(activitySummary.build[name]) + ' ' + ucfirst(name));
        }

        // Order of the Sun
        for (var name in activitySummary.faith) {
            summary('Discovered: +' + game.getDisplayValueExt(activitySummary.faith[name]) + ' ' + ucfirst(name));
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

    showActivity.on('click', displayActivitySummary);

    activityBox.append(showActivity);

    $('#clearLog').append(activityBox);

    // Donation Button
    // ===============

    var donate = $('<li/>', {id: "ks-donate"}).append($('<a/>', {
        href: 'bitcoin:' + address + '?amount=0.00048&label=Kittens Donation',
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
    game._publish("kitten_scientists/ready", version);

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
