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

	kmDrivenPerYear: -1,

	yearsFromNow: -1,

	yearsAfterSwitch: -1,

	serverKey: "",

	baseLink: "",

	workableLinks: function(){
		if(this.baseLink && this.serverKey) {
			return true;
		}
		return false;
	},

	saveLink: function(){
		if(this.workableLinks()) {
			return this.baseLink+"save/"+this.serverKey+"/";
		}
		return "";
	},

	showLink: function(){
		if(this.workableLinks()) {
			return this.baseLink+"show/"+this.serverKey+"/";
		}
		return "";
	},

	shareLink: function(){
		if(this.workableLinks()) {
			return this.baseLink+"retrieve/"+this.serverKey+"/";
		}
		return "";
	},

	resetLink: function(){
		if(this.workableLinks()) {
			return this.baseLink+"reset/";
		}
		return "";
	},

	init: function() {
		var kmDrivenPerYearTempVar = this.kmDrivenPerYear == -1 ? EVC.DefaultData.kmDrivenPerYear : this.kmDrivenPerYear;
		var yearsFromNowTempVar = this.yearsFromNow == -1 ? EVC.DefaultData.yearsFromNow : this.yearsFromNow;
		var yearsAfterSwitchTempVar = this.yearsAfterSwitch == -1 ? EVC.DefaultData.yearsAfterSwitch : this.yearsAfterSwitch;
		this.myData = new EVCfx(yearsFromNowTempVar, yearsAfterSwitchTempVar, kmDrivenPerYearTempVar);
		//now we have the data, we can show it ...
		EVC.HTMLInteraction.init();
	}

};

