(function($){"use strict";var clickedURL;$.fn.isExternal=function(){var host=window.location.hostname;var link=$("<a>",{href:this.attr("href"),})[0].hostname;return link!==host;};function trapFocus(){$(".close-modal").focus();var focusableEls=document.querySelectorAll('.wp-post-modal a[href]:not([disabled]), .wp-post-modal button:not([disabled]), .wp-post-modal textarea:not([disabled]), .wp-post-modal input[type="text"]:not([disabled]), .wp-post-modal input[type="radio"]:not([disabled]), .wp-post-modal input[type="checkbox"]:not([disabled]), .wp-post-modal select:not([disabled])'),firstFocusableEl=focusableEls[0],lastFocusableEl=focusableEls[focusableEls.length-1];document.addEventListener("keydown",function(e){var isTabPressed=e.key==="Tab"||e.keyCode===9;if(!isTabPressed)return;if(e.shiftKey&&isTabPressed){if(document.activeElement===firstFocusableEl){lastFocusableEl.focus();e.preventDefault();}}else if(isTabPressed){if(document.activeElement===lastFocusableEl){firstFocusableEl.focus();e.preventDefault();}}});}
function popupOpen(){return $(".modal-wrapper").hasClass("show");}
function basename(path,suffix){var b=path;var lastChar=b.charAt(b.length-1);if(lastChar==="/"||lastChar==="\\"){b=b.slice(0,-1);}
b=b.replace(/^.*[/\\]/g,"");if(typeof suffix==="string"&&b.substr(b.length-suffix.length)===suffix){b=b.substr(0,b.length-suffix.length);}
return b;}
var getUrlParameter=function getUrlParameter(sParam){var sPageURL=decodeURIComponent(window.location.search.substring(1)),sURLVariables=sPageURL.split("&"),sParameterName,i;for(i=0;i<sURLVariables.length;i++){sParameterName=sURLVariables[i].split("=");if(sParameterName[0]===sParam){return sParameterName[1]===undefined?true:sParameterName[1];}}};function modalCustomizer(){if(typeof wp.customize!=="undefined"){var body=$("body");body.off("click.preview");body.on("click.preview",`a[href]:not(.${fromPHP.modalLinkClass})`,function(e){var link=$(this);e.preventDefault();wp.customize.preview.send("scroll",0);wp.customize.preview.send("url",link.prop("href"));});}}
$(function(){var $window=$(window),$document=$(document),scrollPos,currentURL=window.location.pathname,disablePopup=!!window.MSInputMethodContext&&!!document.documentMode;function showModal(postLink,external){scrollPos=window.pageYOffset;if(fromPHP.disableScrolling)$("body, html").addClass("no-scroll");$(".modal-wrapper").addClass("show");$(".wp-post-modal").addClass("show");setTimeout(function(){trapFocus();},1000);if(postLink){if(postLink.length>0&&!external){history.replaceState("","",postLink);}}}
function hideModal(currentURL){var body=$("body");if(body.hasClass("no-scroll")){body.removeClass("no-scroll");$("html").removeClass("no-scroll");window.scroll(0,scrollPos);}
$(".modal-wrapper").removeClass("show").hide();$(".wp-post-modal").removeClass("show");$("#modal-content").empty();if(clickedURL)clickedURL.focus();if(window.location.pathname!==currentURL){history.replaceState("","",currentURL);}}
$document.keyup(function(e){if(e.keyCode===27&&$(".modal-wrapper").hasClass("show")&&popupOpen())
hideModal(currentURL);}).on("click",function(e){if(popupOpen()){const currentTargetIsLink=e.target instanceof HTMLAnchorElement||e.target.parentNode.className.indexOf(fromPHP.modalLinkClass)>=0||(e.originalEvent.path&&e.originalEvent.path[1].className===fromPHP.modalLinkClass);if(!currentTargetIsLink)hideModal(currentURL);}}).on("click",".close-modal",function(){if(popupOpen())hideModal(currentURL);}).on("click",".wp-post-modal, .modal-content",function(e){e.stopPropagation();});function initModal(){if($window.width()>=fromPHP.breakpoint){var modalUrl=getUrlParameter(fromPHP.modalLinkClass);if(modalUrl){if(fromPHP.loader){$("#modal-content").html('<img class="loading" src="'+
fromPHP.pluginUrl+
'/images/loading.gif" />');}
$.get(modalUrl,function(html){var htmlContent=html.indexOf("<html")>-1?$(html).find(fromPHP.containerID).html():html;$("#modal-content").html(htmlContent);});$(".modal-wrapper").fadeIn("fast",showModal);}
$("body").on("click",`.${fromPHP.modalLinkClass}`,function(e){var modalContent=$("#modal-content");var $this=$(this).attr("href")!==undefined?$(this):$(this).find("a").first();var postLink=$this.attr("href");var postSlug=postLink.lastIndexOf("/#")>-1?basename(postLink.substring(0,postLink.lastIndexOf("/#")))+
basename(postLink):basename(postLink);var postAnchor=postSlug.lastIndexOf("#")!==-1?postSlug.substring(postSlug.lastIndexOf("#")):false;var dataDivID=$this.attr("data-div")?"#"+$this.attr("data-div"):fromPHP.containerID;var dataBuddypress=$this.attr("data-buddypress");var loader='<img class="loading" src="'+
fromPHP.pluginUrl+
'/images/loading.gif" />';clickedURL=document.activeElement;e.preventDefault();if(fromPHP.loader){modalContent.html(loader);}
if($this.isExternal()){if($(this).hasClass("iframe")||fromPHP.iframe){var iframeCode='<iframe src="'+
$(this).attr("href")+
'" width="100%"'+
' height="600px" frameborder="0"></iframe>';modalContent.html(iframeCode);}
else{$.ajaxPrefilter(function(options){if(options.crossDomain&&jQuery.support.cors){var http=window.location.protocol==="http:"?"http:":"https:";options.url=http+"//cors-anywhere.herokuapp.com/"+options.url;}});$.get(postLink,function(html){modalContent.html($(html).find(dataDivID).html());});}}
else{if(dataBuddypress){modalContent.load(postLink+" #buddypress");}
else if($(this).hasClass("iframe")){var iframeCode='<iframe src="'+
$(this).attr("href")+
'" width="100%"'+
' height="600px" frameborder="0"></iframe>';modalContent.html(iframeCode);}
else{if(fromPHP.restMethod||$(this).hasClass("rest")){$.get(fromPHP.siteUrl+
"/wp-json/wp-post-modal/v1/any-post-type?slug="+
postSlug,function(response){$.when(modalContent.html(response.post_content)).done(function(){setTimeout(function(){if(postAnchor){$(".modal-wrapper").animate({scrollTop:$("#modal-content "+postAnchor).offset().top,},300);}},200);});});}
else{$.get(postLink,function(html){var content=$(html).find(dataDivID),htmlContent=html.indexOf("<html")>-1?$(html).find(dataDivID).html():html;if(content[0]){$.when(modalContent.html(htmlContent)).done(function(){setTimeout(function(){if(postAnchor){$(".modal-wrapper").animate({scrollTop:$("#modal-content "+postAnchor).offset().top,},300);}},200);});}
else{modalContent.load(postLink,function(){modalContent.html($(modalContent.html()).find(dataDivID).html());setTimeout(function(){if(postAnchor){$(".modal-wrapper").animate({scrollTop:$("#modal-content "+postAnchor).offset().top,},300);}},200);});}});}}}
$(".modal-wrapper").fadeIn("fast",function(){showModal(fromPHP.urlState?postLink:"",$this.isExternal());});});}}
if(!disablePopup)initModal();});$(window).on("load",function(){if(fromPHP.customizing)modalCustomizer();});})(jQuery);