# Kitten Scientists

Kitten Scientists is a simple automation script for the complex kittens.

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

#### Buildings

Auto-builds the following buildings when resource is at 75% capacity, will only build when on the "Bonfire" tab:

- field
- pasture
- library
- academy
- mine
- aqueduct
- lumberMill
- workshop
- unicornPasture

#### Cat Power

Auto-hunts when catpower is at 95% capacity.

Auto-builds the following buildings when they have a specific amount:

- parchment
- manuscript (2500 parchment)
- compendium (500 manuscript)

#### Religion

Auto-praise when faith is at 95% capacity.

#### Game Log

Auto-observes astronomical events.