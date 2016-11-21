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