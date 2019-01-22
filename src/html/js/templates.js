define(['vendor/text!templates/about.html',
        'vendor/text!templates/work.html',
        'vendor/text!templates/labs.html',
        'vendor/text!templates/work_contents.html',
        'vendor/text!templates/labs_contents.html',
        'vendor/text!templates/about_contents.html',
        'handlebars',
        'appmod/workclass'], function(about,work,labs,work_contents,labs_contents,about_contents,handlebars,workclass)
{
    /* ==========================================================================
     Public Methods
     ========================================================================== */
    Handlebars.registerHelper('list', function(items, options) {
                var out = "";
                for(var i=0, l=items.length; i<l; i++) {
                    out = out + options.fn(items[i]);
                }
                return out;
            });
    return {
        work: function() {
            var template = Handlebars.compile($(work).html());            
            var dataExamp = {title:"OPEN WORK"};
            return template(dataExamp);
        },
        about: function() {
            var template = Handlebars.compile($(about).html());            
            var dataExamp = {title:"OPEN ABOUT"};
            return template(dataExamp);
        },
        labs: function() {
            var template = Handlebars.compile($(labs).html());            
            var dataExamp = {title:"OPEN LABS"};
            return template(dataExamp);
        },
        ContentWork: function() {
            var nContentPlayer = function(params){
                var instanc = new workclass(params);
                return instanc;
            }
            var template = Handlebars.compile($(work_contents).html());            
            var dataExamp = {people:[{ficheiro:"img/heineken.jpeg",name:"Heinken Smart Tv",tag:"AS3/Javascript"},
                        {ficheiro:"img/redbull.jpeg",name:"RedBull Smart Tv",tag:"AS3/Javascript"},
                        {ficheiro:"img/Abstract-Design-Background-Free-Download-Wallpaper-Abstract-Design.jpg",name:"RedBull Smart Tv",tag:"AS3/Javascript"},
                        {ficheiro:"img/6-Series-7-Scandinavian-Design.jpg",name:"RedBull Smart Tv",tag:"AS3/Javascript"},
                        {ficheiro:"imgdummy/lamborghini-exotic-only-car.jpg",name:"RedBull Smart Tv",tag:"AS3/Javascript"},
                        {ficheiro:"imgdummy/lamborghini-exotic-only-car.jpg",name:"RedBull Smart Tv",tag:"AS3/Javascript"},
                        {ficheiro:"imgdummy/lamborghini-exotic-only-car.jpg",name:"RedBull Smart Tv",tag:"AS3/Javascript"},
                        {ficheiro:"img/redbull.jpeg",name:"RedBull Smart Tv",tag:"AS3/Javascript"}]};
            return {html:template(dataExamp),init:nContentPlayer};
        },
        ContentAbout: function() {
            var template = Handlebars.compile($(about_contents).html());            
            var dataExamp = {texto:"Aqui entra projectos para labs"};
            return template(dataExamp);
        },
        ContentLabs: function() {
            var template = Handlebars.compile($(labs_contents).html());            
            var dataExamp = {texto:"Aqui entra projectos para labs"};
            return template(dataExamp);
        }
    }
});
 