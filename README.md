# Kitten Scientists

<p align="center"><img src="https://i.imgur.com/AWHGIGH.jpg" /></p>

Kitten Scientists (KS) is a simple automation script for the complex [Kittens Game](http://bloodrizer.ru/games/kittens/).

## Basic Usage

Create the following JavaScript bookmarklet (create a new bookmark and paste this as the URL):

    javascript:(function(){var d=document,s=d.createElement('script');s.src='https://cdn.jsdelivr.net/gh/cameroncondry/cbc-kitten-scientists@master/kitten-scientists.user.js';d.body.appendChild(s);})();

### Alternative Installation

You can also permanently install Kitten Scientists with a userscript manager.

- On **Firefox**, you'd want to use [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/).
- On **Chrome** and **Opera**, you'd want to use [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo).

Now simply [open the script](https://raw.githubusercontent.com/cameroncondry/cbc-kitten-scientists/master/kitten-scientists.user.js) and you should be prompted to install it. 

## Functionality

- Several UI adjustments (depending on selected theme).
- Automates:
    - Building (Bonfire, Space, Religion, and Time Buildings)
    - Crafting
    - Upgrading
    - Trading
    - Hunting
    - Praising
    - Holding Festivals
    - Observing Astronomical Events
    - Trading Cryptocurrency
    - Autofeeding Necrocorns
    - Exploring (Deprecated)

### Building

By default, bonfire buildings are built if their required resources are at 75% of their storage capacity. For space and time structures, the default threshold is 95%. For religion structures, it is 99%.

### Crafting

Craftable resources are crafted when the resources required for the craft exceed the *trigger* value (95% by default) of their storage capacity, or always craft if the resource lacks a storage capacity.

For each resource, you can set a *consumption rate* (60% by default) and a *stock* (0 by default). The consumption rate defines how much of the trigger value times the storage capacity that autocrafting is allowed to consume (meaning with the default consumption rate and a trigger value of 100%, autocrafting would leave 40% of the resource's storage capacity). The stock setting tells KS to ignore the specified amount of this resource.

Furthermore, each resource can be set to be *limited* crafted. Limited crafting behaves normally when the resource exceeds the trigger value, but behaves differently when beneath the trigger value or for a resource that lacks a storage capacity. It crafts resources in an attempt to keep both the inputs and outputs in proportion. (Meaning if the player has 2000 minerals and 0 slabs, and each slab costs 50 minerals, it will craft 20 slabs for new totals of 1000 minerals and 20 slabs).

### Upgrading

Techs and workshop upgrades are automatically bought when affordable, prioritizing the workshop. Buildings can be set to be automatically upgraded to their second stage.

### Trading

Trades happen when the traded resource and gold is at 98% of the storage capacity. By default, the trades are optimized to only happen during seasons when the trade is most effective.

Trading also has a *limited* trading mode. This mode determines how much production time is needed to make the trade's input resources versus the time to make the trade's average output resources to determine if a trade is profitable. It also checks how many trades each resource involved is worth, and prevents trading if the least input resource is less than the least output resource. This prevents limited trading from depleting the input resources.

### Hunting

Hunts when catpower is at 95% capacity.

### Praising

Praises when faith is at 99% capacity.

### Misc
KS can be set to:

Automatically buy cryptocurrency at low prices and sells near the peak.

Automatically hold festivals when the resources are available.

Autofeed necrocorns to leviathans.

### Game Log

Automatically observes astronomical events.

All KS log output can be filtered.

## Contributors

If you would like to contribute to the Kitten Scientists, then you can do so in these ways:

- Submit issues or bugs you find, or functionality that would improve the project.
- Fork the repository, add some functionality, then submit a pull request.

Thanks to these past and present contributors!

- [adituv](https://github.com/adituv)
- [amaranth](https://github.com/amaranth)
- [Azulan](https://www.reddit.com/user/Azulan)
- [carver](https://github.com/carver)
- [coderpatsy](https://github.com/coderpatsy)
- [cokernel](https://github.com/cokernel)
- [DirCattus](https://www.reddit.com/user/DirCattus)
- [DrGaellon](https://github.com/DrGaellon)
- Eliezer Kanal
- [enki1337](https://github.com/enki1337)
- [FancyRabbitt](https://www.reddit.com/user/FancyRabbitt)
- [gnidan](https://github.com/gnidan)
- [Hastebro](https://github.com/Hastebro)
- [hypehuman](https://github.com/hypehuman)
- Iris Ward
- ironchefpython
- [jacob-keller](https://github.com/jacob-keller)
- Jason Carver
- [jcranmer](https://github.com/jcranmer)
- [KMChappell](https://github.com/KMChappell)
- [Kobata](https://github.com/Kobata)
- [magus424](https://github.com/magus424)
- [mammothb](https://github.com/mammothb)
- [markuskeunecke](https://github.com/markuskeunecke)
- Meleneth
- [Mewnine](https://www.reddit.com/user/Mewnine)
- [mjdillon](https://github.com/mjdillon)
- [mmccubbing](https://github.com/mmccubbing)
- [NoobKitten](https://github.com/NoobKitten)
- [oliversalzburg](https://github.com/oliversalzburg)
- [pefoley2](https://www.reddit.com/user/pefoley2)
- [Phoenix09](https://github.com/Phoenix09)
- [poizan42](https://github.com/poizan42)
- [riannucci](https://github.com/riannucci)
- [romanalexander](https://github.com/romanalexander)
- [sapid](https://github.com/sapid)
- [sjdrodge](https://github.com/sjdrodge)
- [SphtMarathon](https://www.reddit.com/user/SphtMarathon)
- [TeWeBu](https://github.com/TeWeBu)
- Tom Rauchenwald
- [toadjaune](https://github.com/toadjaune)
- [trini](https://github.com/trini)
- [woutershep](https://github.com/woutershep)
- [Wymrite](https://github.com/Wymrite)
- [Xanidel](https://github.com/Xanidel)
- [zelenay](https://github.com/zelenay)
