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
		this.sorted = []
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
		this.setCircleSizeRelative();
		var overlapRatio = this.findOverlapRatio( this.sizeOne, this.sizeTwo, this.overlap );
		var overlapArea = this.findOverlapArea( overlapRatio );
		
		var largest = this.dataSets[this.sorted[0][0]]
		var smallest = this.dataSets[this.sorted[1][0]]
		
		
		console.log( this.findCircleArea ( largest["diameter"] ) )
		console.log( this.findCircleArea ( smallest["diameter"] ) )
		console.log(overlapArea);
		console.log( overlapArea / this.findCircleArea ( largest["diameter"]));
		
		var centerDistance = this.findIntersectDistance(largest["diameter"],
														smallest["diameter"],
														overlapArea);
														
		console.log(centerDistance);
		smallest["y"] = this.element.height/2;
		smallest["x"] = centerDistance + largest["x"];
		
		this.drawCircles();
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

	// Calculate relative size
	this.setCircleSizeRelative = function () {
		this.sorted = this.sortOnKey(this.dataSets, "size");
		this.sorted.reverse()
		largest = this.sorted[0][0];
		smallest = this.sorted[1][0];
		
		ratio = this.sorted[1][1]/this.sorted[0][1];
				
		this.dataSets[smallest]["diameter"] = this.maxDiameter * ratio;
		this.dataSets[smallest]["diameter"] = this.maxDiameter * ratio;
		
		// We can also set the x and y coordinates
		
		this.dataSets[largest]["diameter"]	= this.maxDiameter;
		this.dataSets[largest]["x"]	= this.maxDiameter/2;
		this.dataSets[largest]["y"]	= this.element.height/2;
	}

	// Calculate circle area
	this.findCircleArea = function (diameter) {
		return Math.PI * (this.sqr(diameter) / 4)
	}

	// Find square
	this.sqr = function (n) {
		return Math.pow(n, 2);
	}
	// Calculate intersection area

	this.findIntersectArea = function (r, R, d) {
		if(R < r){
			// swap
			s = r;
			r = R;
			R = s;
		}
		var part1 = r*r*Math.acos((d*d + r*r - R*R)/(2*d*r));
		var part2 = R*R*Math.acos((d*d + R*R - r*r)/(2*d*R));
		var part3 = 0.5*Math.sqrt((-d+r+R)*(d+r-R)*(d-r+R)*(d+r+R));

		var intersectionArea = part1 + part2 - part3;
		return intersectionArea;
	}

	// Calculate intersection distance
	this.findIntersectDistance = function (diameterOne, diameterTwo, overlap) {
		var distance = (diameterOne/2) + (diameterTwo/2);
		var currentArea = 0;
		
		while( currentArea < overlap ) {
			currentArea = this.findIntersectArea( diameterOne/2, diameterTwo/2, distance);
			distance-= 0.001;
		}
		
		return distance;
	}

	// Calculate overlap factor
	this.findOverlapRatio = function(sizeOne, sizeTwo, overlap) {
		return overlap / Math.max(sizeOne, sizeTwo);
	}

	// Calculate overlap area
	this.findOverlapArea = function(ratio, area) {
		var maxDiameter = this.dataSets[this.sorted[1][0]]["diameter"];
		var area = this.findCircleArea( maxDiameter );		
		return ratio * area;
	}

	// Calculate overlap position
	
	// Draw circle
	this.drawCircle = function( x, y, d ) {
		var ctx = this.context;
		ctx.beginPath();
		ctx.arc(x,y,d/2,0,2*Math.PI);
		ctx.stroke();
	}

	// Draw overlapping circles
	
	this.drawCircles = function () {
		console.log(this.dataSets);
		for ( c in this.dataSets ) {
			console.log(this.dataSets[c]);
			this.drawCircle( this.dataSets[c].x, this.dataSets[c].y, this.dataSets[c].diameter );
		}
	}

	// Draw text

	// Initialize
	this.init(element);

}
