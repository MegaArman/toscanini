$(document).ready(function(){
    // to fade in on page load
    $("body").css("display", "none");
    $("body").fadeIn(400);
    // to fade out before redirect
    $('information').click(function(e){
        redirect = $(this).attr('href');
        e.preventDefault();
        $('body').fadeOut(400, function(){
            document.location.href = redirect;
        });
    });
})
