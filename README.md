# Kitten Scientists

<p align="center"><img src="https://i.imgur.com/AWHGIGH.jpg" /></p>

Kitten Scientists (KS) is a simple automation script for the complex [Kittens Game](http://bloodrizer.ru/games/kittens/).

## Quick Start

Create the following JavaScript bookmarklet (create a new bookmark and paste this as the URL):

```js
javascript:(function(){var d=document,s=d.createElement('script');s.src='https://cdn.jsdelivr.net/gh/cameroncondry/cbc-kitten-scientists@master/kitten-scientists.user.js';d.body.appendChild(s);})();
```

### Manual Installation

You can also permanently install Kitten Scientists with a userscript manager.

- On **Firefox**, you'd want to use [Greasemonkey](https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/).
- On **Chrome** and **Opera**, you'd want to use [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo).

Now simply [open the script](https://raw.githubusercontent.com/cameroncondry/cbc-kitten-scientists/master/kitten-scientists.user.js) and you should be prompted to install it.

## Introduction

Note that the default configuration of Kitten Scientists is designed to already give very good results for most stages of the game. When you're exploring the features of KS, try disabling all sections and then re-enabling them one-by-one.

As you get more comfortable with the behavior of KS, feel free to fine-tune the settings to achieve your goals faster.

## UI Guide

To enable/disable the entire suite of automations of KS, click the **Enable Scientists** label at the top of the UI.

Individual automation sections can be enabled/disabled by clicking on the label of the automation section. By clicking the **items** label to the right of the label, you can expand/collapse the panel that holds the individual automation options of that section. Their specific behavior is documented below.

### Bonfire

> This section has a configurable threshold for when the automation should be activated. Click the **trigger** label to the right of the **Bonfire** label to set your desired threshold. The default value is `0` (activate as soon as possible).

By clicking the names of the individual buildings, you can select which buildings from the **Bonfire** page you want to have built automatically. 

### Space

> This section has a configurable threshold for when the automation should be activated. Click the **trigger** label to the right of the **Space** label to set your desired threshold. The default value is `0` (activate as soon as possible).

As in the **Bonfire** section, here you can select which buildings from the **Space** page you want to have built automatically.

### Crafting

> This section has a configurable threshold for when the automation should be activated. Click the **trigger** label to the right of the **Crafting** label to set your desired threshold. The default value is `0.95`. This means that a resource will be crafted when it is at 95% of your storage limit.

In this section, you can select which craftable resources you want to craft automatically.

When you enable the **Limited** option for a resource, then only a portion of the source materials is crafted into the desired resource. The portion is currently set to 50% (this is currently not configurable).

This means that if you have 1000 beams, and you have crafting of scaffolds enabled, then only 500 beams would be crafted into scaffolds. This is especially useful for when you want to split up source materials between different craftable resources.

However, this is not entirely accurate, as the overall process is more complicated. Consider crafting steel and plates. Both require iron. If you would allow unlimited plate crafting, then you wouldn't have any iron left to craft steel. By having steel and plates set to **limited**, the iron resource is split between the two craftable resources.

#### Resources

By clicking the **Resources** label, you can access the fine-grained resource management.

For each resource, you can set a *consumption rate* (60% by default) and a *stock* (0 by default). The consumption rate defines how much of the trigger value times the storage capacity that autocrafting is allowed to consume (meaning with the default consumption rate and a trigger value of 100%, autocrafting would leave 40% of the resource's storage capacity). The stock setting keeps a specific amount on hand, regardless of all other settings.

### Unlocking

- Workshop **upgrades** and **techs** are automatically bought when affordable, prioritizing the workshop if both are enabled.
- **Races** for trading are automatically explored as they become available.
- Space **missions** can automatically be conducted.
- **Buildings** can be set to be automatically upgraded to their second stage as soon as upgrading would not significantly impact income. 

### Trading

> This section has a configurable threshold for when the automation should be activated. Click the **trigger** label to the right of the **Trading** label to set your desired threshold. The default value is `0.98`. This means that a trade will be made, when you're at 98% of your storage limit. This only relates to resources that have a storage limit.

By default, the trades are optimized to only happen during seasons when the trade is most effective. You can customize these seasons by clicking the **seasons** label to the right of the individual races.

Trading also has a *limited* trading mode. This mode determines how much production time is needed to make the trade's input resources versus the time to make the trade's average output resources to determine if a trade is profitable. The resources gained and spent trading and hunting are also factored in, making this mode self-limiting.

### Religion

> This section has a configurable threshold for when the automation should be activated. Click the **trigger** label to the right of the **Religion** label to set your desired threshold. The default value is `0` (activate as soon as possible).

In the **Religion** section, you can select which buildings and techs from the **Religion** page you want to have purchased automatically.

### Time

> This section has a configurable threshold for when the automation should be activated. Click the **trigger** label to the right of the **Time** label to set your desired threshold. The default value is `0` (activate as soon as possible).

The automations in this section behave exactly like in the **Bonfire** and **Space** sections, but here you select which buildings from the **Time** page you want to have built automatically.

### Options

- **Observe Astro Events**: Automatically observe astronomical events as they happen.
- **Hold Festivals**: Automatically hold festivals as soon as the previous one ends and enough resources are available and holding the festival won't drain your stockpile.
- **Auto Praise**: Automatically praises the sun as your faith approaches the resource limit.
- **Force Ships to 243**: Ensures that 243 ships are constructed as soon as possible, ignoring other resource constraints. This is useful because after 243 ships, trades for titanium with the zebras are guaranteed to be successful 100% of the time.
- **Feed Leviathans**: Automatically feed the leviathans race necrocorns to ensure they stay longer for possible trading.
- **Hunt**: Automatically send your kittens hunting as you approach the catpower limit. This automation has a configurable trigger. The default value is `0.98`, which means the kittens will hunt when your catpower is at 98% of your catpower limit.
- **Trade Blackcoin**: Automatically trade blackcoin with the leviathans at low prices and sells near the peak.
- **Build Embassies (Beta)**: Automatically builds embassies, just like other buildings.
- **Explore (deprecated)**: _relates to a feature no longer present in current versions of Kittens Game_

### Filters

The filters allow you to set which types of messages you want to see in the game log.

Note that _enabling_ a filter will cause the message to **not** be logged. This is in contrast to the **Log Filters** that are already present in Kittens Game, where the logic is reversed.

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
- [ironchefpython](https://github.com/ironchefpython)
- [jacob-keller](https://github.com/jacob-keller)
- [jcranmer](https://github.com/jcranmer)
- [KMChappell](https://github.com/KMChappell)
- [Kobata](https://github.com/Kobata)
- [magus424](https://github.com/magus424)
- [mammothb](https://github.com/mammothb)
- [markuskeunecke](https://github.com/markuskeunecke)
- [Meleneth](https://github.com/meleneth)
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
- [toadjaune](https://github.com/toadjaune)
- Tom Rauchenwald
- [trini](https://github.com/trini)
- [woutershep](https://github.com/woutershep)
- [Wymrite](https://github.com/Wymrite)
- [Xanidel](https://github.com/Xanidel)
- [zelenay](https://github.com/zelenay)
