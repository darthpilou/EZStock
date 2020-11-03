// this mod is heavily based on a mod by Silentclowd found here: https://github.com/Nyhilo/KookieStocks

let EZStock = {
    setCookie: (cname, cvalue, exdays) => {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + encodeURIComponent(cvalue) + ";" + expires + ";path=/";
    },
    getCookie: (cname) => {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
    },
    saveData: {},
    bank: {},
	automate: false,
    minigameGoods: {},
    goods: {},
    initializeGoods: {},
    formatPrice: {},
    update: {},
    interval: {},
    container: {},
    drawInterval: {},
    drawLoop: {},
    canvasLastTop: 0,
    canvasLastLeft: 0,
    htmlTemplate: `
<div id="EZStock-container" style="position:absolute; left:24px;">
    <style>
        #EZStockTable {
            z-index: 10000;
            display: block;
            position: relative;
            color: #fff;
            background-color: rgba(0,0,0,.5);
            text-shadow: black -1px 0px, black 0px 1px, black 1px 0px, black 0px -1px;
            font-weight: bold;
            padding: 2px;
        }
        #EZStockTable tr {
            margin-bottom: 1px;
        }
        #EZStockTable td {
            width: 32;
        }
        #EZStockTable .EZStock-low {
		color: #4bf0b8;
		float: right
        }
        #EZStockTable .EZStock-progress {
		width: 96px;
	}
        #EZStockTable .EZStock-high {
		color: #a358ff;
        }
        #EZStockTable .EZStock-profit {
		float: right
        }
		
		
    </style>
    <table id="EZStockTable">
` +
['CRL','CHC','BTR','SUG','NUT','SLT','VNL','EGG','CNM','CRM','JAM','WCH','HNY','CKI','RCP','SBD'].map((abbrev, index) => {
    return (
`<tr id="EZStock-${index}" style="opacity:.4">
    <td>${abbrev}</td>
    <td class="EZStock-ba"><span class="EZStock-low">$0.00</span></td><td>&nbsp;</td>
    <td><div class="EZStock-progress"><div class="EZStock-bar1"><div class="EZStock-bar2">&nbsp;</div></div></div></td>
    <td><span class="EZStock-high">$0.00</span></td>
    <td><span class="EZStock-move"></span></td>
    <td><span class="EZStock-profit">$0.00</span></td>
</tr>`);
}).join('\n') +
`    </table>
</div>
`
};

document.getElementById('sectionMiddle')
    .insertAdjacentHTML('beforeend', EZStock.htmlTemplate);

EZStock.initializeGoods = () => {
    EZStock.minigameGoods.map((good, id) => {
        EZStock.goods[id] = {
		name: good.name,
		lowval: 1000,
		highval: 0,
		delta: 0,
		streak: 1,
		bought: 0,
		value: 0,
        };
    });
};

EZStock.bank = Game.ObjectsById[5];
EZStock.minigameGoods = EZStock.bank.minigame.goodsById;
EZStock.goods = Array(EZStock.minigameGoods.length);

// Attach position of div to canvas
// This is done this way because putting this table near the canvas breaks
// the draw loop for some reason
let getOffset = (el) => {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
};

EZStock.drawLoop = () => {
    if (Game.onMenu != "" || EZStock.bank.amount == 0 || EZStock.bank.muted || !EZStock.bank.onMinigame)
        document.getElementById('EZStock-container').style.visibility = 'hidden';
    else
        document.getElementById('EZStock-container').style.visibility = 'visible';

    var canvasRect = getOffset(document.getElementById('bankGraph'));
    if (canvasRect.top == EZStock.canvasLastTop)
        return;
    
    document.getElementById('EZStock-container').style.top = canvasRect.top + 'px';
};
EZStock.drawInterval = setInterval(EZStock.drawLoop, 10);

EZStock.formatPrice = (val, colored) => {
    let money = "";
    let style = "" ;
    if(colored == true) {
        let mval = val/1000;
	money = Math.abs(mval).toFixed(0).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "k";
	style = val >= 0 ? 'color:#73f21e;' : 'color:#f21e3c;' ;
    }
    else {
	money = val.toFixed(1).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
	style = "";
    }

    return `<span style="${style}">${money}</span>`;
};

