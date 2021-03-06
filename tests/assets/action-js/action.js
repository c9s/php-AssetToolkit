// Generated by CoffeeScript 1.7.1

/*
vim:fdm=marker:sw=4:et:

Action.js: Javascript for submitting forms and validations.
Depends on: region.js, jQuery.scrollTo.js
Author: Yo-An Lin <cornelius.howl@gmail.com>
Date: 2/16 17:04:44 2011 

USAGE
-----

    Action.form('#action-form').setup({ 
        clear: true,
        onSuccess:
        onError: 
        onResult:
    })
 */

(function() {
  var Action, ActionPlugin;

  window.FormUtils = {
    findFields: function(form) {
      return $(form).find('select, textarea, input[type=text], input[type=checkbox], input[type=radio], input[type=password], input[type=date], input[type=datetime], input[type=time], input[type=email], input[type=hidden]');
    },
    findVisibleFields: function(form) {
      return $(form).find('select, textarea, input[type=text], input[type=date], input[type=datetime], input[type=time], input[type=checkbox], input[type=radio], input[type=email], input[type=password]');
    },
    findTextFields: function(form) {
      return $(form).find('input[type="text"], input[type="file"], input[type="time"], input[type="datetime"], input[type="date"], input[type="password"], input[type="email"], textarea');
    },
    enableInputs: function(form) {
      return this.findVisibleFields(form).removeAttr('disabled');
    },
    disableInputs: function(form) {
      return this.findVisibleFields(form).attr('disabled', 'disabled');
    }
  };

  Action = (function() {
    Action.prototype.ajaxOptions = {
      dataType: 'json',
      type: 'post',
      timeout: 8000
    };

    Action.prototype.plugins = [];

    Action.prototype.actionPath = null;

    Action.prototype.options = {
      disableInput: true
    };

    function Action(arg1, arg2) {
      var formsel, opts, plugin, _i, _len, _ref;
      formsel = null;
      opts = {};
      if (arg1 && (arg1 instanceof jQuery || arg1.nodeType === 1 || typeof arg1 === 'string')) {
        formsel = arg1;
        opts = arg2 || {};
      } else if (typeof arg1 === "object") {
        opts = arg1 || {};
      }
      if (formsel) {
        this.form(formsel);
      }
      this.options = $.extend({}, opts);
      if (this.options.plugins) {
        _ref = this.options.plugins;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          plugin = _ref[_i];
          this.plug(plugin);
        }
      }
      $(Action._globalPlugins).each((function(_this) {
        return function(i, e) {
          return _this.plug(e.plugin, e.options);
        };
      })(this));
    }

    Action.prototype.form = function(f) {
      if (f) {
        this.formEl = $(f);
        this.formEl.attr('method', 'post');
        this.formEl.attr("enctype", "multipart/form-data");
        this.formEl.data("actionObject", this);
        this.actionName = this.formEl.find('input[name=action]').val();
        if (!this.formEl.get(0)) {
          alert("Action form element not found");
        }
        if (!this.actionName) {
          alert("Action name is undefined.");
        }
        if (!this.formEl.find('input[name="__ajax_request"]').get(0)) {
          this.formEl.append($('<input>').attr({
            type: "hidden",
            name: "__ajax_request",
            value: 1
          }));
        }
        this.formEl.submit((function(_this) {
          return function() {
            var e, ret;
            try {
              ret = _this.submit();
              if (ret) {
                return ret;
              }
            } catch (_error) {
              e = _error;
              if (window.console) {
                console.error(e.message, e);
              }
            }
            return false;
          };
        })(this));
      }
      return this.formEl;
    };

    Action.prototype.log = function() {
      if (window.console && window.console.log && console.log.apply) {
        return console.log.apply(console, arguments);
      }
    };

    Action.prototype.plug = function(plugin, options) {
      var p;
      if (typeof plugin === 'function') {
        p = new plugin(this, options);
        this.plugins.push(p);
        return p;
      } else if (plugin instanceof ActionPlugin) {
        plugin.init(this);
        this.plugins.push(plugin);
        return plugin;
      }
    };

    Action.prototype.setPath = function(path) {
      return this.actionPath = path;
    };

    Action.prototype.getData = function(f) {
      var data, isIndexed, that;
      that = this;
      data = {};
      isIndexed = function(n) {
        return n.indexOf('[]') > 0;
      };
      if (typeof tinyMCE !== 'undefined') {
        tinyMCE.EditorManager.triggerSave();
      }
      FormUtils.findFields(f).each(function(i, n) {
        var el, name, val;
        el = $(n);
        val = $(n).val();
        name = el.attr('name');
        if (!name) {
          return;
        }
        if (val && (typeof val === "object" || typeof val === "array")) {
          data[name] = val;
          return;
        }
        if (isIndexed(name)) {
          data[name] || (data[name] = []);
        }
        if (el.attr('type') === "checkbox") {
          if (el.is(':checked')) {
            if (isIndexed(name)) {
              return data[name].push(val);
            } else {
              return data[name] = val;
            }
          }
        } else if (el.attr('type') === "radio") {
          if (el.is(':checked')) {
            if (isIndexed(name)) {
              return data[name].push(val);
            } else {
              return data[name] = val;
            }
          } else if (!data[name]) {
            return data[name] = null;
          }
        } else {
          if (isIndexed(name)) {
            return data[name].push(val);
          } else {
            return data[name] = val;
          }
        }
      });
      return data;
    };

    Action.prototype.setup = function(options) {
      this.options = $.extend(this.options, options);
      return this;
    };

    Action.prototype._processElementOptions = function(options) {
      var el;
      if (options.removeTr) {
        el = $($(options.removeTr).parents('tr').get(0));
        el.fadeOut('fast', function() {
          return $(this).remove();
        });
      }
      if (options.remove) {
        return $(options.remove).remove();
      }
    };

    Action.prototype._processFormOptions = function(options, resp) {
      if (options.clear) {
        FormUtils.findTextFields(this.form()).each(function(i, e) {
          if ($(this).attr('name') !== "action") {
            return $(this).val("");
          }
        });
      }
      if (resp.success && options.fadeOut) {
        return this.form().fadeOut('slow');
      }
    };

    Action.prototype._processLocationOptions = function(options, resp) {
      if (options.reload) {
        return setTimeout((function() {
          return window.location.reload();
        }), options.delay || 0);
      } else if (options.redirect) {
        return setTimeout((function() {
          return window.location = options.redirect;
        }), options.delay || 0);
      } else if (resp.redirect) {
        return setTimeout((function() {
          return window.location = resp.redirect;
        }), resp.delay * 1000 || options.delay || 0);
      }
    };

    Action.prototype._processRegionOptions = function(options, resp) {
      var form, reg, regionKeys;
      if (!Region) {
        throw "Region is undefined.";
      }
      form = this.form();
      if (form) {
        reg = Region.of(form);
        regionKeys = ['refreshSelf', 'refresh', 'refreshParent', 'refreshWithId', 'removeRegion', 'emptyRegion'];
        $(regionKeys).each(function(i, e) {
          if (options[e] === true) {
            return options[e] = reg;
          }
        });
      }
      if (options.refreshSelf) {
        Region.of(options.refreshSelf).refresh();
      }
      if (options.refresh) {
        Region.of(options.refresh).refresh();
      }
      if (options.refreshParent) {
        Region.of(options.refreshParent).parent().refresh();
      }
      if (options.refreshWithId) {
        Region.of(options.refreshWithId).refreshWith({
          id: resp.data.id
        });
      }
      if (options.removeRegion) {
        Region.of(options.removeRegion).remove();
      }
      if (options.emptyRegion) {
        return Region.of(options.emptyRegion).fadeEmpty();
      }
    };

    Action.prototype._createSuccessHandler = function(formEl, options, cb) {
      var $self, self;
      self = this;
      $self = $(self);
      return function(resp) {
        var ret;
        $self.trigger('action.on_result', [resp]);
        if (formEl && options.disableInput) {
          FormUtils.enableInputs(formEl);
        }
        if (cb) {
          ret = cb.call(self, resp);
          if (ret) {
            return ret;
          }
        }
        if (resp.success) {
          if (options.onSuccess) {
            options.onSuccess.apply(self, [resp]);
          }
          self._processFormOptions(options, resp);
          self._processRegionOptions(options, resp);
          self._processElementOptions(options, resp);
          self._processLocationOptions(options, resp);
        } else if (resp.error) {
          if (options.onError) {
            options.onError.apply(self, [resp]);
          }
          if (window.console) {
            console.error(resp.message);
          } else {
            alert(resp.message);
          }
        } else {
          throw "Unknown error:" + resp;
        }
        return true;
      };
    };

    Action.prototype._createErrorHandler = function(formEl, options) {
      return (function(_this) {
        return function(error, t, m) {
          if (error.responseText) {
            if (window.console) {
              console.error(error.responseText);
            } else {
              alert(error.responseText);
            }
          } else {
            console.error(error);
          }
          if (formEl && options.disableInput) {
            return FormUtils.enableInputs(formEl);
          }
        };
      })(this);
    };


    /* 
    
    run method
    
    .run() or runAction()
        run specific action
    
    .run( 'Delete' , { table: 'products' , id: id } , function() { ... });
    
    
    .run( [action name] , [arguments] , [options] or [callback] );
    .run( [action name] , [arguments] , [options] , [callback] );
    
    
    Event callbacks:
    
            * onSubmit:    [callback]
                            callback before sending request
    
            * onSuccess:   [callback]
                            success callback.
    
    options:
            * confirm:      [text]    
                            should confirm 
    
            * removeRegion: [element] 
                            the element in the region. to remove region.
    
            * emptyRegion:  [element] 
                            the element in the region. to empty region.
    
    
            * removeTr:     [element] 
                            the element in the tr.
    
            * remove:       [element] 
                            the element to be removed.
    
            * clear:        [bool]
                            clear text fields
    
            * fadeOut:      [hide]
                            hide the form if success
     */

    Action.prototype.run = function(actionName, args, arg1, arg2) {
      var cb, data, e, errorHandler, formEl, postUrl, successHandler;
      try {
        if (typeof arg1 === "function") {
          cb = arg1;
        } else if (typeof arg1 === "object") {
          this.options = $.extend(this.options, arg1);
          if (typeof arg2 === "function") {
            cb = arg2;
          }
        }
        if (this.options.confirm) {
          if (!confirm(this.options.confirm)) {
            return false;
          }
        }
        data = $.extend({
          action: actionName,
          __ajax_request: 1
        }, args);
        if (this.options.onSubmit) {
          this.options.onSubmit();
        }
        formEl = this.form();
        if (formEl) {
          if (this.options.disableInput) {
            FormUtils.disableInputs(formEl);
          }
        }
        postUrl = window.location.pathname;
        if (formEl && formEl.attr('action')) {
          postUrl = formEl.attr('action');
        } else if (this.actionPath) {
          postUrl = this.actionPath;
        }
        errorHandler = this._createErrorHandler(formEl, this.options);
        successHandler = this._createSuccessHandler(formEl, this.options, cb);
        jQuery.ajax($.extend(this.ajaxOptions, {
          url: postUrl,
          data: data,
          error: errorHandler,
          success: successHandler
        }));
        return false;
      } catch (_error) {
        e = _error;
        if (window.console) {
          console.error(e.message, e);
        }
        return alert(e.message);
      }
    };


    /*
     * submit:
     * submit( option , callback )
     * submit( callback )
     */

    Action.prototype.submit = function(arg1, arg2) {
      var $form, cb, data, ret, that;
      that = this;
      if (typeof arg1 === "object") {
        this.options = $.extend(this.options, arg1);
        if (arg2 && typeof arg2 === "function") {
          cb = arg2;
        }
      } else if (typeof arg1 === "function") {
        cb = arg1;
      }
      $form = this.form();
      data = this.getData($form);
      if (this.options.beforeSubmit) {
        ret = this.options.beforeSubmit.call($form, data);
        if (ret === false) {
          return false;
        }
      }
      $(this).trigger('action.before_submit', [data]);
      if ($form.find("input[type=file]").get(0) && $form.find('input[type=file]').parents('form').get(0) === $form.get(0)) {
        return this.submitWithAIM(data, cb);
      } else {
        return this.run(data.action, data);
      }
      return true;
    };

    Action.prototype.submitWithAIM = function(data, cb) {
      var $form, actionName, errorHandler, successHandler, that;
      $form = this.form();
      successHandler = this._createSuccessHandler($form, this.options, cb);
      errorHandler = this._createErrorHandler($form, this.options);
      if (this.options.beforeUpload) {
        this.options.beforeUpload.call(this, $form, data);
      }
      if (!$form || !$form.get(0)) {
        throw "form element not found.";
      }
      if (typeof AIM === "undefined") {
        alert("AIM is required for uploading file in ajax mode.");
      }
      actionName = $form.find('input[name="action"]').val();
      if (!actionName) {
        throw "action name field is required";
      }
      that = this;
      return AIM.submit($form.get(0), {
        onStart: function() {
          if (that.options.beforeUpload) {
            that.options.beforeUpload.call(that, $form, json);
          }
          return true;
        },
        onComplete: function(responseText) {
          var e, json;
          try {
            json = JSON.parse(responseText);
            successHandler(json, that.options.onUpload);
            if (that.options.afterUpload) {
              that.options.afterUpload.call(that, $form, json);
            }
          } catch (_error) {
            e = _error;
            errorHandler(e);
          }
          return true;
        }
      });
    };


    /*
    (Action object).submitWith( args, ... )
     */

    Action.prototype.submitWith = function(extendData, arg1, arg2) {
      var cb, data, options;
      options = {};
      if (typeof arg1 === "object") {
        options = arg1;
        if (typeof arg2 === "function") {
          cb = arg2;
        }
      } else if (typeof arg1 === "function") {
        cb = arg1;
      }
      data = $.extend(this.getData(this.form()), extendData);
      return this.run(data.action, data, options, cb);
    };

    return Action;

  })();

  Action._globalPlugins = [];

  Action.form = function(formsel, opts) {
    return new Action(formsel, opts || {});
  };

  Action.plug = function(plugin, opts) {
    return Action._globalPlugins.push({
      plugin: plugin,
      options: opts
    });
  };

  Action.reset = function() {
    return Action._globalPlugins = [];
  };

  window.submitActionWith = function(f, extendData, arg1, arg2) {
    return Action.form(f).submitWith(extendData, arg1, arg2);
  };

  window.submitAction = function(f, arg1, arg2) {
    return Action.form(f).submit(arg1, arg2);
  };

  window.runAction = function(actionName, args, arg1, arg2) {
    var a;
    a = new Action;
    return a.run(actionName, args, arg1, arg2);
  };

  window.Action = $.Action = Action;


  /*
  
      a = new ActionPlugin(action,{ ...options...  })
      a = new ActionPlugin(action)
      a = new ActionPlugin({ ... })
   */

  ActionPlugin = (function() {
    ActionPlugin.prototype.formEl = null;

    ActionPlugin.prototype.action = null;

    ActionPlugin.prototype.config = {};

    function ActionPlugin(a1, a2) {
      if (a1 && a2) {
        this.config = a2 || {};
        this.init(a1);
      } else if (a1 instanceof Action) {
        this.init(a1);
      } else if (typeof a1 === 'object') {
        this.config = a1;
      }
    }

    ActionPlugin.prototype.init = function(action) {
      this.action = action;
      return this.form = this.action.form();
    };

    return ActionPlugin;

  })();

  window.ActionPlugin = ActionPlugin;

}).call(this);
