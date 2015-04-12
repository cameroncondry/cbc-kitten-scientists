# Kitten Scientists

Kitten Scientists is a simple automation script for the complex kittens. [Kittens Game](http://bloodrizer.ru/games/kittens/)

## Basic Usage

Create the following JavaScript bookmarklet (create a new bookmark and past this as the URL):

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

Crafts the following resources when at 95% capacity, will only use 50% of total resources:

- wood
- beam
- slab
- steel
- plate

Luxury crafts the following resources when at 99% capacity, will only use 50% of total resources:

- manuscripts
- compendiums

#### Buildings

Builds the following buildings when required resource is at 75% capacity, will only build while on the "Bonfire" tab:

- field
- pasture
- mine
- library
- academy
- barn
- workshop
- lumberMill
- aqueduct
- unicornPasture
- tradepost

Housing will build the following population buildings when required resource is at 85% capacity:

- hut
- logHouse
- mansion

#### Trading

Trades with races when gold and catpower are at 95% capacity. Uses 50% of the amount available, divided among races based on a separate race amount factor. Note that the actual amount traded per race is the trade amount multiplied by the per-race amount. Ex: we will trade 12.5% of the total available gold and catpower with zebras in the winter (but no more than 50% of the total slab in one trade).

- zebras, 25% of the trade total in winter
- zebras, 25% of the trade total in spring

#### Cat Power

Hunts when catpower is at 95% capacity and builds parchments before the hunt is sent.

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