<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <div class="controls">
      <p>
        <button id="edit" @click="edit">
          Toggle editing polygon
        </button>
      </p>
    </div>
    <div class="canvas-body">
      <canvas id="c" width="500" height="400" style="border: 1px solid #ccc;" />
    </div>
  </div>
</template>
<script setup>

</script>

<script>
// @ is an alias to /src
import { fabric } from 'fabric'
export default {
  name: 'HomeView',
  components: {
  },
  data () {
    return {
      points: [
        {
          x: 3,
          y: 4
        },
        {
          x: 16,
          y: 3
        },
        {
          x: 30,
          y: 5
        },
        {
          x: 25,
          y: 55
        },
        {
          x: 19,
          y: 44
        },
        {
          x: 15,
          y: 30
        },
        {
          x: 15,
          y: 55
        },
        {
          x: 9,
          y: 55
        },
        {
          x: 6,
          y: 53
        },
        {
          x: -2,
          y: 55
        },
        {
          x: -4,
          y: 40
        },
        {
          x: 0,
          y: 20
        }
      ],
      polygon: null,
      Editfun: null
    }
  },
  mounted () {
    console.log(process.env.BASE_URL + '旋转-1.png')
    const controlsUtils = fabric.controlsUtils
    // fabric.Object.prototype.controls.mtr = new fabric.Control({
    //   x: 0,
    //   y: -0.5,
    //   actionHandler: controlsUtils.rotationWithSnapping,
    //   cursorStyleHandler: () => ('url(' + require('@/assets/旋转-1.png') + '),crosshair'),
    //   offsetY: -40,
    //   withConnection: true,
    //   actionName: 'rotate'
    // })
    // 需要使用 cur,ico 格式
    fabric.Control.prototype.cursorStyle = 'url("' + process.env.BASE_URL + '旋转.ico") 16 16,pointer'
    const canvas = new fabric.Canvas('c', {
      // uniformScaling: false, // true.默认拖动时按比例缩放， false.默认自由缩放
      // uniScaleKey: 'shiftKey' // 按住该键时，切换 uniformScaling 缩放模式
    })
    // create a polygon object
    const polygon = this.polygon = new fabric.Polygon(this.points, {
      left: 500,
      top: 100,
      fill: '#66B1FF',
      strokeWidth: 1,
      stroke: '#409EFF',
      scaleX: 4,
      scaleY: 4,
      objectCaching: false,
      // flipY: true,
      // transparentCorners: false,
      cornerColor: '#1883F1',
      cornerSize: 10
      // angle: 123
    })
    canvas.set({
      // centeredRotation: false,
      uniformScaling: false, // true.默认拖动时按比例缩放， false.默认自由缩放
      uniScaleKey: 'shiftKey' // 按住该键时，切换 uniformScaling 缩放模式
    })
    canvas.viewportTransform = [0.7, 0, 0, 0.7, -50, 50]
    canvas.add(polygon)

    // define a function that can locate the controls.
    // this function will be used both for drawing and for interaction.
    function polygonPositionHandler (dim, finalMatrix, fabricObject) {
      const x = fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x
      const y = fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y
      return fabric.util.transformPoint(
        { x: x, y: y },
        fabric.util.multiplyTransformMatrices(
          fabricObject.canvas.viewportTransform,
          fabricObject.calcTransformMatrix()
        )
      )
    }

    function getObjectSizeWithStroke (object) {
      const stroke = new fabric.Point(
        object.strokeUniform ? 1 / object.scaleX : 1,
        object.strokeUniform ? 1 / object.scaleY : 1
      ).multiply(object.strokeWidth)
      return new fabric.Point(object.width + stroke.x, object.height + stroke.y)
    }

    // define a function that will define what the control does
    // this function will be called on every mouse move after a control has been
    // clicked and is being dragged.
    // The function receive as argument the mouse event, the current trasnform object
    // and the current position in canvas coordinate
    // transform.target is a reference to the current object being transformed,
    function actionHandler (eventData, transform, x, y) {
      const polygon = transform.target
      const currentControl = polygon.controls[polygon.__corner]
      const mouseLocalPosition = polygon.toLocalPoint(
        new fabric.Point(x, y),
        'center',
        'center'
      )
      const polygonBaseSize = getObjectSizeWithStroke(polygon)
      const size = polygon._getTransformedDimensions(0, 0)
      const finalPointPosition = {
        x:
      (mouseLocalPosition.x * polygonBaseSize.x) / size.x +
      polygon.pathOffset.x,
        y:
      (mouseLocalPosition.y * polygonBaseSize.y) / size.y +
      polygon.pathOffset.y
      }
      polygon.points[currentControl.pointIndex] = finalPointPosition
      return true
    }

    // define a function that can keep the polygon in the same position when we change its
    // width/height/top/left.
    function anchorWrapper (anchorIndex, fn) {
      return function (eventData, transform, x, y) {
        const fabricObject = transform.target
        const absolutePoint = fabric.util.transformPoint(
          {
            x: fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x,
            y: fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y
          },
          fabricObject.calcTransformMatrix()
        )
        const actionPerformed = fn(eventData, transform, x, y)
        const newDim = fabricObject._setPositionDimensions({})
        const polygonBaseSize = getObjectSizeWithStroke(fabricObject)
        const newX =
      (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) /
      polygonBaseSize.x
        const newY =
      (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) /
      polygonBaseSize.y
        fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5)
        return actionPerformed
      }
    }

    function Edit () {
      // clone what are you copying since you
      // may want copy and paste on different moment.
      // and you do not want the changes happened
      // later to reflect on the copy.
      const poly = canvas.getObjects()[0]
      canvas.setActiveObject(poly)
      poly.edit = !poly.edit
      if (poly.edit) {
        const lastControl = poly.points.length - 1
        poly.cornerStyle = 'circle'
        poly.cornerColor = 'rgba(0,0,255,0.5)'
        poly.controls = poly.points.reduce(function (acc, point, index) {
          acc['p' + index] = new fabric.Control({
            positionHandler: polygonPositionHandler,
            actionHandler: anchorWrapper(
              index > 0 ? index - 1 : lastControl,
              actionHandler
            ),
            actionName: 'modifyPolygon',
            pointIndex: index,
            cursorStyleHandler: function (eventData, control, fabricObject) {
              console.log(arguments)
              return 'move'
            }
          })
          return acc
        }, {})
      } else {
        poly.cornerColor = 'blue'
        poly.cornerStyle = 'rect'
        poly.controls = fabric.Object.prototype.controls
      }
      poly.hasBorders = !poly.edit
      canvas.requestRenderAll()
    }
    this.Editfun = Edit
  },
  methods: {
    edit () {
      this.Editfun()
    }
  }
}
</script>
<style lang="less" scoped>
.controls {
  display: inline-block;
}
.canvas-body{
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
