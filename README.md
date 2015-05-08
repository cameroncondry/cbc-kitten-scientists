# Kitten Scientists

Kitten Scientists is a simple automation script for the complex kittens. [Kittens Game](http://bloodrizer.ru/games/kittens/)

## Basic Usage

Create the following JavaScript bookmarklet (create a new bookmark and past this as the URL):

    javascript:(function(){var d=document,s=d.createElement('script');s.src='https://rawgit.com/cameroncondry/cbc-kitten-scientists/master/kitten-scientists.js';d.body.appendChild(s);})();

## Functionality

#### User Interface

- Switched to a monospace font and descreased the overall size.
- Removed rounded edges on buttons.
- Set up columns to span 100% of the width of the screen.
- Toggle button for the script above the game log.

#### Resources

Crafts the following resources when at 95% capacity, will only use 50% of total resources:

    wood:           enabled: true  
    beam:           enabled: true  
    slab:           enabled: true  
    steel:          enabled: true  
    plate:          enabled: true  
    alloy:          enabled: false  
    concrete:       enabled: false  
    gear:           enabled: false  
    scaffold:       enabled: false  
    ship:           enabled: false  
    tanker:         enabled: false  
    parchment:      enabled: true  
    megalith:       enabled: false  

Luxury crafts follows the same rules as normal crafts except they are auto built during hunts:

    manuscript:     enabled: true  
    compendium:     enabled: true  
    blueprint:      enabled: false  

#### Buildings

Builds the following buildings when required resource is at 75% capacity:

    // science
    library:        enabled: true
    academy:        enabled: true
    observatory:    enabled: true
    
    // craft bonuses
    workshop:       enabled: true
    factory:        enabled: true
    
    // production
    field:          enabled: true
    pasture:        enabled: true
    mine:           enabled: true
    lumberMill:     enabled: true
    aqueduct:       enabled: true
    oilWell:        enabled: true
    quarry:         enabled: true
    
    // conversion
    smelter:        enabled: true
    biolab:         enabled: false
    calciner:       enabled: false
    reactor:        enabled: false
    accelerator:    enabled: false
    steamworks:     enabled: false
    magneto:        enabled: false
    
    // storage
    barn:           enabled: true
    harbor:         enabled: false
    warehouse:      enabled: false
    
    // housing
    hut:            enabled: false
    logHouse:       enabled: false
    mansion:        enabled: false
    
    // other
    amphitheatre:   enabled: true
    tradepost:      enabled: true
    chapel:         enabled: true
    temple:         enabled: true
    unicornPasture: enabled: true
    ziggurat:       enabled: true
    choronosphere:  enabled: true

#### Trading

Trades with the following races when gold is at 90% and the maximum resource is not met. Ex: zebras will trade when gold is at 90% and titanium is below 99% to prevent over trading.

    zebras: (summer)    enabled true
    lizards: (summer)   enabled: false
    sharks: (winter)    enabled: false
    griffins: (autumn)  enabled: false
    nagas: (spring)     enabled: false
    spiders: (autumn)   enabled: false
    dragons: (all)      enabled: false
    leviathans: (all)   enabled: false

#### Cat Power

Hunts when catpower is at 95% capacity and builds luxury items before the hunt is sent.

#### Religion

Praises when faith is at 99% capacity.

#### Game Log

Observes astronomical events.

## Contributors

If you would like to contribute to the Kitten Scientists, then you can do so in these ways:

- Submit issues or bugs you find, or functionality that would improve the project.
- Fork the repository, add some functionality, then submit a pull request.

Thanks to these past and present contributors!

- [jacob-keller](https://github.com/jacob-keller)
- [sjdrodge](https://github.com/sjdrodge)
- [trini](https://github.com/trini)
- [SphtMarathon](https://www.reddit.com/user/SphtMarathon)
- [jcranmer](https://github.com/jcranmer)
- [mjdillon](https://github.com/mjdillon)
- [Azulan](https://github.com/Azulan)
- [mmccubbing](https://github.com/mmccubbing)