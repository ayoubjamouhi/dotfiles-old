var url=this.chrome.extension.getURL("images/button.png"),e=window.document.createElement("script"),push=this.chrome.extension.getURL("images/push.svg");e.id="ezusy.com",e.text='window.addtocart=function(e){return function(n){var t=document.getElementById("ezusy-product-"+e),o=document.getElementById("ezusy-cancel"),s=document.getElementById("ezusy-box-message");n.shopcart_limit_num>-1&&n.shopcart_now_num>-1?setTimeout(function(){window.postMessage({type:"ezusy_addcart",response:n,product_id:e},"*")},3e3):t.innerHTML="<span style=\'color:red;\'>This product was out</span>",s.innerHTML=""}},window.postMessage(window.runParams,"*");',window.document.head.appendChild(e),$("body").append('<div class="addproduct-section"><a id="addproduct" ><img style="width: 50px;" src="'+push+'" /></a></div>'),$("#addproduct").click(function(){var a=document.URL;a=a.split("?"),a=a[0],$("div#root").length<1?$(this).ezusy({product_url:a,product_image:$(".ui-image-viewer-thumb-frame img").attr("src"),product_title:$(".product-name").text()}):(a=a.replace("item/","item//"),$(".image-view-magnifier-wrap img.magnifier-image").length>0?$(this).ezusy({product_url:a,product_image:$(".image-view-magnifier-wrap img.magnifier-image").attr("src"),product_title:$(".product-info .product-title").text()}):$(this).ezusy({product_url:a,product_image:$("img#poster").attr("src"),product_title:$(".product-info .product-title").text()}))}),window.addEventListener("message",function(a){a.data.error&&($(".ezusy_message").show(),$(".ezusy-cart").show())}),$(".ezusy_close").click(function(){$(".ezusy_message").hide()});