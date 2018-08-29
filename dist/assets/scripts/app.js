'use strict';

$(function() {

	var appW = $('#app').width(),
	    appH = $('#app').height(),
	    openArticle = appW < 1024 ? appW - 50 : (appW - 500) > 1275 ? 1275 : appW - 500,
	    isMenu = false,
	    isStart = false;

	$.ajax({
    url: 'assets/datas.json',
    dataType: 'json',
    success: function(data){
      const maxArticles = parseInt(data.max_articles, 10) > 0 ? parseInt(data.max_articles, 10) : data.articles.length
      const sortedArticles = data.articles.sort((a, b) => {
      	if (data.order === "chrono") return a.publication_date - b.publication_date
      	return b.publication_date - a.publication_date
      })
      const sortedData = Object.assign({}, data, {
    		articles: sortedArticles
    	})
      sortedData.articles.forEach(function(v,i) {
      	v.image = (i + 1) + '/' + maxArticles;
      	v.chapo = v.chapo;
      	v.isOpen = false;
      });
      init(sortedData);
    }
  });

  function getNodeindex(el) { 
    var c = el.parentNode.children, i = 0;
    for(i ; i < c.length; i++ )
    if( c[i] == el ) return i;
	}

  function init(json) {

		var app = new Vue({
			el: '#app',
			data: {
				slug: json.slug,
				titre: json.titre,
				chapo: json.chapo,
				auteur: json.auteur,
				articles: json.articles,
				current: false
			},
			mounted: function() {
				$('.slider').width((this.articles.length * 450) + (openArticle - 450));
        $('.titleNav').css({'width': appH - 150, 'top': appH - 150});

				var self = this;

				$(window).keydown(_.debounce(function(event) {
			    if ([37,39].indexOf(event.which) >= 0) {
			      if (!isMenu) self.$updateSlide(event.which == 39 ? 'down' : 'up');
			    }
			  }, 100));

			  $(window).resize(function() {
					self.resize();
				});
				this.resize();

			  this.$updateSlide = function(direction) {
			    if (direction == 'down') self.next();
			    else self.prev();

			    $('.sliderWrap').css({'left': 50, 'width': appW - 50});
			    isStart = true;
			    	
			    $('.intro').css({'width': 0, 'padding': 0});
			    $('.panel').css('width', 50);
					$('.nav').css('width', 50);
			  }
			},

			methods: {
				facebook: function() {
          var url = encodeURIComponent(window.location.origin + window.location.pathname),
              link = 'http://www.facebook.com/sharer/sharer.php?u=' + url;
          window.open(link, '', 'width=575,height=400,menubar=no,toolbar=no');
        },

        twitter: function() {
          var url = encodeURIComponent(window.location.origin + window.location.pathname),
              text = this.titre + " " + url + " via @libe",
              link = 'https://twitter.com/intent/tweet?original_referer=&text=' + text;
          window.open(link, '', 'width=575,height=400,menubar=no,toolbar=no');
        },

				open: function(back, ev) {
					var el = ev.target.parentNode,
							index = getNodeindex(el);

					this.animate(index);

					$('.intro').css({'width': 0, 'padding': 0});

					if (back) $('.menu').css('width', 0);
					$('.panel').css('width', 50);
					$('.nav').css('width', 50);

					isMenu = false;
				},

				close: function() {
					this.articles.forEach(function(v,i) {
						v.isOpen = false;
					});
					$('article').css('width', 450);
				},

				prev: function() {
					var index = (this.current - 1) < 0 ? 0 : (this.current - 1);
					this.animate(index);
				},

				next: function() {
					var index;
					if (this.current !== false) index = (this.current + 1) > (this.articles.length - 1) ? (this.articles.length - 1) : this.current + 1;
					else index = 0;
					this.animate(index);
				},

				showMenu: function() {
					$('.panel').css('width', appW);
					$('.menu').css('width', appW);
					$('.nav').css('width', 0);
					isMenu = true;
				},

				hideMenu: function() {
					$('.panel').css('width', 50);
					$('.menu').css('width', 0);
					$('.nav').css('width', 50);
					isMenu = false;
				},

				animate: function(index) {
					this.articles.forEach(function(v,i) {
						v.isOpen = false;
					});

					this.articles[index].isOpen = !this.articles[index].isOpen;

					this.current = index;
					Vue.nextTick(function () {
						isStart = true;
						$('.sliderWrap').css({'left': 50, 'width': appW - 50});
						$('.slider').css('left', -(index * 450));
					  $('article:not(.openArticle)').css('width', 450);
	    			$('.openArticle').css('width', openArticle);
	    			$('.sliderWrap').scrollLeft(0);
					})
				},

				resize: function() {
					appW = $('#app').width();
			    appH = $('#app').height();
			    // $('.menu ul').css('width', appW);
			    openArticle = appW < 1024 ? appW - 50 : (appW - 500) > 1275 ? 1275 : appW - 500;
			    if (isStart) $('.sliderWrap').css({'left': 50, 'width': appW - 50});
			    else $('.sliderWrap').css({'left': 450, 'width': appW - 450});
			    $('.slider').width((json.length * 450) + (openArticle - 450));
			    $('article:not(.openArticle)').css('width', 450);
			    $('.openArticle').css('width', openArticle);
			    if (isMenu) {
			    	$('.panel').css('width', appW);
						$('.menu').css('width', appW);
						$('.nav').css('width', 0);
			    }
			    $('.titleNav').css({'width': appH - 150, 'top': appH - 150});
				}
			}
		});
	}
});