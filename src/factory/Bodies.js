// TODO: true circle bodies

var Bodies = {};

(function() {

    Bodies.rectangle = function(x, y, width, height, options) {
        options = options || {};

        var rectangle = { 
                position: { x: x, y: y },
                path: 'L 0 0 L ' + width + ' 0 L ' + width + ' ' + height + ' L 0 ' + height
            };

        return Body.create(Common.extend({}, rectangle, options));
    };
    
    Bodies.trapezoid = function(x, y, width, height, slope, options) {
        options = options || {};

        slope *= 0.5;
        var roof = (1 - (slope * 2)) * width;
        
        var x1 = width * slope,
            x2 = x1 + roof,
            x3 = x2 + x1;

        var trapezoid = { 
                position: { x: x, y: y },
                path: 'L 0 0 L ' + x1 + ' ' + (-height) + ' L ' + x2 + ' ' + (-height) + ' L ' + x3 + ' 0'
            };

        return Body.create(Common.extend({}, trapezoid, options));
    };

    Bodies.circle = function(x, y, radius, options, maxSides) {
        options = options || {};
        
        // approximate circles with polygons until true circles implemented in SAT

        maxSides = maxSides || 25;
        var sides = Math.ceil(Math.max(10, Math.min(maxSides, radius)));

        // optimisation: always use even number of sides (half the number of unique axes)
        if (sides % 2 === 1)
            sides += 1;

        // flag for better rendering
        options.circleRadius = radius;

        return Bodies.polygon(x, y, sides, radius, options);
    };

    Bodies.polygon = function(x, y, sides, radius, options) {
        options = options || {};

        if (sides < 3)
            return Bodies.circle(x, y, radius, options);

        var theta = 2 * Math.PI / sides,
            path = '',
            offset = theta * 0.5;

        for (var i = 0; i < sides; i += 1) {
            var angle = offset + (i * theta),
                xx = Math.cos(angle) * radius,
                yy = Math.sin(angle) * radius;

            path += 'L ' + xx.toFixed(3) + ' ' + yy.toFixed(3) + ' ';
        }

        var polygon = { 
                position: { x: x, y: y },
                path: path
            };

        return Body.create(Common.extend({}, polygon, options));
    };

})();