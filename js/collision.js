
// Collision - Header
// adapted from: https://bl.ocks.org/mbostock/3231307 

var width = 1500,
height = 650;

var num = 400,
base = 2,
dif = 14;

var nodes = d3.range(num).map(function() { return {radius: Math.random() * dif + base }; }),
root = nodes[0],
color =  ['#4b4c6e','#727394','#aeaecf','#ceceed','#95deda']// ['#9d9ec2', '#cccde0', '#4f92f7', '#2c2d2e', '#fff', '#c23096'];

root.radius = 0;
root.fixed = true;
root.px = width/2;
root.py = height/2;

var force = d3.layout.force()
.gravity(0.015)
.charge(function(d, i) { return i ? 0 : - (height + width); })
.nodes(nodes)
.size([width, height]);

force.start();

var canvas = d3.select("#background").append("canvas")
.attr("width", width)
.attr("height", height);

var context = canvas.node().getContext("2d");

force.on("tick", function(e) {
var q = d3.geom.quadtree(nodes),
  i,
  d,
  n = nodes.length;

for (i = 1; i < n; ++i) q.visit(collide(nodes[i]));

context.clearRect(0, 0, width, height);
force.size([width, height]);
for (i = 1; i < n; ++i) {
context.fillStyle = color[i % color.length];
context.globalAlpha = 0.6;
d = nodes[i];
context.moveTo(d.x, d.y);
context.beginPath();
context.arc(d.x, d.y, d.radius, 0, 2 * Math.PI);
context.fill();
}
});


canvas.on("mousemove", move);
canvas.on("touchmove", move);

function move() {
  var p1 = d3.mouse(this);
  root.px = p1[0];
  root.py = p1[1];
  force.resume();
};

function collide(node) {
  var r = node.radius + 16,
      nx1 = node.x - r,
      nx2 = node.x + r,
      ny1 = node.y - r,
      ny2 = node.y + r;
  return function(quad, x1, y1, x2, y2) {
    if (quad.point && (quad.point !== node)) {
      var x = node.x - quad.point.x,
          y = node.y - quad.point.y,
          l = Math.sqrt(x * x + y * y),
          r = node.radius + quad.point.radius + 7;
      if (l < r) {
        l = (l - r) / l * .5;
        node.x -= x *= l;
        node.y -= y *= l;
        quad.point.x += x;
        quad.point.y += y;
      }
    }
    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
  };
}
