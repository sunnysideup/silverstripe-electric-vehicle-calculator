
Number.prototype.formatMoney = function(c, d, t){
	var n = this, 
	c = isNaN(c = Math.abs(c)) ? 0 : c, 
	d = d == undefined ? "." : d, 
	t = t == undefined ? "," : t, 
	s = n < 0 ? "-" : "", 
	i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
	j = (j = i.length) > 3 ? j % 3 : 0;
	return s + "$" + (j ? i.substr(0, j) + t : "") +  i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

Number.prototype.formatPercentage = function(){
	var n = this;
	return n + "%";
};

Number.prototype.formatNumber = function() {
	var n = this;
	return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}



jQuery(document).ready(
	function(){
		EVCalculator.init();
		EVCalculatorTableInteraction.init();
	}
);



var EVCalculator = {

	keyAssumptionKeys: {
		"CVValue":                           "currency",
		"kmDrivenPerYear":                   "number",
		"daysWithContinuousTripsOver100Km":  "number",
		"subsidyPaymentFixed":               "currency",
		"subsidyPaymentPerKM":               "currency"
	},

	otherAssumptionKeys: {
		"numberOfYears":                     "number",
		"upgradeCostToGoElectric":           "currency",
		"setupChargeStation":                "currency",
		"financingCostInPercentage":         "percentage",
		"saleCostForCarInPercentage":        "percentage",
		"costOfPetrolPerLitre":              "currency",
		"costOfElectricityPerKwH":           "currency",
		"fuelEfficiencyCV":                  "number",
		"fuelEfficiencyEV":                  "number",
		"insuranceBaseCost":                 "currency",
		"insuranceCostPerThousand":          "currency",
		"numberOfTyresPerFortyThousandKm":   "number",
		"tyreCostCV":                        "currency",
		"tyreCostEV":                        "currency",
		"licenseWOFCostCVPerYear":           "currency",
		"licenseWOFCostEVPerYear":           "currency",
		"maintenanceCVPerTenThousandKm":     "currency",
		"maintenanceEVPerTenThousandKm":     "currency",
		"depreciationRatePerYear":           "percentage",
		"costPerDayRentalCar":               "currency",
		"kilometresPerDayForLongTrips":      "number"
	},

	/* key assumptions */
	CVValue:                             10000,
	kmDrivenPerYear:                     20000,
	daysWithContinuousTripsOver100Km:       10,
	subsidyPaymentFixed:                  1000,
	subsidyPaymentPerKM:                  0.05,

	/* other assumptions */
	numberOfYears:                           1,
	upgradeCostToGoElectric:               150,
	setupChargeStation:                    300,
	financingCostInPercentage:              10,
	saleCostForCarInPercentage:             12,
	costOfPetrolPerLitre:                 2.00,
	costOfElectricityPerKwH:              0.20,
	fuelEfficiencyCV:                       12,
	fuelEfficiencyEV:                        5,
	insuranceBaseCost:                     200,
	insuranceCostPerThousand:               50,
	numberOfTyresPerFortyThousandKm:         4,
	tyreCostCV:                            100,
	tyreCostEV:                            150,
	licenseWOFCostCVPerYear:               250,
	licenseWOFCostEVPerYear:               350,
	maintenanceCVPerTenThousandKm:        1200,
	maintenanceEVPerTenThousandKm:         200,
	depreciationRatePerYear:                27,
	costPerDayRentalCar:                    70,
	kilometresPerDayForLongTrips:          300,

	/* key assumptions Labels */
	CVValueLabel:                                 "Current Car Value",
	kmDrivenPerYearLabel:                         "Kilometers Driven Per Year",
	daysWithContinuousTripsOver100KmLabel:        "Big Trip Days Per Year",
	subsidyPaymentFixedLabel:                     "Fixed Subsidy for E-Vehicle",
	subsidyPaymentPerKMLabel:                     "Kilometer Subsidy for E-Vehicle",

	/* other assumptions */
	numberOfYearsLabel:                           "Years calculated",
	upgradeCostToGoElectricLabel:                 "Upgrade Cost to go Electrical (percentage)",
	setupChargeStationLabel:                      "Infrastructure Set Up Cost",
	financingCostInPercentageLabel:               "Finance Cost In Percentage",
	saleCostForCarInPercentageLabel:              "Sale Cost in Percentage",
	costOfPetrolPerLitreLabel:                    "Cost of Petrol per Litre",
	costOfElectricityPerKwHLabel:                 "Cost of Electricity per KwH",
	fuelEfficiencyCVLabel:                        "Fuel Efficiency KM per Litre of Petrol",
	fuelEfficiencyEVLabel:                        "Fuel Efficiency KM per KwH",
	insuranceBaseCostLabel:                       "Insurance Base Cost",
	insuranceCostPerThousandLabel:                "Insurance Cost per $1000 of Car Value",
	numberOfTyresPerFortyThousandKmLabel:         "Number of Tyres needed per 40,000km",
	tyreCostCVLabel:                              "Tyre Cost for Current Car",
	tyreCostEVLabel:                              "Tyre Cost for Electric Car",
	licenseWOFCostCVPerYearLabel:                 "License and WOF cost per year for current car",
	licenseWOFCostEVPerYearLabel:                 "License and WOF cost per year for electric car",
	maintenanceCVPerTenThousandKmLabel:           "Maintenance cost per 10,000 current car",
	maintenanceEVPerTenThousandKmLabel:           "Maintenance cost per 10,000 electric car",
	depreciationRatePerYearLabel:                 "car depreciation rate per year",
	costPerDayRentalCarLabel:                     "cost per day day for rental car",
	kilometresPerDayForLongTripsLabel:            "Kilometers per day for Trips",

	/* key assumptions Descs */
	CVValueDesc:                                 "",
	kmDrivenPerYearDesc:                         "",
	daysWithContinuousTripsOver100KmDesc:        "more than 150km per day",
	subsidyPaymentFixedDesc:                     "",
	subsidyPaymentPerKMDesc:                     "",

	/* other assumptions */
	numberOfYearsDesc:                           "",
	upgradeCostToGoElectricDesc:                 "",
	setupChargeStationDesc:                      "",
	financingCostInPercentageDesc:               "",
	saleCostForCarInPercentageDesc:              "",
	costOfPetrolPerLitreDesc:                    "",
	costOfElectricityPerKwHDesc:                 "",
	fuelEfficiencyCVDesc:                        "",
	fuelEfficiencyEVDesc:                        "",
	insuranceBaseCostDesc:                       "",
	insuranceCostPerThousandDesc:                "",
	numberOfTyresPerFortyThousandKmDesc:         "",
	tyreCostCVDesc:                              "",
	tyreCostEVDesc:                              "",
	licenseWOFCostCVPerYearDesc:                 "",
	licenseWOFCostEVPerYearDesc:                 "",
	maintenanceCVPerTenThousandKmDesc:           "",
	maintenanceEVPerTenThousandKmDesc:           "",
	licenseWOFCostEVPerYearDesc:                 "",
	depreciationRatePerYearDesc:                 "",
	costPerDayRentalCarDesc:                     "",
	kilometresPerDayForLongTripsDesc:            "",
	
	/* calculations */
	setupCost: function(carType){
		if(carType == "e") {
			return this.setupChargeStation;
		}
		else {
			return 0;
		}
	},

	valueStartOfTheYear: function(carType){
		if(carType == "e") {
			return (this.CVValue * (this.upgradeCostToGoElectric / 100));
		}
		else {
			return this.CVValue;
		}
	},

	financeCost: function(carType){
		if(carType == "e") {
			console.debug("A" + this.valueStartOfTheYear(carType));
			console.debug("B" + this.financingCostInPercentage);
			console.debug("C" + this.financingCostInPercentage / 100);
			return this.valueStartOfTheYear(carType) * (this.financingCostInPercentage / 100);
		}
		else {
			return 0;
		}
	},

	insuranceCost: function(){
		return this.insuranceBaseCost + ((this.valueStartOfTheYear() / 1000) * this.insuranceCostPerThousand);
	},

	licensingAndWOFCost: function(carType) {
		if(carType == "e") {
			return this.licenseWOFCostEVPerYear;
		}
		else {
			return this.licenseWOFCostCVPerYear;
		}
	},

	actualAnnualKms: function(carType){
		if(carType == "e") {
			return this.kmDrivenPerYear - (this.daysWithContinuousTripsOver100Km * this.kilometresPerDayForLongTrips);
		}
		else {
			return this.kmDrivenPerYear;
		}
	},

	fuelCost: function(carType) {
		if(carType == "e") {
			return (this.actualAnnualKms(carType) / this.fuelEfficiencyEV) * this.costOfElectricityPerKwH;
		}
		else {
			return (this.actualAnnualKms(carType) / this.fuelEfficiencyCV) * this.costOfPetrolPerLitre;
		}
	},

	maintenanceCost: function(carType) {
		var tyresNeeded = (this.actualAnnualKms(carType)  / 40000) * this.numberOfTyresPerFortyThousandKm;
		if(carType == "e") {
			var maintanceCost = (this.actualAnnualKms(carType)  / 10000) * this.maintenanceEVPerTenThousandKm;
			var tyreCost = tyresNeeded * this.tyreCostEV;
		}
		else {
			var maintanceCost = (this.actualAnnualKms(carType)  / 10000) * this.maintenanceCVPerTenThousandKm;
			var tyreCost = tyresNeeded * this.tyreCostCV;
		}
		return maintanceCost + tyreCost;
	},

	carRentalCost: function(carType) {
		if(carType == "e") {
			return this.daysWithContinuousTripsOver100Km * this.costPerDayRentalCar;
		}
		else {
			return 0;
		}
	},

	resellValueAtEndOfYear: function(carType){
		var startOfYearValue = this.valueStartOfTheYear(carType);
		return startOfYearValue - (startOfYearValue * (this.depreciationRatePerYear/100));
	},

	/* totals */

	totalUpFrontPayment: function(carType) {
		return this.setupCost(carType);
	},

	totalFinanceCost: function(carType) {
		return this.financeCost(carType);
	},

	totalFixedCost: function(carType) {
		return this.insuranceCost(carType) + this.licensingAndWOFCost(carType);
	},

	totalOperatingCost: function(carType) {
		return this.fuelCost(carType) + this.maintenanceCost(carType);
	},

	totalOtherCost: function(carType) {
		if(carType == "e") {
			var rentalCost = this.carRentalCost(carType);
			var subsidyInput = this.subsidyPaymentFixed + (this.subsidyPaymentPerKM * this.actualAnnualKms(carType));
			return rentalCost - subsidyInput;
		}
		else {
			return 0;
		}
	},
	
	totalCombined: function(carType) {
		return parseFloat(this.totalUpFrontPayment(carType)) + parseFloat(this.totalFinanceCost(carType)) + parseFloat(this.totalFixedCost(carType)) + parseFloat(this.totalOperatingCost(carType)) + parseFloat(this.totalOtherCost(carType));
	},

	totalProfit: function(){
		return this.totalCombined("f") - this.totalCombined("e");
	},

	init: function(){
		this.buildKeyAssumptionForm();
		this.buildOtherAssumptionsForm();
		this.populateResultTable();
	},


	buildKeyAssumptionForm: function() {
		jQuery("#KeyAssupmptions").html(
			"<h2>key assumptions</h2>"+this.createFormFieldsFromList(this.keyAssumptionKeys)
		);
	},
	
	buildOtherAssumptionsForm: function() {
		jQuery("#OtherAssumptions").html(
			"<h2>more assumptions</h2>"+this.createFormFieldsFromList(this.otherAssumptionKeys)
		);
	},
	
	populateResultTable: function() {
		jQuery("#ResultTableHolder table th, #ResultTableHolder table td").each(
			function(i, el) {
				var method = jQuery(el).attr("data-js-method");
				var carType = jQuery(el).attr("data-car-type");
				if(method && carType) {
					var value = EVCalculator[method](carType);
					var numberValue = parseFloat(value);
					if(typeof numberValue === "number") {
						var formattedValue = numberValue.formatMoney();
						//console.debug(method + "..." + carType + "..." + value + "..." + formattedValue);
						jQuery(el).text(formattedValue);
					}
					else {
						//console.debug(method + "..." + carType + "..." + value + "... error");
						jQuery(el).text("error");
					}
				}
			}
		);
		var value = EVCalculator.totalProfit();
		var numberValue = parseFloat(value);
		if(typeof numberValue === "number") {
			var formattedValue = numberValue.formatMoney();
			//console.debug(method + "..." + carType + "..." + value + "..." + formattedValue);
			jQuery("#TotalProfit").text(formattedValue);
		}
		else {
			//console.debug(method + "..." + carType + "..." + value + "... error");
			jQuery(el).text("error");
		}
	},

	createFormFieldsFromList: function(list) {
		var html = "";
		for (var key in list) {
			if (list.hasOwnProperty(key)) {
				var type = list[key];
				var labelVariableName = key + "Label";
				var DescVariableName = key + "Desc";
				var label = EVCalculator[labelVariableName];
				var desc = EVCalculator[DescVariableName];
				var holderID = key + "Holder";
				var fieldID = key + "Field";
				var value = EVCalculator.getValueFromDefaultsOrSession(key);
				//console.debug(key + "..." + fieldID + "..." + value)
				html += "\n";
				html += "<div id=\""+holderID+"\" class=\"fieldHolder\">";
				html += "\t<label for=\""+ fieldID + "\"><strong>"+label+"</strong> <span class=\"desc\">"+desc+"</span></label>";
				html += "\t<div class=\"middleColumn\">";
				html += "\t\t<input type=\"text\" class=\""+ type + "\" id=\""+ fieldID + "\" onchange=\"EVCalculator.setValue('"+key+"')\" value=\""+value+"\" onkeyup=\"EVCalculator.setMyValue('"+key+"', this)\" />";
				html += "\t</div>";
				html += "</div>";
			}
		}
		return html;
	},

	getValueFromDefaultsOrSession: function(key){
		var value = EVCalculator[key];
		return this.formatValue(key, value)
	},

	formatValue: function(key, value) {
		var format = EVCalculator["keyAssumptionKeys"][key];
		if (typeof format == 'undefined') {
			format = EVCalculator["otherAssumptionKeys"][key];
		}
		value = parseFloat(value);
		switch(format) {
			case "number":
				value = value.formatNumber();
				break;
			case "percentage":
				value = value.formatPercentage();
				break;
			default:
				value = value.formatMoney();
		}		
		return value;
	},

	setValue: function(key){
		var fieldID = key + "Field";
		var value = jQuery("#"+fieldID).val();
		//remove comma and $ ...
		value = parseFloat(value.replace(/\$|,/g, ''))
		EVCalculator[key] = value;
		EVCalculator.populateResultTable();
	},

	setMyValue: function(key, item){
		var value = item.value;
		value = parseFloat(value.replace(/\$|,/g, ''));
		value = this.formatValue(key, value);
		item.value = value;
	}
	

}



var EVCalculatorTableInteraction = {

	init: function(){
		jQuery("table").on(
			"click",
			"tr.summary th a.expandRows",
			function(){
				jQuery(this).toggleClass("show");
				var parentTR = jQuery(this).parents("tr");
				jQuery(parentTR).nextUntil("tr.summary").each(
					function(i, el) {
						jQuery(el).toggle();
					}
				);
			}
		);
	}

}
