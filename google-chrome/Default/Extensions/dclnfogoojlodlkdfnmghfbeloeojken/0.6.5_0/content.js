const selectors = {
	docid: 'a[contains(@href, "/store/apps/details?id=")]',
	track: '[property="hasPart"][typeof="MusicRecording"]',
	artist: '[property="byArtist"] [property="name"]',
	title: '[property="name"]:not(.artist)'
};
let stats = {'installs': 0, 'total': 0, 'released': 0, 'updated': 0};
let tpl_downloads = {
	1: [1, 'yellow'],
	5: [2, 'yellow'],
	10: [3, 'yellow'],
	50: [5, 'yellow'],
	100: [8, 'yellow'],
	500: [10, '#ffeb3b'],
	1000: [15, '#ffeb3b'],
	5000: [20, '#cddc39'],
	10000: [25, '#cddc39'],
	50000: [30, '#8bc34a'],
	100000: [35, '#8bc34a'],
	500000: [40, '#4caf50'],
	1000000: [50, '#4caf50'],
	5000000: [60, 'green'],
	10000000: [70, 'green'],
	50000000: [80, '#673ab7'],
	100000000: [90, '#673ab7'],
	500000000: [96, 'black'],
	1000000000: [100, 'black'],
};
let colors={
	0:'#eeeeee',
	// d:'#e9ffde',
	d:'#a8ff5c',
//        m:'#ffffaa',
	m:'#FEFF7F',
	// y:'#fff1f1',
	y:'#fda9a9',
	t:'#d2e5f9',
};
let plan;
let extracttm;
const log = (t, l) => {
	if (l)
		console.log(t)
};
function getCountry() {
	let p=window.location.search.search('&gl=');
	if (p > 0) {
		return window.location.search.substr(p+4, 2);
	}
	let qs = document.querySelectorAll('span[class="footer-item"]');
	if (qs.length===3 && qs[1].innerHTML.search(':') > 0) {
		return qs[1].innerHTML.split(':')[1].trim();
	}
}

