var CennVess = function (element) {
	this.init = function (element) {
		this.element = document.getElementById(element);
		this.context = this.element.getContext("2d");
		this.sizeOne = 0;
		this.sizeTwo = 0;
		this.overlap = 0;
		this.padding = 0;
		this.dataSets = {};
		this.colors = [];
		this.maxDiameter = this.maxDiameter();
	}

	// Set canvas layout
	this.setLayout = function (padding) {
		this.padding = padding;
		this.maxDiameter = this.maxDiameter();
	}

	// Colors
	this.setColors = function (colors) {
		this.colors = colors;
	}

	this.addColor = function (color) {
		this.colors.push(color);
	}

	// Set data sets
	this.addData = function (sizeOne, sizeTwo, overlap) {
		this.sizeOne = sizeOne;
		this.sizeTwo = sizeTwo;
		this.overlap = overlap;

		this.dataSets = [{
				"size" : sizeOne,
				"overlap" : [overlap]
			}, {
				"size" : sizeTwo,
				"overlap" : [overlap]
			}
		];
	}

	this.start = function () {
		this.findCircleSizeRelative();
	}

	// Find max diameter for circles
	this.maxDiameter = function () {
		var w = this.element.width - this.padding;
		var h = this.element.height - this.padding;

		// We need to add at least two circles in here.
		// We assume a diagram that places the circles next to each other.
		// As such, the maximum diameter of the circles either the width
		// of the canvas cut in half, or the height of the document, whichever
		// is lower.
		return Math.min((w / 2), h);
	}

	// Sort object by key
	this.sortOnKey = function (object, key) {
		var sortable = [];
		for (k in object) {
			sortable.push([parseInt(k), object[k][key]]);
		}
		sortable.sort(function (a, b) {
			return a[1] - b[1]
		});
		return sortable;
	}

	// Reverse array
	this.reverseArray = function (array) {
		var i = null;
		var r = null;
		for (i = 0, r = length - 1; i < r; i += 1, r -= 1) {
			var left = array[i];
			var right = array[r];
			left ^= right;
			right ^= left;
			left ^= right;
			array[i] = left;
			array[r] = right;
		}
		return array;
	}

	// Calculate relative size
	this.findCircleSizeRelative = function () {
		console.log(this.dataSets);
		var sorted = this.sortOnKey(this.dataSets, "size");
		console.log(sorted)
		sorted.reverse()
		console.log(sorted)

	}

	// Calculate circle area
	this.findArea = function (diameter) {
		return Math.Pi * ((diameter^2) / 4)
	}

	// Find square
	this.sqr = function (n) {
		return Math.pow(n, 2);
	}
	// Calculate intersection area

	this.findIntersectArea = function (r1, R2, d) {
		var sqrt = Math.sqrt;
		var sqr = this.sqr;
		var arccos = Math.acos;
		
		var A= sqr(r1)*arccos((sqr(d)+sqr(r1)-sqr(R2))/(2*d*r1)) + sqr(R2)*arccos((sqr(d)+sqr(R2)-sqr(r1))/(2*d*R2)) - -.5*sqrt((-d+r1+R2)*(d+r1-R2)*(d-r1+R2)*(d+r1+R2));
		return A;
	}

	// Calculate intersection distance
	this.findIntersectDistance = function (diameterOne, diameterTwo, overlap) {
		var distance = (diameterOne/2) + (diameterTwo/2);
		var currentArea = 0;
		
		while( currentArea < overlap ) {
			currentArea = this.findIntersectArea( diameterOne/2, diameterTwo/2, distance);
			distance--;
		}
		
		return distance;

	}

	// Calculate relative area

	// Calculate overlap size

	// Calculate overlap area

	// Calculate overlap position
	
	// Draw circle
	this.drawCircle = function( x, y, r ) {
		var ctx = this.context;
		ctx.beginPath();
		ctx.arc(x,y,r,0,2*Math.PI);
		ctx.stroke();
	}

	// Draw overlapping circles

	// Draw text

	// Initialize
	this.init(element);

}