var EVCfx = function(
	yearsFromNow,
	yearsAfterSwitch,
	kmDrivenPerYear
) {

	kmDrivenPerYear = kmDrivenPerYear == undefined ? EVC.DefaultData.kmDrivenPerYear : kmDrivenPerYear;

	yearsFromNow = yearsFromNow == undefined ? EVC.DefaultData.yearsFromNow : yearsFromNow;

	yearsAfterSwitch = yearsAfterSwitch == undefined ? EVC.DefaultData.yearsAfterSwitch : yearsAfterSwitch;

	this.updateKmDrivenPerYear = function(newValue){
		kmDrivenPerYear = newValue;
	};

	/* getters and setters */
	this.updateYearsFromNow = function(newValue){
		yearsFromNow = newValue;
	};

	this.updateYearsAfterSwitch = function(newValue){
		yearsAfterSwitch = newValue;
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
			originalValue = originalValue / (1-(this.depreciationRate(carType) / 100));
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
				return this.valueStartOfTheYear(carType) + (this.valueStartOfTheYear(carType) * (EVC.DefaultData.purchaseCostForCarInPercentage / 100))
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

	this.depreciationRate = function(carType) {
		if(carType == "e") {
			var rate = EVC.DefaultData.depreciationRatePerYearEV;
		}
		else {
			var rate = EVC.DefaultData.depreciationRatePerYearCV;
		}
		return rate;
	}

	this.valueStartOfTheYear =  function(carType){
		var rateCV = this.depreciationRate("f");

		//value today
		var value = EVC.DefaultData.CVValueToday;
		//what will that value be in the future ...
		for(var i = yearsFromNow; i > 0; i--) {
			value = value - (value * (rateCV / 100));
		}
		if(carType == "e") {
			//to do: which one should come first... value improvement or upgrade cost?
			//the e value improvements in the future ...
			if(yearsFromNow > 0) {
				var upgradeCostDividedByFutureYears = (EVC.DefaultData.upgradeCostToGoElectric / 100) / yearsFromNow;
				for(var i = yearsFromNow; i > 0; i--) {
					value = value + (value * upgradeCostDividedByFutureYears);
					value = value - (value * (EVC.DefaultData.EVValueImprovementPerYearPercentage / 100));
				}
			}
			else {
				value = value + (value * (EVC.DefaultData.upgradeCostToGoElectric / 100));
			}
		}
		var rate = this.depreciationRate(carType);
		//depreciate for years after switch
		for(var i = yearsAfterSwitch; i > 0; i--) {
			value = value - (value * (rate / 100));
		}
		return value;
	};

	this.valueAtTheEndOfTheYear = function(carType){
		var startOfYearValue = this.valueStartOfTheYear(carType);
		return startOfYearValue - (startOfYearValue * (this.depreciationRate(carType)/100));
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

	this.numberOfKMsWithRentalCar = function(carType) {
		if(carType == "e") {
			return EVC.DefaultData.daysWithContinuousTripsOver100Km * EVC.DefaultData.kilometresPerDayForLongTrips;
		}
		else {
			return 0;
		}
	}

	this.carRentaFuel = function(carType) {
		var kms = this.numberOfKMsWithRentalCar(carType);
		return (kms / EVC.DefaultData.fuelEfficiencyRentalCar) * EVC.DefaultData.costOfPetrolPerLitre;
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
			var rentalCostFuel = this.carRentaFuel(carType);
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
		this.buildPlayAroundAssumptionForm();
		this.buildOtherAssumptionsForm();
		this.populateResultTable();
		this.populateCalculations();
		this.populateLinks();
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
			"<h2>"+EVC.DataDescription.headerTitles["keyAssumptions"]+"</h2>"+this.createFormFieldsFromList(EVC.DataDescription.keyAssumptionKeys)
		);
	},

	buildPlayAroundAssumptionForm: function() {
		jQuery("#PlayAroundAssumptions").html(
			"<h2>"+EVC.DataDescription.headerTitles["playAroundAssumptions"]+"</h2>"+this.createFormFieldsFromList(EVC.DataDescription.playAroundAssumptionKeys)
		);
	},

	buildOtherAssumptionsForm: function() {
		jQuery("#OtherAssumptions").html(
			"<h2>"+EVC.DataDescription.headerTitles["otherAssumptions"]+"</h2>"+this.createFormFieldsFromList(EVC.DataDescription.otherAssumptionKeys)
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
				//console.debug(method);
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

	populateLinks: function() {
		if(EVC.workableLinks()) {
			jQuery("#ShareLink").attr("href", "mailto:?subject="+encodeURIComponent("I want an Electric Car")+"&body="+encodeURIComponent("Please visit: "+EVC.shareLink()));
			jQuery("#ResetLink").attr("href", EVC.resetLink());
		}
		else {
			jQuery("#ShareLink").hide();
			jQuery("#ResetLink").attr("#");
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
				var label = EVC.DataDescription.labels[key];
				var desc = EVC.DataDescription.desc[key];
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
			format = EVC.DataDescription["playAroundAssumptionKeys"][key];
			if (typeof format == 'undefined') {
				format = EVC.DataDescription["otherAssumptionKeys"][key];
				if (typeof format == 'undefined') {
					format = "error";
				}
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
		value = parseFloat(value.replace(/\$|,/g, ''));
		//send to server
		if(EVC.baseLink) {
			jQuery.ajax({
				method: "GET",
				url: EVC.saveLink(),
				data: { key: key, value: value },
				cache: false
			})
			.done(function( returnKey ) {
				EVC.serverKey = returnKey
			})
			.fail(function( jqXHR, textStatus ) {
				alert( "Data could not be saved: " + textStatus );
			});
			//save locally...
		}
		EVC.DefaultData[key] = value;
		//special exception ..
		if(key == "kmDrivenPerYear" || key == "yearsFromNow" || key == "yearsAfterSwitch") {
			if(key == "kmDrivenPerYear") {
				EVC.myData.updateKmDrivenPerYear(key, value);
			}
			else if(key == "yearsFromNow") {
				EVC.myData.updateYearsFromNow(key, value);
			}
				EVC.myData.updateYearsAfterSwitch(key, value);
ww			else if(key == ""){
			}
		}
		//update HTML

		this.populateResultTable();
		this.populateCalculations();
		this.populateLinks();

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
		"CVValueToday":                         "currency",
		"kmDrivenPerYear":                      "number"
	},

	playAroundAssumptionKeys: {
		"daysWithContinuousTripsOver100Km":     "number",
		"yearsFromNow":                         "number",
		"yearsAfterSwitch":                     "number"
	},

	otherAssumptionKeys: {
		"upgradeCostToGoElectric":              "percentage",
		"EVValueImprovementPerYearPercentage":  "percentage",
		"setupChargeStation":                   "currency",
		"saleCostForCarInPercentage":           "percentage",
		"purchaseCostForCarInPercentage":       "percentage",
		"financingCostInPercentage":            "percentage",
		"principalRepaymentsPerYearPercentage": "percentage",
		"costOfPetrolPerLitre":                 "currency",
		"costOfElectricityPerKwH":              "currency",
		"fuelEfficiencyCV":                     "number",
		"fuelEfficiencyEV":                     "number",
		"fuelEfficiencyRentalCar":              "number",
		"insuranceBaseCost":                    "currency",
		"insuranceCostPerThousand":             "currency",
		"averageKmsPerTyre":                    "number",
		"tyreCostCV":                           "currency",
		"tyreCostEV":                           "currency",
		"licenseWOFCostCVPerYear":              "currency",
		"licenseWOFCostEVPerYear":              "currency",
		"maintenanceCVPerTenThousandKm":        "currency",
		"maintenanceEVPerTenThousandKm":        "currency",
		"depreciationRatePerYearCV":            "percentage",
		"depreciationRatePerYearEV":            "percentage",
		"costPerDayRentalCar":                  "currency",
		"kilometresPerDayForLongTrips":         "number",
		"subsidyPaymentFixed":                  "currency",
		"subsidyPaymentPerKM":                  "currency",
		"personalContributionFixed":            "currency",
		"personalContributionPerKM":            "currency"
	},

	labels: {
		/* key assumptions s */
		CVValueToday:                           "Current Car Value",
		kmDrivenPerYear:                        "Kilometers Driven per Year",
		/* play around assumptions */
		yearsFromNow:                           "Number of Years Before Switch",
		yearsAfterSwitch:                       "Number of Years after Switch",
		daysWithContinuousTripsOver100Km:       "Big Trip Days Per Year",
		/* other assumptions */
		amountOfCurrentCarAsLoan:               "Borrowed Amount for Current Car",
		upgradeCostToGoElectric:                "Premium for Electrical Car",
		EVValueImprovementPerYearPercentage:    "Relative Value Improvement per Year for Electric Cars",
		setupChargeStation:                     "Infrastructure Set Up",
		saleCostForCarInPercentage:             "Sale Related Costs",
		purchaseCostForCarInPercentage:         "Purchase Related Costs",
		financingCostInPercentage:              "Interest Rate",
		principalRepaymentsPerYearPercentage:   "Principal Repayments per Year",
		costOfPetrolPerLitre:                   "Petrol per Litre",
		costOfElectricityPerKwH:                "Electricity per KwH",
		fuelEfficiencyCV:                       "Current Car: KMs per Litre of Petrol",
		fuelEfficiencyEV:                       "Electric Car: KMs per KwH",
		fuelEfficiencyRentalCar:                "Rental Car: KMs per Litre of Petrol",
		insuranceBaseCost:                      "Insurance Base Price",
		insuranceCostPerThousand:               "Insurance per $1000 Car Value",
		averageKmsPerTyre:                      "Average KMs per Tyre",
		tyreCostCV:                             "Current Car: one Tyre",
		tyreCostEV:                             "Electric Car: one Tyre",
		licenseWOFCostCVPerYear:                "Current Car: License and WOF per Year",
		licenseWOFCostEVPerYear:                "Electric Car: License and WOF per Year",
		maintenanceCVPerTenThousandKm:          "Current Car: Service per 10,000kms",
		maintenanceEVPerTenThousandKm:          "Electric Car: Service per 10,000kms",
		depreciationRatePerYearCV:              "Current Car: Depreciation rate per Year",
		depreciationRatePerYearEV:              "Electric Car: Depreciation rate per Year",
		costPerDayRentalCar:                    "Cost per Day for Rental Car",
		kilometresPerDayForLongTrips:           "KMs per Day for Long Trips",
		subsidyPaymentFixed:                    "Electric Car: Fixed Subsidy",
		subsidyPaymentPerKM:                    "Electric Car: Kilometer Subsidy",
		personalContributionFixed:              "Electric Car: Personal Contribution per Year",
		personalContributionPerKM:              "Electric Car: Personal Contribution per KM"
	},

	desc: {
		/* key assumptions s */
		CVValueToday:                           "The price at which you can sell your car today without taking into consideration the cost of the sale (e.g. auction cost)",
		kmDrivenPerYear:                        "Approximate kilometers you drive per year. Most people drive between 15,000 and 45,000km per year.",
		/* play around assumptions */
		daysWithContinuousTripsOver100Km:       "Any trip where you drive more than 150km in one go and days that you are away on such a trip (e.g. enter seven if you drive to far away holiday destination where you will be away for a week)",
		yearsFromNow:                           "The number of years you will wait before you make the switch.  Zero means that you make the switch today.",
		yearsAfterSwitch:                       "See the results for the set number of years after you make the switch. For example, if you enter two here, then you will see the results for the year starting two year after you make the switch.",
		/* other assumptions */
		amountOfCurrentCarAsLoan:               "How much of your current car cost have you borrowed? If you paid for your current car with money you saved up then enter 0.",
		upgradeCostToGoElectric:                "The additional amount you will have to pay to purchase an electric car similar to your current vehicle. Excluding the standard costs of purchasing a trade-in car.",
		EVValueImprovementPerYearPercentage:    "The expected amount of relative cost improvements of electric vehicles as compared to conventional cars powered by oil based fuel for each year.",
		setupChargeStation:                     "The cost of setting up a charging station at your home (or work) to charge your electric car. If your home has a garage with a plug then the cost could be zero.",
		saleCostForCarInPercentage:             "The cost of selling a vehicle. Included are advertising costs, commissions, auction fees, government registration fees, etc... This is basically the difference between the buy and sell price of a car (i.e. the profit of the car sales person).",
		purchaseCostForCarInPercentage:         "Any costs associated with purchasing a car that is paid by the purchaser.",
		financingCostInPercentage:              "Interest rate charged on car loans.  It may be a good idea to increase this a little bit to cover any finance fees that are charged by most lenders. ",
		principalRepaymentsPerYearPercentage:   "The percentage of the value of the car (at the time of purchase) used to calculate any loan repayments.  For example, if you purchase a $10,000 vehicle and you pay $1000 per year (excluding interest) then the amount entered here is 10%.  In general, the payments should satisfy the basic requirement that a sale of the car today would ensure that the total outstanding amount of the loan can be met.",
		costOfPetrolPerLitre:                   "Cost of oil based fuel (diesel / petrol) per litre.",
		costOfElectricityPerKwH:                "Cost of the electricity used to charge your Electric Car, per Kilowatt Hour.  This is usuall between $0.10 and $0.40cents.  You may be able to apply a special night rate for this, if you are able to charge your car at night.",
		fuelEfficiencyCV:                       "Average number of kilometers you can drive on one litre of petrol in your current car.",
		fuelEfficiencyEV:                       "Average number of kilometers you expect to drive on one Kilowatt Hour in an electric car.",
		fuelEfficiencyRentalCar:                "Average number of kilometers you expect to drive on one litre of petrol for a rental car.",
		insuranceBaseCost:                      "A minimum insurance fee per year",
		insuranceCostPerThousand:               "Additional insurance fee per year per $1000 of the total value of your car.",
		averageKmsPerTyre:                      "The average number of kilometers you expect to drive before the average tyre needs to be replaced.",
		tyreCostCV:                             "Cost per tyre for your current car.",
		tyreCostEV:                             "Cost per tyre for your electric car.  This may be slightly different from a conventional car as an electric car may use a fuel efficient type of tyre.",
		licenseWOFCostCVPerYear:                "The total amount of licensing and testing charges and fees for your current car, per year.",
		licenseWOFCostEVPerYear:                "The total amount of licensing and testing charges and fees for an electric car, per year.",
		maintenanceCVPerTenThousandKm:          "The total service cost for your current car per 10,000km.  For this, you may include the replacements of parts that are expected in older parts (e.g. Cam Belt, Radiator, etc...)",
		maintenanceEVPerTenThousandKm:          "The total service cost for your electric car per 10,000km. ",
		depreciationRatePerYearCV:              "The value reduction per year for your current car.  For this, we do not take into account kms driven. Instead, we use a relatively high, linear depreciation rate that may be applied by insurance companies and car financing companies.",
		depreciationRatePerYearEV:              "The value reduction per year for your an electric car.  For this, we do not take into account kms driven. Instead, we use a relatively high, linear depreciation rate that may be applied by insurance companies and car financing companies.",
		costPerDayRentalCar:                    "How much does it cost to rent a similar vehicle per day, including a full insurance package.",
		kilometresPerDayForLongTrips:           "What are the average number of KMs you will drive on any days that you will use a rental car?",
		subsidyPaymentFixed:                    "Any subsidies as a percentage of the purchase cost from the government and/or your employer you will receive when purchasing an electric vehicle. This only applies at the time of purchase.  It is not a yearly payment.",
		subsidyPaymentPerKM:                    "Any per kilometer subsidies (government / employer) payments you will receive when driving an electric vehicle.",
		personalContributionFixed:              "Any personal payments or value you would like to add to the total purchase price of your electric vehicle to account for your reduced emissions. This only applies at the time of purchase.  It is not a yearly payment.",
		personalContributionPerKM:              "Any per kilometer personal payments or value you would like to add when driving an electric vehicle. This could, for example, be equal to the carbon credits you receive based on your reduced emissions."
	},

	alternativeFormatsForFxs: {
		"actualAnnualKms":                      "number",
		"actualAnnualKmsPerDay":                "number",
		"numberOfKMsWithRentalCar":             "number"
	},

	headerTitles: {
		keyAssumptions:                         "your current situation",
		playAroundAssumptions:                  "play around",
		otherAssumptions:                       "tweak assumptions",
	}
};


EVC.DefaultData = {

	/* key assumptions */
	CVValueToday:                            0,
	kmDrivenPerYear:                         0,

	/* play around assumptions */
	daysWithContinuousTripsOver100Km:        0,
	yearsFromNow:                            0,
	yearsAfterSwitch:                        0,

	/* other assumptions */
	amountOfCurrentCarAsLoan:                0,
	upgradeCostToGoElectric:                20,
	EVValueImprovementPerYearPercentage:     5,
	setupChargeStation:                    300,
	saleCostForCarInPercentage:              7,
	purchaseCostForCarInPercentage:          3,
	financingCostInPercentage:              10,
	principalRepaymentsPerYearPercentage:   30,
	costOfPetrolPerLitre:                 2.00,
	costOfElectricityPerKwH:              0.20,
	fuelEfficiencyCV:                       12,
	fuelEfficiencyEV:                        5,
	fuelEfficiencyRentalCar:                12,
	insuranceBaseCost:                     200,
	insuranceCostPerThousand:               50,
	averageKmsPerTyre:                   40000,
	tyreCostCV:                            100,
	tyreCostEV:                            150,
	licenseWOFCostCVPerYear:               250,
	licenseWOFCostEVPerYear:               350,
	maintenanceCVPerTenThousandKm:         400,
	maintenanceEVPerTenThousandKm:          50,
	depreciationRatePerYearCV:              27,
	depreciationRatePerYearEV:              27,
	costPerDayRentalCar:                    70,
	kilometresPerDayForLongTrips:          300,
	subsidyPaymentFixed:                     0,
	subsidyPaymentPerKM:                  0.00,
	personalContributionFixed:               0,
	personalContributionPerKM:               0,

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
