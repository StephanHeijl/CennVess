var CennVess = function (element) {
	this.init = function (element) {
		this.element = document.getElementById(element);
		this.context = this.element.getContext("2d");
		this.sizeOne = 0;
		this.sizeTwo = 0;
		this.overlap = 0;
		this.padding = 0;
		this.textSize = 30;
		this.dataSets = {};
		this.colors = ["rgba(255,0,0,0.5)", "rgba(0,0,255,0.5)"];
		this.maxD = this.maxDiameter();
		this.sorted = []
		this.centerDistance = 0;
	}

	// Set canvas layout
	this.setLayout = function (padding) {
		this.padding = padding;
		this.maxD = this.maxDiameter();
	}

	// Colors
	this.setColors = function (colors) {
		this.colors = colors;
	}

	this.addColor = function (color) {
		this.colors.push(color);
	}
	
	this.lockColors = function () {
		for ( c in this.dataSets ) {
			this.dataSets[c]["color"] = this.colors[c];
		}
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
		this.lockColors();
		this.setCircleSizeRelative();
		
		var overlapRatio = this.findOverlapRatio( this.sizeOne, this.sizeTwo, this.overlap );
		var overlapArea = this.findOverlapArea( overlapRatio );
		
		var largest = this.dataSets[this.sorted[0][0]]
		var smallest = this.dataSets[this.sorted[1][0]]
		console.log(overlapRatio);
		console.log(overlapArea);
		
		this.centerDistance = this.findIntersectDistance(largest["diameter"],
														smallest["diameter"],
														overlapArea);
														
		console.log(this.centerDistance);
		console.log("");
														
		smallest["y"] = this.element.height/2;
		smallest["x"] = this.centerDistance + largest["x"];
		
		this.drawCircles();
		this.drawText(1, 1, 2, 0.5);
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
				
		this.dataSets[smallest]["diameter"] = this.maxD * ratio;
		this.dataSets[smallest]["diameter"] = this.maxD * ratio;
		
		// We can also set the x and y coordinates
		
		this.dataSets[largest]["diameter"]	= this.maxD;
		this.dataSets[largest]["x"]	= this.maxD/2;
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

	this.findIntersectArea = function (r, R, d, depth) {
		if ( depth> 10) {
			return 999999999;
		}
	
		if(R < r){
			// swap
			s = r;
			r = R;
			R = s;
		}
		
		this.chord = (d*d + r*r - R*R)/(2*d);
		
		var part1 = r*r*Math.acos((d*d + r*r - R*R)/(2*d*r));
		var part2 = R*R*Math.acos((d*d + R*R - r*r)/(2*d*R));
		var part3 = 0.5*Math.sqrt((-d+r+R)*(d+r-R)*(d-r+R)*(d+r+R));
		
		if( isNaN(part1) || isNaN(part2) || isNaN(part3) ) {
			console.log("Mistake...", depth)
			return this.findIntersectArea(r+0.02, R+0.02, d, depth+1);
		}
		
		//console.log( part1, "+", part2, "-", part3 );

		var intersectionArea = part1 + part2 - part3;
		return intersectionArea;
	}

	// Calculate intersection distance
	this.findIntersectDistance = function (diameterOne, diameterTwo, overlap) {
		var distance = (diameterOne/2) + (diameterTwo/2);
		var currentArea = 0;
		
		console.log(  diameterOne/2, diameterTwo/2, distance )
		
		do {
			currentArea = this.findIntersectArea( diameterOne/2, diameterTwo/2, distance, 0);
			distance-= 0.001;
		} while( currentArea < overlap )
		
		return distance;
	}

	// Calculate overlap factor
	this.findOverlapRatio = function(sizeOne, sizeTwo, overlap) {
		return overlap / Math.min(sizeOne, sizeTwo);
	}

	// Calculate overlap area
	this.findOverlapArea = function(ratio, area) {
		var maxDiameter = this.dataSets[this.sorted[1][0]]["diameter"];
		var area = this.findCircleArea( maxDiameter );		
		return ratio * area;
	}

	// Calculate overlap position
	
	// Draw circle
	this.drawCircle = function( x, y, d, color ) {
		var ctx = this.context;
		ctx.beginPath();
		ctx.arc(x,y,d/2,0,2*Math.PI);
		ctx.stroke();
		ctx.fillStyle = color;
		ctx.fill();
	}

	// Draw overlapping circles
	
	this.drawCircles = function () {	
		for ( c in this.dataSets ) {
			this.drawCircle( this.dataSets[c].x, this.dataSets[c].y, this.dataSets[c].diameter, this.dataSets[c].color );
		}
	}

	// Draw text
	this.drawText = function( sX, sY, sBlur, sOp ) {
	
		this.context.shadowColor = "rgba(0,0,0," + sOp + ")";
		this.context.shadowOffsetX = sX;
		this.context.shadowOffsetY = sY;
		this.context.shadowBlur = sBlur;
		this.context.fillStyle = "white";
				
		this.context.font= this.textSize + "px Arial";
		for ( c in this.dataSets ) {
			var text = this.dataSets[c].size;
			var x = this.dataSets[c].x - (this.context.measureText(text)["width"]/2);
			var y = this.dataSets[c].y + (this.textSize/2);
			
			
			this.context.fillText(text, x, y);
		}
		
		centerX =  this.dataSets[this.sorted[1][0]].x -  this.chord;
		centerX -= (this.context.measureText(this.overlap)["width"]/2);
		centerY = this.element.height/2 - (this.textSize);
		this.context.fillText(this.overlap, centerX, centerY);
		
	}
	
	this.clear = function() {
		this.context.clearRect ( 0,0,this.element.width, this.element.height );
		this.maxD = this.maxDiameter();
	}
	
	this.openAsImage = function() {
		window.open( this.element.toDataURL() );
	}

	// Initialize
	this.init(element);

}
