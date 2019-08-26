## History

### 2019.08.?? - Version 1.4.0

#### Changes by [Wymrite](https://github.com/Wymrite)
- Fixed broken enable-all button.
- Added upgrade manager for automated upgrading.
- Fixed issues with leviathan tradings.
- Modified building system to build all possible buildings in a single KS cycle iteration.
- Adjusted priority of limited crafting to override trigger and consumption rate settings.
- Changed multiple default settings.
- Modified crafting to reach equilibrium in one KS cycle iteration.
- Changed how trades are distributed to reach equilibrium in one KS cycle iteration.
- Added new limited trading system to trade when profitable, limited by the input/output resource ratio.
- Changed logging to use correct numbers, use correct labels, and have the summary log everything it should.
- Some formatting fixes.
- Updated the changelog and readme.


#### Changes by [hypehuman](https://github.com/hypehuman)
- Moved autofeeding necrocorns to correct file.

#### Changes by [coderpatsy](https://github.com/coderpatsy)
- Fixed autofeed settings.
- Changed toggleAttribute method to setAttribute.
- Updated bookmarklet URL to jsdelivr.

### 2019.06.13 - Version 1.3.3

#### Changes by [coderpatsy](https://github.com/coderpatsy)
- Allowed activity messages to have multiple types.
- Fixed craft setting loading.
- Fixed trade message filter.
- Fixed libraries and data centers.
- Removed trade filter.
- Fixed ship craft prices.
- Disabled exploring by default.
- Added some features for external scripts.
- Made top level toggles save.
- Some CSS changes.

#### Changes by [Phoenix09](https://github.com/Phoenix09)
- Added spice refinery.
- Changed praise summary to use faith bonus.
- Changed crafting logging to use correct ratio.

#### Changes by [markuskeunecke](https://github.com/markuskeunecke)
- Fixed autofestival.

#### Changes by Tom Rauchenwald
- Fixed missing comma.

#### Changes by [romanalexander](https://github.com/romanalexander)
- Fixed another missing comma.

#### Changes by [amaranth](https://github.com/amaranth)
- Added order of the sun functionality.
- Added rendered tab checks.
- Changed limited crafting to use season id.

#### Changes by [toadjaune](https://github.com/toadjaune)
- Begun overhaul of limited crafting to use quantities of involved materials.
- Prevented limited crafting from occuring when a maximum is present

#### Changes by Eliezer Kanal
- Prevented building from using stock resources.
- Added visual warning for when stock exceeds resource cap.
- Fixed backwards resource check.
- Fixed loop continuing incorrectly.
- Fixed initial loading of stock.

#### Changes by [Kobata](https://github.com/Kobata)
- Fixed building price checking for buildings with stages.

#### Changes by [Hastebro](https://github.com/Hastebro)
- Added cryptocurrency and exploration automation.

#### Changes by [NoobKitten](https://github.com/NoobKitten)
- Added autofeeding necrocorns.

#### Changes by [Wymrite](https://github.com/Wymrite)
- Added ziggurats and cryptotheology functionality.
- Added molten core.
- Added time tab building automation.
- Added craft ratio to limited crafting formula.
- Updated limited crafting documentation.

### 2017.04.07 - Version 1.3.2

#### Changes by [trini](https://github.com/trini)
- Removed per race trade trigger.

#### Changes by [cokernel](https://github.com/cokernel)
- Improved logging of hunting.
- Switched activity summary to use past tense.

#### Changes by [coderpatsy](https://github.com/coderpatsy)
- Updated logging messaging.
- Fixed space auto-build message.
- Modified logging methods.

#### Changes by [zelenay](https://github.com/zelenay)
- Added tampermonkey functionality and script load check.

#### Changes by [Xanidel](https://github.com/Xanidel)
- Added thorium crafting option.

#### Changes by [woutershep](https://github.com/woutershep)
- Fixed trade ratio calculation.
- Added missing space buildings.
- Added check to prevent early space building.

