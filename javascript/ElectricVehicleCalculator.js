/**
 * @author Nicolaas @ sunnysideup.co.nz
 *
 *
 *
 */ 



jQuery(document).ready(
	function(){
		EVC.init();
	}
);

var EVC = {

	myData: {},
	
	yearsFromNow: 0,

	isSwitchYear: true,

	kmDrivenPerYear: 0,

	init: function() {
		var kmDrivenPerYearTempVar = this.kmDrivenPerYear == 0 ? EVC.DefaultData.kmDrivenPerYear : this.kmDrivenPerYear;
		this.myData = new EVCfx(this.yearsFromNow, this.isSwitchYear, kmDrivenPerYearTempVar);
		//now we have the data, we can show it ...
		EVC.HTMLInteraction.init();
	}
	
};

var EVCfx = function(
	yearsFromNow,
	isSwitchYear,
	kmDrivenPerYear
) {

	yearsFromNow = yearsFromNow == undefined ? 0 : yearsFromNow;

	isSwitchYear = isSwitchYear == undefined ? true : isSwitchYear;

	kmDrivenPerYear = kmDrivenPerYear == undefined ? EVC.DefaultData.kmDrivenPerYear : kmDrivenPerYear;
	
	/* calculations */
	this.setupCost = function(carType){
		if(isSwitchYear) {
			if(carType == "e") {
				return EVC.DefaultData.setupChargeStation;
			}
			else {
				return 0;
			}
		}
		else {
			return 0;
		}
	};

	this.valueStartOfTheYear =  function(carType){
		if(carType == "e") {
			return (EVC.DefaultData.CVValue * (EVC.DefaultData.upgradeCostToGoElectric / 100));
		}
		else {
			return EVC.DefaultData.CVValue;
		}
	};

	this.financeCost = function(carType){
		if(carType == "e") {
			//console.debug("A" + this.valueStartOfTheYear(carType));
			//console.debug("B" + EVC.DefaultData.financingCostInPercentage);
			//console.debug("C" + EVC.DefaultData.financingCostInPercentage / 100);
			return this.valueStartOfTheYear(carType) * (EVC.DefaultData.financingCostInPercentage / 100);
		}
		else {
			return 0;
		}
	};

	this.insuranceCost = function(carType){
		return EVC.DefaultData.insuranceBaseCost + ((this.valueStartOfTheYear(carType) / 1000) * EVC.DefaultData.insuranceCostPerThousand);
	};

	this.licensingAndWOFCost = function(carType) {
		if(carType == "e") {
			return EVC.DefaultData.licenseWOFCostEVPerYear;
		}
		else {
			return EVC.DefaultData.licenseWOFCostCVPerYear;
		}
	};

	this.actualAnnualKms = function(carType){
		if(carType == "e") {
			return kmDrivenPerYear - (EVC.DefaultData.daysWithContinuousTripsOver100Km * EVC.DefaultData.kilometresPerDayForLongTrips);
		}
		else {
			return kmDrivenPerYear;
		}
	};

	this.fuelCost = function(carType) {
		if(carType == "e") {
			return (this.actualAnnualKms(carType) / EVC.DefaultData.fuelEfficiencyEV) * EVC.DefaultData.costOfElectricityPerKwH;
		}
		else {
			return (this.actualAnnualKms(carType) / EVC.DefaultData.fuelEfficiencyCV) * EVC.DefaultData.costOfPetrolPerLitre;
		}
	};

	this.maintenanceCost = function(carType) {
		var tyresNeeded = (this.actualAnnualKms(carType)  / 40000) * EVC.DefaultData.numberOfTyresPerFortyThousandKm;
		if(carType == "e") {
			var maintanceCost = (this.actualAnnualKms(carType)  / 10000) * EVC.DefaultData.maintenanceEVPerTenThousandKm;
			var tyreCost = tyresNeeded * EVC.DefaultData.tyreCostEV;
		}
		else {
			var maintanceCost = (this.actualAnnualKms(carType)  / 10000) * EVC.DefaultData.maintenanceCVPerTenThousandKm;
			var tyreCost = tyresNeeded * EVC.DefaultData.tyreCostCV;
		}
		return maintanceCost + tyreCost;
	};

	this.carRentalCost = function(carType) {
		if(carType == "e") {
			return EVC.DefaultData.daysWithContinuousTripsOver100Km * EVC.DefaultData.costPerDayRentalCar;
		}
		else {
			return 0;
		}
	};

	this.subsidy = function(carType){
		if(carType == "e") {
			return EVC.DefaultData.subsidyPaymentFixed + (EVC.DefaultData.subsidyPaymentPerKM * this.actualAnnualKms(carType));
		}
		else {
			return 0;
		}
	}

	this.resellValueAtEndOfYear = function(carType){
		var startOfYearValue = this.valueStartOfTheYear(carType);
		return startOfYearValue - (startOfYearValue * (EVC.DefaultData.depreciationRatePerYear/100));
	};

	/* totals */

	this.totalUpFrontPayment = function(carType) {
		return this.setupCost(carType);
	};

	this.totalFinanceCost = function(carType) {
		return this.financeCost(carType);
	};

	this.totalFixedCost = function(carType) {
		return this.insuranceCost(carType) + this.licensingAndWOFCost(carType);
	};

	this.totalOperatingCost = function(carType) {
		return this.fuelCost(carType) + this.maintenanceCost(carType);
	};

	this.totalOtherCost = function(carType) {
		if(carType == "e") {
			var rentalCost = this.carRentalCost(carType);
			var subsidyInput = this.subsidy(carType);
			return rentalCost - subsidyInput;
		}
		else {
			return 0;
		}
	};
	
	this.totalCombined = function(carType) {
		return parseFloat(this.totalUpFrontPayment(carType)) + parseFloat(this.totalFinanceCost(carType)) + parseFloat(this.totalFixedCost(carType)) + parseFloat(this.totalOperatingCost(carType)) + parseFloat(this.totalOtherCost(carType));
	};

	this.totalProfit = function(){
		return this.totalCombined("f") - this.totalCombined("e");
	};

	return this;

};



