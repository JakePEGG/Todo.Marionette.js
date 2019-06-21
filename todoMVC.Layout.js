//A layout is a specialized type of view that directly extends  Marionette.ItemView. This means it’s intended to render a single template and may or may not have a 
//model (or item) associated with the template.

//One of the main differences between a Layout and an ItemView is that the layout contains regions. When defining a Layout, we supply it with both a template and the 
//regions that the template contains. After rendering the layout, we can display other views within the layout using the regions that were defined.

//In our TodoMVC Layout module below, we define Layouts for:

//Header: where we can create new Todos
//Footer: where we summarize how many Todos are remaining/have been completed
//This captures some of the view logic that was previously in our AppView and TodoView.

//Note that Marionette modules (such as the below) offer a simple module system which is used to create privacy and encapsulation in Marionette apps. 
//These certainly don’t have to be used however, and later on in this section we’ll provide links to alternative implementations using RequireJS + AMD instead.


TodoMVC.module('Layout', function (Layout, App, Backbone, Marionette, $, _) {

    // Layout Header View

    Layout.Header = Backbone.Marionette.ItemView.extend({
        template: '#template-header',

        // UI Bindings create cached attributes that
        // point to jQuery selected objects.
        ui: {
            input: '#new-todo'
        },

        events: {
            'keypress #new-todo': 'onInputKeypress',
            'blur #new-todo': 'onTodoBlur'
        },

        onTodoBlur: function () {
            var todoText = this.ui.input.val().trim();
            this.createTodo(todoText);
        },

        onInputKeypress: function (e) {
            var ENTER_KEY = 13;
            var todoText = this.ui.input.val().trim();

            if (e.which === ENTER_KEY && todoText) {
                this.createTodo(todoText);
            }
        },

        completeAdd: function () {
            this.ui.input.val('');
        },

        createTodo: function (todoText) {
            if (todoText.trim() === "") {
                return;
            }

            this.collection.create({
                title: todoText
            });

            this.completeAdd();
        }
    });

    // Layout Footer View

    Layout.Footer = Marionette.Layout.extend({
        template: '#template-footer',

        // UI Bindings create cached attributes that
        // point to jQuery selected objects.

        ui: {
            todoCount: '#todo-count .count',
            todoCountLabel: '#todo-count .label',
            clearCount: '#clear-completed .count',
            filters: "#filters a"
        },

        events: {
            "click #clear-completed": "onClearClick"
        },

        initialize: function () {
            this.bindTo(App.vent, "todoList: filter", this.updateFilterSelection, this);
            this.bindTo(this.collection, 'all', this.updateCount, this);
        },

        onRender: function () {
            this.updateCount();
        },

        updateCount: function () {
            var activeCount = this.collection.getActive().length,
                completedCount = this.collection.getCompleted().length;
            this.ui.todoCount.html(activeCount);

            this.ui.todoCountLabel.html(activeCount === 1 ? 'item' : 'items');
            this.ui.clearCount.html(completedCount === 0 ? '' : '(' + completedCount + ')');
        },

        updateFilterSelection: function (filter) {
            this.ui.filters
                .removeClass('selected')
                .filter('[href="#' + filter + '"]')
                .addClass('selected');
        },

        onClearClick: function () {
            var completed = this.collection.getCompleted();
            completed.forEach(function destroy(todo) {
                todo.destroy();
            });
        }
    });

});