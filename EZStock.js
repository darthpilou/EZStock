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
        <tr id="EZStock-0" style="opacity:.4">
            <td>CRL</td>
            <td class="EZStock-ba"><span class="EZStock-low">$0.00</span></td><td>&nbsp;</td>
            <td><div class="EZStock-progress"><div class="EZStock-bar1"><div class="EZStock-bar2">&nbsp;</div></div></div></td>
            <td><span class="EZStock-high">$0.00</span></td>
            <td><span>|</span></td>
            <td><span class="EZStock-profit">$0.00</span></td>
        </tr>
        <tr id="EZStock-1" style="opacity:.4">
            <td>CHC</td>
            <td class="EZStock-ba"><span class="EZStock-low">$0.00</span></td><td>&nbsp;</td>
            <td><div class="EZStock-progress"><div class="EZStock-bar1"><div class="EZStock-bar2">&nbsp;</div></div></div></td>
            <td><span class="EZStock-high">$0.00</span></td>
            <td><span>|</span></td>
            <td><span class="EZStock-profit">$0.00</span></td>
        </tr>
        <tr id="EZStock-2" style="opacity:.4">
            <td>BTR</td>
            <td class="EZStock-ba"><span class="EZStock-low">$0.00</span></td><td>&nbsp;</td>
            <td><div class="EZStock-progress"><div class="EZStock-bar1"><div class="EZStock-bar2">&nbsp;</div></div></div></td>
            <td><span class="EZStock-high">$0.00</span></td>
            <td><span>|</span></td>
            <td><span class="EZStock-profit">$0.00</span></td>
        </tr>
        <tr id="EZStock-3" style="opacity:.4">
            <td>SUG</td>
            <td class="EZStock-ba"><span class="EZStock-low">$0.00</span></td><td>&nbsp;</td>
            <td><div class="EZStock-progress"><div class="EZStock-bar1"><div class="EZStock-bar2">&nbsp;</div></div></div></td>
            <td><span class="EZStock-high">$0.00</span></td>
            <td><span>|</span></td>
            <td><span class="EZStock-profit">$0.00</span></td>
        </tr>
        <tr id="EZStock-4" style="opacity:.4">
            <td>NUT</td>
            <td class="EZStock-ba"><span class="EZStock-low">$0.00</span></td><td>&nbsp;</td>
            <td><div class="EZStock-progress"><div class="EZStock-bar1"><div class="EZStock-bar2">&nbsp;</div></div></div></td>
            <td><span class="EZStock-high">$0.00</span></td>
            <td><span>|</span></td>
            <td><span class="EZStock-profit">$0.00</span></td>
        </tr>
        <tr id="EZStock-5" style="opacity:.4">
            <td>SLT</td>
            <td class="EZStock-ba"><span class="EZStock-low">$0.00</span></td><td>&nbsp;</td>
            <td><div class="EZStock-progress"><div class="EZStock-bar1"><div class="EZStock-bar2">&nbsp;</div></div></div></td>
            <td><span class="EZStock-high">$0.00</span></td>
            <td><span>|</span></td>
            <td><span class="EZStock-profit">$0.00</span></td>
        </tr>
        <tr id="EZStock-6" style="opacity:.4">
            <td>VNL</td>
            <td class="EZStock-ba"><span class="EZStock-low">$0.00</span></td><td>&nbsp;</td>
            <td><div class="EZStock-progress"><div class="EZStock-bar1"><div class="EZStock-bar2">&nbsp;</div></div></div></td>
            <td><span class="EZStock-high">$0.00</span></td>
            <td><span>|</span></td>
            <td><span class="EZStock-profit">$0.00</span></td>
        </tr>
        <tr id="EZStock-7" style="opacity:.4">
            <td>EGG</td>
            <td class="EZStock-ba"><span class="EZStock-low">$0.00</span></td><td>&nbsp;</td>
            <td><div class="EZStock-progress"><div class="EZStock-bar1"><div class="EZStock-bar2">&nbsp;</div></div></div></td>
            <td><span class="EZStock-high">$0.00</span></td>
            <td><span>|</span></td>
            <td><span class="EZStock-profit">$0.00</span></td>
        </tr>
        <tr id="EZStock-8" style="opacity:.4">
            <td>CNM</td>
            <td class="EZStock-ba"><span class="EZStock-low">$0.00</span></td><td>&nbsp;</td>
            <td><div class="EZStock-progress"><div class="EZStock-bar1"><div class="EZStock-bar2">&nbsp;</div></div></div></td>
            <td><span class="EZStock-high">$0.00</span></td>
            <td><span>|</span></td>
            <td><span class="EZStock-profit">$0.00</span></td>
        </tr>
        <tr id="EZStock-9" style="opacity:.4">
            <td>CRM</td>
            <td class="EZStock-ba"><span class="EZStock-low">$0.00</span></td><td>&nbsp;</td>
            <td><div class="EZStock-progress"><div class="EZStock-bar1"><div class="EZStock-bar2">&nbsp;</div></div></div></td>
            <td><span class="EZStock-high">$0.00</span></td>
            <td><span>|</span></td>
            <td><span class="EZStock-profit">$0.00</span></td>
        </tr>
        <tr id="EZStock-10" style="opacity:.4">
            <td>JAM</td>
            <td class="EZStock-ba"><span class="EZStock-low">$0.00</span></td><td>&nbsp;</td>
            <td><div class="EZStock-progress"><div class="EZStock-bar1"><div class="EZStock-bar2">&nbsp;</div></div></div></td>
            <td><span class="EZStock-high">$0.00</span></td>
            <td><span>|</span></td>
            <td><span class="EZStock-profit">$0.00</span></td>
        </tr>
        <tr id="EZStock-11" style="opacity:.4">
            <td>WCH</td>
            <td class="EZStock-ba"><span class="EZStock-low">$0.00</span></td><td>&nbsp;</td>
            <td><div class="EZStock-progress"><div class="EZStock-bar1"><div class="EZStock-bar2">&nbsp;</div></div></div></td>
            <td><span class="EZStock-high">$0.00</span></td>
            <td><span>|</span></td>
            <td><span class="EZStock-profit">$0.00</span></td>
        </tr>
        <tr id="EZStock-12" style="opacity:.4">
            <td>HNY</td>
            <td class="EZStock-ba"><span class="EZStock-low">$0.00</span></td><td>&nbsp;</td>
            <td><div class="EZStock-progress"><div class="EZStock-bar1"><div class="EZStock-bar2">&nbsp;</div></div></div></td>
            <td><span class="EZStock-high">$0.00</span></td>
            <td><span>|</span></td>
            <td><span class="EZStock-profit">$0.00</span></td>
        </tr>
        <tr id="EZStock-13" style="opacity:.4">
            <td>CKI</td>
            <td class="EZStock-ba"><span class="EZStock-low">$0.00</span></td><td>&nbsp;</td>
            <td><div class="EZStock-progress"><div class="EZStock-bar1"><div class="EZStock-bar2">&nbsp;</div></div></div></td>
            <td><span class="EZStock-high">$0.00</span></td>
            <td><span>|</span></td>
            <td><span class="EZStock-profit">$0.00</span></td>
        </tr>
        <tr id="EZStock-14" style="opacity:.4">
            <td>RCP</td>
            <td class="EZStock-ba"><span class="EZStock-low">$0.00</span></td><td>&nbsp;</td>
            <td><div class="EZStock-progress"><div class="EZStock-bar1"><div class="EZStock-bar2">&nbsp;</div></div></div></td>
            <td><span class="EZStock-high">$0.00</span></td>
            <td><span>|</span></td>
            <td><span class="EZStock-profit">$0.00</span></td>
        </tr>
    </table>
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
            bought: 0,
            value: 0,
            profit: 0,
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