EVC.HTMLInteraction = {

	init: function(){
		this.clear();		
		this.buildKeyAssumptionForm();
		this.buildOtherAssumptionsForm();
		this.populateResultTable();
		this.setupShowAndHideResultRows();
	},

	clear: function(){
		jQuery("#KeyAssupmptions").html("");
		jQuery("#OtherAssumptions").html("");
		jQuery("tr.detail").hide();
		jQuery("a.expandRows").unbind("click");
	},

	buildKeyAssumptionForm: function() {
		jQuery("#KeyAssupmptions").html(
			"<h2>key assumptions</h2>"+this.createFormFieldsFromList(EVC.DataDescription.keyAssumptionKeys)
		);
	},
	
	buildOtherAssumptionsForm: function() {
		jQuery("#OtherAssumptions").html(
			"<h2>more assumptions</h2>"+this.createFormFieldsFromList(EVC.DataDescription.otherAssumptionKeys)
		);
	},
	
	populateResultTable: function() {
		jQuery("#ResultTableHolder table th, #ResultTableHolder table td").each(
			function(i, el) {
				var method = jQuery(el).attr("data-js-method");
				var carType = jQuery(el).attr("data-car-type");
				if(method && carType) {
					var value = EVC.myData[method](carType);
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
		var value = EVC.myData.totalProfit();
		var numberValue = parseFloat(value);
		var formattedValue = numberValue.formatMoney();
		if(value < 0) {
			var htmlValue = "<span class=\"negativeNumber\">"+formattedValue+"</span>";
		}
		else {
			var htmlValue = "<span class=\"positiveNumber\">"+formattedValue+"</span>";
		}
		if(typeof numberValue === "number") {
			var formattedValue = numberValue.formatMoney();
			//console.debug(method + "..." + carType + "..." + value + "..." + formattedValue);
			jQuery("#TotalProfit").html(htmlValue);
		}
		else {
			//console.debug(method + "..." + carType + "..." + value + "... error");
			jQuery(el).text("error");
		}
	},

	setupShowAndHideResultRows: function(){
		jQuery("a.expandRows").on(
			"click",
			function(e){
				e.preventDefault();
				jQuery(this).toggleClass("show");
				var parentTR = jQuery(this).parents("tr");
				jQuery(parentTR).nextUntil("tr.summary").each(
					function(i, el) {
						jQuery(el).toggle();
					}
				);
				return false;
			}
		);
	},

	createFormFieldsFromList: function(list) {
		var html = "";
		for (var key in list) {
			if (list.hasOwnProperty(key)) {
				var type = list[key];
				var labelVariableName = key + "Label";
				var DescVariableName = key + "Desc";
				var label = EVC.DefaultData[labelVariableName];
				var desc = EVC.DefaultData[DescVariableName];
				var holderID = key + "Holder";
				var fieldID = key + "Field";
				var value = EVC.HTMLInteraction.getValueFromDefaultsOrSession(key);
				//console.debug(key + "..." + fieldID + "..." + value)
				html += "\n";
				html += "<div id=\""+holderID+"\" class=\"fieldHolder\">";
				html += "\t<label for=\""+ fieldID + "\"><strong>"+label+"</strong> <span class=\"desc\">"+desc+"</span></label>";
				html += "\t<div class=\"middleColumn\">";
				html += "\t\t<input type=\"text\" class=\""+ type + "\" id=\""+ fieldID + "\" onchange=\"EVC.HTMLInteraction.setValue('"+key+"')\" value=\""+value+"\" onblur=\"EVC.HTMLInteraction.setMyValue('"+key+"', this)\" />";
				html += "\t</div>";
				html += "</div>";
			}
		}
		return html;
	},

	getValueFromDefaultsOrSession: function(key){
		//todo - get from session here ...
		var value = EVC.DefaultData[key];
		return this.formatValue(key, value)
	},

	formatValue: function(key, value) {
		var format = EVC.DataDescription["keyAssumptionKeys"][key];
		if (typeof format == 'undefined') {
			format = EVC.DataDescription["otherAssumptionKeys"][key];
			if (typeof format == 'undefined') {
				format = "error";
			}
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
		EVC.DefaultData[key] = value;
		this.populateResultTable();
	},

	setMyValue: function(key, item){
		var value = item.value;
		value = parseFloat(value.replace(/\$|,/g, ''));
		value = this.formatValue(key, value);
		item.value = value;
	},

	resetSession: function(){
		alert("to be completed");
	}

};


EVC.DataDescription = {

	keyAssumptionKeys: {
		"CVValue":                           "currency",
		"kmDrivenPerYear":                   "number",
		"daysWithContinuousTripsOver100Km":  "number",
		"subsidyPaymentFixed":               "currency",
		"subsidyPaymentPerKM":               "currency"
	},

	otherAssumptionKeys: {
		"upgradeCostToGoElectric":           "percentage",
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
	}
};


EVC.DefaultData = {

	/* key assumptions */
	CVValue:                             10000,
	kmDrivenPerYear:                     20000,
	daysWithContinuousTripsOver100Km:       10,
	subsidyPaymentFixed:                  1000,
	subsidyPaymentPerKM:                  0.05,

	/* other assumptions */
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
	kilometresPerDayForLongTripsDesc:            ""
};




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
