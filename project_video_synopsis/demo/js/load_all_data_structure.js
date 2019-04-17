
function test_fun(what_obj) {
	var a = what_obj + what_obj;
	return a;
}


function load_all_structure(method_name) {

	// ===================== To decompose space =====================
	var whole_panel = d3.select("p");

	// add graph title
	var title_block = whole_panel.append("div").attr("class", "title");
	title_block.append("text").text("Semantic data structure discovered by " + method_name + ". Colour: inferred tag; Size: inference confidence; Edge: pairwise similarity.");

	var legend_panel = whole_panel.append("div").attr("class", "panel legend_panel this_panel");
	var graph_panel = whole_panel.append("div").attr("class", "panel graph_panel this_panel");


	// ===================== To deal with legend panel =====================
	// 1. No Event
	// 2. Do Cleaning
	// 3. Career Fair
	// 4. Forum on Gun Control and Gun Violence
	// 5. Group Studying
	// 6. Scholarship Competition
	// 7. Accommodative Service
	// 8. Spring Semester Orientation		
	var evt_name = ["No Event", "Cleaning", "Career Fair", "Gun Forum", "Group Study", 
			"Scholarship Competition", "Accommodative Service", "Student Orientation"];			
	var node_colours = ["BlueViolet", "IndianRed", "ForestGreen", "RoyalBlue", 
					"CadetBlue", "SaddleBrown", "DarkOrange", "DeepPink"];

	var legend_svg_graph_svg_w = 170;
	var legend_svg_graph_svg_h = 800;

	var legend_icon_r = 15;
	var legend_icon_x = legend_icon_r + 2;
	var legend_icon_start_y = legend_icon_r + 2;
	var legend_icon_dist = 100;

	var legend_text_x = legend_icon_x + legend_icon_r + 5;	

	var legend_img_height = legend_icon_dist - legend_icon_r - 3;
	var legend_img_width = Math.round(640 / 480 * legend_img_height);
	var legend_img_x = legend_text_x;

	var legend_svg = legend_panel.append("svg").attr("width", legend_svg_graph_svg_w).attr("height", legend_svg_graph_svg_h);
		
	// add legend icons
	var legend_icons = legend_svg.selectAll("circle")
				.data(evt_name)
				.enter()
				.append("circle");

	legend_icons.attr("fill", function(d, i) { return node_colours[i]; })
		.attr("cx", legend_icon_x )
		.attr("cy", function(d, i) { return i * legend_icon_dist + legend_icon_start_y; } )
		.attr("r", legend_icon_r);
					
	// add legend text
	var legend_texts = legend_svg.selectAll("text")
				.data(evt_name)
				.enter()
				.append("text")
				.text(function(d) {
					return d;
				})
				.attr("x", legend_text_x )
				.attr("y", function(d, i) { return i * legend_icon_dist + legend_icon_start_y; } )
				.attr("class", "legend_text");


	// add legend images
	var legend_imgs = legend_svg.selectAll("image")
			.data(evt_name)
			.enter()
			.append("image")
			.attr("class", "legend_img")
			.attr("xlink:href", function(d) {return "imgs/evt_rep/" + d + ".jpg";})
			.attr("x", legend_img_x)
			.attr("y", function(d, i) {return  legend_icon_start_y + 2 + i * legend_icon_dist;})
			.attr("width", legend_img_width)
			.attr("height", legend_img_height);


	// add links to event data structure
	if (method_name == "our MSC-Forest model")
	{
		var evt_data_link = ["Career_Fair_structure.html", "Gun_Forum_structure.html", "Group_Study_structure.html", "Scholarship_Competition_structure.html"];
		var evt_link_x = legend_icon_x - legend_icon_r;
		var evt_links = legend_svg.selectAll("a")
							.data(evt_data_link)
							.enter()
							.append("a")
							.attr("xlink:href", function (d) {return d;})
							.attr("x", evt_link_x)
							.attr("y", function(d, i) {return i * 100;});

		evt_links.append("image").attr("xlink:href", "imgs/go.png")
						.attr("width", 30)
						.attr("height", 30)
						.attr("x", evt_link_x)
						.attr("y", function (d, i) {return  legend_icon_start_y + legend_icon_dist / 3 + (i + 2) * legend_icon_dist; });

	}


	// ===================== To create force graph =====================  
	var graph_svg_w = 900;
	var graph_svg_h = 800;

	var graph_svg = graph_panel.append("svg").attr("width", graph_svg_w).attr("height", graph_svg_h);

								 
	// add links between data samples
	var force = d3.layout.force()
		.gravity(.05)
		.distance(30)
		.charge(-8)
		.size([graph_svg_w, graph_svg_h]);
			
	d3.json("json/structure_all_data " + method_name + ".json", function(error, json) {
		force
		.nodes(json.nodes)
		.links(json.links)
		.start();

		var link = graph_svg.selectAll(".link")
			.data(json.links)
			.enter().append("line")
			.attr("stroke-width", function(d){return Math.min(8, Math.round(d.value/10));})
			.attr("class", "link");

		var node = graph_svg.selectAll("circle")
			.data(json.nodes)
			.enter().append("circle")
			.attr("r", function(d) { return d.belief * 7; })
			.attr("fill", function(d) {return node_colours[d.tag-1]})
			.call(force.drag);

		force.on("tick", function() {
			link.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });

			node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
		});
	});	

}