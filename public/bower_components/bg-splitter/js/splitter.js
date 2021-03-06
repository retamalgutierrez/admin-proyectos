angular.module('bgDirectives', [])
  .directive('bgSplitter', function() {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      scope: {
        orientation: '@'
      },      
      template: '<div class="split-panes {{orientation}}" ng-transclude></div>',
      controller: function ($scope, $element) {
        $scope.panes = [];
        
        this.addPane = function(pane){
          if ($scope.panes.length > 1) 
            throw 'splitters can only have two panes';
          $scope.panes.push(pane);
          return $scope.panes.length;
        };
        $scope.getSize = function(pane){
          var paneel = $scope.panes[pane-1];
          var vertical = $scope.orientation == 'vertical';
          if (vertical) {
            initLOrT = 'top';
            initWOrH = 'height';
          } else {
            initLOrT = 'left';
            initWOrH = 'width';
          }
          return paneel.elem.css(initWOrH);
        }
        $scope.setSize = function(pane, size){          
          var pane1 = $scope.panes[0];
          var pane2 = $scope.panes[1];
          var pane1size = 0;          
          if (pane==1){
            pane1size = size;
          }
          if (pane==2) {
            if (vertical){
              var parheight = pane1.elem[0].parentNode.offsetHeight;
              pane1size = parheight-size;  
            }
            else{
              var parwidth = pane1.elem[0].parentNode.offsetWidth;
              pane1size = parwidth-size;  
            }
          }
          var handler = $scope.handler;
          var vertical = $scope.orientation == 'vertical';
          if (vertical) {
            initLOrT = 'top';
            initWOrH = 'height';
          } else {
            initLOrT = 'left';
            initWOrH = 'width';
          }
          handler.css(initLOrT, pane1size + 'px');
          pane1.elem.css(initWOrH, pane1size + 'px');
          pane2.elem.css(initLOrT, pane1size + 'px');
        };
      },
      link: function(scope, element, attrs) {
        var handler = angular.element('<div class="split-handler"></div>');
        scope.handler = handler;
        var pane1 = scope.panes[0];
        var pane2 = scope.panes[1];
        var vertical = scope.orientation == 'vertical';
        var pane1Min = pane1.minSize || 0;
        var pane2Min = pane2.minSize || 0;
        var drag = false;
        
        pane1.elem.after(handler);
   
        var initPane1 = (!isNaN(pane1.initSize));     
        var initPane2 = (!isNaN(pane2.initSize));    
        var initLOrT;
        var initWOrH;
        
        if (vertical) {
          initLOrT = 'top';
          initWOrH = 'height';
        } else {
          initLOrT = 'left';
          initWOrH = 'width';
        }
        var pane1initsize = pane1.initSize;
        if (initPane2) {
          if (vertical){
            var parheight = pane1.elem[0].parentNode.offsetHeight;
            pane1initsize = parheight-pane2.initSize;  
          }
          else{
            var parwidth = pane1.elem[0].parentNode.offsetWidth;
            pane1initsize = parwidth-pane2.initSize;  
          }
          initPane1 = (!isNaN(pane1initsize));  
        }

        if (initPane1) {
          handler.css(initLOrT, pane1initsize + 'px');
          pane1.elem.css(initWOrH, pane1initsize + 'px');
          pane2.elem.css(initLOrT, pane1initsize + 'px');
        }        
        element.bind('mousemove', function (ev) {
          if (!drag) return;
          
          var bounds = element[0].getBoundingClientRect();
          var pos = 0;
          
          if (vertical) {

            var height = bounds.bottom - bounds.top;
            pos = ev.clientY - bounds.top;

            if (pos < pane1Min) return;
            if (height - pos < pane2Min) return;

            handler.css('top', pos + 'px');
            pane1.elem.css('height', pos + 'px');
            pane2.elem.css('top', pos + 'px');
      
          } else {

            var width = bounds.right - bounds.left;
            pos = ev.clientX - bounds.left;

            if (pos < pane1Min) return;
            if (width - pos < pane2Min) return;

            handler.css('left', pos + 'px');
            pane1.elem.css('width', pos + 'px');
            pane2.elem.css('left', pos + 'px');
          }
        });
    
        handler.bind('mousedown', function (ev) { 
          ev.preventDefault();
          drag = true; 
        });
    
        angular.element(document).bind('mouseup', function (ev) {
          drag = false;
        });
      }
    };
  })
  .directive('bgPane', function () {
    return {
      restrict: 'E',
      require: '^bgSplitter',
      replace: true,
      transclude: true,
      scope: {
        minSize: '=',
        initSize: '=',
        setSize: '='
      },
      template: '<div class="split-pane{{index}}" ng-transclude></div>',
      link: function(scope, element, attrs, bgSplitterCtrl) {
        scope.elem = element;
        scope.index = bgSplitterCtrl.addPane(scope);
      }
    };
  });