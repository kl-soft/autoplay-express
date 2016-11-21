$(function () {
	var locals = {
		year: (new Date()).getFullYear(),
		download_setup: 'download/autoplay_setup.exe',
		order_personal: 'https://secure.payproglobal.com/orderpage.aspx?products=47884',
		order_site: 'https://secure.payproglobal.com/orderpage.aspx?products=47887'
	};
	var routes = {
		index: { id: 'content/index', locals: locals },
		overview: { id: 'content/overview', locals: locals },
		download: { id: 'content/download', locals: locals },
		contact: { id: 'content/contact', locals: locals },
		order: { id: 'content/order', locals: locals }
	};
	var contentElement = document.getElementById('page-content');

	function onHashChange() {
		var hash = location.hash.slice(1) || 'index';
		var route = routes[hash] || routes['index'];
		if (route) {
			contentElement.innerHTML = parseTemplate(route.id, route.locals);
			$('#header li').removeClass('active');
			$('#header a[href="#' + hash + '"]').parent().addClass('active');
		}
	}

	function parseTemplate(id, locals) {
		var html = document.getElementById(id).innerHTML;
		Object.keys(locals).forEach(function (key) {
			var regExp = new RegExp('{{' + key + '}}', 'g');
			html = html.replace(regExp, locals[key]);
		});
		return html;
	}

	(function init() {
		document.getElementById('footer').innerHTML = parseTemplate('footer', locals);
		onHashChange();
		window.addEventListener('hashchange', onHashChange);
	})();
});

$(function () {
	$('.lic-info').popover();

	$('#contact_us').on('submit', function(e) {
		e.preventDefault();

		var $form = $(this);
		var $button = $form.find('button');
		var $result = $('#result');

		$result.removeClass('alert-success alert-danger').html('').stop().hide();
		$button.button('loading');

		$.post($form.attr('action'), $form.serialize() + '&js_executed=yes')
			.done(function(data) {
				if (!data || !data.result) {
					$result.addClass('alert-danger').html('Error: incorrect server response');
				} else {
					if (data.result == 'ok') {
						$result.addClass('alert-success');
					} else {
						$result.addClass('alert-danger');
					}
					$result.html(data.message);
				}
			})
			.fail(function(error, msg) {
				if (error) {
					msg = 'Network Error: ' + error.status + ' ' + error.statusText;
				}
				$result.addClass('alert-danger').html(msg);
			})
			.always(function() {
				$result.stop().fadeIn().delay(30000).fadeOut();
				$button.button('reset');
			});
	});
});