jQuery(document).ready(
	function() {EVCSelectPage.init();}
);

var EVCSelectPage = {

	baseLink: "",

	steps: [
		"Year",
		"Make",
		"Model",
		"Type",
		"ODO"
	],

	init: function(){
		this.setupFields();
	},

	setupFields: function(){
		for(var i = 0; i < this.steps.length; i++) {
			var nameOfField = this.steps[i];
			var selectorOfField = "#Form_SelectForm_"+nameOfField;
			console.debug("setting up "+nameOfField);
			jQuery(selectorOfField).css("border", "1px solid blue");
			jQuery(selectorOfField).on(
				"change",
				function(){
					var nameOfField = jQuery(this).attr("name");
					var selectorOfField = "#"+ jQuery(this).attr("id");
					var valueOfField = jQuery(selectorOfField).val();
					var indexOfField = EVCSelectPage.steps.indexOf(nameOfField);
					var nextFieldName = EVCSelectPage.steps[indexOfField+1];
					console.debug("changing "+nameOfField+" to "+valueOfField);
					jQuery.ajax(
						{
							// The link we are accessing.
							url: EVCSelectPage.baseLink + "nextstep/" + nameOfField + "/"+valueOfField+"/",

							// The type of request.
							type: "get",
							
							// The type of data that is getting returned.
							dataType: "json",
							
							error: function(){
								window.location.reload();
							},
							
							beforeSend: function(){
							},
							
							complete: function(){
							},
							
							success: function( json ){
								alert("SUCCESS");
								if(typeof nextFieldName !== "undefined") {
									var nextFieldSelector = "#Form_SelectForm_"+nextFieldName;
									if(jQuery(nextFieldSelector).length && jQuery(nextFieldSelector).is("select")) {
										jQuery(nextFieldSelector).empty();
										jQuery.each(
											json,
											function(i, value) {
												jQuery(nextFieldSelector).append($('<option>').text(value).attr('value', value));
											}
										);
										jQuery(nextFieldSelector).focus();
									}
								}
								else {
									alert("submit now");
								}
							}
						}
					);
				}
			)
		}
	}


}
