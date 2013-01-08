/*
jQuery.gallerybox  since 2011.3.1 
version 1.0.2   // 2013.1.8 // jQuery 1.7.1.min over
wootplanet
Copyright (C) 2013 wootplanet <takehiro@wootplanet.com> Licensed LGPL

Originally under GPL
Relicensed under LGPL

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this library; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA

*/
(function ($) {
	$.fn.extend({
		galleryBox: function (options) {
			var defaults = {
				xmlPath: './setting.xml', // xml data path
				viewW: 700, //gallery width
				viewH: 240, //galery height
				thumbW: 118, //thumbnails width
				thumbH: 38, //thumbnails height
				thumbnail: 'auto', //thunbnail type
				viewID: 'bnrImg',//gallery ID
				ctrlID: 'bnrCtrl',//controler ID
				background: '#000',//controler background
				opacity: 0.6, //controler background opacity
				delay: 8 // animation delay seconds

			}
			var options = $.extend(defaults, options);
			return this.each(function () {
				var target = $(this),
					xmlcnt = 0,
					_viewW = options.viewW,
					_viewH = options.viewH,
					_thumbW = options.thumbW,
					_thumbH = options.thumbH,
					_thumbnail = options.thumbnail,
					_viewID = options.viewID,
					_ctrlID = options.ctrlID,
					_background = options.background,
					_opacity = options.opacity,
					_buttonMax = 5,
					_delay = options.delay,
					items = 0,
					p = _thumbW + 10,
					current = 1,
					btnMax = 1,
					ctrlPOS = 0,
					markerPOS = 0;

				xmlLoad();
				function xmlLoad() {
					$.ajax({
						url: options.xmlPath,
						type: 'get',
						dataType: 'xml',
						timeout: 1000,
						success: parse_xml,
						error: parse_err
					});
				}

				function parse_xml(xml, status) {
					if (status != 'success') return;
					generateBnr(xml);
				}

				function parse_err(xml, status) {
					if (status != 'error') return;
					if (xmlcnt < 10) xmlLoad();
					xmlcnt++;
				}
				function generateBnr(xml) {
					var DiffTime = function (val) {
						this.now = jQuery.now();
						this.start = 0;
						try {
							if ($(val).attr('start').length > 0) {
								this.start = new Date($(val).attr('start')).getTime() - this.now;
							}
						} catch (e) {}
						this.end = 30 * 24 * 360 * 1000;
						try {
							if ($(val).attr('end').length > 0) {
								this.end = new Date($(val).attr('end')).getTime() - this.now;
							}
						} catch (e) {}
					}
					var arr = [];
					var n = 0;
					$(xml).find('component').each(function () {
						var timer = new DiffTime(this);
						if (timer.start <= 0 && timer.end > 0) {
							$(this).find('item').each(function () {
								arr[n] = [];
								if ($(this).find('img').text().length) {
									arr[n]['img'] = $(this).find('img').text();
									if ($(this).find('url').text().length) {
										arr[n]['url'] = $(this).find('url').text();
									}
									if ($(this).find('alt').text().length) {
										arr[n]['alt'] = $(this).find('alt').text();
									}
									if ($(this).find('thumb').text().length) {
										arr[n]['thumb'] = $(this).find('thumb').text();
									}else{
										arr[n]['thumb'] = $(this).find('img').text();
									}
									n++;
								}
							});
						}
					});
					items = arr.length;
					if (items < 1) return false;
					//make a destination
					target.html('<div id="galleryBox"><div id="' + _viewID + '"></div><div id="' + _ctrlID + '"><div id="' + _ctrlID + 'Btn"></div><div id="' + _ctrlID + 'PN"></div>' + '<div id="' + _ctrlID + 'Bg"></div></div></div>');
					

					$.each(arr, function (i, val) {
						_bnrImg = '<img src="' + arr[i]['img'] + '" alt="' + arr[i]['alt'] + '">';
						_bnrItem = '<p id="bnrImg' + [i + 1] + '">' + _bnrImg + '</p>';
						if (arr[i]['url'].length > 2) _bnrItem = '<p id="bnrImg' + [i + 1] + '">' +
							'<a href="' + arr[i]['url'] + '" class="over">' + _bnrImg + '</a></p>\n';
						$('#' + _viewID).append(_bnrItem);
						
						//Create Thumbnails
						if (items > 1) {
							switch (_thumbnail) {
								case 'auto':
									thumb = arr[i]['img'];
									break;
								case 'xml':
									thumb = arr[i]['thumb'];
									break;
							}
							$('#' + _ctrlID + 'Btn').append('<p id="bnrBtn' + [i + 1] + '" class="over"><img src="' + thumb + '"></p>\n');
						}
						delete _bnrItem, _bnrImg;
					});
					if(items >1){
						//thumbnails size
						deff = _viewH * _thumbW / _viewW;
						if (_thumbH < deff) {
							$('#' + _ctrlID + 'Btn img').css({
								'width': _thumbW
							});
						} else {
							$('#' + _ctrlID + 'Btn img').css({
								'height': _thumbH
							});
						}
						//Create prev next
						if (items >= 4) {
							$('#' + _ctrlID + 'PN').append('<p class="bnrPrev"></p><p class="bnrNext"></p>');
						}
						$('#' + _ctrlID + 'PN').append('<div class="bnrMaker"></div>');
						if(items >3){
							$('#' + _ctrlID + 'PN .bnrMaker').append('<span></span>');
						}
						btnMax = items;
						if(items > 5) btnMax = 5;
						view_design(xml);
					}
					//RollOver
					$('.over').bind({
						'mouseover':function(){
							$(this).find('img').animate({
								opacity: 0.8
							}, 0);
						},
						'mouseout':function(){
							$(this).find('img').animate({
								opacity: 1
							}, 0);
						}
					});
				}
				function view_design() {
					
					$('#' + _viewID).find('p').css({
						'left': -1 * _viewW - 10,
						'z-index':0
					})
					.siblings('#bnrImg1').animate({
						opacity: 0,
						left: 0
					}, 0)
					.css('z-index',1000)
					.animate({
						opacity: 1
					}, 500);
					
					btnView = btnMax;
					if(btnMax == 4) {btnView =3;}
					ctrlW = _thumbW * btnView + [btnView-1] * 10;
					ctrlPOS = [_viewW - ctrlW]/2 +1;
					$('#' + _ctrlID + 'Btn').css({
						'left':ctrlPOS,
						'width':ctrlW
					});
					var m = 0;
					if(btnMax == 4){
						m = 1;
					}
					else if(btnMax == 5){
						m = 2;
					}
					
					$('#' + _ctrlID + 'Btn p').each(function (i) {
							j = i + m;
							if (j - 1 == items) j = 1;
							else if (j == items) j = 0;
							else if (j > btnMax) j = btnMax;
							$(this).css('left', p * j);
						});
					
					$('#' + _ctrlID + 'Bg').css({
						'background': _background,
						'z-index': 10
					})
						.animate({
						opacity: _opacity
					}, 0);
					
					$('#' + _ctrlID + 'PN .bnrMaker').css({
						'left': ctrlPOS -2 +p*m
					});
					autoRotate();
					
					

				//MOUSEOVER
				$('#' + _ctrlID + 'Btn,#' + _ctrlID + 'PN,#'+_viewID).bind({
						'mouseover':function(){
						clearInterval(Timer1); 
					},
						'mouseout':function(){
						autoRotate();
					}
				});
				

				//CLICK
				$('#' + _ctrlID + 'PN p').click(function () {
					RotateAnime($(this).attr('class'));
				});
				$('#' + _ctrlID + 'Btn p').click(function () {
					RotateAnime($(this).attr('id').replace(/bnrBtn(\d+)/, '$1'));
				});
					
				}

				//AUTO ANIMATION
				function autoRotate(){
					if(items >1){
						Timer1 = setInterval( function() {
							RotateAnime('bnrNext');
						}, _delay * 1000);
					}
				}
				
				//ROTATE ANIMATION
				function RotateAnime(v) {
					if(v == current) return false;
					
					//Deviation of the pixel values
					var m = 0;
					if(btnMax == 4){
						m = 1;
					}
					else if(btnMax == 5){
						m = 2;
					}
					
					//Coordinates of the standby position
					var nextp;
					if (v == 'bnrNext') {
						nextp = p * btnMax;
						current++;
						if (current > items) current = 1;
					} else if (v == 'bnrPrev') {
						nextp = p * -1;
						current--;
						if (current == 0) current = items;
					} else {
						v= v*1;
						if(current < v || (v <= 2&& current >= items-1 )){
							nextp = p * btnMax;
							if(v >= items-1 && current < 3){
								nextp = p * -1;
							}
						}else{
							nextp = p * -1;
						}
						current = v;
					}
					if(btnMax <= 3){
						$('#' + _ctrlID + 'PN .bnrMaker').animate({
							left: ctrlPOS -2 +p*[current-1]
						});
						
					}
					if(btnMax >= 4 ){
						
						//Image that appears at the top of the controller
						var btn = current - m;
						if (btnMax == 5) {
							if (current == 1) {
								btn = items - 1;
							}
							if (current == 2) {
								btn = items;
							}
						}
						if (btnMax == 4) {
							if (current == 1) {
								btn = items;
							}
						}
						
						fadeCtrl('hide');
						$('#' + _ctrlID + 'Btn p').each(function (i) {
							j = btn + i;
							if (j > items) {
								j = j - items;
							}
							
							//pre-position
							if (i >= btnMax || (nextp > 0 && i == btnMax-1) || (nextp < 0 && i == 0)) {
								$('#bnrBtn' + j).stop(false, true).animate({
									opacity: 0,
									left: nextp
								}, 0);
							}
							if (v != 'bnrNext' && v != 'bnrPrev') {
								$('#bnrBtn' + j).animate({
									opacity: 0,
									left: nextp
								}, 0);
							}
							
							//animate
							if (i < btnMax) {
								if (v == 'bnrNext' || v == 'bnrPrev') {
									$('#bnrBtn' + j).stop(false, true).css('opacity', 1).animate({
										left: p * i
									});
								} else {
									waitp = p * i -p
									if(nextp > 0){
										waitp = p * i +p
									}
									//	console.log(waitp)
									$('#bnrBtn' + j).stop(false, true).css('left', waitp).animate({
										opacity:1,
										left: p * i
									}, 500);
								}
							}
						});
						fadeCtrl('show');
					}

					//image change
					$('#bnrImg p').addClass('change');
					$('#bnrImg' + current).removeClass('change').css('left',0);
					$('#bnrImg p').stop(true, false).animate({
						opacity: 0
					}, 300);
					$('#bnrImg' + current).removeClass('change').animate({
						opacity: 1
					}, 300,function(){
						$('#bnrImg p.change').css({'left': _viewW * -1,'z-index':0}).removeClass('change');
					}).css('z-index',1000);
				}


				//FADE Controler
				function fadeCtrl(mode) {
					if (mode == 'hide') {
						$('#' + _ctrlID + 'PN p,#' + _ctrlID + 'PN div').fadeOut(0);
					} else if (mode == 'show') {
						$('#' + _ctrlID + 'Btn p').animate({ opacity: 1}, 500);
						setTimeout(function(){
						$('#' + _ctrlID + 'PN div').stop(true,false).fadeIn(300,function(){
							$('#' + _ctrlID + 'PN p').fadeIn(300);
						});
						},300);
					}
				}
			});
		}
	});
})(jQuery);