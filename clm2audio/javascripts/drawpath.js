/**
 * cvs_element : canvas element (e.g. document.querySelector("canvas"))
 * points : plot points [[[x0, y0], [x1, y1], ...],  ... ]
 * line_color : line color (e.g. "rgb(255, 0, 0)")
 * line_width : pixel order line width  (e.g. "rgb(255, 0, 0)")
 * flag : if true, path is closed.
 */

function clear(cvs_element, color) {

  var ctx = cvs_element.getContext('2d')
  ctx.clearRect(0, 0, cvs_element.width, cvs_element.height);

//  ctx.fillStyle = color || "#fff"
//  ctx.beginPath();
//  ctx.fillRect(0, 0, cvs_element.width, cvs_element.height);
//  ctx.closePath();
}

function drawPath(cvs_element, points, line_color, line_width, close_flag ) {
  var ctx = cvs_element.getContext("2d")

  line_color = line_color || "#000";
  line_width = line_width || 1;
  close_flag = !!close_flag; // default false

  var rad = parseInt(line_width * 1.2);

  ctx.strokeStyle = line_color;
  ctx.lineWidth = line_width;
  ctx.lineCap = "round";

  points.forEach(function(points_){
    for(var i = 0; points_[i]; i++) {
      var method = i === 0 ? "moveTo" : "lineTo"
      var x = points_[i][0], y = points_[i][1]

      ctx[method](x, y)

      ctx.moveTo(x + rad, y)
      ctx.arc(x, y, rad, 0, 2 * Math.PI, false)
      ctx.moveTo(x, y)
    }
    if(close_flag) ctx.lineTo(points_[0][0], points_[0][1]);
  })

  ctx.stroke();
}

function drawPCM(cvs_element, points, line_color /* default = black */, line_width ) {
  cvs_element = cvs_element || document.getElementById("visualizer");
  var ctx = cvs_element.getContext("2d")
    , len = points.length - 1
    , w = cvs_element.width
    , h = cvs_element.height
    , GAIN = h / 2
  ctx.clearRect(0, 0, cvs_element.width, cvs_element.height);

  line_color = line_color || "#000";
  line_width = line_width || 1;


  ctx.beginPath();
  ctx.strokeStyle = line_color;
  ctx.lineWidth = line_width;
  ctx.lineCap = "round";

  for(var i = 0, l = points.length; i < l; i++) {
      var method = i === 0 ? "moveTo" : "lineTo"
      var x = w / len * i
        , y = (h / 2) + points[i] * GAIN;

      ctx[method](x, y)
  }

  ctx.stroke();
}
