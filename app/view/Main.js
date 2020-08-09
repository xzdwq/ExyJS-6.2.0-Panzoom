Ext.define('Scene.view.Main', {
  extend: 'Ext.panel.Panel',
  alias: 'widget.main',
  layout: 'fit',
  cls: 'container-dg',
  border: true,
  items: [
    {
      xtype: 'panel',
      title: 'Scene',
      cls: 'panzoom',
      layout: 'absolute',
      tools: [
        { type: 'plus', cls: 'zoom-in' }
      ],
      items: [
        {
          xtype: 'panel',
          layout: 'absolute',
          cls: 'item-dg',
          id: 'svg',
          width: 400,
          height: 110,
          //draggable: true,
          x: 30, y: 50,
          border: true,
          html: '<div class="svg"><svg><rect width="100%" height="100%" style="fill:rgb(0,0,255);stroke-width:43;stroke:rgb(0,0,0)" /></svg></div>'
        },
        {
          xtype: 'panel',
          layout: 'absolute',
          cls: 'item-dg',
          id: 'text-area',
          title: 'Item 1',
          style: 'background: #fff',
          border: true,
          width: 300,
          height: 300,
          //draggable: true,
          x: 730, y: 320,
          html: '<textarea style="width: 100%; height: 100%;"></textarea>'
        }
      ]
    }
  ],
  listeners: {
    afterrender: function(el) {
      var minScale = 0.4;
      var maxScale = 2;
      var incScale = 0.1;
      var $container = $(".container-dg");
      var $panzoom = null;
      _.defer(function(){
        $panzoom = $container.find("#panel-1010-innerCt").panzoom({
          minScale: minScale,
          maxScale: maxScale,
          increment: incScale,
          cursor: "",
          ignoreChildrensEvents: true,
        }).on("panzoomstart",function(e,pz,ev){
          $panzoom.css("cursor","move");
        })
        .on("panzoomend",function(e,pz){
          $panzoom.css("cursor","");
        });
        $panzoom.parent()
        .on('mousewheel.focal', function( e ) {
          if(e.ctrlKey||e.originalEvent.ctrlKey)
          {
            var delta = e.delta || e.originalEvent.wheelDelta;
            var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
            $panzoom.panzoom('zoom', zoomOut, {
              animate: true,
              exponential: false,
            });
          }else{
            var deltaY = e.deltaY || e.originalEvent.wheelDeltaY || (-e.originalEvent.deltaY);
            var deltaX = e.deltaX || e.originalEvent.wheelDeltaX || (-e.originalEvent.deltaX);
            $panzoom.panzoom("pan",deltaX/2,deltaY/2,{
              animate: true,
              relative: true,
            });
          }
        })
        .on("mousedown touchstart",function(ev){
          var matrix = $container.find("#panel-1010-innerCt").panzoom("getMatrix");
          var offsetX = matrix[4];
          var offsetY = matrix[5];
          var dragstart = {x:ev.pageX,y:ev.pageY,dx:offsetX,dy:offsetY};
          $(ev.target).css("cursor","move");
          $(this).data('dragstart', dragstart);
        })
        .on("mousemove touchmove", function(ev){
          var dragstart = $(this).data('dragstart');
          if(dragstart)
          {
            var deltaX = dragstart.x-ev.pageX;
            var deltaY = dragstart.y-ev.pageY;
            var matrix = $container.find("#panel-1010-innerCt").panzoom("getMatrix");
            matrix[4] = parseInt(dragstart.dx)-deltaX;
            matrix[5] = parseInt(dragstart.dy)-deltaY;
            $container.find("#panel-1010-innerCt").panzoom("setMatrix",matrix);
          }
        })
        .on("mouseup touchend touchcancel", function(ev){
          $(this).data('dragstart',null);
          $(ev.target).css("cursor","");
        });
      });
      var currentScale = 1;
      $container.find(".item-dg").draggable({
        start: function(e){
          var pz = $container.find("#panel-1010-innerCt");
          currentScale = pz.panzoom("getMatrix")[0];
          $(this).css("cursor","move");
          pz.panzoom("disable");
        },
        drag: function(e,ui){
          ui.position.left = ui.position.left/currentScale;
          ui.position.top = ui.position.top/currentScale;
          console.log("snapped position: [" + ui.position.left + "|" + ui.position.top +"], currentScale:" + currentScale);
        },
        stop: function(e,ui){
          var nodeId = $(this).attr('id');
          if($(this).hasClass("jsplumb-connected"))
          {
            plumb.repaint(nodeId,ui.position);
          }
          $(this).css("cursor","");
          $container.find("#panel-1010-innerCt").panzoom("enable");
        }, grid: [20,20]
      });
    }
  }
});