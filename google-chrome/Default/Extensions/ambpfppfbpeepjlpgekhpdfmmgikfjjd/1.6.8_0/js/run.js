window.addEventListener("message",function(event){if(event.data.csrfToken&&chrome.storage.local.get("ezusy_step",function(a){void 0!==a.ezusy_step&&a.ezusy_step&&chrome.storage.local.get("order",function(a){if(void 0!==a.order){var b=a.order,c='<div class="ezusy-box-notice">';c+='<h3 class="ezusy-box-header">Fulfil Orders Automatically</h3>',c+='<h3 class="ezusy-box-notice-head ezusy-current">1. Add to cart</h3>',$.each(b,function(a,b){var d="Adding to cart";c+='<div class="ezusy-box-notice-item">',c+='<div class="ezusy-box-notice-image"><img src="'+b.img.replace(".jpg",".jpg_50x50.jpg")+'" /></div>',c+='<div class="ezusy-box-notice-title">',c+="<strong>"+b.title.substring(0,20)+"...</strong>",b.added&&(d='<span class="ezusy-finished">Added to cart'),c+='<p data-url="'+b.url+'" id="ezusy-product-'+b.id+'">'+d+"</p>",c+="</div>",c+="</div>"}),c+='<p id="ezusy-box-message"></p>',c+='<h3 class="ezusy-box-notice-head">2. Delete address</h3>',c+='<h3 class="ezusy-box-notice-head">3. Select shipping method</h3>',c+='<h3 class="ezusy-box-notice-head">4. Checkout</h3>',c+='<h3 class="ezusy-box-notice-head">5. Confirm & Pay</h3>',c+="<p><a style='float:right' href='javascript:void(0)' id='ezusy-cancel'>Cancel this Fulfil!</a></p>",c+="</div>",$("body").append(c),$.each(b,function(a,b){var c=b.sku;c.indexOf("@")>=0&&(c=b.sku.split("@"),c=c[0]);b.cart;c=c?c.replace(/ /g,"%20"):"",$.ajax({url:"https://shoppingcart.aliexpress.com/addToShopcart4Js.htm",type:"POST",dataType:"jsonp",jsonpCallback:"addtocart("+b.id+")",data:{productId:b.id,quantity:b.quantity,promiseId:"",country:$("#userCountryCode").val(),company:"Other",itemCondition:"",cartfrom:"main_detail",skuAttr:c,_csrf_token_:event.data.csrfToken}})})}})}),"sync_woo"==event.data.type){var list=event.data;chrome.runtime.sendMessage({ajax:"sync_woo",list:list})}if("ezusy_addcart"==event.data.type&&chrome.storage.local.get("order",function(a){if(void 0!==a.order){var b=a.order,c=!0,d={};$.each(b,function(a,c){c.id==event.data.product_id&&event.data.response.shopcart_now_num>-1&&event.data.response.shopcart_limit_num>-1&&(b[a].added=!0,d={status:!0,custom_note:c.custom_note,override_phone:c.override_phone,default_shipping:c.default_shipping})}),chrome.storage.local.set({order:b},function(){$.each(b,function(a,b){console.log(b),b.added||(c=!1,b.affiurl?window.open(b.affiurl,"_self"):window.open(b.url,"_self"))}),c&&chrome.storage.local.set({ezusy_step:!1,adress:!0},function(){chrome.storage.local.set({cart_step:d,order:b,econfirm:{custom_note:d.custom_note},error:[],done_order:!1},function(){window.open("https://ilogisticsaddress.aliexpress.com/addressList.htm","_self",!0)})})})}}),"ezusy_import_app"==event.data.type&&jQuery(this).ezusy({product_url:event.data.data.url,product_image:event.data.data.image,product_title:event.data.data.title}),"import_split"==event.data.type&&jQuery(this).ezusy({product:event.data.data.item,opt:event.data.data.opt,options:event.data.data.options,product_url:event.data.data.url,product_image:event.data.data.image,product_title:event.data.data.title,split:event.data.data.split}),event.data.query&&"ezusy_search"==event.data.type&&(chrome.runtime.sendMessage({url:event.data.query,ajax:"ezusy_search",data:{},data_send:{method:"GET",headers:{"Content-Type":"application/x-www-form-urlencoded"}},type:"ezusy_search"}),chrome.runtime.onMessage.addListener(function(a,b,c){"ezusy_searched"==a.type&&window.postMessage(a,"*")})),event.data.type&&"ezusy_order"==event.data.type){var city=event.data.orders.shipping.city;chrome.storage.local.set({ezusy_current:event.data.ezusy_current,order:event.data.orders.items,billing:event.data.orders.billing,shipping:event.data.orders.shipping,city:city},function(a){});var order=event.data.orders;order.items[0].url&&chrome.storage.local.set({ezusy_step:"eproduct"},function(){order.items[0].affiurl?window.open(order.items[0].affiurl,"_blank"):window.open(order.items[0].url,"_blank")})}if(event.data.type&&"findUpdate"==event.data.type){var getdata=function(obj){var product_link="https://www.aliexpress.com/item/xxx/"+obj.product_id+".html";$.ajax(product_link).done(function(response){var data=$(response),script;if(data.find("script").each(function(){$(this).text().indexOf("PAGE_TIMING")<0&&(script+=$(this).text())}),script=script.replace("var AEConflict = ctl.noConflict();",""),script=script.replace('AEConflict.config("PC");',""),eval(script),"undefined"!=typeof skuProducts){var sku=skuProducts,text=window.runParams,options={};data.find("#j-product-info-sku .p-property-item").each(function(){var a,b,c=jQuery(this),d={},e=c.find(".p-item-title").text();c.find("li").each(function(){var c,e=jQuery(this),f="";c=e.find("a").attr("data-sku-id"),f=void 0===e.find("a").attr("title")?e.find("a").text():e.find("a").attr("title"),void 0!==e.find("img").attr("bigpic")&&(a=e.find("img").attr("bigpic"),b=e.find("img").attr("src")),d[c]={title:f,src:a,simg:b}}),options[e]=d});var desc=text.detailDesc,alii=text;alii.opts=options,alii.title=data.find(".product-name").text(),alii.description={},alii.description=data.find(".product-property-main .ui-box-body").html(),alii.description="<ul>"+alii.description+"</ul>";var des_element=$(alii.description);des_element.find("span").each(function(a){var b=$(this).text();$(this).replaceWith(b)}),des_element.find("li").each(function(a){$(this).removeAttr("id")});var newString=des_element.html();newString=newString.replace(/\s\s+/g," "),$.each(sku,function(a,b){var c=b.skuPropIds.split(",");sku[a].title=[],$.each(c,function(b,c){var d={},e=data.find('a[data-sku-id="'+c+'"]');"string"==typeof e.attr("title")&&(d.title=e.attr("title")),void 0===e.attr("title")&&(d.title=e.text()),"string"==typeof e.find("img").attr("bigpic")&&(d.img=e.find("img").attr("bigpic"),d.simg=e.find("img").attr("src"),sku[a].img=e.find("img").attr("bigpic"),sku[a].simg=e.find("img").attr("src")),sku[a].title[b]=d})}),alii.options=sku,alii.id=obj.id,alii.ali_url=data.find('meta[itemprop="url"]').attr("content"),$.ajax({url:"https://www.ezusy.com/wp-admin/admin-ajax.php?action=fix_update",method:"POST",cache:!1,data:JSON.stringify(alii),contentType:"application/json",dataType:"json"}).done(function(a){_list.splice(0,1),_list.length>0?getdata(_list[0]):document.dispatchEvent(new CustomEvent("csEvent",{detail:"continue"}))})}}).fail(function(){$.ajax({url:"https://www.ezusy.com/wp-admin/admin-ajax.php?action=remove_update",method:"POST",cache:!1,data:_list[0].id,contentType:"application/json",dataType:"json"}).done(function(a){_list.splice(0,1),_list.length>0?getdata(_list[0]):document.dispatchEvent(new CustomEvent("csEvent",{detail:"continue"}))})})},_list=event.data.data.list;getdata(_list[0])}event.source==window&&(event.data.type&&"ezusy_import"==event.data.type&&$(this).ezusy({product_url:event.data.href}),event.data.type&&"FROM_PAGE"==event.data.type&&$(this).ezusy({product_url:window.location.href}))},!1);var vars={},parts=window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(a,b,c){vars[b]=c});$("body").on("click","#ezusy-cancel",function(){chrome.storage.local.set({ezusy_step:!1},function(){window.location.reload()})}),chrome.storage.local.set({cart_step:!1,check_out_new:!1,check_out:!1,error:[],done_order:!1});