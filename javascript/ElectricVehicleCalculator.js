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

	yearsAfterSwitch: 0,

	kmDrivenPerYear: 0,

	init: function() {
		var kmDrivenPerYearTempVar = this.kmDrivenPerYear == 0 ? EVC.DefaultData.kmDrivenPerYear : this.kmDrivenPerYear;
		this.myData = new EVCfx(this.yearsFromNow, this.yearsAfterSwitch, kmDrivenPerYearTempVar);
		//now we have the data, we can show it ...
		EVC.HTMLInteraction.init();
	}
	
};

var EVCfx = function(
	yearsFromNow,
	yearsAfterSwitch,
	kmDrivenPerYear
) {

	yearsFromNow = yearsFromNow == undefined ? 0 : yearsFromNow;

	yearsAfterSwitch = yearsAfterSwitch == undefined ? 0 : yearsAfterSwitch;

	kmDrivenPerYear = kmDrivenPerYear == undefined ? EVC.DefaultData.kmDrivenPerYear : kmDrivenPerYear;
	
	/* calculations */
	this.setupCost = function(carType){
		if(yearsAfterSwitch == 0) {
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

	this.originalPrice = function(carType) {
		var originalValue = this.valueStartOfTheYear(carType);
		for(i = yearsAfterSwitch; i > 0; i--) {
			originalValue = originalValue / (1-(EVC.DefaultData.depreciationRatePerYear / 100));
		}
		return originalValue;
	};

	this.salePrice = function(carType) {
		if(yearsAfterSwitch == 0) {
			if(yearsAfterSwitch == 0) {
				if(carType == "e") {
					return 0;
				}
				else {
					return this.valueStartOfTheYear(carType) - (this.valueStartOfTheYear(carType) * (EVC.DefaultData.saleCostForCarInPercentage / 100))
				}
			}
			else {
				return 0;
			}
		}
		else {
			return 0;
		}
	};

	this.purchasePrice = function(carType) {
		if(yearsAfterSwitch == 0) {
			if(carType == "e") {
				return this.valueStartOfTheYear(carType) + (this.valueStartOfTheYear(carType) * (EVC.DefaultData.saleCostForCarInPercentage / 100))
			}
			else {
				return 0;
			}
		}
		else {
			return 0;
		}
	};

	this.costOfSwap = function(carType) {
		if(yearsAfterSwitch == 0) {
			if(carType == "e") {
				return (this.valueStartOfTheYear("f") - this.salePrice("f")) + this.purchasePrice("e") - this.valueStartOfTheYear("e"); 
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
		var CVValue = EVC.DefaultData.CVValueToday;
		for(var i = yearsFromNow; i > 0; i--) {
			CVValue = CVValue - (CVValue * (EVC.DefaultData.depreciationRatePerYear / 100));
		}
		if(carType == "e") {
			var EVValue = (CVValue * (EVC.DefaultData.upgradeCostToGoElectric / 100));
			for(var i = yearsFromNow; i > 0; i--) {
				EVValue = EVValue - (EVValue * (EVC.DefaultData.EVValueImprovementPerYearPercentage / 100));
			}
			return EVValue;
		}
		else {
			return CVValue;
		}
	};

	this.principalRepayment = function(carType){
		return this.originalPrice(carType) * (EVC.DefaultData.principalRepaymentsPerYearPercentage / 100);
	};

	this.interest = function(carType){
		if(carType == "e") {
			//console.debug("A" + this.valueStartOfTheYear(carType));
			//console.debug("B" + EVC.DefaultData.financingCostInPercentage);
			//console.debug("C" + EVC.DefaultData.financingCostInPercentage / 100);
			return this.valueStartOfTheYear(carType) * (EVC.DefaultData.financingCostInPercentage / 100);
		}
		else {
			return this.valueStartOfTheYear(carType) * (EVC.DefaultData.financingCostInPercentage / 100);
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

	this.actualAnnualKmsPerDay = function(carType){
		if(carType == "e") {
			return (kmDrivenPerYear - (EVC.DefaultData.daysWithContinuousTripsOver100Km * EVC.DefaultData.kilometresPerDayForLongTrips)) / 365;
		}
		else {
			return kmDrivenPerYear / 365;
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
		if(carType == "e") {
			return maintanceCost = (this.actualAnnualKms(carType)  / 10000) * EVC.DefaultData.maintenanceEVPerTenThousandKm;
		}
		else {
			return maintanceCost = (this.actualAnnualKms(carType)  / 10000) * EVC.DefaultData.maintenanceCVPerTenThousandKm;
		}
	};
	
	this.tyreCost = function(carType) {
		var tyresNeeded = (this.actualAnnualKms(carType)  / 40000) * EVC.DefaultData.numberOfTyresPerFortyThousandKm;
		if(carType == "e") {
			return tyresNeeded * EVC.DefaultData.tyreCostEV;
		}
		else {
			return tyresNeeded * EVC.DefaultData.tyreCostCV;
		}
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
			return -1 * (EVC.DefaultData.subsidyPaymentFixed + (EVC.DefaultData.subsidyPaymentPerKM * this.actualAnnualKms(carType)));
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
		return this.setupCost(carType) + this.costOfSwap(carType);
	};

	this.totalFinanceCost = function(carType) {
		return this.interest(carType) + this.principalRepayment(carType);
	};

	this.totalFixedCost = function(carType) {
		return this.insuranceCost(carType) + this.licensingAndWOFCost(carType);
	};

	this.totalOperatingCost = function(carType) {
		return this.fuelCost(carType) + this.maintenanceCost(carType) + this.tyreCost(carType);
	};

	this.totalOtherCost = function(carType) {
		if(carType == "e") {
			var rentalCost = this.carRentalCost(carType);
			var subsidyInput = this.subsidy(carType);
			return rentalCost + subsidyInput;
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

	this.debug = function(){
		console.debug("this.valueStartOfTheYear-f: "+parseFloat(this.valueStartOfTheYear("f")));
		console.debug("this.valueStartOfTheYear-e: "+parseFloat(this.valueStartOfTheYear("e")));
		
		console.debug("this.actualAnnualKms-f: "+parseFloat(this.actualAnnualKms("f")));
		console.debug("this.actualAnnualKms-e: "+parseFloat(this.actualAnnualKms("e")));
		
		console.debug("totalUpFrontPayment-f: "+parseFloat(this.totalUpFrontPayment("f")));
		console.debug("totalUpFrontPayment-e: "+parseFloat(this.totalUpFrontPayment("e")));
		
		console.debug("totalFinanceCost-f: "+parseFloat(this.totalFinanceCost("f")));
		console.debug("totalFinanceCost-e: "+parseFloat(this.totalFinanceCost("e")));
		
		console.debug("totalFixedCost-f: "+parseFloat(this.totalFixedCost("f")));
		console.debug("totalFixedCost-e: "+parseFloat(this.totalFixedCost("e")));
		
		console.debug("totalOperatingCost-f: "+parseFloat(this.totalOperatingCost("f")));
		console.debug("totalOperatingCost-e: "+parseFloat(this.totalOperatingCost("e")));

		console.debug("fuelCost-f: "+parseFloat(this.fuelCost("f")));
		console.debug("fuelCost-e: "+parseFloat(this.fuelCost("e")));
		console.debug("maintenanceCost-f: "+parseFloat(this.maintenanceCost("f")));
		console.debug("maintenanceCost-e: "+parseFloat(this.maintenanceCost("e")));
		console.debug("tyreCost-f: "+parseFloat(this.tyreCost("f")));
		console.debug("tyreCost-e: "+parseFloat(this.tyreCost("e")));

		console.debug("totalOperatingCost-e: "+parseFloat(this.totalOperatingCost("e")));
		
		console.debug("totalOtherCost-f: "+parseFloat(this.totalOtherCost("f")));
		console.debug("totalOtherCost-e: "+parseFloat(this.totalOtherCost("e")));
	};

	return this;

};



EVC.HTMLInteraction = {

	init: function(){
		this.clear();
		this.buildKeyAssumptionForm();
		this.buildOtherAssumptionsForm();
		this.populateResultTable();
		this.populateCalculations();
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
			"<h2>all assumptions</h2>"+this.createFormFieldsFromList(EVC.DataDescription.otherAssumptionKeys)
		);
	},
	
	populateResultTable: function() {
		jQuery("#ResultTableHolder table th, #ResultTableHolder table td").each(
			function(i, el) {
				var method = jQuery(el).attr("data-fx");
				var carType = jQuery(el).attr("data-type");
				if(method && carType) {
					var value = EVC.myData[method](carType);
					var numberValue = parseFloat(value);
					if(typeof numberValue === "number") {
						format = EVC.DataDescription["alternativeFormatsForFxs"][method];
						if (typeof format == 'undefined') {
							var formattedValue = numberValue.formatMoney();
						}
						else if(format == "number") {
							var formattedValue = numberValue.formatNumber();
						}	
						else if(format == "percentage") {
							var formattedValue = numberValue.formatPercentage();
						}
						else {
							var formattedValue = numberValue;
						}
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
	},

	populateCalculations: function(){
		jQuery("span.calcVal").each(
			function(i, el) {
				var method = jQuery(el).attr("data-fx");
				console.debug(method);
				var value = EVC.scenarios[method]();
				var numberValue = parseFloat(value);
				var formattedValue = numberValue.formatMoney();
				if(value < 0) {
					var htmlValue = "<span class=\"negativeNumber\">"+formattedValue+"</span>";
				}
				else {
					var htmlValue = "<span class=\"positiveNumber\">"+formattedValue+"</span>";
				}
				if(typeof numberValue === "number") {
					jQuery(el).html(htmlValue);
				}
				else {
					jQuery(el).text("error");
				}
			}
		);

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
				html += "\t\t<input type=\"text\" class=\""+ type + "\" id=\""+ fieldID + "\" onchange=\"EVC.HTMLInteraction.setValue('"+key+"')\" value=\""+value+"\" onblur=\"EVC.HTMLInteraction.setMyValue('"+key+"', this)\" onfocus=\"EVC.HTMLInteraction.showDesc('"+key+"');\" />";
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
		jQuery("div#"+key+"Holder label span.desc").css("display", "none");
	},

	showDesc: function(key){
		jQuery("div#"+key+"Holder label span.desc").css("display", "block");
	},

	resetSession: function(){
		alert("to be completed");
	}

};

EVC.scenarios = {

	totalProfit: function(){
		return EVC.myData.totalProfit();
	},

	theeYearProfit: function(){
		var year1 = new EVCfx(0, 0, EVC.DefaultData.kmDrivenPerYear);
		var year2 = new EVCfx(0, 1, EVC.DefaultData.kmDrivenPerYear);
		var year3 = new EVCfx(0, 2, EVC.DefaultData.kmDrivenPerYear);
		return year1.totalProfit() + year2.totalProfit() + year3.totalProfit();
	},
	
	plusFiveThousand: function(){
		var newDistance = parseFloat(EVC.DefaultData.kmDrivenPerYear) + 5000;
		var year1 = new EVCfx(0, 0, newDistance);
		return year1.totalProfit();
	},
	
	minusFiveThousand: function(){
		var year1 = new EVCfx(0, 0, parseFloat(EVC.DefaultData.kmDrivenPerYear) - 5000);
		return year1.totalProfit();
	},
	
	inThreeYearsTime: function(){
		var year1 = new EVCfx(3, 0, parseFloat(EVC.DefaultData.kmDrivenPerYear) - 5000);
		//return year1.debug();
		return year1.totalProfit();
	}

}

EVC.DataDescription = {

	keyAssumptionKeys: {
		"CVValueToday":               "currency",
		"kmDrivenPerYear":                   "number",
		"daysWithContinuousTripsOver100Km":  "number"
	},

	otherAssumptionKeys: {
		"upgradeCostToGoElectric":              "percentage",
		"EVValueImprovementPerYearPercentage":  "percentage",
		"setupChargeStation":                   "currency",
		"saleCostForCarInPercentage":           "percentage",
		"financingCostInPercentage":            "percentage",
		"principalRepaymentsPerYearPercentage": "percentage",
		"costOfPetrolPerLitre":                 "currency",
		"costOfElectricityPerKwH":              "currency",
		"fuelEfficiencyCV":                     "number",
		"fuelEfficiencyEV":                     "number",
		"insuranceBaseCost":                    "currency",
		"insuranceCostPerThousand":             "currency",
		"numberOfTyresPerFortyThousandKm":      "number",
		"tyreCostCV":                           "currency",
		"tyreCostEV":                           "currency",
		"licenseWOFCostCVPerYear":              "currency",
		"licenseWOFCostEVPerYear":              "currency",
		"maintenanceCVPerTenThousandKm":        "currency",
		"maintenanceEVPerTenThousandKm":        "currency",
		"depreciationRatePerYear":              "percentage",
		"costPerDayRentalCar":                  "currency",
		"kilometresPerDayForLongTrips":         "number",
		"subsidyPaymentFixed":               "currency",
		"subsidyPaymentPerKM":               "currency"
	},

	alternativeFormatsForFxs: {
		"actualAnnualKms": "number",
		"actualAnnualKmsPerDay": "number"
	}
};


EVC.DefaultData = {

	/* key assumptions */
	CVValueToday:                        10000,
	kmDrivenPerYear:                     20000,
	daysWithContinuousTripsOver100Km:       10,

	/* other assumptions */
	upgradeCostToGoElectric:               150,
	EVValueImprovementPerYearPercentage:     5,
	setupChargeStation:                    300,
	saleCostForCarInPercentage:             12,
	financingCostInPercentage:              10,
	principalRepaymentsPerYearPercentage:   15,
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
	maintenanceCVPerTenThousandKm:         400,
	maintenanceEVPerTenThousandKm:          50,
	depreciationRatePerYear:                27,
	costPerDayRentalCar:                    70,
	kilometresPerDayForLongTrips:          300,
	subsidyPaymentFixed:                  1000,
	subsidyPaymentPerKM:                  0.05,	

	/* key assumptions Labels */
	CVValueTodayLabel:                            "Current Car Value",
	kmDrivenPerYearLabel:                         "Kilometers Driven Per Year",
	daysWithContinuousTripsOver100KmLabel:        "Big Trip Days Per Year",

	/* other assumptions */
	upgradeCostToGoElectricLabel:                 "Upgrade Cost to go Electrical (percentage)",
	EVValueImprovementPerYearPercentageLabel:     "Value improvement per year in percentages for electric vehicles",
	setupChargeStationLabel:                      "Infrastructure Set Up Cost",
	saleCostForCarInPercentageLabel:              "Sale Cost in Percentage",
	financingCostInPercentageLabel:               "Finance Cost In Percentage",
	principalRepaymentsPerYearPercentageLabel:    "Principal repayments per year, as percentage of original total",
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
	subsidyPaymentFixedLabel:                     "Fixed Subsidy for E-Vehicle",
	subsidyPaymentPerKMLabel:                     "Kilometer Subsidy for E-Vehicle",
	
	/* key assumptions Descs */
	CVValueTodayDesc:                            "",
	kmDrivenPerYearDesc:                         "",
	daysWithContinuousTripsOver100KmDesc:        "more than 150km per day",

	/* other assumptions */
	upgradeCostToGoElectricDesc:                 "",
	EVValueImprovementPerYearPercentageDec:      "",
	setupChargeStationDesc:                      "",
	saleCostForCarInPercentageDesc:              "",
	financingCostInPercentageDesc:               "",
	principalRepaymentsPerYearPercentageDesc:    "",
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
	subsidyPaymentFixedDesc:                     "",
	subsidyPaymentPerKMDesc:                     ""
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
	n = Math.round(n, 2)
	return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
