#EZStocks

This mod is heavily based on a mod by Silentclowd found here: https://github.com/Nyhilo/KookieStocks

It gives an overview of lowest and highest record prices, current value on that scale,  profit for bought goods and highlight rows when it is suggested to buy or sell.
Buying is suggested when reaching the lower 25% of recorded price, and even more when reaching the lower 10%
Selling is when profit would be made and current value is higher than this good usual settle value (10*goods id + bank level - 1)


To install with TamperMonkey, use the following:

```javascript
{
// ==UserScript==
// @name         EZStocks
// @namespace    EZStocks
// @version      1.0
// @description  Display purchase and profit information for the CookieClicker Dough Jones.
// @author       Hizin
// @include http://orteil.dashnet.org/cookieclicker/
// @include https://orteil.dashnet.org/cookieclicker/
// @grant        none
// ==/UserScript==

var code = "(" + (function() {
    var checkReady = setInterval(function() {
        if (typeof Game.ready !== 'undefined' && Game.ready) {
            Game.LoadMod('https://darthpilou.github.io/cctest/cctest.js');
            clearInterval(checkReady);
        }
    }, 1000);
}).toString() + ")()";

window.eval(code);
}
```

Or paste the following into the url field for a bookmark.

```javascript
{
javascript:(function() {
    Game.LoadMod('https://darthpilou.github.io/cctest/cctest.js');
}());
}
```
