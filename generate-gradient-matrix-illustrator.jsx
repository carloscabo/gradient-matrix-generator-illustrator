//#target illustrator
/**
 * Adobe Illustrator script that generates a matrix of gradient combinations from a selection of colors
 * @author Carlos Cabo (@putuko) <carloscaboATgmailDOTcom>
 * @source https://github.com/carloscabo/gradient-matrix-generator-illustrator
 * @license MIT
 */

// Base Objects
var doc = app.activeDocument;
var selected_items = doc.selection;
var selected_count = selected_items.length;

// General AI config
app.defaultStroked = false;
app.defaultFilled = true;

// Check for minimun requirements
if (selected_count === 0) {
  var msg = '⚠️ No layers are selected!.';
  alert(msg);
  throw msg;
} else if (selected_count < 2) {
  var msg = '⚠️ You need at least 2 color filed layers!';
  alert(msg);
  throw msg;
}

// Base swatch object
var swatch = {
  w: 50,
  h: 35,
  spacing: 0
};

// Base artboard object
var artb = {
  x: 0,
  y: 0
}


var my_colors = [];
// Make a copy of selected objects
var selected_sorted = selected_items.slice();
// Sort by x position left -> right
selected_sorted.sort(function (a, b) { return b.left < a.left });
for (var i = 0; i < selected_sorted.length; i++) {
  my_colors.push(selected_sorted[i].fillColor);
}

// Initial sizes and positions
swatch.w = selected_sorted[0].width;
swatch.h = selected_sorted[0].height;
swatch.spacing = selected_sorted[1].left - selected_sorted[0].left - selected_sorted[0].width;
artb.x = selected_sorted[0].left;
artb.y = selected_sorted[0].top - swatch.h - swatch.spacing;
//$.writeln(swatch.w + ' ' + swatch.h + ' ' + swatch.spacing);

for (var i = 0; i < my_colors.length; i++) {
  var swatch_y = artb.y - (i * (swatch.h + swatch.spacing));
  var color_row = my_colors[i];

  for (var j = 0; j < my_colors.length; j++) {
    var swatch_x = artb.x + (j * (swatch.w + swatch.spacing));
    var color_column = my_colors[j];

    // Gradient creation
    var new_gradient = doc.gradients.add();
    new_gradient.type = GradientType.LINEAR;
    new_gradient.gradientStops[0].rampPoint = 0;
    new_gradient.gradientStops[0].midPoint = 50;
    new_gradient.gradientStops[0].color = color_column;
    new_gradient.gradientStops[1].rampPoint = 100;
    new_gradient.gradientStops[1].color = color_row;

    // If start and en color are teh same we set opacity to 0
    if (i == j) {
      new_gradient.gradientStops[0].opacity = 0;
    }

    // Color gradient object
    var color_of_gradient = new GradientColor();
    color_of_gradient.gradient = new_gradient;

    // top, left, width, height[,reversed])
    var new_item = doc.pathItems.rectangle(swatch_y, swatch_x, swatch.w, swatch.h);
    new_item.fillColor = color_of_gradient;

    // Rotates the gradient 45 degrees
    new_item.rotate(45, false, false, true, false, Transformation.CENTER);
  }
};

