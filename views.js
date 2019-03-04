(function ($, Backbone, _, app) {
    var TemplateView = Backbone.View.extend({
        initialize: function () {
            this.template = _.template($(this.templateName).html());
        },
        render: function () {
            var context = this.getContext(),
            html = this.template(context);
            this.$el.html(html);
        },
        getContext: function () {
            return {};
        }
    });

    var FormView = TemplateView.extend({
        events: {
            'submit form': 'submit',
            'click button.cancel': 'done'
        },
        errorTemplate: _.template('<span class="error"><%- msg %><br></span>'),
        clearErrors: function () {
            $('.error', this.form).remove();
        },
        serializeForm: function (form) {
            return _.object(_.map(form.serializeArray(), function (item) {
                // Convert object to tuple of (name, value)
                return [item.name, item.value];
            }));
        },
        submit: function (event) {
            event.preventDefault();
            this.form = $(event.currentTarget);
            this.clearErrors();
        },
        success: function (model) {
            this.done();
        },
        failure: function (model, status, error) {
            if (status.status===502){
                this.form.prepend(this.errorTemplate({msg: "Bad gateway."}))
            }
        },
        done: function (event) {
            if (event) {
                event.preventDefault();
            }
            this.trigger('done');
        }
    });

    var NewMessageView = FormView.extend({
        templateName: '#new-message-template',
        className: 'new-message',
        submit: function (event) {
            var self = this;
            FormView.prototype.submit.apply(this, arguments);
            var attributes = this.serializeForm(this.form);
            app.messages.create(attributes, {
              wait: true,
              success: $.proxy(self.success, self),
              error: $.proxy(self.failure, self)
            });
        },
        getContext: function () {
            return {
              item: app.session.get('item')
            };
        }
    });

    var NewItemView = FormView.extend({
        templateName: '#new-item-template',
        className: 'new-item',
        submit: function (event) {
            var self = this;
            FormView.prototype.submit.apply(this, arguments);
            var data = this.serializeForm(this.form);
            app.items.create(data, {
              wait: true,
              success: $.proxy(self.success, self),
              error: $.proxy(self.failure, self)
            });
        }
    });

    var HelpView = TemplateView.extend({
        templateName: '#help-template',
    });

    var HomepageView = TemplateView.extend({
        templateName: '#home-template',
        events: {
            'click button.add': 'renderAddForm',
            'click button.close': 'close',
            'click button.hole': 'hole',
            'click button.rectangularModal': 'modalRectangular',
            'click button.rectangular': 'rectangular',
            'click button.textModal': 'modalText',
            'click button.text': 'text'
        },
        initialize: function (options) {
          var self = this;
          TemplateView.prototype.initialize.apply(this, arguments);
            app.items.fetch({
              success: $.proxy(self.render, self)
            });
        },
        renderAddForm: function (event) {
            this.$modal = document.getElementById('modal');
            this.$modal.style.display = "block";
        },
        modalRectangular: function (event) {
            this.$modal = document.getElementById('modalRectangular');
            this.$modal.style.display = "block";
        },
        modalText: function (event) {
            this.$modal = document.getElementById('modalText');
            this.$modal.style.display = "block";
        },
        close: function (event) {
            this.$modal = document.getElementById('modal');
            this.$modal.style.display = "none";
            this.$modal = document.getElementById('modalRectangular');
            this.$modal.style.display = "none";
            this.$modal = document.getElementById('modalText');
            this.$modal.style.display = "none";
        },
        hole: function (event) {
            this.$modal = document.getElementById('modal');
            this.$face  = document.getElementById('faceHole').value;
            this.$modal.style.display = "none";

            var x = document.getElementById('XHole').value;
            var y = document.getElementById('YHole').value;
            var size = document.getElementById('D').value;
            switch(this.$face) {
              case "front":
                var canvas = document.getElementById('canvasFront'),
                    ctx = canvas.getContext('2d');
                break;
              case "back":
                var canvas = document.getElementById('canvasBack'),
                    ctx = canvas.getContext('2d');
                break;
              case "left":
                var canvas = document.getElementById('canvasLeft'),
                    ctx = canvas.getContext('2d');
                break;
              case "right":
                var canvas = document.getElementById('canvasRight'),
                    ctx = canvas.getContext('2d');
                break;
              case "top":
                var canvas = document.getElementById('canvasTop'),
                    ctx = canvas.getContext('2d');
                break;
              case "bottom":
                var canvas = document.getElementById('canvasBottom'),
                    ctx = canvas.getContext('2d');
                break;
              default:
                // code block
            }
            changeCanvasCircle(x, y, size, ctx);
        },
        rectangular: function (event) {
            this.$modal = document.getElementById('modalRectangular');
            this.$face  = document.getElementById('faceRect').value;
            this.$modal.style.display = "none";
            var x = document.getElementById('XRect').value;
            var y = document.getElementById('YRect').value;
            var width = document.getElementById('W').value;
            var hight = document.getElementById('H').value;
            switch(this.$face) {
              case "front":
                var canvas = document.getElementById('canvasFront'),
                    ctx = canvas.getContext('2d');
                break;
              case "back":
                var canvas = document.getElementById('canvasBack'),
                    ctx = canvas.getContext('2d');
                break;
              case "left":
                var canvas = document.getElementById('canvasLeft'),
                    ctx = canvas.getContext('2d');
                break;
              case "right":
                var canvas = document.getElementById('canvasRight'),
                    ctx = canvas.getContext('2d');
                break;
              case "top":
                var canvas = document.getElementById('canvasTop'),
                    ctx = canvas.getContext('2d');
                break;
              case "bottom":
                var canvas = document.getElementById('canvasBottom'),
                    ctx = canvas.getContext('2d');
                break;
              default:
                // code block
            }
            changeCanvasRect(x, y, width, hight, ctx);
        },
        text: function (event) {
            this.$modal = document.getElementById('modalText');
            this.$modal.style.display = "none";
            this.$face  = document.getElementById('faceText').value;
            var text = document.getElementById('T').value;
            var x = document.getElementById('XText').value;
            var y = document.getElementById('YText').value;
            switch(this.$face) {
              case "front":
                var canvas = document.getElementById('canvasFront'),
                    ctx = canvas.getContext('2d');
                break;
              case "back":
                var canvas = document.getElementById('canvasBack'),
                    ctx = canvas.getContext('2d');
                break;
              case "left":
                var canvas = document.getElementById('canvasLeft'),
                    ctx = canvas.getContext('2d');
                break;
              case "right":
                var canvas = document.getElementById('canvasRight'),
                    ctx = canvas.getContext('2d');
                break;
              case "top":
                var canvas = document.getElementById('canvasTop'),
                    ctx = canvas.getContext('2d');
                break;
              case "bottom":
                var canvas = document.getElementById('canvasBottom'),
                    ctx = canvas.getContext('2d');
                break;
              default:
                // code block
            }
            changeCanvasText(x, y, text, ctx);
        }
    });

    var HeaderView = TemplateView.extend({
        tagName: 'nav',
        className: 'container',
        templateName: '#header-template',
    });

    var FooterView = TemplateView.extend({
        tagName: 'footer',
        className: 'container',
        templateName: '#footer-template'
    });

    var AboutView = TemplateView.extend({
        tagName: 'about',
        templateName: '#about-template'
    })

    var ItemView = TemplateView.extend({
        templateName: '#item-template',
        events: {
            'click button.add': 'renderAddForm'
        },
        initialize: function (options) {
            var self = this;
            TemplateView.prototype.initialize.apply(this, arguments);
            this.item = new app.models.Item({id: options.itemId});
            this.item.fetch({
              success: $.proxy(self.render, self)
            });
            app.session.set('item', this.item);
            app.messages.fetch({
              data: {item: this.item.id},
              success: $.proxy(self.render, self)
            });
        },
        getContext: function () {
            return {item: this.item, messages: app.messages};
        },
        renderAddForm: function (event) {
            var view = new NewMessageView(),
                link = $(event.currentTarget),
                self = this;
            event.preventDefault();
            link.before(view.el);
            link.hide();
            view.render();
            view.on('done', function () {
                self.render();
            });
        }
    });

    app.views.HelpView = HelpView;
    app.views.HomepageView = HomepageView;
    app.views.HeaderView = HeaderView;
    app.views.ItemView = ItemView;
    app.views.AboutView = AboutView;
    app.views.FooterView = FooterView;
})(jQuery, Backbone, _, app);