EZStock.updateDisplay = (good,id) => {
	let row = document.getElementById('EZStockTable').querySelector(`#EZStock-${id}`);
	let curgood = EZStock.goods[id];
	let range = curgood.highval-curgood.lowval;
	let ratio = (good.val-curgood.lowval)/range;
	let low = row.querySelector('.EZStock-low');
	let high = row.querySelector('.EZStock-high');
	let progress = row.querySelector('.EZStock-progress');
	let bar1 = row.querySelector('.EZStock-bar1');
	let bar2 = row.querySelector('.EZStock-bar2');
	let move = row.querySelector('.EZStock-move');
	let profit = (good.val * curgood.bought) - (EZStock.goods[id].value * curgood.bought);
	let profitbar = row.querySelector('.EZStock-profit');
	let width1 = 0;
	let width2 = 0;
	let color1 = "";
	let color2 = "";
	let colorprog = "transparent";
	let offset = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
	let opac= 0.1;
	let rowback = "transparent";
	let profitHTML = "";
	let settle = (id+1)*10+Game.Objects['Bank'].level-1;

	let dirchar = curgood.delta > 0 ? "►" : "◄";

	if (curgood.bought==0) {
		width1 = ratio*100;
		width2 = 100-300/(width1+0.001);
		color2 = "#0f141a";
		colorprog = "#405068";
		
		opac = 1-ratio;
		let red = Math.round(255*ratio);
		let green = Math.round(255*opac);
		color1 = "rgb(" + red.toFixed(0) + "," + green.toFixed(0)  + ", 0)";
		if(range<30 || opac<0.1)
			opac=0.1;
		if (good.val < (0.3+0.02*id)*settle)
			rowback = "#3333FF"; 
		if (good.val < (0.15+0.02*id)*settle)
			rowback = "#6666FF"; 
	}
	else {
		opac = 0.3;
		color2 = "#405068";
		profitHTML = EZStock.formatPrice(profit,true);
		if(good.val-curgood.value <0) {
			width1 = (curgood.value-curgood.lowval)/range*100;
			width2 = (good.val-curgood.lowval)/(curgood.value-curgood.lowval)*100;
			color1 = "#f21e3c";
		}
		else {
			opac = 0.5;
			width1 = (good.val-curgood.lowval)/range*100;
			width2 = (curgood.value-curgood.lowval)/(good.val-curgood.lowval)*100;
			color1 = "#73f21e";
			if (good.val>settle) {
				opac = 1;
				rowback = "#9933FF";
			}
		}
	}
	
	row.style.background = rowback;
	row.style.opacity = opac;
	progress.style.background = colorprog;	
	bar1.style.width = width1.toFixed(0) + "%";	
	bar1.style.background = color1;	
	bar2.style.width = width2.toFixed(0) + "%";	
	bar2.style.background = color2;	
	if ( curgood.value > 0 ) 
		bar2.innerHTML = offset + EZStock.formatPrice(curgood.value, false);
	else
		bar2.innerHTML = offset;
	low.innerHTML = EZStock.formatPrice(curgood.lowval, false);
	high.innerHTML = EZStock.formatPrice(curgood.highval, false);
	profitbar.innerHTML = profitHTML;
	move.innerHTML = dirchar;
};

