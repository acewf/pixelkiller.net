console.log('\'Allo \'Allo!');


function init(){ 
	console.log('run');
	console.log($(".he-view a[rel^='prettyPhoto']"));
	$(".he-view a[rel^='prettyPhoto']").prettyPhoto({
	theme:'pp_default',
	show_title:1,
	animation1_speed:'fast',
	slideshow:'5000',
	opacity:'0.80',
	autoplay_slideshow:0,
	counter_separator_label:'/',
	autoplay:1});
}
init();