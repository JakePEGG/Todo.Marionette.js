var TodoMVC = new Backbone.Marionette.Application();

TodoMVC.addRegions({
    header: '#header',
    main: '#main',
    footer: '#footer'
});

TodoMVC.on('start', function () {
    Backbone.history.start();
});

// Regions are used to manage the content that’s displayed within specific elements, and the  addRegions method on the MVC object is just a shortcut 
//for creating Region objects. We supply a jQuery selector for each region to manage (e.g., #header, #main, and #footer) and then tell the region to show various 
//Backbone views within that region. Once the application object has been initialized, we call Backbone.history.start() to route the initial URL.

$(function () {
    TodoMVC.start();
});