function short(value) {
	if (value >= 1000000000)
		return Math.round(value / 1000000000) + 'B';
	if (value >= 1000000)
		return Math.round(value / 1000000) + 'M';
	if (value >= 1000)
		return Math.round(value / 1000) + 'K';
	return value;
}
function age(value) {
	value = (new Date().getTime() - new Date(value).getTime())/86400000;
	if (value >= 365)
		return Math.round(value / 365) + ' y';
	if (value >= 30)
		return Math.round(value / 30) + ' m';
	return Math.round(value) + ' d';
}
function getRating(app) {
	let more = [];
	if (app['ratingValue'])
		more.push('<b>'+app['ratingValue'] + '</b>');
	if (app['pay'])
		more.push('inapp');
	if (app['inapp'])
		more.push('iap');
	if (app['ads'])
		more.push('ads');
	return more.join(' ');
}
function getHtmlCard(app, q, titleElement, devElement, ratingElement) {
	let html = '<ul>';
	if (app) {
		if (devElement && app['developer'] && app['developer']['apps']) {
			devElement.innerHTML += '<div align="right" style="background-color:'+colors.d+';top:1px;right:0px;padding:0px 3px;position:absolute;">' + app['developer']['apps'] + ' > ' + short(app['developer']['installs']) + '</div>';
		}

		if (titleElement && q) {
			let title = titleElement.innerText;
			if (title.toLocaleLowerCase() === q) {
				titleElement.style.backgroundColor = 'green';
			}
			else if (title.toLocaleLowerCase().indexOf(q) >= 0) {
				titleElement.style.backgroundColor = '#d0ffd0';
			}
		}

		if (app['positions'] && app['positions'].length) {
			for (let j = 0; j < 1; j++) { // app['positions'].length
				html += '<li>' + '#' + app['positions'][j]['pos'] + ' in ' + app['positions'][j]['category']['name'];
			}
		}
		else {
			html += "<li>" + (app['category'] ? app['category'] : 'updating...') + "</li>";
		}
		let url = 'https://appstorespy.com/pricing?utm_source=google&utm_medium=extension&utm_campaign=card';
		let premium = '<a href="'+url+'" target="_blank">🔒</a>';
		if (app['installs'])
			if (tpl_downloads[app['installs']])
				html += '<li><div title="'+app['installs'] +'" style="width:'+tpl_downloads[app['installs']][0]+'%;height:3px;background-color: '+tpl_downloads[app['installs']][1]+';">&nbsp;</div></li>';
			else
				html += '<li><div title="'+app['installs'] +'" style="width: 1%;height: 3px;background-color: grey;">&nbsp;</div></li>';
		html += '<li>'+(app['installs']?'<div style="float: left">' + short(app['installs']) +' <span style="color: grey;font-size: smaller">installs</span></div>' + (app['pace'] ? '<div style="float:right"><span style="color: grey;font-size: smaller">per day</span> '+(app['pace'] === true?premium:short(app['pace']))+'</div>':''):'&nbsp;') + '<div style="clear:both"></div></li>';
		html += '<li>'+(app['released'] ? '<div style="float: left" title="'+app['released']+'">' + age(app['released']) +' <span style="color: grey;font-size: smaller">release</span></div>': '&nbsp;') + (app['updated'] ? '<div style="float:right"><span style="color: grey;font-size: smaller">update</span> ' + (app['updated'] ? age(app['updated']) : '') + '</div>':'&nbsp;')+'<div style="clear:both"></div></li>';
		html += '<li>' + (app['st'] ? (app['st']['revenue'] ? '<div style="float: left">' + (app['st']['revenue'] === true ? premium : '$'+short(app['st']['revenue'] * 1000)) + ' <span style="color: grey;font-size: smaller">revnu</span></div>' : '')+(app['st']['downloads'] ? '<div style="float:right"><span style="color: grey;font-size: smaller">dwnlds</span> ' + (app['st']['downloads'] === true ? premium : short(app['st']['downloads'] * 1000)) + '</div>': '') : '') + '&nbsp;<div style="clear:both"></div></li>';
		stats['installs'] += app['installs'];
		stats['total'] += 1;

		if (app['top']) {
			let top='';
			if (app['top']===true) {
				top='<a href="'+url+'" target="_blank" style="font-size: smaller">Country ranks 🔒</a>';
			}
			else {
			   let items = Object.keys(app['top']).map(function(key) {
				  return [key, app['top'][key]];
				});
				items.sort(function(first, second) {
				  return first[1]-second[1];
				});
			   html += '<li><div style="width: 140px;white-space:nowrap;float: left;">';
			   for (let r in items) {
					if (items[r][0]) {
						if (isSigned) {
						   let a=items[r][0] +':' + items[r][1] +' ';
						   if (top.length+a.length>23)
							   break;
						   top +=a;
						}
						else {
					       top=items[r][0]+':'+' <span class="auth">Login to see rank</span>';
						   break;
						}
					}
					else {
					   top +=' <a href="'+url+'" target="_blank" style="font-size: smaller">More in Premium 🔒</a>';
					   break;
					}
			   }
			}
		   html += (top ? top : '&nbsp;')+'</div><div style="clear:both"></div></li>';
		}
		else
		   html += "<li>&nbsp;</li>";

		if (ratingElement) {
			ratingElement.innerHTML = getRating(app);
			let links = document.createElement('div');
			links.style.cssFloat='right';
			links.innerHTML = '<a href="https://appstorespy.com/d/'+app['docid']+'" target="_blank"><img src="'+chrome.runtime.getURL("asodigger16.png")+'" width="16" height="16" alt="Visit app page at Appstorespy"></a>';
			ratingElement.parentElement.parentElement.parentElement.append(links)
		}
	} else {
		html += '<li>no data</li>';
	}
	html += '</ul>';

	return html;
}
/*
function getElementsByXPath(xpath, parent)
{
  let results = [];
  let query = document.evaluate(xpath,
	  parent || document,
	  null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for (let i=0, length=query.snapshotLength; i<length; ++i) {
	results.push(query.snapshotItem(i));
  }
  return results;
}
*/
/*
    function show_stats() {
	    if (document.getElementById('summary')) {
            document.getElementById('summary').innerHTML = "AVG downloads: "+stats['installs_avg']+"; Total apps:"+stats['total'];
        }
    }
*/
let pause=null;
function display(response) {
	if (response === undefined) {
		log('undefined', 1);
		return
	}
	if (response.hasOwnProperty('message')) {
		log(response.message, 1);
        toast(response.message);
	}
	data = response;
	// if (data)
	// 	log("Embed: "+Object.keys(data).length, 1);
	let version=2;
	let q = document.querySelector("input[name=q]").value.toLocaleLowerCase();
	let cards_added=0;

	function embedone(el) {
		let docid = el.getAttribute('href').replace('/store/apps/details?id=', '');
		log(docid);
		if (el.parentElement.getAttribute('data-playbar'))
			return;
		if (el.querySelector('div[class="reason-set-star-rating"]'))
			version = 1;
		else
			version = 2;

		if (version === 1)
			el.parentElement.parentElement.parentElement.parentElement.style.height = '335px';
		else
			el.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.style.height = '335px';

		let cover = document.createElement('div');
		cover.classList.add('playbar'+version);
		cover.style.width = '100%';
		let ratingElement, titleElement,devElement;
		if (version === 2) {
			cover.style.display = 'table-row';
			ratingElement = el.parentElement.parentElement.parentElement.parentElement.parentElement.querySelector('div[role="img"]');
			titleElement = el.querySelector('div');
			devElement = el.parentElement.parentElement.querySelector('a[href*="/store/apps/dev"] > div');
			if (devElement) {
				try {
					devElement.parentElement.parentElement.querySelector('div > div').remove()
				} catch (e) {
				}
			}
		}
		else {
			ratingElement = el.getElementsByClassName('reason-set-star-rating').length ?
				el.getElementsByClassName('reason-set-star-rating')[0] :
				(el.getElementsByClassName('reason-set').length ?
						el.getElementsByClassName('reason-set')[0] :
						null);
			titleElement = el.parentElement.parentElement.parentElement.querySelector('div[class="details"] > div[class="title"]');

			devElement = el.parentElement.parentElement.parentElement.querySelector('div[class="details"] > div[class="subtitle-container"]')
		}

		if (data[docid] === undefined) {
			if (!isSigned && cards_added>=5) {
				cover.style.backgroundColor = colors['0'];
				cover.innerHTML = '<ul class="auth"><li>&nbsp;</li><li>Subscribe to</li><li>Premium</li><li></li><li>&nbsp;</li></ul>';
				el.parentElement.parentElement.parentElement.appendChild(cover);
				el.parentElement.setAttribute('data-playbar', 1);
			}
//			log("Not found in data "+docid, 1)
			return
		}
		if (data[docid]) {
			cards_added++;

			let a = age(data[docid]['released']);
			cover.style.backgroundColor = colors[a[a.length - 1]];
			cover.innerHTML = getHtmlCard(data[docid], q, titleElement, devElement, ratingElement);
			el.parentElement.parentElement.parentElement.appendChild(cover);
			el.parentElement.setAttribute('data-playbar', 1);
		}
	}
	let list = Array.from(document.querySelectorAll('div[class="reason-set"]'))
		.filter(item=>item.offsetParent !== null)
		.map(item=>item.querySelector('a[href*="/store/apps/details?id="]'))  // parentElement.parentElement.
		.filter(item=>item)
		.map(item=>embedone(item));
	if (!list.length)
		list = Array.from(document.querySelectorAll('a[href*="/store/apps/details?id="] > div'))
			.filter(item=>item.offsetParent !== null)
			.map(item=>item.parentElement.parentElement.querySelector('a[href*="/store/apps/details?id="]'))  //
			.filter(item=>item)
			.map(item=>embedone(item));

	var els = document.getElementsByClassName("auth");
	Array.prototype.forEach.call(els, function(el) {
		el.addEventListener("click", function () {
			menu();
		});
	});
}
/*
const embed = data => (
	addCovers(data)
	// Array.from(document.querySelectorAll('div[role="img"]'))
	// 	.filter(item=>item.offsetParent !== null)
	// 	.map(item=>item.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement)
	// 	.map(item=>cover(item))
);
*/
const extract = doc => {
	let l = Array.from(document.querySelectorAll('div[class="cover"] > a'));
	if (!l.length)
		l = Array.from(document.querySelectorAll('a[href*="/store/apps/details?id="] > div'));
	return l.filter(item => item.offsetParent !== null)
		.map(item => item.parentElement.parentElement.querySelector('a[href*="/store/apps/details?id="]'))
		.filter(item => item)
		.map(item => item.getAttribute('href').replace('/store/apps/details?id=', ''))
};