EZStock.updateProgressBar = (good,id,row) => {
	let range = EZStock.goods[id].highval-EZStock.goods[id].lowval;
	let width1 = 0;
	let width2 = 0;
	let color1 = "";
	let color2 = "";
	let colorprog = "transparent";
	let progress = row.querySelector('.EZStock-progress');
	let bar1 = row.querySelector('.EZStock-bar1');
	let bar2 = row.querySelector('.EZStock-bar2');
	let alignleft = "&nbsp;&nbsp;&nbsp;";
	let alignright = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
	let offset = "";
       	let ratio = (good.val-EZStock.goods[id].lowval)/(EZStock.goods[id].highval-EZStock.goods[id].lowval);
        let opac= 0.1;
	let rowback = "transparent";

	if(ratio < 0.5) 
		offset = alignright;
	else
		offset = alignleft;
	
	if (EZStock.goods[id].bought==0) {
		width1 = (good.val-EZStock.goods[id].lowval)/range*100;
		width2 = 100-500/(width1+0.001);
		color2 = "#0f141a";
		colorprog = "#405068";
		
		opac = 1-ratio;
		let red = Math.round(255*ratio);
		let green = Math.round(255*opac);
		color1 = "rgb(" + red.toFixed(0) + "," + green.toFixed(0)  + ", 0)";
		if(range<30 || opac<0.1)
			opac=0.1;
		if(ratio < 0.2 && range>30)
			rowback = "#3333FF"; 
	}
	else {
		opac = 0.3;
		color2 = "#405068";
		if(EZStock.goods[id].value>good.val) {
			width1 = (EZStock.goods[id].value-EZStock.goods[id].lowval)/range*100;
			width2 = (good.val-EZStock.goods[id].lowval)/(EZStock.goods[id].value-EZStock.goods[id].lowval)*100;
			color1 = "#f21e3c";
		}
		else {
			opac = 0.5;
			width1 = (good.val-EZStock.goods[id].lowval)/range*100;
			width2 = (EZStock.goods[id].value-EZStock.goods[id].lowval)/(good.val-EZStock.goods[id].lowval)*100;
			color1 = "#73f21e";
			if (EZStock.goods[id].profit > 25000) {
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
	bar2.innerHTML = offset + EZStock.formatPrice(good.val,false);
};

EZStock.update = () => {
    if (EZStock.bank.amount == 0)
        EZStock.initializeGoods();

    let table = document.getElementById('EZStockTable');

    EZStock.minigameGoods.map((good, id) => {
        let bought = EZStock.goods[id].bought;
        if (good.stock == 0)
            EZStock.goods[id].bought = 0;
        EZStock.goods[id].profit = (good.val * bought) - (EZStock.goods[id].value * bought);
        EZStock.goods[id].lowval = good.val < EZStock.goods[id].lowval ? good.val : EZStock.goods[id].lowval;
        EZStock.goods[id].highval = good.val > EZStock.goods[id].highval ? good.val : EZStock.goods[id].highval;

        let row = table.querySelector(`#EZStock-${id}`);
	    
		EZStock.updateProgressBar(good,id,row);
        row.querySelector('.EZStock-low').innerHTML = EZStock.formatPrice(EZStock.goods[id].lowval, false);
        row.querySelector('.EZStock-high').innerHTML = EZStock.formatPrice(EZStock.goods[id].highval, false);
	    let buy = (bought) => {
		EZStock.goods[id].bought = bought;
		EZStock.goods[id].value = bought == 0 ? 0 : good.val;
	    };
			
		if (EZStock.goods[id].bought > 0) {
			let buttonsellHTML = '<div id="fastsell-'+id+'" style="border:solid 1px width:20px;" >'+ 
			    			EZStock.formatPrice(EZStock.goods[id].profit,true)+'</div>'
			row.querySelector('.EZStock-profit').innerHTML = buttonsellHTML;
			AddEvent(l('fastsell-'+id),'click',function(id){return function(e){
				if (EZStock.bank.minigame.sellGood(id,10000)) Game.SparkleOn(e.target);
			}}(id));
			l('fastsell-'+id).addEventListener('click', () => {
                		buy('All' > good.stock ? 'All' : good.stock);
            		});
			
		}
		else {
			let buttonbuyHTML = '<div id="fastbuy-'+id+'" style="border:solid 1px" >Buy</div>'
			row.querySelector('.EZStock-profit').innerHTML = buttonbuyHTML;
			AddEvent(l('fastbuy-'+id),'click',function(id){return function(e){
				if (EZStock.bank.minigame.buyGood(id,10000)) Game.SparkleOn(e.target);
			}}(id));			
			l('fastbuy-'+id).addEventListener('click', () => {
                		buy('-Max' > good.stock ? '-Max' : good.stock);
            		});
		}
    });

    let serialized = btoa(JSON.stringify(EZStock.goods));
    EZStock.setCookie('EZStock_Data', serialized);
}

EZStock.initializeGoods();

EZStock.minigameGoods.map((good, id) => {
    let buy = (bought) => {
        EZStock.goods[id].bought = bought;
        EZStock.goods[id].value = bought == 0 ? 0 : good.val;
        EZStock.update();
    };

    let buttons = ['1','10','100','Max','-1','-10','-100','-All'];
    buttons.map((b) => {
        let _id = 'bankGood-' + id + '_' + b;
        document.getElementById(_id)
            .addEventListener('click', () => {
                buy(b > good.stock ? b : good.stock);
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
