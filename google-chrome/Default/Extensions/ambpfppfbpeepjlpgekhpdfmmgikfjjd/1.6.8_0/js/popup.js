chrome.runtime.onMessage.addListener(function(a,b,c){}),$(document).ready(function(){$(".desc-settings").on("change",function(){var a=$(".desc-settings :selected").val();void 0!==a&&chrome.storage.local.set({full_des:a})})}),chrome.storage.local.get(["full_des"],function(a){void 0!==a.full_des&&$(".desc-settings").val(a.full_des)});