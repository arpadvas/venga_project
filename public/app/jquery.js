$(document).ready(function() {
	$('#login-button').on('click', function() {
		$('#register').hide();
		$('#login').show();
	})
});

$(document).ready(function() {
	$('#register-button').on('click', function() {
		$('#login').hide();
		$('#register').show();
	})
});