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
            if (status.status === 502){
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

    var HelpView = TemplateView.extend({
        templateName: '#help-template',
    });

    var TwoDView = TemplateView.extend({
        templateName: '#2d-template',
        events: {
            'click button.format': 'format',
            'click button.close': 'close',
            'click button.material': 'material',
            'click button.shape': 'shape'
        },
        format: function (event) {
            this.$modal = document.getElementById('modal');
            this.$modal.style.display = "block";
        },
        material: function (event) {
            this.$modal = document.getElementById('modalRectangular');
            this.$modal.style.display = "block";
        },
        shape: function (event) {
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
        }
    });

    var ThreeDView = TemplateView.extend({
        templateName: '#3d-template',
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
            /*app.items.fetch({
              success: $.proxy(self.render, self)
            });*/
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
            changeCircle(x, y, size, ctx);
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
            changeRect(x, y, width, hight, ctx);
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
            changeText(x, y, text, ctx);
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
    app.views.ThreeDView = ThreeDView;
    app.views.HeaderView = HeaderView;
    app.views.AboutView = AboutView;
    app.views.FooterView = FooterView;
    app.views.TwoDView = TwoDView;
})(jQuery, Backbone, _, app);
