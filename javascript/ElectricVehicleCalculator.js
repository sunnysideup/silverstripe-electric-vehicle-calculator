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

	/* getters and setters */

	
	this.updateYearsFromNow = function(newValue){
		yearsFromNow = newValue;
	};
	
	this.updateYearsAfterSwitch = function(newValue){
		yearsAfterSwitch = newValue;
	};
	
	this.updateKmDrivenPerYear = function(newValue){
		kmDrivenPerYear = newValue;
	};

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

	this.amountBorrowedAtStartOfTheYear = function(carType){
		if(carType == "e") {
			var loan = (this.purchasePrice(carType) - (this.salePrice("f") - EVC.DefaultData.amountOfCurrentCarAsLoan)) - (yearsAfterSwitch * this.standardPrincipalRepaymentPerYear(carType));
		}
		else {
			var loan = EVC.DefaultData.amountOfCurrentCarAsLoan - (yearsAfterSwitch * this.standardPrincipalRepaymentPerYear(carType));
		}
		return loan < 0 ? 0 : loan;
	};

	this.amountBorrowedAtEndOfTheYear = function(carType){
		var loan = this.amountBorrowedAtStartOfTheYear(carType) - this.standardPrincipalRepaymentPerYear(carType);
		return loan < 0 ? 0 : loan;
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

	this.valueAtTheEndOfTheYear = function(carType){
		var startOfYearValue = this.valueStartOfTheYear(carType);
		return startOfYearValue - (startOfYearValue * (EVC.DefaultData.depreciationRatePerYear/100));
	};

	this.standardPrincipalRepaymentPerYear = function(carType){
		var loanRepaymentsPerYear = this.originalPrice(carType) * (EVC.DefaultData.principalRepaymentsPerYearPercentage / 100);
		return loanRepaymentsPerYear;
	}
	
	this.principalRepayment = function(carType){
		var loanRepaymentsPerYear = this.standardPrincipalRepaymentPerYear(carType);
		var maxAmountToPay = this.amountBorrowedAtStartOfTheYear(carType);
		if(maxAmountToPay > loanRepaymentsPerYear) {
			return loanRepaymentsPerYear;
		}
		else {
			return maxAmountToPay;
		}
	};

	this.cashLeftAfterSellingCar = function(carType){
		var salePrice = this.valueAtTheEndOfTheYear(carType) - this.amountBorrowedAtEndOfTheYear(carType);
		return salePrice - ((EVC.DefaultData.saleCostForCarInPercentage / 100) * salePrice);
	};

	this.interest = function(carType){
		var interest = 0;
		var dailyInterest = (EVC.DefaultData.financingCostInPercentage / 100) / 365;
		for(var i = 1; i < 366; i++) {
			var valueOfTheDay = (this.amountBorrowedAtStartOfTheYear(carType) - ((this.principalRepayment(carType) / 365) * i));
			if(valueOfTheDay > 0) {
				interest += valueOfTheDay * dailyInterest;
			}
		}
		return interest;
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
		var tyresNeeded = this.actualAnnualKms(carType)  / EVC.DefaultData.averageKmsPerTyre;
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
			var fixedSubsidy = 0;
			if(yearsAfterSwitch == 0) {
				var fixedSubsidy = EVC.DefaultData.subsidyPaymentFixed;
			}
			return -1 * (fixedSubsidy + (EVC.DefaultData.subsidyPaymentPerKM * this.actualAnnualKms(carType)));
		}
		else {
			return 0;
		}
	}

	this.personalContribution = function(carType){
		if(carType == "e") {
			return -1 * (EVC.DefaultData.personalContributionFixed + (EVC.DefaultData.personalContributionPerKM * this.actualAnnualKms(carType)));
		}
		else {
			return 0;
		}
	}

	/* totals */

	this.totalUpFrontPayment = function(carType) {
		return this.setupCost(carType);
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
			var personalContribution = this.personalContribution(carType);
			return rentalCost + subsidyInput + personalContribution;
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
		this.selectFirstInput();
	},

	clear: function(){
		jQuery("#KeyAssupmptions").html("");
		jQuery("#OtherAssumptions").html("");
		jQuery("tr.detail").hide();
		jQuery("a.expandRows").unbind("click");
	},

	buildKeyAssumptionForm: function() {
		jQuery("#KeyAssupmptions").html(
			"<h2>"+EVC.DefaultData.keyAssumptions+"</h2>"+this.createFormFieldsFromList(EVC.DataDescription.keyAssumptionKeys)
		);
	},
	
	buildOtherAssumptionsForm: function() {
		jQuery("#OtherAssumptions").html(
			"<h2>"+EVC.DefaultData.allAssumptions+"</h2>"+this.createFormFieldsFromList(EVC.DataDescription.otherAssumptionKeys)
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

	selectFirstInput: function(){
		//we have to wait until HTML is registered...
		window.setTimeout(
			function(){
				jQuery("#CVValueTodayField").focus();
			},
			300
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
		//special exception ..
		if(key == "kmDrivenPerYear") {
			EVC.kmDrivenPerYear = value;
			EVC.myData.updateKmDrivenPerYear(value);
		}
		//update HTML
		this.populateResultTable();
		this.populateCalculations();
		
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
		"averageKmsPerTyre":                    "number",
		"tyreCostCV":                           "currency",
		"tyreCostEV":                           "currency",
		"licenseWOFCostCVPerYear":              "currency",
		"licenseWOFCostEVPerYear":              "currency",
		"maintenanceCVPerTenThousandKm":        "currency",
		"maintenanceEVPerTenThousandKm":        "currency",
		"depreciationRatePerYear":              "percentage",
		"costPerDayRentalCar":                  "currency",
		"kilometresPerDayForLongTrips":         "number",
		"subsidyPaymentFixed":                  "currency",
		"subsidyPaymentPerKM":                  "currency",
		"personalContributionFixed":            "currency",
		"personalContributionPerKM":            "currency"
	},

	alternativeFormatsForFxs: {
		"actualAnnualKms": "number",
		"actualAnnualKmsPerDay": "number"
	}
};


EVC.DefaultData = {

	/* key assumptions */
	CVValueToday:                            0,
	kmDrivenPerYear:                         0,
	daysWithContinuousTripsOver100Km:        0,

	/* other assumptions */
	amountOfCurrentCarAsLoan:                0,
	upgradeCostToGoElectric:               150,
	EVValueImprovementPerYearPercentage:     5,
	setupChargeStation:                    300,
	saleCostForCarInPercentage:             12,
	financingCostInPercentage:              10,
	principalRepaymentsPerYearPercentage:   30,
	costOfPetrolPerLitre:                 2.00,
	costOfElectricityPerKwH:              0.20,
	fuelEfficiencyCV:                       12,
	fuelEfficiencyEV:                        5,
	insuranceBaseCost:                     200,
	insuranceCostPerThousand:               50,
	averageKmsPerTyre:                   40000,
	tyreCostCV:                            100,
	tyreCostEV:                            150,
	licenseWOFCostCVPerYear:               250,
	licenseWOFCostEVPerYear:               350,
	maintenanceCVPerTenThousandKm:         400,
	maintenanceEVPerTenThousandKm:          50,
	depreciationRatePerYear:                27,
	costPerDayRentalCar:                    70,
	kilometresPerDayForLongTrips:          300,
	subsidyPaymentFixed:                     0,
	subsidyPaymentPerKM:                  0.00,
	personalContributionFixed:               0,
	personalContributionPerKM:               0,

	/* key assumptions Labels */
	CVValueTodayLabel:                            "Current Car Value",
	kmDrivenPerYearLabel:                         "Kilometers Driven per Year",
	daysWithContinuousTripsOver100KmLabel:        "Big Trip Days Per Year",

	/* other assumptions */
	amountOfCurrentCarAsLoanLabel:                "Borrowed Amount for Current Car",
	upgradeCostToGoElectricLabel:                 "Premium for Electrical Car",
	EVValueImprovementPerYearPercentageLabel:     "Relative Value Improvement per Year for Electric Cars",
	setupChargeStationLabel:                      "Infrastructure Set Up",
	saleCostForCarInPercentageLabel:              "Sale / Purchase Cost",
	financingCostInPercentageLabel:               "Interest Rate",
	principalRepaymentsPerYearPercentageLabel:    "Principal Repayments per Year",
	costOfPetrolPerLitreLabel:                    "Petrol per Litre",
	costOfElectricityPerKwHLabel:                 "Electricity per KwH",
	fuelEfficiencyCVLabel:                        "Current Car: KMs per Litre of Petrol",
	fuelEfficiencyEVLabel:                        "Electric Car: KMs per KwH",
	insuranceBaseCostLabel:                       "Insurance Base Price",
	insuranceCostPerThousandLabel:                "Insurance per $1000 Car Value",
	averageKmsPerTyreLabel:                       "Average KMs per Tyre",
	tyreCostCVLabel:                              "Current Car: one Tyre",
	tyreCostEVLabel:                              "Electric Car: one Tyre",
	licenseWOFCostCVPerYearLabel:                 "Current Car: License and WOF per year",
	licenseWOFCostEVPerYearLabel:                 "Electric Car: License and WOF per year",
	maintenanceCVPerTenThousandKmLabel:           "Current Car: Service per 10,000kms",
	maintenanceEVPerTenThousandKmLabel:           "Electric Car: Service per 10,000kms",
	depreciationRatePerYearLabel:                 "Depreciation rate per year",
	costPerDayRentalCarLabel:                     "Cost per Day for Rental Car",
	kilometresPerDayForLongTripsLabel:            "KMs per Day for Long Trips",
	subsidyPaymentFixedLabel:                     "Electric Car: Fixed Subsidy",
	subsidyPaymentPerKMLabel:                     "Electric Car: Kilometer Subsidy",
	personalContributionFixedLabel:               "Electric Car: Personal Contribution per Year",
	personalContributionPerKMLabel:               "Electric Car: Personal Contribution per KM",
	
	
	/* key assumptions Descs */
	CVValueTodayDesc:                            "",
	kmDrivenPerYearDesc:                         "",
	daysWithContinuousTripsOver100KmDesc:        "more than 150km per day",

	/* other assumptions */
	amountOfCurrentCarAsLoanDesc:                "",
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
	averageKmsPerTyreDesc:                       "",
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
	subsidyPaymentPerKMDesc:                     "",
	personalContributionFixedDesc:               "",
	personalContributionPerKMDesc:               "",

	keyAssumptions:         "your current situation",
	allAssumptions:                "all assumptions",
};




Number.prototype.formatMoney = function(c, d, t){
	var n = this, 
	c = isNaN(c = Math.abs(c)) ? (Math.abs(n) < 5  && n != 0? 2 : 0) : c,
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