#### Changes by [poizan42](https://github.com/poizan42)
- Changed getBuilding function to getBuildingExt.
- Fixed space building labels.
- Fixed show activity checkbox for 1.3.0.0.

#### Changes by [oliversalzburg](https://github.com/oliversalzburg)
- Numerous building and ui bugfixes.

#### Changes by [KMChappell](https://github.com/KMChappell)
- Corrected renderFilters crash.

#### Changes by [riannucci](https://github.com/riannucci)
- Fixed hasResource call.

#### Changes by Meleneth
- Added check to find buildings from button text.

#### Changes by [TeWeBu](https://github.com/TeWeBu)
- Fixed getBuildButton method.
- Fixed tradeMultiple method.
- Formatting fixes.

### 2016.01.02 - Version 1.3.1

#### Changes by [oliversalzburg](https://github.com/oliversalzburg)
- Fixed upgradeable buildings not being built.
- Prioritize housing in build order and upgrade storage last.
- Allow the user to configure the trigger threshold.
- Script was renamed to kitten-scientists.user.js to improve interaction with Greasemonkey/Tampermonkey.

### 2016.01.01 - Version 1.3.0

#### Changes by [jacob-keller](https://github.com/jacob-keller)
- Added an activity system.
- Trading no longer relies on having a certain amount of catpower.
- Trading will now equalize trades among all possible races.
- Hunts will now happen more frequently.
- Hunting will now happen after trading.
- Parchment is no longer treated like a special, luxury resource during crafting.
- Some furs are retained to maintain happiness by default.
- Added eludium crafting option.
- Improved LAF of items toggles.
- Allow the user to set a stock of items that is retained during crafting and trading.
- Optimized when trades with specific races can happen.
- Added a *disable all* option in item lists.
- Prevent Scientists from crafting more resources than we can store. 

#### Changes by [adituv](https://github.com/adituv)
- Prevent hunt attempts with too little catpower.

#### Changes by  [magus424](https://github.com/magus424)
- Settings are now persisted to local storage.

#### Changes by [coderpatsy](https://github.com/coderpatsy)
- Added support for new log filters.
- Fixed attempts to hold festivals when you hadn't unlocked them.
- Buttons are now actually clicked instead of internal game logic being invoked. Fixes new tabs not appearing if the unlocking building was built by Scientists.

#### Changes by [sapid](https://github.com/sapid)
- Improve observation of stars.

#### Changes by [mammothb](https://github.com/mammothb)
- Changed UI in default theme to use a monospaced font.
- Added an *enable all* option in item lists.

#### Changes by ironchefpython
- Added support for kerosene crafting.

#### Changes by [oliversalzburg](https://github.com/oliversalzburg)
- Allow auto-building of buildings that have multiple stages.
- Fixed font size on buttons to avoid buttons with differing heights.
- Allow Scientists to run in Kittens Game development mode (`file:///`)
- Rename *Engine* checkbox to *Enable Scientists*.
- Fixed Scientists not being able to handle new resources introduced into the game.
- Support for the Space build options.
- Support for the Sleek theme.
- Use internal names for checkbox values instead of the IDs of items.
- Added a log message when Scientists are loaded.

