//Marionette uses the concept of an AppRouter to simplify routing. This reduces the boilerplate for handling route events and allows routers to be configured 
//to call methods on an object directly. We configure our AppRouter using appRoutes which replaces the  '*filter': 'setFilter' route defined in our original router and 
// invokes a method on our Controller.

// The TodoList Controller, also found in this next code block, handles some of the remaining visibility logic originally found in AppView and TodoView, albeit using very 
// readable Layouts.

TodoMVC.module('TodoList', function (TodoList, App, Backbone, Marionette, $, _) {

    // TodoList Router
    // Handle routes to show the active vs complete todo items

    TodoList.Router = Marionette.AppRouter.extend({
        appRoutes: {
            '*filter': 'filterItems'
        }
    });

    // TodoList Controller (Mediator)
    // Control the workflow and logic that exists at the application level, above the implementation detail of views and models

    TodoList.Controller = function () {
        this.todoList = new App.Todos.TodoList();
    };

    _.extend(TodoList.Controller.prototype, {

        // Start the app by showing the appropriate views and fetching the list of todo items, if there are any

        start: function () {
            this.showHeader(this.todoList);
            this.showFooter(this.todoList);
            this.showTodoList(this.todoList);

            App.bindTo(this.todoList, 'reset add remove', this.toggleFooter, this);
            this.todoList.fetch();
        },

        showHeader: function (todoList) {
            var header = new App.Layout.Header({
                collection: todoList
            });
            App.header.show(header);
        },

        showFooter: function (todoList) {
            var footer = new App.Layout.Footer({
                collection: todoList
            });
            App.footer.show(footer);
        },

        showTodoList: function (todoList) {
            App.main.show(new TodoList.Views.ListView({
                collection: todoList
            }));
        },

        toggleFooter: function () {
            App.footer.$el.toggle(this.todoList.length);
        },

        // Set the filter to show complete or all items

        filterItems: function (filter) {
            App.vent.trigger('todoList:filter', filter.trim() || '');
        }
    });

    // TodoList Initializer
    // Get the TodoList up and running by initializing the mediator when the the application is started, pulling in all of the existing Todo items and displaying them.

    TodoList.addInitializer(function () {

        var controller = new TodoList.Controller();
        new TodoList.Router({
            controller: controller
        });

        controller.start();

    });

});