const parser = new DOMParser();

const capture = () => {
	let docids = extract(document);
	if (docids.length > 0) {
		if (!isSigned && docids.length > 5) {
			docids = docids.slice(0, 5);
		}
		// log("Request: "+docids.length, 1);
		// log('Loading...')
//		is_loading=true;
		try {
			chrome.runtime.sendMessage({docids}, display)
		}catch (e) {
			log(e)
		}
	}
};
let authOpened=false;
const auth = () => {
	if (!authOpened) {
		authOpened = true;
		try {
			chrome.runtime.sendMessage('auth', function (result) {
				authOpened=false;
				if (result === 'ok') {
					checkIsSigned();
					alert("Please Reload This Page to activate new features")
				}
			})
		}catch (e) {
			log(e)
		}
	}
};
let isSigned=false;
const checkIsSigned = () => {
	try {
		chrome.runtime.sendMessage('isSigned', function (result) {
			isSigned = result;
		})
	}catch (e) {
		log(e)
	}
};
const menu=async()=>{
	try {
		chrome.runtime.sendMessage('openPopup', function (result) {
		})
	}catch (e) {
		log(e)
	}
}
const addbutton = async () => {
	el = document.getElementById('playbar');
	if (null === el) {
		t = document.querySelector('div[href="/settings"]');
		if (!t)
			t = document.querySelector('a[href="/settings"]');
		if (t) {
			let b1 = document.createElement('div');
			b1.className = t.className;
			let i = document.createElement('img');
			i.src = chrome.runtime.getURL("asodigger16.png");
			b1.appendChild(i);

			let b = document.createElement('div');
			b.innerText = 'Embed';
			b.id='playbar';
			b.className = t.parentElement.className+' playbar_button';
			b.addEventListener("click", function () {
				capture();
			});
			b1.appendChild(b);
			t.parentElement.parentElement.appendChild(b1);

			b1 = document.createElement('div');
			b1.className = t.className;
			i = document.createElement('img');
			i.src = chrome.runtime.getURL("asodigger16.png");
			b1.appendChild(i);

			b = document.createElement('div');
			b.innerText = 'AppstoreSpy';
			b.className = t.parentElement.className+' playbar_button';
			b.addEventListener("click", function () {
				menu();
			});
			b1.appendChild(b);
			t.parentElement.parentElement.appendChild(b1);
		}
	}
};
const inject_beamer = async () => {
	(function (i, s, o, g) {
		a = s.createElement(o),
			m = s.getElementsByTagName(o)[0];
		a.text = "var beamer_config = {\n" +
			"\tproduct_id : 'xYxGNoQi26386'\n" +
			"};\n";
		m.parentNode.insertBefore(a, m)
		a = s.createElement(o),
			m = s.getElementsByTagName(o)[0];
		a.defer = 1;
		a.src = g;
		m.parentNode.insertBefore(a, m)
	})(window, document, 'script', 'https://app.getbeamer.com/js/beamer-embed.js');
};
const inject_play = async () => {
	checkIsSigned();
	let observer = new MutationObserver(function (mutationsList) {
//           log(lock, mutationsList)
		for (let mutation of mutationsList) {
			if (mutation.type === 'childList') {
				if (extracttm)
					clearTimeout(extracttm);
				extracttm=setTimeout(function(){ clearTimeout(extracttm);addbutton();capture()}, 200);
			}
			else if (mutation.type === 'attributes') {
				if (extracttm)
					clearTimeout(extracttm);
				extracttm=setTimeout(function(){clearTimeout(extracttm);addbutton();capture()}, 200);
			}
		}
	});
	observer.observe(document.querySelector('body'), {attributes: true, childList: true});
	observer.observe(document.querySelector('head'), {attributes: true, childList: true});

	new MutationObserver(function(mutations) {
		msg({command:'pageview'})
	}).observe(
		document.querySelector('title'),
		{childList:true}
	);
	addbutton()
//	inject_beamer();
};
const pageview = async() => {
	msg({command:'pageview'})
}
const msg = async (d) => {
	try {
		chrome.runtime.sendMessage(d, function (result) {
	})
	}catch (e) {
		log(e)
	}
};
const inject_appstorespy = async () => {
	let accessToken = document.getElementsByName('appstorespy')[0].getAttribute('content');
	if (accessToken) {
		try {
			chrome.runtime.sendMessage({command:'saveToken', accessToken:accessToken}, function (result) {
		})
		}catch (e) {
			log(e)
		}
	}
};
const run = async () => {
	if (document.getElementsByName('appstorespy').length) {
		inject_appstorespy();
	}
	else {
		inject_play();
	}
	pageview();
};
const toast=async(message,t=10000)=>{
    let x=document.getElementById('playspytoast');
    if (x)x.remove();
    x=Object.assign(document.createElement('div'),{id:'playspytoast'});
    Object.assign(x.style,{textAlign:'right',color:'red','font-size':'larger','font-weight':'bold','position': 'relative','z-index':'9999','margin-top':'10px'});
    x.appendChild(Object.assign(document.createElement('img'),{src:chrome.runtime.getURL("asodigger16.png")}));
    if (message.indexOf('https://') === 0) {
    	let a=message.split('|');
		let a1=Object.assign(document.createElement('a'),{href:a[0],innerText:a[1]});
		x.appendChild(Object.assign(document.createElement('span')));
	    x.appendChild(a1);
	} else {
	    x.appendChild(Object.assign(document.createElement('span'),{innerText:message}));
	}
	document.querySelector('div[role="navigation"]').appendChild(x);
    setTimeout(function(){ x.remove(); }, t);
};
run().catch(error => {
	console.error(error)
});
