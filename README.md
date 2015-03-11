# Kitten Scientists

Kitten Scientists is a simple automation script for the complex kittens. [Kittens Game](http://bloodrizer.ru/games/kittens/)

## Basic Usage

Create the following JavaScript bookmarklet:

```
javascript:(function(){var d=document,s=d.createElement('script');s.src='https://rawgit.com/cameroncondry/cbc-kitten-scientists/master/kitten-scientists.js';d.body.appendChild(s);})();
```

## Functionality

#### User Interface

- Switched to a monospace font and descreased the overall size.
- Removed rounded edges on buttons.
- Set up columns to span 100% of the width of the screen.
- Toggle button for the script above the game log.

#### Resources

Auto-crafts the following resources when resource is at 95% capacity, will only use 50% of total resources:

- wood
- beam
- slab
- steel
- plate

Auto-luxuries for the following resources when at 99% capacity, will only use 50% of total resources:

- manuscripts
- compendiums

#### Buildings

Auto-builds the following buildings when resource is at 75% capacity, will only build while on the "Bonfire" tab:

- field
- pasture
- library
- academy
- mine
- barn
- aqueduct
- lumberMill
- workshop
- unicornPasture

Auto-housing will build the following population buildings when resource is at 85% capacity:

- hut
- logHouse
- mansion

#### Cat Power

Auto-hunts when catpower is at 95% capacity and Auto crafts parchments before the next hunt is deployed.

#### Religion

Auto-praise when faith is at 99% capacity.

#### Game Log

Auto-observes astronomical events.

## History

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
