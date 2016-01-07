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

	debug: false,

	myData: {},

	yearsBeforeSwitch: -1,

	yearsAfterSwitch: -1,

	kmDrivenPerDay: -1,

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
		var kmDrivenPerDayTempVar = this.kmDrivenPerDay == -1 ? EVC.ActualData.kmDrivenPerDay : this.kmDrivenPerDay;
		var yearsBeforeSwitchTempVar = this.yearsBeforeSwitch == -1 ? EVC.ActualData.yearsBeforeSwitch : this.yearsBeforeSwitch;
		var yearsAfterSwitchTempVar = this.yearsAfterSwitch == -1 ? EVC.ActualData.yearsAfterSwitch : this.yearsAfterSwitch;
		this.myData = new EVCfx(yearsBeforeSwitchTempVar, yearsAfterSwitchTempVar, kmDrivenPerDayTempVar);
		//now we have the data, we can show it ...
		EVC.HTMLInteraction.init();
	},

	cloneObject: function(obj) {
		if (null == obj || "object" != typeof obj) {
			return obj;
		}
		var copy = obj.constructor();
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) {
				copy[attr] = obj[attr];
			}
		}
		return copy;
	}




};

var EVCfx = function(
	yearsBeforeSwitch,
	yearsAfterSwitch,
	kmDrivenPerDay
) {

	yearsBeforeSwitch = yearsBeforeSwitch == undefined || yearsBeforeSwitch == -1 ? EVC.ActualData.yearsBeforeSwitch : yearsBeforeSwitch;

	yearsAfterSwitch = yearsAfterSwitch == undefined || yearsAfterSwitch == -1  ? EVC.ActualData.yearsAfterSwitch : yearsAfterSwitch;

	kmDrivenPerDay = kmDrivenPerDay == undefined || kmDrivenPerDay == -1  ? EVC.ActualData.kmDrivenPerDay : kmDrivenPerDay;

	/* getters and setters */
	this.updateYearsBeforeSwitch = function(newValue){
		yearsBeforeSwitch = newValue;
	};

	this.updateYearsAfterSwitch = function(newValue){
		yearsAfterSwitch = newValue;
	};

	this.updateKmDrivenPerDay = function(newValue){
		kmDrivenPerDay = newValue;
	};

	/* calculations */
	this.setupCost = function(carType){
		if(yearsAfterSwitch == 0) {
			if(carType == "e") {
				return EVC.ActualData.setupChargeStation;
			}
			else {
				return 0;
			}
		}
		else {
			return 0;
		}
	};


	/**
	 * how much does the car depreciate each year?
	 */
	this.depreciationRate = function(carType) {
		if(carType == "e") {
			var rate = EVC.ActualData.depreciationRatePerYearEV;
		}
		else {
			var rate = EVC.ActualData.depreciationRatePerYearCV;
		}
		return rate;
	}

	/**
	 * what is the price of the current car at the moment you sell it?
	 */
	this.currentCarValueAtTimeOfSale = function(carType){
		//value today
		var value = EVC.ActualData.CVValueToday;
		//what will that value be in the future ...
		if(yearsBeforeSwitch > 0) {
			var rateCV = this.depreciationRate("f");
			for(var i = yearsBeforeSwitch; i > 0; i--) {
				value = value - (value * (rateCV / 100));
			}
		}
		return value;
	};

	/**
	 * what is the minimum price you pay for an electric vehicle when you purchase it?
	 */
	this.minimumCostElectricVehicleAtYearOfSwitch = function(carType){
		var minimum = EVC.ActualData.minimumCostElectricVehicle;
		if(yearsBeforeSwitch > 0) {
			for(var i = yearsBeforeSwitch; i > 0; i--) {
				minimum = minimum - (minimum * (EVC.ActualData.EVValueImprovementPerYearPercentage / 100));
			}
		}
		return minimum;
	};

	/**
	 * how much do you sell your current car for?
	 */
	this.salePrice = function(carType) {
		if(carType == "e") {
			return 0;
		}
		else {
			return this.currentCarValueAtTimeOfSale(carType) - (this.currentCarValueAtTimeOfSale(carType) * (EVC.ActualData.saleCostForCarInPercentage / 100))
		}
	};

	/**
	 * what is the value that you sell your car (more) for, as opposed to what do you get for it (which is a little bit less)
	 */
	this.salePriceExSalesCost = function(carType){
		return this.salePrice(carType) / (1 - (EVC.ActualData.saleCostForCarInPercentage / 100));
	};

	/**
	 * how much do you pay for the electric car?
	 */
	this.purchasePrice = function(carType) {
		if(carType == "e") {
			var value = this.currentCarValueAtTimeOfSale(carType);
			var minimum = this.minimumCostElectricVehicleAtYearOfSwitch(carType);
			var upgradeRate = (EVC.ActualData.upgradeCostToGoElectric / 100);
			//to do: which one should come first... value improvement or upgrade cost?
			//the e value improvements in the future ...
			if(yearsBeforeSwitch > 0) {
				var upgradeCostDividedByFutureYears =  upgradeRate / yearsBeforeSwitch;
				var valueImprovementRate = (EVC.ActualData.EVValueImprovementPerYearPercentage / 100);
				for(var i = yearsBeforeSwitch; i > 0; i--) {
					value = value + (value * upgradeCostDividedByFutureYears);
					value = value - (value * valueImprovementRate);
				}
			}
			else {
				value = value + (value * upgradeRate);
			}
			value = value + (value * (EVC.ActualData.purchaseCostForCarInPercentage / 100));
			if(value < minimum) {
				value = minimum;
			}
			return value;
		}
		else {
			return 0;
		}
	};

	/**
	 * how much is the electric car you purchase worth at the time of purchase (less than what you paid for it)
	 */
	this.purchasePriceExSalesCost = function(carType){
		return this.purchasePrice(carType) / (1 + (EVC.ActualData.purchaseCostForCarInPercentage / 100));
	};

	/**
	 * what is the total cost for the swap of the cars (how much value do you loose )
	 */
	this.costOfSwap = function(carType) {
		if(yearsAfterSwitch == 0) {
			if(carType == "e") {
				var saleDifference = this.salePriceExSalesCost("f") - this.salePrice("f");
				var purchaseDifference = this.purchasePrice("e") - this.purchasePriceExSalesCost("e");
				return saleDifference + purchaseDifference;
			}
			else {
				return 0;
			}
		}
		else {
			return 0;
		}
	};


	/**
	 * what is the value of the car at the start of the year?
	 */
	this.valueStartOfTheYear =  function(carType){
		if(carType == "e") {
			var value = this.purchasePriceExSalesCost(carType);
		}
		else {
			var value = this.salePriceExSalesCost(carType);
		}
		if(yearsAfterSwitch) {
			var rate = this.depreciationRate(carType) / 100;
			//depreciate for years after switch
			for(var i = yearsAfterSwitch; i > 0; i--) {
				value = value - (value * rate);
			}
		}
		return value;
	};

	/**
	 * what is the value of the car at the end of the year?
	 */
	this.valueAtTheEndOfTheYear = function(carType){
		var rate = this.depreciationRate(carType) / 100;
		var valueStartOfTheYear = this.valueStartOfTheYear(carType);
		return valueStartOfTheYear - (valueStartOfTheYear * rate);
	};


	/**
	 * what was the total size of the car loan at the time of the switch?
	 */
	this.totalLoanAtStart = function(carType) {
		if(carType == "e") {
			var amountPaid = this.purchasePrice(carType);
			var paidUpFront = this.salePrice("f") - EVC.ActualData.amountOfCurrentCarAsLoan;
			return amountPaid - paidUpFront;
		}
		else {
			return EVC.ActualData.amountOfCurrentCarAsLoan;
		}
	}

	/**
	 * how much do you pay towards paying off the loan in any year?
	 */
	this.standardPrincipalRepaymentPerYear = function(carType){
		var rate = (EVC.ActualData.principalRepaymentsPerYearPercentage / 100);
		return this.totalLoanAtStart(carType) * rate;
	}

	/**
	 * what is the amount outstanding in loan at the start of the year?
	 */
	this.amountBorrowedAtStartOfTheYear = function(carType){
		var paidSoFar = yearsAfterSwitch * this.standardPrincipalRepaymentPerYear(carType);
		var loan = this.totalLoanAtStart(carType) - paidSoFar;
		return loan < 0 ? 0 : loan;
	};

	/**
	 * what is the amount outstanding in loan at the end of the year?
	 */
	this.amountBorrowedAtEndOfTheYear = function(carType){
		var loan = this.amountBorrowedAtStartOfTheYear(carType) - this.standardPrincipalRepaymentPerYear(carType);
		return loan < 0 ? 0 : loan;
	};


	/**
	 * what is the principal repayment paid this year?
	 */
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

	/**
	 * what is the interest paid in the year?
	 */
	this.interest = function(carType){
		var interest = 0;
		var dailyInterest = (EVC.ActualData.financingCostInPercentage / 100) / 365;
		for(var i = 1; i < 366; i++) {
			var valueOfTheDay = (this.amountBorrowedAtStartOfTheYear(carType) - ((this.principalRepayment(carType) / 365) * i));
			if(valueOfTheDay > 0) {
				interest += valueOfTheDay * dailyInterest;
			}
		}
		return interest;
	};


	/**
	 * if you were to sell the car at the end of the year, how much $$ would you have left?
	 */
	this.cashLeftAfterSellingCar = function(carType){
		var salePrice = this.valueAtTheEndOfTheYear(carType) - this.amountBorrowedAtEndOfTheYear(carType);
		return salePrice - ((EVC.ActualData.saleCostForCarInPercentage / 100) * salePrice);
	};

	this.equityImprovementAtEndOfYear = function(carType) {
		return this.cashLeftAfterSellingCar("e") - this.cashLeftAfterSellingCar("f");
	};

	this.insuranceCost = function(carType){
		return EVC.ActualData.insuranceBaseCost + ((this.valueStartOfTheYear(carType) / 1000) * EVC.ActualData.insuranceCostPerThousand);
	};

	this.licensingAndWOFCost = function(carType) {
		if(carType == "e") {
			return EVC.ActualData.licenseWOFCostEVPerYear;
		}
		else {
			return EVC.ActualData.licenseWOFCostCVPerYear;
		}
	};

	this.actualAnnualKmsPerDay = function(carType){
		if(carType == "e") {
			var totalValue = kmDrivenPerDay - ((EVC.ActualData.daysWithContinuousTripsOver100Km * EVC.ActualData.kilometresPerDayForLongTrips) / 365);
		}
		else {
			var totalValue = kmDrivenPerDay;
		}
		if(totalValue < 0) {
			totalValue = 0;
		}
		return totalValue;
	};

	this.actualAnnualKms = function(carType){
		if(carType == "e") {
			var totalValue = this.actualAnnualKmsPerDay(carType) * 365;
		}
		else {
			var totalValue =  this.actualAnnualKmsPerDay(carType) * 365;
		}
		if(totalValue < 0) {
			totalValue = 0;
		}
		return totalValue;
	};

	this.fuelCost = function(carType) {
		if(carType == "e") {
			return (this.actualAnnualKms(carType) / EVC.ActualData.fuelEfficiencyEV) * EVC.ActualData.costOfElectricityPerKwH;
		}
		else {
			return (this.actualAnnualKms(carType) / EVC.ActualData.fuelEfficiencyCV) * EVC.ActualData.costOfPetrolPerLitre;
		}
	};

	this.fuelCostPerWeek = function(carType) {
		return this.fuelCost(carType) / 52;
	};

	this.maintenanceCost = function(carType) {
		if(carType == "e") {
			return maintanceCost = (this.actualAnnualKms(carType)  / 10000) * EVC.ActualData.maintenanceEVPerTenThousandKm;
		}
		else {
			return maintanceCost = (this.actualAnnualKms(carType)  / 10000) * EVC.ActualData.maintenanceCVPerTenThousandKm;
		}
	};

	this.tyreCost = function(carType) {
		var tyresNeeded = this.actualAnnualKms(carType)  / EVC.ActualData.averageKmsPerTyre;
		if(carType == "e") {
			return tyresNeeded * EVC.ActualData.tyreCostEV;
		}
		else {
			return tyresNeeded * EVC.ActualData.tyreCostCV;
		}
	};

	this.repairCost = function(carType){
		var valueStartOfTheYear = this.valueStartOfTheYear(carType);
		var kmMultiplier = (this.actualAnnualKms(carType) / 5000)
		var total = 0
		var valueMultiplier = ((valueStartOfTheYear - 7000) * -1) / 200;
		if(valueMultiplier > 0) {
			total = Math.pow(valueMultiplier, 2) *  kmMultiplier;
		}
		return total;
	};


	this.carRentalCost = function(carType) {
		if(carType == "e") {
			return EVC.ActualData.daysWithContinuousTripsOver100Km * EVC.ActualData.costPerDayRentalCar;
		}
		else {
			return 0;
		}
	};

	this.numberOfKMsWithRentalCar = function(carType) {
		if(carType == "e") {
			return EVC.ActualData.daysWithContinuousTripsOver100Km * EVC.ActualData.kilometresPerDayForLongTrips;
		}
		else {
			return 0;
		}
	}

	this.carRentaFuel = function(carType) {
		var kms = this.numberOfKMsWithRentalCar(carType);
		return (kms / EVC.ActualData.fuelEfficiencyRentalCar) * EVC.ActualData.costOfPetrolPerLitre;
	};

	this.subsidy = function(carType){
		if(carType == "e") {
			var fixedSubsidy = 0;
			if(yearsAfterSwitch == 0) {
				var fixedSubsidy = EVC.ActualData.subsidyPaymentFixed;
			}
			return -1 * (fixedSubsidy + (EVC.ActualData.subsidyPaymentPerKM * this.actualAnnualKms(carType)));
		}
		else {
			return 0;
		}
	}

	this.personalContribution = function(carType){
		if(carType == "e") {
			return -1 * (EVC.ActualData.personalContributionFixed + (EVC.ActualData.personalContributionPerKM * this.actualAnnualKms(carType)));
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
		return this.fuelCost(carType) + this.maintenanceCost(carType) + this.tyreCost(carType) + this.repairCost(carType);
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

	this.costPerKM = function(carType){
		return this.totalCombined(carType) / this.actualAnnualKms(carType);
	};

	this.totalProfit = function(){
		if(EVC.debug) {
			this.debug();
			EVC.debug = false;
		}
		return this.totalCombined("f") - this.totalCombined("e");
	};

	this.debug = function(){
		var methodArray = [
			"setupCost",
			"depreciationRate",
			"currentCarValueAtTimeOfSale",
			"minimumCostElectricVehicleAtYearOfSwitch",
			"salePrice",
			"salePriceExSalesCost",
			"purchasePrice",
			"purchasePriceExSalesCost",
			"costOfSwap",
			"valueStartOfTheYear",
			"valueAtTheEndOfTheYear",
			"totalLoanAtStart",
			"standardPrincipalRepaymentPerYear",
			"amountBorrowedAtStartOfTheYear",
			"amountBorrowedAtEndOfTheYear",
			"principalRepayment",
			"interest",
			"cashLeftAfterSellingCar",
			"insuranceCost",
			"licensingAndWOFCost",
			"actualAnnualKms",
			"actualAnnualKmsPerDay",
			"fuelCost",
			"fuelCostPerWeek",
			"maintenanceCost",
			"repairCost",
			"tyreCost",
			"carRentalCost",
			"numberOfKMsWithRentalCar",
			"carRentaFuel",
			"subsidy",
			"personalContribution"
		];
		var arrayLength = methodArray.length;
		var method = "";
		console.debug("===========================");
		console.debug("yearsBeforeSwitch: " + yearsBeforeSwitch);
		console.debug("yearsAfterSwitch: " + yearsAfterSwitch);
		console.debug("kmDrivenPerDay: " + kmDrivenPerDay);
		for (var i = 0; i < arrayLength; i++) {
			method = methodArray[i];
			console.debug(method +": "+Math.round(parseFloat(this[method]("f"))) + " ||| " + Math.round(parseFloat(this[method]("e"))));
			//Do something
		}

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
		jQuery("#PlayAroundAssumptions").html("");
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
				if(EVC.ActualData.CVValueToday > 0 && EVC.ActualData.kmDrivenPerDay > 0) {
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
					jQuery(el).parent().fadeIn();
				}
				else {
					jQuery(el).parent().fadeOut();
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
		var isMobile = this.isMobile();
		var readOnly = "";
		if(isMobile){
			var readOnly = " readonly=\"readonly\" ";
		}		
		for (var key in list) {
			if (list.hasOwnProperty(key)) {
				var type = list[key];
				var labelVariableName = key + "Label";
				var DescVariableName = key + "Desc";
				var label = EVC.DataDescription.labels[key];
				var desc = EVC.DataDescription.desc[key];
				var holderID = key + "Holder";
				var fieldID = key + "Field";
				var rangeFieldID = key + "FieldRange";
				var unformattedValue = EVC.HTMLInteraction.getValueFromDefaultsOrSession(key, false);
				var formattedValue = EVC.HTMLInteraction.getValueFromDefaultsOrSession(key, true);
				var min = EVC.DefaultDataMinMax[key][0];
				var max = EVC.DefaultDataMinMax[key][1];
				var step = Math.round(((max - min) / 20)*100)/100;

				//console.debug(key + "..." + fieldID + "..." + value)
				html += "\n";
				html += "<div id=\""+holderID+"\" class=\"fieldHolder\">";
				html += "\t<label for=\""+ fieldID + "\" onclick=\"EVC.HTMLInteraction.hideDesc('"+key+"')\"\"><strong>"+label+"</strong> <span class=\"desc\">"+desc+"</span></label>";
				html += "\t<div class=\"middleColumn\">";
				html += "\t\t<input type=\"range\" tabindex=\"-1\" class=\""+ type + "\" id=\""+ rangeFieldID + "\" onchange=\"EVC.HTMLInteraction.setValue('"+key+"', this)\" value=\""+unformattedValue+"\"  min=\""+min+"\" max=\""+max+"\" step=\""+step+"\"/>";
				html += "\t\t<input type=\"text\" class=\""+ type + "\" id=\""+ fieldID + "\"  onfocus=\"EVC.HTMLInteraction.inputReady('"+key+"', this)\" onchange=\"EVC.HTMLInteraction.setValue('"+key+"', this)\" value=\""+formattedValue+"\" onblur=\"EVC.HTMLInteraction.setMyValue('"+key+"', this)\" "+readOnly+" />";
				html += "\t</div>";
				html += "</div>";
			}
		}
		return html;
	},

	isMobile: function(){
		var isMobile = false; //initiate as false
		// device detection
		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		 isMobile = true;// some code..
		}
		return isMobile;
	},

	getValueFromDefaultsOrSession: function(key, formatted){
		//todo - get from session here ...
		var value = EVC.ActualData[key];
		if(formatted) {
			return this.formatValue(key, value)
		}
		else {
			return value;
		}
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

	inputReady: function(key, el) {
		//var val = jQuery(el).val();
		//jQuery(el).attr("placeholder", val)
		//jQuery(el).val(val.replace(/\$|,/g, ''));
		EVC.HTMLInteraction.showDesc(key);
	},

	updateInProgress: false,
	
	setValue: function(key, elOrValue){
		if(this.updateInProgress) {
			return true;
			//do nothing
		}
		else {
			this.updateInProgress = true;
			var fieldID = key + "Field";
			var rangeFieldID = key + "FieldRange";
			var holderSelector = "#"+key+"Holder";
			var labelSelector = "#"+key+"Holder label[for='"+fieldID+"'] strong";
			var defaultValue = EVC.DefaultData[key];
			var currentID = "";
			//does it need cleaning?
			if(isNaN(elOrValue)) {
				var value = jQuery(elOrValue).val();
				//remove comma and $ ...
				value = parseFloat(value.replace(/\$|,/g, ''));
				if(isNaN(value)) {
					value = defaultValue;
				}
				else {
					var currentID = jQuery(elOrValue).attr("id");
				}
			}
			else {
				var value = elOrValue;
			}
			var labelValue = EVC.DataDescription.labels[key];
			if(value != defaultValue) {
				if(defaultValue > 0) {
					jQuery(labelSelector).text(labelValue+" (default = "+this.formatValue(key, defaultValue)+")");
				}
				else {
					jQuery(labelSelector).text(labelValue);
				}
				jQuery(holderSelector).addClass("changed");
			}
			else {
				jQuery(labelSelector).text(labelValue);
				jQuery(holderSelector).removeClass("changed");
			}
			//update fields
			if(fieldID != currentID) {
				jQuery("#"+fieldID).val(value).trigger("blur");
			}
			else {
				this.hideDesc(key);
			}
			if(rangeFieldID != currentID) {
				jQuery("#"+rangeFieldID).val(value);
			}
			//send to server
			if(EVC.workableLinks()) {
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
			EVC.ActualData[key] = value;
			//special exception ..
			if(key == "kmDrivenPerDay" || key == "yearsBeforeSwitch" || key == "yearsAfterSwitch") {
				if(key == "kmDrivenPerDay") {
					EVC.myData.updateKmDrivenPerDay(value);
				}
				else if(key == "yearsBeforeSwitch") {
					EVC.myData.updateYearsBeforeSwitch(value);
				}
				else if(key == "yearsAfterSwitch"){
					EVC.myData.updateYearsAfterSwitch(value);
				}
			}
			//update HTML
			this.updateScreen();
			this.updateInProgress = false;
		}
	},

	hideDesc: function(key){
		jQuery("div#"+key+"Holder").removeClass("infocus");
	},

	showDesc: function(key){
		jQuery(".infocus").each(
			function(i, el){
				jQuery(el).removeClass("infocus");
			}
		);
		jQuery("div#"+key+"Holder").addClass("infocus");
	},

	updateScreen: function(){
		this.populateResultTable();
		this.populateCalculations();
		this.populateLinks();
		var $el = jQuery("#ProfitAndLoss");
		//jQuery($el).removeClass("fixed");
		jQuery($el).addClass("fixed");
		//if(this.isScrolledIntoView($el)) {
			//do nothing
		//}
		//else {
		//	
		//}
	},

	setMyValue: function(key, item){
		var value = item.value;
		value = parseFloat(value.replace(/\$|,/g, ''));
		value = this.formatValue(key, value);
		item.value = value;
	},
	resetSession: function(){
		alert("to be completed");
	},

	isScrolledIntoView: function(elem) {
		var $elem = jQuery(elem);
		var $window = jQuery(window);

		var docViewTop = $window.scrollTop();
		var docViewBottom = docViewTop + $window.height();

		var elemTop = $elem.offset().top;
		var elemBottom = elemTop + $elem.height();

		return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
	}	

};

EVC.scenarios = {

	totalProfit: function(){
		return EVC.myData.totalProfit() + EVC.myData.equityImprovementAtEndOfYear();
	},

	theeYearProfit: function(){
		var start = parseInt(EVC.ActualData.yearsAfterSwitch) - 0;
		var year1 = new EVCfx(-1, 0 + start, EVC.ActualData.kmDrivenPerDay);
		var year2 = new EVCfx(-1, 1 + start, EVC.ActualData.kmDrivenPerDay);
		var year3 = new EVCfx(-1, 2 + start, EVC.ActualData.kmDrivenPerDay);
		var totalProfit = year1.totalProfit() + year2.totalProfit() + year3.totalProfit();
		var restValue = year3.equityImprovementAtEndOfYear();
		return totalProfit + restValue;
	},

	fiveYearProfit: function(){
		var start = parseInt(EVC.ActualData.yearsAfterSwitch) - 0;
		var year1 = new EVCfx(-1, 0 + start, EVC.ActualData.kmDrivenPerDay);
		var year2 = new EVCfx(-1, 1 + start, EVC.ActualData.kmDrivenPerDay);
		var year3 = new EVCfx(-1, 2 + start, EVC.ActualData.kmDrivenPerDay);
		var year4 = new EVCfx(-1, 3 + start, EVC.ActualData.kmDrivenPerDay);
		var year5 = new EVCfx(-1, 4 + start, EVC.ActualData.kmDrivenPerDay);
		var totalProfit = year1.totalProfit() + year2.totalProfit() + year3.totalProfit() + year4.totalProfit() + year5.totalProfit();
		var restValue = year5.equityImprovementAtEndOfYear();
		return totalProfit + restValue;
	},

	plusFiveThousand: function(){
		var newDistance = parseFloat(EVC.ActualData.kmDrivenPerDay) + (5000/365);
		var year1 = new EVCfx(-1, -1, newDistance);
		return year1.totalProfit();
	},

	minusFiveThousand: function(){
		var year1 = new EVCfx(-1, -1, parseFloat(EVC.ActualData.kmDrivenPerDay) - (5000 / 365));
		return year1.totalProfit();
	},

	inThreeYearsTime: function(){
		var year1 = new EVCfx(3 + parseInt(EVC.ActualData.yearsBeforeSwitch), -1, parseFloat(EVC.ActualData.kmDrivenPerDay));
		//return year1.debug();
		return year1.totalProfit();
	}

}

EVC.DataDescription = {

	keyAssumptionKeys: {
		"CVValueToday":                         "currency",
		"kmDrivenPerDay":                       "number"
	},

	playAroundAssumptionKeys: {
		"daysWithContinuousTripsOver100Km":     "number",
		"yearsBeforeSwitch":                    "number",
		"yearsAfterSwitch":                     "number"
	},

	otherAssumptionKeys: {
		"minimumCostElectricVehicle":           "currency",
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
		CVValueToday:                           "* Current Car Value",
		kmDrivenPerDay:                         "* Average Kilometers Driven per Day",
		/* play around assumptions */
		yearsBeforeSwitch:                      "Number of Years Before Switch",
		yearsAfterSwitch:                       "Number of Years after Switch",
		daysWithContinuousTripsOver100Km:       "Big Trip Days Per Year",
		/* other assumptions */
		amountOfCurrentCarAsLoan:               "Current Car: Borrowed Amount",
		minimumCostElectricVehicle:             "Electric Car: Minimum Purchase Price",
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
		subsidyPaymentFixed:                    "Fixed Subsidy",
		subsidyPaymentPerKM:                    "KM Subsidy",
		personalContributionFixed:              "Personal Contribution per Year",
		personalContributionPerKM:              "Personal Contribution per KM"
	},

	desc: {
		/* key assumptions s */
		CVValueToday:                           "The price at which you can sell your car today without taking into consideration the cost of the sale (e.g. auction cost)",
		kmDrivenPerDay:                         "Approximate kilometers you drive per day. Consider weekends and weekdays. You might be able to add up all the KMs you drive Mon-Fri and separately for Saturday and Sunday. After that, add all of them and divide by seven.",
		/* play around assumptions */
		daysWithContinuousTripsOver100Km:       "Any trip where you drive more than 150km in one go and days that you are away on such a trip (e.g. enter seven if you drive to far away holiday destination where you will be away for a week)",
		yearsBeforeSwitch:                      "The number of years you will wait before you make the switch.  Zero means that you make the switch today.",
		yearsAfterSwitch:                       "See the results for the set number of years after you make the switch. For example, if you enter two here, then you will see the results for the year starting two year after you make the switch.",
		/* other assumptions */
		amountOfCurrentCarAsLoan:               "How much of your current car cost have you borrowed? If you paid for your current car with money you saved up then enter 0.",
		minimumCostElectricVehicle:             "Minimum price for an electric vehicle at the moment. Because electric cars are relatively new, there are few older models and depreciated cars, therefore a minimum price may apply.",
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


/******************************************************************
 * DATA
 *
 *
 *
 *
 */




EVC.DefaultData = {

	/* key assumptions */
	CVValueToday:                            0,
	kmDrivenPerDay:                          0,

	/* play around assumptions */
	daysWithContinuousTripsOver100Km:        0,
	yearsBeforeSwitch:                       0,
	yearsAfterSwitch:                        0,

	/* other assumptions */
	amountOfCurrentCarAsLoan:                0,
	minimumCostElectricVehicle:          18000,
	upgradeCostToGoElectric:                50,
	EVValueImprovementPerYearPercentage:    20,
	setupChargeStation:                    300,
	saleCostForCarInPercentage:              7,
	purchaseCostForCarInPercentage:          3,
	financingCostInPercentage:              10,
	principalRepaymentsPerYearPercentage:   20,
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

EVC.ActualData = EVC.cloneObject(EVC.DefaultData);

EVC.DefaultDataMinMax = {

	/* key assumptions */
	CVValueToday:                            [0, 40000],
	kmDrivenPerDay:                          [0, 100],

	/* play around assumptions */
	daysWithContinuousTripsOver100Km:        [0, 50],
	yearsBeforeSwitch:                       [0,10],
	yearsAfterSwitch:                        [0,10],

	/* other assumptions */
	amountOfCurrentCarAsLoan:                [0,10000],
	minimumCostElectricVehicle:              [18000,36000],
	upgradeCostToGoElectric:                 [0,100],
	EVValueImprovementPerYearPercentage:     [0,50],
	setupChargeStation:                      [0,5000],
	saleCostForCarInPercentage:              [0,25],
	purchaseCostForCarInPercentage:          [0,25],
	financingCostInPercentage:               [0,20],
	principalRepaymentsPerYearPercentage:    [0,50],
	costOfPetrolPerLitre:                    [1.00,3.50],
	costOfElectricityPerKwH:                 [0.05,0.5],
	fuelEfficiencyCV:                        [5,30],
	fuelEfficiencyEV:                        [1,20],
	fuelEfficiencyRentalCar:                 [5,30],
	insuranceBaseCost:                       [0,1000],
	insuranceCostPerThousand:                [0,200],
	averageKmsPerTyre:                       [20000,80000],
	tyreCostCV:                              [50,300],
	tyreCostEV:                              [50,300],
	licenseWOFCostCVPerYear:                 [0,1000],
	licenseWOFCostEVPerYear:                 [0,1000],
	maintenanceCVPerTenThousandKm:           [50,500],
	maintenanceEVPerTenThousandKm:           [50,500],
	depreciationRatePerYearCV:               [10,40],
	depreciationRatePerYearEV:               [10,40],
	costPerDayRentalCar:                     [10,100],
	kilometresPerDayForLongTrips:            [100,2000],
	subsidyPaymentFixed:                     [0,15000],
	subsidyPaymentPerKM:                     [0,0.50],
	personalContributionFixed:               [0,15000],
	personalContributionPerKM:               [0,0.50]
};