EZStock.automated = (good,id) => {
	let curgood = EZStock.goods[id];
	let range = curgood.highval-curgood.lowval;
	let buysell = false;
	let msg = "";
	let _id = "";
	let settle = (id+1)*10+Game.Objects['Bank'].level-1;

	if (curgood.bought==0) {
		if(range>30) {
			if ( Math.abs(good.val-curgood.lowval) <0.01 )
				buysell = true;
			if(curgood.delta > 0) {
				if (good.val < (0.15+0.02*id)*settle)
					buysell =true;
				if (good.val < (0.3+0.02*id)*settle && (curgood.streak >2 || curgood.delta > 10 ))
					buysell =true;
			}
		}
		if (buysell == true) {
			msg = " autobought " + curgood.name + " for " + good.val.toFixed(2).toString();
			_id = 'bankGood-'+ id +'_Max';
		}
	}
	else {
		if(good.val-curgood.value > 0) {
			if (Math.abs(good.val-curgood.highval) < 0.01)
				buysell = true;
			if(curgood.delta < 0) {
				if (good.val>settle+10)
					buysell =true;
				if (good.val>settle && (curgood.streak >1 || curgood.delta < -5))
					buysell =true;
			}
			if (buysell == true) {
				let profit = ((good.val * curgood.bought) - (EZStock.goods[id].value * curgood.bought))/1000; 
				msg = " autosold " + curgood.name + " for " + good.val.toFixed(2).toString() + " profit:" + profit.toFixed(0).toString() + "k";
				_id = 'bankGood-'+ id +'_-All';
			}
		}
	}
	if ( buysell == true) {
		let today = new Date();
		let time = today.getHours() + ":" + today.getMinutes();
		let prevbought = curgood.bought;
		document.getElementById(_id).click();
		if ( curgood.bought != prevbought)
			console.log(time + msg);
	}
	
}

EZStock.update = () => {
    if (EZStock.bank.amount == 0)
        EZStock.initializeGoods();
	EZStock.minigameGoods.map((good, id) => {
        let bought = EZStock.goods[id].bought;
        if (good.stock == 0)
            EZStock.goods[id].bought = 0;
        EZStock.goods[id].lowval = good.val < EZStock.goods[id].lowval ? good.val : EZStock.goods[id].lowval;
        EZStock.goods[id].highval = good.val > EZStock.goods[id].highval ? good.val : EZStock.goods[id].highval;
		if (Math.abs(EZStock.goods[id].delta-EZStock.bank.minigame.goodDelta(id))>0.01) {
			if(EZStock.goods[id].delta*EZStock.bank.minigame.goodDelta(id) >= 0)
				EZStock.goods[id].streak++;
			else
				EZStock.goods[id].streak = 1;
			EZStock.goods[id].delta = EZStock.bank.minigame.goodDelta(id);
		}

		if (EZStock.automate == true )
			EZStock.automated(good,id);
		EZStock.updateDisplay(good,id);
    });

    let serialized = btoa(JSON.stringify(EZStock.goods));
    EZStock.setCookie('EZStock_Data', serialized);
}

EZStock.resetThresholds = () => {
	EZStock.minigameGoods.map((good, id) => {
		let newlow = Math.max(EZStock.goods[id].lowval,good.val-10);
		let newhigh = Math.min(EZStock.goods[id].highval,good.val+10);
		if ( EZStock.goods[id].value > 0.01 ) {
			newlow = Math.max(EZStock.goods[id].lowval,Math.min(EZStock.goods[id].value,good.val)-10);
			newhigh = Math.min(EZStock.goods[id].highval,Math.max(EZStock.goods[id].value,good.val)+10);
		}
		EZStock.goods[id].lowval = newlow;
		EZStock.goods[id].highval = newhigh;
	});
}

EZStock.initializeGoods();

EZStock.minigameGoods.map((good, id) => {
    let buy = () => {
		let curgood = EZStock.goods[id];
		if (good.stock !=  curgood.bought) {
			if( good.stock > curgood.bought ) {
				let newavg = (curgood.bought*curgood.value + (good.stock-curgood.bought)*good.val)/good.stock;
				curgood.value = newavg;
			}
			curgood.bought = good.stock;
			if (good.stock == 0)
				curgood.value = 0;
		}
    };

    let buttons = ['1','10','100','Max','-1','-10','-100','-All'];
    buttons.map((b) => {
        let _id = 'bankGood-' + id + '_' + b;
        document.getElementById(_id)
            .addEventListener('click', () => {
                buy();
            });
    });
});

// Load previous numbers
EZStock.saveData = EZStock.getCookie('EZStock_Data');

if (EZStock.saveData != '')
try {
    EZStock.goods = JSON.parse(atob(EZStock.saveData));
} catch {
    console.log("Failed to load EZStock save data.");
}

EZStock.interval = setInterval(EZStock.update, 1000);