Plus several more improvements by our [contributors](https://github.com/cameroncondry/cbc-kitten-scientists#contributors). A big *thank you* to all of them.

### 2015.05.10 - Version 1.2.4

- Added a debug mode to send messages to the console.
- Set a 100 message limit on the game log. (thanks [FancyRabbitt](https://www.reddit.com/user/FancyRabbitt))
- Added toggles to limit resources to once per season. (thanks [jacob-keller](https://github.com/jacob-keller))

### 2015.05.09 - Version 1.2.3

- Added variable controls over season limits. ([#41](https://github.com/cameroncondry/cbc-kitten-scientists/issues/41))

### 2015.05.08 - Version 1.2.2

- Added season control to crafts. (thanks [jacob-keller](https://github.com/jacob-keller)) ([#37](https://github.com/cameroncondry/cbc-kitten-scientists/issues/37))
- Reimplemented resource stock on buildings. (thanks [jacob-keller](https://github.com/jacob-keller))
- Added season control to trades. (thanks [jacob-keller](https://github.com/jacob-keller))

### 2015.04.30 - Version 1.2.1

- Added mint to the building list. (thanks [lightrider44](https://www.reddit.com/user/lightrider44))
- Removed trading cap temporarily. This will need re-enabled with better cap measures.
- Added the remaining trade possibilities.

### 2015.04.30 - Version 1.2.0

- Added granular controls for build orders. #8 #12 #21
- Added a bitcoin address by request. #16
- Updated README with alterations to build orders.
- Removed restriction of sitting on the "Bonfire" tab for auto building.
- Added all buildings and crafts to auto crafting. (requires toggling on in some cases)
- Stocks are enabled but require manual updating. Ex: "options.auto.craft.items.wood.stock = 5000;" 

Thanks for contributing code:
[jacob-keller](https://github.com/jacob-keller)
[trini](https://github.com/trini)
[sjdrodge](https://github.com/sjdrodge)

Thanks for contributing ideas:
[Azulan](https://github.com/Azulan)
[mmccubbing](https://github.com/mmccubbing)

### 2015.04.06 - Version 1.1.6 - 1.1.6.1

- Moved parchments out of the luxury goods until fine controls are implemented.
- Quality of life changes in internal codebase. (thanks [jacob-keller](https://github.com/jacob-keller))
- Added automated trading and enabled trading with Zebras. (thanks [jacob-keller](https://github.com/jacob-keller))
- Specified resource to watch with unicorn pastures. (thanks [jacob-keller](https://github.com/jacob-keller))
- Moved parchment into the "luxury" goods category. (thanks [jacob-keller](https://github.com/jacob-keller))
- Added tradepost to the list of buildings and reprioritized order. (thanks [trini](https://github.com/trini))
- Reprioritized crafting to happen after building. (thanks [trini](https://github.com/trini))
- Updated the build internals to use the buttons directly. (reverted) (thanks [jacob-keller](https://github.com/jacob-keller))

### 2015.03.11 - Version 1.1.5

- Tweaked styles to remove extra margin around interface buttons.
- Fixed a bug with praising, due to refactoring. (thanks [sjdrodge](https://github.com/sjdrodge))
- Fixed a bug with catnip calculations.
- Removed lingering console.log statements. (thanks [sjdrodge](https://github.com/sjdrodge))

### 2015.03.11 - Version 1.1.4

- Major refactor of codebase to have cleaner lines between responsibilities.
- Stacked options in a two column layout.
- Luxury resources now have their own toggle.

### 2015.03.10 - Version 1.1.3

- Updated Auto Faith to wait for 99% faith capacity.
- Lowered minimum capacity of parchments. (thanks [trini](https://github.com/trini))
- Move luxury resources out of Auto Hunt. (thanks [SphtMarathon](https://www.reddit.com/user/SphtMarathon))
- Added safe guards for catnip in the winter. (thanks [jcranmer](https://github.com/jcranmer))

### 2015.03.08 - Version 1.1.2

- Updated auto housing to be toggled and added mansions.
- Added auto housing option. (thanks [mjdillon](https://github.com/mjdillon))
- Plates moved for priority over steel. (thanks [mjdillon](https://github.com/mjdillon))

### 2015.03.03 - Version 1.1.1

- Added barns to the auto build list.

### 2015.02.03 - Version 1.1.0

- Set up the ability to toggle auto crafting, building, hunting, and praising.
- Simplified css rule insertion and tweaked displayed colors.
- Added logging into the GameLog to prevent confusion.
- Updated crafting log to include the warehouse bonuses.

### 2015.25.02 - Version 1.0.0

- Initial release
