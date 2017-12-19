define([
    'core/js/views/componentView',
    'core/js/adapt'
], function(ComponentView, Adapt) {

    var ImageSlider = ComponentView.extend({

        events: {
            'click .next': 'onNextClick',
            'click .previous': 'onPreviousClick',
            'click .progress': 'onProgressClick'
        },

        onNextClick: function(event) {
            if ((this._activeIndex + 1) >= this.itemCount) {
                return;
            }
            this._activeIndex++;
            this.moveSlide();
        },

        onPreviousClick: function(event) {
            if ((this._activeIndex - 1) < 0) {
                return;
            }
            this._activeIndex--;
            this.moveSlide();
        },

        onProgressClick: function(event) {
            var index = $(event.currentTarget).attr('data-index');
            this._activeIndex = parseInt(index);
            this.moveSlide();
        },

        moveSlide: function() {
            var offset = 100 / this.itemCount * this._activeIndex * -1;
            var value = 'translateX('+offset+'%)';

            this.prefixHelper(this.imageSliderElm, 'Transform', value);
            this.prefixHelper(this.titleSliderElm, 'Transform', value);
            this.imageSliderElm.style.transform = value;
            this.titleSliderElm.style.transform = value;
            
            this.controllButtons();
            this.controllIndicators();
        },

        controllButtons: function() {
            this.checkCompletion();
            var showPrevBtn = true;
            var showNextBtn = true;

            if (this._activeIndex === 0) {
                showPrevBtn = false;
            }
            if (this._activeIndex >= (this.itemCount - 1)) {
                showNextBtn = false;
            }

            this.$el.toggleClass('show-next', showNextBtn);
            this.$el.toggleClass('show-prev', showPrevBtn);
        },

        controllIndicators: function() {
            this.$('.indicator').find('.progress').removeClass('selected');
            this.$('.indicator').find('[data-index="'+this._activeIndex+'"]').addClass('selected');
        },

        checkCompletion: function() {
            if (this.model.get('_isComplete')) return;

            var items = this.model.get('_items');
            items[this._activeIndex]._isVisited = true;
            
            var visited = 0;
            for (var i = 0; i < items.length; i++) {
                if (items[i]._isVisited) {
                    visited++;
                }
            }

            if (visited >= this.itemCount) {
                this.setCompletionStatus();
            }
        },

        preRender: function() {
            // Checks to see if the graphic should be reset on revisit
            this.checkIfResetOnRevisit();

            this._activeIndex = 0;

            this.itemCount = this.model.get('_items').length;
            this.model.set('_totalWidth', 100 * this.itemCount);
            this.model.set('_itemWidth', 100 / this.itemCount);
        },

        postRender: function() {
            this.imageSliderElm = this.$('.image-slider')[0];
            this.titleSliderElm = this.$('.title-slider')[0];

            this.controllButtons();
            this.controllIndicators();
            
            this.$('.graphic-widget').imageready(_.bind(function() {
                this.setReadyStatus();
            }, this));
        },

        // Used to check if the graphic should reset on revisit
        checkIfResetOnRevisit: function() {
            var isResetOnRevisit = this.model.get('_isResetOnRevisit');

            // If reset is enabled set defaults
            if (isResetOnRevisit) {
                this.model.reset(isResetOnRevisit);
            }
        },

        prefixHelper: function(elm, prop, val) {
            elm.style["webkit" + prop] = val;
            elm.style["moz" + prop] = val;
            elm.style["ms" + prop] = val;
            elm.style["o" + prop] = val;
        }

    });

    Adapt.register('imageSlider', ImageSlider);

    return ImageSlider;

});
