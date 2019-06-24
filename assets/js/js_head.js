$(document).ready(function() {
    	$("img.feature").hide();
		var $source = $("img.feature").attr("src");
		$('#feature-image').css({
			'backgroundImage': 'url(' + $source +')',
			'backgroundRepeat': 'no-repeat',
            'border-top': '3px solid #E4E4E4',
            'border-bottom': '3px solid #E4E4E4'
		});
  
  
  $('.dropdown a:first-child').click(function(e){
    	//e.preventDefault();
  });
});

