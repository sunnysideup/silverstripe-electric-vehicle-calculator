/**
 * @author Nicolaas @ sunnysideup.co.nz
 *
 *
 */
/**
 * general notes:
 * -------------
 *
 *  # always change data through EVC.HTMLInteraction.setValue()
 *    to make the caching work.
 *
 *  #
 *
 *
 */


/**
 * kick start into action!
 */
jQuery(document).ready(
    function(){
        EVC.init();
    }
);

/**
 * main object holdering main variables
 */
var EVC = {

    /**
     * debug the application
     * @type {Boolean}
     */
    debug: false,

    /**
     * current data set
     * @type {Object}
     */
    myData: {},

    /**
     * years before switching to EV
     * @type {Number}
     */
    yearsBeforeSwitch: -1,

    /**
     * years after switch to EV
     * @type {Number}
     */
    yearsAfterSwitch: -1,

    kmDrivenPerDay: -1,

    serverKey: "",

    isLocked: false,

    isChanged: false,

    baseLink: "",

    numberOfSteps: 10,


    isReadyToCalculate: function(){
        return EVC.ActualData.CVValueToday > 0 && EVC.ActualData.kmDrivenPerDay > 0;
    },

    workableLinks: function(){
        //console.debug(this.baseLink + "|" + this.serverKey)
        if(this.baseLink !== "" && this.serverKey !== "") {
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

    retrieveLink: function(){
        if(this.workableLinks()) {
            return this.baseLink+"retrieve/"+this.serverKey+"/";
        }
        return "";
    },

    lockLink: function(){
        if(this.workableLinks()) {
            return this.baseLink+"lock/"+this.serverKey+"/";
        }
        return "";
    },

    listLink: function(){
        if(this.workableLinks()) {
            return this.baseLink+"all/";
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
        EVC.HTMLInteraction.updateScreen();
    },

    cloneObject: function(obj) {
        if (null === obj || "object" !== typeof obj) {
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

    yearsBeforeSwitch = typeof yearsBeforeSwitch === 'undefined' || yearsBeforeSwitch == -1 ? EVC.ActualData.yearsBeforeSwitch : yearsBeforeSwitch;

    yearsAfterSwitch = typeof yearsAfterSwitch === 'undefined' || yearsAfterSwitch == -1  ? EVC.ActualData.yearsAfterSwitch : yearsAfterSwitch;

    kmDrivenPerDay = typeof kmDrivenPerDay === 'undefined' || kmDrivenPerDay == -1  ? EVC.ActualData.kmDrivenPerDay : kmDrivenPerDay;

    var yearOfManufacturing = 0;

    var newPrice = 0;

    var todaysOdoMeter = 0;

    /**
     * if the car was worth $0.00 then
     * how long would it last?
     * @var int
     */
    var mininimumYearsToZero =  12;

    /**
     *
     * @var int
     */
    var mininimumOdoToZero = 200000;

    /**
     * e.g. if the new price of the car is $100,000
     * then the car will have an additional 5 years.
     * @var int
     */
    var dividerOfNewValueYearsToZero = 100;

    /**
     * e.g. if new value = $200,000
     * then you can add another 200,000 to zero
     */
    var dividerOfNewValueOdoToZero =  1;


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
    this.hasCar = function(carType) {
        if(carType == "f") {
            return EVC.ActualData.CVValueToday > 100 ? true : false;
        }
        else {
            return true;
        }
    };


    this.expectedKmsPerYearBasedOnOdo = function(carType){
        var actual = this.actualAnnualKmsPerDay(carType);
        if(actual > 0) {
            return actual;
        }
        else {
            Math.round(EVC.ActualData.todaysOdoMeter / EVC.ActualData.yearOfManufacturing);
        }
    },

    this.currentPrice = function(carType){
        EVC.ActualData.newPrice - (0.5 * this.yearsReduction()) - (0.5 * this.kmsReduction());
    },

    this.calendarYearOfSwitch = function(carType) {
        var d = new Date();
        var year = d.getYear();
        // should this be: EVC.ActualData.yearsBeforeSwitch;???
        return year + yearsBeforeSwitch;
    },

    this.kmsTravelledAtSwitch = function(carType) {
        return EVC.ActualData.todaysOdoMeter + (yearsBeforeSwitch * this.expectedKmsPerYearBasedOnOdo("f"));
    },

    this.yearsOldAtSwitch = function(carType) {
        this.calendarYearOfSwitch() - EVC.ActualData.yearOfManufacturing;
    },

    this.numberOfKMsToZero = function(carType) {
        return EVC.ActualData.mininimumOdoToZero + (EVC.ActualData.newPrice / EVC.ActualData.dividerOfNewValueOdoToZero);
    },

    this.currentPriceBasedOnNewPrice = function(carType) {
        var yearsOld = this.yearsOldAtSwitch() + yearsAfterSwitch;
        var calcPrice = EVC.ActualData.newPrice;
        var depreciationRate = this.depreciationRate(carType);
        for(var y = 0; y <= yearsOld; y++) {
            calcPrice = calcPrice - (calcPrice * (depreciationRate - (y / EVC.ActualData.dividerDeprPerValueYear)));
        }
        return calcPrice;
    },

    this.currentPriceBasedOnKms = function(carType) {
        var kmsDone = this.kmsTravelledAtSwitch(carType) + (yearsAfterSwitch * this.expectedKmsPerYearBasedOnOdo(carType));
        var startPrice = EVC.ActualData.newPrice;
        var kmsToZero = this.numberOfKMsToZero();
        var percentageDone = kmsDone / kmsToZero;
        return startPrice - (startPrice * percentageDone);
    },


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
     * what is the maximum price you pay for an electric vehicle when you purchase it?
     */
    this.maximumCostElectricVehicleAtYearOfSwitch = function(carType){
        var maximum = EVC.ActualData.maximumCostElectricVehicle;
        if(yearsBeforeSwitch > 0) {
            for(var i = yearsBeforeSwitch; i > 0; i--) {
                maximum = maximum - (maximum * (EVC.ActualData.EVValueImprovementPerYearPercentage / 100));
            }
        }
        return maximum;
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
            var maximum = this.maximumCostElectricVehicleAtYearOfSwitch(carType);
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
            if(value > maximum) {
                value = maximum;
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

    this.replacementSaving = function(carType) {
        return 100;
    }

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
        if(this.hasCar(carType)) {
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
        }
        return 0;
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
        var tyresNeeded = (this.actualAnnualKms(carType)  / EVC.ActualData.averageKmsPerTyre) * 4;
        if(carType == "e") {
            return tyresNeeded * EVC.ActualData.tyreCostEV;
        }
        else {
            return tyresNeeded * EVC.ActualData.tyreCostCV;
        }
    };

    this.repairCost = function(carType){
        var valueStartOfTheYear = this.valueStartOfTheYear(carType);
        var kmMultiplier = (this.actualAnnualKms(carType) / EVC.ActualData.repairKMDivider)
        var total = 0
        var valueMultiplier = ((valueStartOfTheYear - EVC.ActualData.maxCarValueForRepairs) * -1) / EVC.ActualData.valueDividerForRepairCalculation;
        if(valueMultiplier > 0) {
            total = Math.pow(valueMultiplier, EVC.ActualData.exponentialGrowthFactorForRepairs) *  kmMultiplier;
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
        return this.interest(carType) + this.principalRepayment(carType) + this.replacementSaving(carType);
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

    this.totalProfitWithEquity = function(){
        return this.totalProfit() + this.equityImprovementAtEndOfYear();
    };

    this.debug = function(){
        var methodArray = [
            "hasCar",
            "setupCost",
            "depreciationRate",
            "currentCarValueAtTimeOfSale",
            "minimumCostElectricVehicleAtYearOfSwitch",
            "maximumCostElectricVehicleAtYearOfSwitch",
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
        console.debug("baseLink: " + EVC.baseLink);
        console.debug("serverKey: " + EVC.serverKey);
        console.debug("IsLocked: " + (EVC.isLocked ? "true" : "false"));
        for (var i = 0; i < arrayLength; i++) {
            method = methodArray[i];
            if(method === 'hasCar') {
                console.debug(method +": "+this[method]("f") + " ||| " + this[method]("e"));
            } else {
                console.debug(method +": "+Math.round(parseFloat(this[method]("f"))) + " ||| " + Math.round(parseFloat(this[method]("e"))));
            }
            //Do something
        }

    };

    return this;

};



EVC.HTMLInteraction = {

    isStartup: true,

    hasRangeSlider: true,

    hasGraphs: true,

    isTouchScreen: null,

    init: function(){
        this.clear();
        this.isTouchScreen = this.isTouchScreenTest();
        if(this.isTouchScreen) {
            this.hasRangeSlider = true;
        } else {
            this.hasRangeSlider = false;
        }
        this.buildKeyAssumptionForm();
        this.buildPlayAroundAssumptionForm();
        this.buildOtherAssumptionsForm();
        //this.populateResultTable();
        //this.populateCalculations();
        //this.populateLinks();
        //this.setupLinks();
        this.populateLinks();
        this.setupShowAndHideResultRows();
        this.inlineExpandListener();
        if(this.hasRangeSlider) {

        }
        else {
            this.makeGraphClickable();
        }
        if( EVC.isReadyToCalculate()) {
            this.hideStartup();
            this.selectFirstInput();
        } else {
            this.hideDetails();
            window.setTimeout(
                function(){
                    if( EVC.isReadyToCalculate()) {
                        EVC.HTMLInteraction.hideStartup();
                        EVC.HTMLInteraction.selectFirstInput();
                    }
                },
                500
            );
        }


    },

    clear: function(){
        jQuery("#EVCWrapper").addClass("notReady");
        jQuery("#KeyAssupmptions").html("");
        jQuery("#PlayAroundAssumptions").html("");
        jQuery("#OtherAssumptions").html("");
        jQuery("tr.detail").hide();
        jQuery("a.expandRows").unbind("click");
    },

    isTouchScreenTest: function() {
        if(this.isTouchScreen === null) {
            this.isTouchScreen = 'ontouchstart' in window        // works on most browsers
                || navigator.maxTouchPoints;                     // works on IE10/11 and Surface
        }
        return this.isTouchScreen;
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
                var method = jQuery(el).parents("tr").attr("data-fx");
                var carType = jQuery(el).attr("data-type");
                if(method && carType) {
                    if(EVC.myData.hasCar(carType) == true) {
                        var value = EVC.myData[method](carType);
                    }
                    else {
                        var value = 0;
                    }
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
                        else if(format == "kmPerDay") {
                            var formattedValue = numberValue.kmPerYearFormat();
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
                if(jQuery(el).hasClass("detailHeader")) {
                    if(jQuery(el).children().length == 0) {
                        var text = jQuery(el).text();
                        var html = "<a href=\"#\" class=\"influencerLink\" onclick=\"return EVC.scenarios.checkInfluenceForRowEntry(this, 'myData', '"+method+"');\">"+text+"</a>";
                    }
                    else {
                        var influencersOpened = jQuery(el).find("a.hasInfluencersOpened").get(0);
                        if(influencersOpened) {
                            //click twice to remove and open it back up...
                            influencersOpened.click();
                            influencersOpened.click();
                        }
                    }
                    jQuery(el).html(html);
                }
            }
        );
    },

    populateCalculations: function(){
        jQuery("span.calcVal").each(
            function(i, el) {
                if(EVC.isReadyToCalculate()) {
                    var method = jQuery(el).attr("data-fx");
                    //console.debug(method);
                    var value = EVC.scenarios[method]();
                    var numberValue = parseFloat(value);
                    var htmlValue = 'error';
                    var originalNumber = numberValue;
                    var calculatedNumber = numberValue;
                    if(method === 'fiveYearProfit') {
                        var calculatedNumber = Math.abs(numberValue);
                    }
                    var formattedValue = calculatedNumber.formatMoney();
                    if(value < 0) {
                        htmlValue = "<span class=\"negativeNumber\">"+formattedValue+"</span>";
                    }
                    else {
                        htmlValue = "<span class=\"positiveNumber\">"+formattedValue+"</span>";
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
        jQuery(".straightFillers").each(
            function(i, el) {
                var method = jQuery(el).attr("data-fx");
                if(method) {
                    var value = EVC.scenarios[method]();
                    jQuery(el).html(value);
                } else {
                    console.error('Could not find method on element')
                }
            }
        )
    },

    populateLinks: function() {
        jQuery(".saveLink").each(
            function(i, el){
                if(jQuery(el).attr("data-replace-link") == "yes") {
                    jQuery(el).attr("data-default-href", jQuery(el).attr("href")).addClass("hideWithoutServerInteraction");
                }
            }
        );
        jQuery(".saveLink").click(
            function(event){
                var el = this;
                var newLink = "";
                var mustReplaceLink = jQuery(el).attr("data-replace-link");
                var workableLinks = EVC.workableLinks();
                //have to replace but can not replace
                if(workableLinks !== true && mustReplaceLink == "yes") {
                    alert("Could not save data ... please try again");
                    return false;
                }
                else {
                    //can server interact - then lock and redirect ...
                    if(workableLinks === true) {
                        if(EVC.isChanged === true) {
                            var answer = prompt("Please enter a title for your calculation sheet");
                        }
                        else {
                            var answer = "ignore";
                        }
                        var lockLink = EVC.lockLink();
                        if(answer === null) {
                            if(EVC.debug) {console.debug("cancelled");}
                            return false;
                        }
                        answer = encodeURIComponent(answer);
                        if(EVC.debug) {console.debug("running AJAX: lock link"+lockLink+" answer"+answer);}
                        jQuery.ajax({
                            method: "GET",
                            url: lockLink,
                            data: { "title": answer },
                            cache: false
                        })
                        .done(function( returnedFollowLink ) {
                                if(mustReplaceLink == "yes") {
                                    var decodedReplaceLink = returnedFollowLink;
                                    var encodedReplaceLink = encodeURIComponent(returnedFollowLink);
                                    var oldHref = jQuery(el).attr("data-default-href");
                                    newLink = oldHref;
                                    newLink = newLink.replace("[DECODED_LINK]", decodedReplaceLink);
                                    newLink = newLink.replace("[ENCODED_LINK]", encodedReplaceLink);
                                    jQuery(el).attr("href", newLink);
                                    if(EVC.debug) {console.debug("redirecting to: "+newLink);}
                                }
                                else {
                                    if(EVC.debug ) {console.debug("no need to replace link");}
                                    newLink = jQuery(el).attr("href");
                                }
                                window.location = newLink;
                                return true;
                        })
                        .fail(function( jqXHR, textStatus ) {
                                alert( "Error in application - link data can not be saved: " + textStatus );
                                followLink = "";
                                mustReplaceLink = "yes";
                                return false;
                        });
                    }
                    //server is not working, but we can redirect immediately
                    else if(mustReplaceLink == "no") {
                        if(EVC.debug) {console.debug("redirect without saving");}
                        return true;
                    }
                    else {
                        alert("could not run command");
                        return false;
                    }
                    return false;
                }
            }
        );
    },

    updateLinks: function() {
        if(EVC.workableLinks() == true && EVC.isReadyToCalculate() == true) {
            jQuery(".saveLink.hideWithoutServerInteraction").show();
        }
        else {
            jQuery(".saveLink.hideWithoutServerInteraction").hide();
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

    hideStartup: function() {
        jQuery('#start-up-screen').hide();
        jQuery('#ElectricVehicleCalculator').show();
    },

    hideDetails: function() {
        jQuery('#ElectricVehicleCalculator').hide();
        jQuery('#HowMuchDoWeSave a').click(
            function(e) {
                EVC.HTMLInteraction.transitionFromStartupToResults();
                return false;
            }
        );
        window.setTimeout(
            function(){
                jQuery('input[name="startup-car-value"]').focus();
            },
            300
        );
    },

    transitionFromStartupToResults: function() {
        jQuery('body').addClass('loading');
        var carValue = jQuery('input[name="startup-car-value"]').val();
        carValue = parseFloat(carValue.replace(/[^0-9.]/g, ''));
        var petrolSpentPerWeek = jQuery('input[name="petrol-spent-per-week"]').val();
        petrolSpentPerWeek = parseFloat(petrolSpentPerWeek.replace(/[^0-9.]/g, ''));
        var litresBoughtPerWeek = petrolSpentPerWeek / EVC.DefaultData.costOfPetrolPerLitre;
        var odoPerDay = (EVC.DefaultData.fuelEfficiencyCV *  litresBoughtPerWeek) / 7;
        var next = true;
        if(parseInt(odoPerDay) > 5) {
        } else {
            jQuery('input[name="petrol-spent-per-week"]').focus();
            next = false;
        }
        if(parseInt(carValue) > 50) {

        } else {
            jQuery('input[name="startup-car-value"]').focus();
            next = false;
        }

        if(next) {
            EVC.HTMLInteraction.setValue('CVValueToday', carValue);
            EVC.HTMLInteraction.setValue('kmDrivenPerDay', odoPerDay);
            jQuery('#start-up-screen').slideUp(
                function() {
                    jQuery('#ElectricVehicleCalculator').slideDown(
                        function() {
                            window.setTimeout(
                                function(){
                                    jQuery('#CVValueTodayField').change();
                                    jQuery('body').removeClass('loading');
                                    jQuery('#ProfitAndLoss').addClass('full-screen');
                                },
                                500
                            );
                            jQuery('#ViewDetailsNow a').click(
                                function(e) {
                                    EVC.HTMLInteraction.transitionFromResultsToDetails();
                                    return false;
                                }
                            );
                        }
                    );
                }
            );
        }
        return false;
    },

    transitionFromResultsToDetails: function() {
        jQuery('#ViewDetailsNow').remove();
        jQuery('#ProfitAndLoss').removeClass('full-screen');
        return false;
    },

    selectFirstInput: function(){
        //we have to wait until HTML is registered...
        window.setTimeout(
            function(){
                jQuery("#CVValueTodayDisplay").click();
            },
            300
        );
    },

    makeGraphClickable: function(){
        jQuery("canvas").on(
            "click",
            function(evt){
                var activePoints1 = EVC.graphMaker.currentGraph.getPointsAtEvent(evt);
                var newValue =  parseFloat(activePoints1[0]["label"].replace(/\$|,/g, ''));
                var key = jQuery(this).attr("data-for");
                jQuery("#"+key+"Field").val(newValue).change();
            }
        );
    },

    createFormFieldsFromList: function(list) {
        var html = "";
        var readOnly = "";
        if( this.isTouchScreenTest()){
            readOnly = " readonly=\"readonly\" ";
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
                var displayFieldID = key + "Display";
                var rangeFieldID = key + "FieldRange";
                var influencerID = key + "Influence";
                var unformattedValue = EVC.HTMLInteraction.getValueFromDefaultsOrSession(key, false);
                var formattedValue = EVC.HTMLInteraction.getValueFromDefaultsOrSession(key, true);
                var min = EVC.DefaultDataMinMax[key][0];
                var max = EVC.DefaultDataMinMax[key][1];
                var step = Math.round(((max - min) / EVC.numberOfSteps)*100)/100;
                var stepHTML = "step=\""+step+"\"";

                //console.debug(key + "..." + fieldID + "..." + value)
                html += "<div id=\""+holderID+"\" class=\"fieldHolder "+ type + "\">";
                    html += "<p id=\""+key+"Modal\" class=\"modalP\"><a href=\"#"+holderID+"\" class=\"closeModal\" onclick=\"return EVC.HTMLInteraction.closeModal('"+key+"');\">close</a></p>";
                    html += "<label for=\""+ rangeFieldID + "\">";
                        html += "<strong onclick=\"return EVC.HTMLInteraction.showDesc('"+key+"');\">"+label+"</strong>";
                        html += "<span class=\"desc\">"+desc+"</span>";
                    html += "</label>";
                    html += "<div class=\"middleColumn\">";
                        html += "<a href=\"#"+holderID+"\" class=\"displayValue\" id=\""+ displayFieldID + "\" onclick=\"return EVC.HTMLInteraction.showDesc('"+key+"');\">"+formattedValue+"</a>";
                        if(EVC.HTMLInteraction.hasRangeSlider) {html += "<input type=\"range\" tabindex=\"-1\" class=\""+ type + "\" id=\""+ rangeFieldID + "\" oninput=\"return  EVC.HTMLInteraction.showUpdatedValue('"+key+"', this);\" onchange=\"return EVC.HTMLInteraction.setValue('"+key+"', this);\" value=\""+unformattedValue+"\"  min=\""+min+"\" max=\""+max+"\" step=\""+step+"\" />";}
                        html += "<input type=\"number\" inputmode=\"numeric\" pattern=\"[0-9]*\"  class=\""+ type + "\" oninput=\"return  EVC.HTMLInteraction.startInput('"+key+"', this);\" id=\""+ fieldID + "\" onclick=\"return EVC.HTMLInteraction.clickInput('"+key+"', this);\" onfocus=\"return EVC.HTMLInteraction.inputReady('"+key+"', this);\" onchange=\"return EVC.HTMLInteraction.setValue('"+key+"', this);\" value=\""+unformattedValue+"\" "+readOnly+" min=\""+min+"\" max=\""+max+"\" "+stepHTML+" />";
                    html += "</div>";
                    if(EVC.HTMLInteraction.hasGraphs) {
                        html += '<p class="graphShower"><a href="#'+key+'Chart\" onclick="return EVC.HTMLInteraction.showGraphNow(\''+key+'\')">view influence graph ⇣</a></p>';
                        html += "<figure id=\""+key+"Chart\" class=\"chartHolder\"><figcaption></figcaption><canvas data-for=\""+key+"\"></canvas></figure>";
                    }
                html += "</div>";
            }
        }
        return html;
    },


    getValueFromDefaultsOrSession: function(key, formatted){
        //todo - get from session here ...
        var value = EVC.ActualData[key];
        if(formatted) {
            return this.formatValue(key, value);
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
            case "kmPerDay":
                value = value.kmPerYearFormat();
                break;
            default:
                value = value.formatMoney();
        }
        return value;
    },

    clickInput: function(key, el) {
        jQuery(el).removeAttr("readonly");
        jQuery(el).focus();
        jQuery(el).select();
        return true;
    },

    inputReady: function(key, el) {
        //var val = jQuery(el).val();
        //jQuery(el).attr("placeholder", val)
        //jQuery(el).val(val.replace(/\$|,/g, ''));
        EVC.HTMLInteraction.showDesc(key);
    },

    showUpdatedValue: function(key, elOrValue){
        var value = jQuery(elOrValue).val();
        var FieldID = key + "Field";
        jQuery("#"+ FieldID).val(value);
        this.startInput(key, elOrValue);
    },

    startInput: function(key, elOrValue){
        jQuery("#ProfitAndLoss .calcVal").text("calculating ...");
        if(this.isTouchScreenTest()) {
            jQuery("#ProfitAndLoss p.good").hide();
            jQuery("#ProfitAndLoss p.warning").show();
        }
    },

    updateInProgress: false,

    setValue: function(key, elOrValue, forceUpdate){
        if(forceUpdate !== true) {
            forceUpdate = false;
        }
        if(this.updateInProgress) {
            console.error('Application can not be updated right now.');
            return false;
            //do nothing
        }
        else {
            this.updateInProgress = true;
            var fieldID = key + "Field";
            var rangeFieldID = key + "FieldRange";
            var displayFieldID = key + "Display";
            var holderSelector = "#"+key+"Holder";
            var labelSelector = "#"+key+"Holder label strong";
            var defaultValue = EVC.DefaultData[key];
            var currentID = "";
            var updateScreen = false;
            //does it need cleaning?
            if(isNaN(elOrValue)) {
                EVC.isChanged = true;
                updateScreen = true;
                var value = jQuery(elOrValue).val();
                //remove comma and $ ...
                value = parseFloat(value.replace(/\$|,/g, ''));
                if(isNaN(value)) {
                    value = EVC.ActualData[key];
                    if(isNaN(value)) {
                        value = defaultValue;
                    }
                }
                else {
                    var currentID = jQuery(elOrValue).attr("id");
                }
            }
            else {
                if(forceUpdate) {
                    EVC.isChanged = true;
                    updateScreen = true;
                }
                var value = elOrValue;
            }
            //generic rounding ...
            value = Math.round(value * 100) / 100;
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
            //smart numbers
            if(key == "kmDrivenPerDay") {
                if((value / 365) > 3) {
                    value = Math.round(value / 365);
                    currentID = "";
                }
            }
            //update fields
            if(fieldID != currentID) {
                jQuery("#"+fieldID).val(value);
            }
            if(rangeFieldID != currentID) {
                jQuery("#"+rangeFieldID).val(value);
            }
            var formattedValue = this.formatValue(key, value);
            jQuery("#"+displayFieldID).text(formattedValue);
            //send to server
            if(EVC.workableLinks()) {
                jQuery.ajax({
                    method: "GET",
                    url: EVC.saveLink(),
                    data: { key: key, value: value },
                    cache: false
                })
                .done(function( returnKey ) {
                    if(returnKey) {
                        EVC.isLocked = false;
                        EVC.serverKey = returnKey;
                    }
                })
                .fail(function( jqXHR, textStatus ) {
                    alert( "Data could not be saved: " + textStatus );
                });
                //save locally...
            }
            //set data ...
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
            if(updateScreen) {
                this.updateScreen(key);
            }
            this.updateInProgress = false;
            return false;
        }
    },

    showDesc: function(key, modal){
        var currentEl = jQuery("div#"+key+"Holder");
        jQuery(".infocus").each(
            function(i, el){
                if(jQuery(currentEl).attr("id") != jQuery(el).attr("id")) {
                    jQuery(el).removeClass("infocus").find("figure").hide();
                }
                else {
                    //do nothing
                }
            }
        );
        if(jQuery(currentEl).hasClass("infocus")) {
            //do nothing
        }
        else {
            currentEl.addClass("infocus");
            if(modal) {
                //do nothing
            }
            else {
                jQuery('html, body').animate(
                    {scrollTop: jQuery("#"+key+"Holder").offset().top - (jQuery("#ProfitAndLoss").height() + 10)
                    },
                    500,
                    function() {
                        jQuery("#"+key+"Holder").find('input[type="number"]').focus();
                    }
                );
            }
        }
        return false;
    },

    showGraphNow: function(key) {
        jQuery('#' + key + 'Chart').show(
            'slow',
            function() {
                EVC.graphMaker.makeGraph(key);
            }
        ).prev('.graphShower').hide();
        return false;
    },

    updateScreen: function(key){
        if(EVC.debug) {console.debug("== UPDATING SCREEN ==");}
        this.populateResultTable();
        this.populateCalculations();
        this.updateLinks();
        EVC.scenarios.checkInfluence();
        if(EVC.isReadyToCalculate()) {
            jQuery("#EVCWrapper").removeClass("notReady").addClass("ready");
        }
        else {
            jQuery("#EVCWrapper").removeClass("ready").addClass("notReady");
        }
        jQuery("#ProfitAndLoss").addClass("fixed");
        if(this.isTouchScreenTest()) {
            jQuery("#ProfitAndLoss p.good").show();
            jQuery("#ProfitAndLoss p.warning").hide();
        }
        if(typeof key !== "undefined") {
            EVC.graphMaker.makeGraph(key);
        }
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
    },

    openModal: function(key, el){
        this.showDesc(key, true);
        jQuery("body").addClass("modalMode");
        jQuery("#"+key+"Holder").addClass("modal");
        return false;
    },

    closeModal: function(key){
        jQuery("body").removeClass("modalMode");
        jQuery("#"+key+"Holder").removeClass("modal").removeClass("infocus");
        return false;
    },

    inlineExpandListener: function(){
        jQuery('.inline-expand').on(
            'click',
            function(e){
                e.preventDefault();
                var link = jQuery(this).attr('href');
                var id = link.substring(link.indexOf('#'));
                jQuery(id).toggle('slow');
                return false;
            }
        )
    }


};

EVC.graphMaker = {

    currentGraph: false,

    makeGraph: function(key) {
        if(typeof this.currentGraph == "object") {
            this.currentGraph.destroy();
        }
        var selector = "figure#" + key + "Chart";
        var ctx = jQuery(selector).children("canvas").get(0).getContext("2d");
        //var ctx = document.getElementById().getContext("2d");
        this.currentGraph = new Chart(ctx).Line(this.getData(key), this.options);

        var legend = this.currentGraph.generateLegend();
        jQuery("#" + key + "Chart figcaption").html(legend);
        if(this.indexBeforeCurrentValue >= 0) {
            if(this.indexBeforeCurrentValue == this.indexAfterCurrentValue) {
                var colour = "blue";
            }
            else {
                var colour = "LightSkyBlue"
            }
            this.currentGraph.datasets[0].points[this.indexBeforeCurrentValue].fillColor =  colour;
            this.currentGraph.datasets[0].points[this.indexBeforeCurrentValue].pointHighlightFill =  colour;
            this.currentGraph.datasets[0].points[this.indexAfterCurrentValue].fillColor =  colour;
            this.currentGraph.datasets[0].points[this.indexAfterCurrentValue].pointHighlightFill =  colour;
        }
        this.currentGraph.update();
        //important to return false...
        return false;
    },

    indexBeforeCurrentValue: -1,

    indexAfterCurrentValue: -1,

    /**
     *
     * @return float
     */
    getStep: function(key){

    },

    /**
     *
     * @return array
     */
    getSteps: function(key){
        if(EVC.DefaultDataMinMax[key].length === 2) {
            var min = EVC.DefaultDataMinMax[key][0];
            var max = EVC.DefaultDataMinMax[key][1];
            var difference = max - min;
            if(difference > EVC.numberOfSteps) {
                var step = Math.round((difference / EVC.numberOfSteps));
            }
            else {
                var step = Math.round((difference / EVC.numberOfSteps) * 100) / 100;
            }
            var k = 0;
            var currentValue = EVC.ActualData[key];
            var nextStep = currentValue + step;
            EVC.DefaultDataMinMax[key][2] = [];
            for(var i = min; i <= max; i = i + step) {
                EVC.DefaultDataMinMax[key][2][k] = i;
                k++;
            }
        }
        return EVC.DefaultDataMinMax[key][2];
    },

    getData: function(key) {
        this.data = {
            labels: [],
            datasets: [
                {
                    label: "The result in profit / loss for possible entries of <u>"+EVC.DataDescription.labels[key]+"</u>:",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: []
                }
            ]
        };

        var currentValue = EVC.ActualData[key];
        var steps = this.getSteps(key);
        var step = steps[1] - steps[0];
        for(var i= 0; i < steps.length; i++) {
            var label = steps[i];
            if(label == currentValue) {
                this.indexBeforeCurrentValue = i;
                this.indexAfterCurrentValue = i;
            }
            if(label > currentValue && label < (currentValue + step)) {
                this.indexBeforeCurrentValue = i-1;
                this.indexAfterCurrentValue = i;
            }
            EVC.ActualData[key] = label;
            var label = EVC.HTMLInteraction.formatValue(key, EVC.ActualData[key]);
            this.data.labels.push(label);
            var value = EVC.scenarios.fiveYearProfit();
            this.data.datasets[0].data.push(value);
        }
        //IMPORTANT reset ...
        EVC.ActualData[key] = currentValue;
        return this.data;
    },


    options: {

        // Boolean - Whether to animate the chart
        animation: true,

        // Number - Number of animation steps
        animationSteps: 40,

        // String - Animation easing effect
        // Possible effects are:
        // [easeInOutQuart, linear, easeOutBounce, easeInBack, easeInOutQuad,
        //  easeOutQuart, easeOutQuad, easeInOutBounce, easeOutSine, easeInOutCubic,
        //  easeInExpo, easeInOutBack, easeInCirc, easeInOutElastic, easeOutBack,
        //  easeInQuad, easeInOutExpo, easeInQuart, easeOutQuint, easeInOutCirc,
        //  easeInSine, easeOutExpo, easeOutCirc, easeOutCubic, easeInQuint,
        //  easeInElastic, easeInOutSine, easeInOutQuint, easeInBounce,
        //  easeOutElastic, easeInCubic]
        animationEasing: "easeOutQuart",

        // Boolean - If we should show the scale at all
        showScale: true,

        // Boolean - If we want to override with a hard coded scale
        scaleOverride: false,

        // ** Required if scaleOverride is true **
        // Number - The number of steps in a hard coded scale
        scaleSteps: null,
        // Number - The value jump in the hard coded scale
        scaleStepWidth: null,
        // Number - The scale starting value
        scaleStartValue: null,

        // String - Colour of the scale line
        scaleLineColor: "rgba(0,0,0,.1)",

        // Number - Pixel width of the scale line
        scaleLineWidth: 1,

        // Boolean - Whether to show labels on the scale
        scaleShowLabels: true,

        // Interpolated JS string - can access value
        scaleLabel: "<%= parseFloat(value).formatMoney() %>",

        // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
        scaleIntegersOnly: true,

        // Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
        scaleBeginAtZero: false,

        // String - Scale label font declaration for the scale label
        scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

        // Number - Scale label font size in pixels
        scaleFontSize: 12,

        // String - Scale label font weight style
        scaleFontStyle: "normal",

        // String - Scale label font colour
        scaleFontColor: "#666",

        // Boolean - whether or not the chart should be responsive and resize when the browser does.
        responsive: true,

        // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
        maintainAspectRatio: true,

        // Boolean - Determines whether to draw tooltips on the canvas or not
        showTooltips: true,

        // Function - Determines whether to execute the customTooltips function instead of drawing the built in tooltips (See [Advanced - External Tooltips](#advanced-usage-custom-tooltips))
        customTooltips: false,

        // Array - Array of string names to attach tooltip events
        tooltipEvents: ["click", "touchstart", "touchmove"],

        // String - Tooltip background colour
        tooltipFillColor: "rgba(0,0,0,0.8)",

        // String - Tooltip label font declaration for the scale label
        tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

        // Number - Tooltip label font size in pixels
        tooltipFontSize: 14,

        // String - Tooltip font weight style
        tooltipFontStyle: "normal",

        // String - Tooltip label font colour
        tooltipFontColor: "#fff",

        // String - Tooltip title font declaration for the scale label
        tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

        // Number - Tooltip title font size in pixels
        tooltipTitleFontSize: 10,

        // String - Tooltip title font weight style
        tooltipTitleFontStyle: "bold",

        // String - Tooltip title font colour
        tooltipTitleFontColor: "#fff",

        // Number - pixel width of padding around tooltip text
        tooltipYPadding: 6,

        // Number - pixel width of padding around tooltip text
        tooltipXPadding: 6,

        // Number - Size of the caret on the tooltip
        tooltipCaretSize: 8,

        // Number - Pixel radius of the tooltip border
        tooltipCornerRadius: 6,

        // Number - Pixel offset from point x to tooltip edge
        tooltipXOffset: 10,

        // String - Template string for single tooltips
        tooltipTemplate: "<%if (label){%><%=label%> = <%}%><%= value.formatMoney() %>",

        // String - Template string for multiple tooltips
        multiTooltipTemplate: "<%= value %>",

        // Function - Will fire on animation progression.
        onAnimationProgress: function(){},

        // Function - Will fire on animation completion.
        onAnimationComplete: function(){},

        /**
         * line specific
         *
         */

        ///Boolean - Whether grid lines are shown across the chart
        scaleShowGridLines : true,

        //String - Colour of the grid lines
        scaleGridLineColor : "rgba(0,0,0,.05)",

        //Number - Width of the grid lines
        scaleGridLineWidth : 1,

        //Boolean - Whether to show horizontal lines (except X axis)
        scaleShowHorizontalLines: true,

        //Boolean - Whether to show vertical lines (except Y axis)
        scaleShowVerticalLines: true,

        //Boolean - Whether the line is curved between points
        bezierCurve : true,

        //Number - Tension of the bezier curve between points
        bezierCurveTension : 0.4,

        //Boolean - Whether to show a dot for each point
        pointDot : true,

        //Number - Radius of each point dot in pixels
        pointDotRadius : 4,

        //Number - Pixel width of point dot stroke
        pointDotStrokeWidth : 1,

        //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
        pointHitDetectionRadius : 20,

        //Boolean - Whether to show a stroke for datasets
        datasetStroke : true,

        //Number - Pixel width of dataset stroke
        datasetStrokeWidth : 2,

        //Boolean - Whether to fill the dataset with a colour
        datasetFill : true,

        //String - A legend template
        legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\">"
         +"<% for (var i=0; i<datasets.length; i++){%><li>"
         +"<span style=\"background-color:<%=datasets[i].strokeColor%>\"></span>"
         +"<%if(datasets[i].label){%><%=datasets[i].label%><%}%>"
         +"</li><%}%>"
         +"</ul>"

    }


}

EVC.scenarios = {

    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],

    totalProfit: function(){
        return EVC.myData.totalProfit();
    },

    totalProfitWithRestValue: function(){
        return EVC.myData.totalProfit() + EVC.myData.equityImprovementAtEndOfYear();
    },

    fiveYearProfit: function(){
        return this.totalProfitManyYears();
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


    breakEvenYearsFromNow: function(){
        var yearsBeforeSwitch = 0;
        var totalProfit = 0;
        while(totalProfit <= 0 && yearsBeforeSwitch < 13) {
            totalProfit = this.totalProfitManyYears(
                yearsBeforeSwitch
            );
            yearsBeforeSwitch++;
        }
        yearsBeforeSwitch--;
        return yearsBeforeSwitch;
    },

    breakEvenYear: function() {
        var yearsBeforeSwitch = this.breakEvenYearsFromNow();
        var now = new Date();
        var year = now.getFullYear();
        return year + yearsBeforeSwitch;
    },

    switchDate: function(){
        var now = new Date();
        var switchDate = new Date();
        switchDate.setYear(now.getFullYear() + EVC.ActualData.yearsBeforeSwitch);
        var day = switchDate.getDate();
        var monthIndex = switchDate.getMonth();
        var year = switchDate.getFullYear();
        if(
            monthIndex === now.getMonth() &&
            year === now.getFullYear()
        ) {
            return 'this month';
        } else {
            return "in " + this.monthNames[monthIndex].substring(0,3) + ". " + year;
        }
    },

    betterOrWorseOff: function() {
        if(this.fiveYearProfit() > 0) {
            var msg = 'will have saved';
        } else {
            var msg = 'will have paid an additional ';
            msg += '<span class="switch-year">(switching from '+this.breakEvenYear()+' will start to be profitable)</span>';
        }
        return msg;

    },

    profitLossDate: function(){
        var now = new Date();
        var maturityDate = new Date();
        maturityDate.setYear(now.getFullYear() + 5  + EVC.ActualData.yearsBeforeSwitch);
        var day = maturityDate.getDate();
        var monthIndex = maturityDate.getMonth();
        var year = maturityDate.getFullYear();
        if(
            monthIndex === now.getMonth() &&
            year === now.getFullYear() + 5
        ) {
            return 'in five years';
        } else {
            return "by " + this.monthNames[monthIndex].substring(0,3) + ". " + year;
        }
        //return " on " + day + " " + this.monthNames[monthIndex] + " " + year;
    },

    resultsTableYear: function(){
        var now = new Date();
        var maturityDate = new Date();
        maturityDate.setYear(now.getFullYear() + EVC.ActualData.yearsBeforeSwitch + EVC.ActualData.yearsAfterSwitch);
        var day = maturityDate.getDate();
        var monthIndex = maturityDate.getMonth();
        var year = maturityDate.getFullYear();
        return " starting " + this.monthNames[monthIndex].substring(0,3) + " " + year;
    },

    checkInfluence: function(){
        EVC.ActualData.influence = {};
        var list = EVC.DataDescription.otherAssumptionKeys;
        var holderID = "";
        var influencerID = "";
        var percentageTimesHundred = 0;
        var html = "";
        for (var key in list) {
            if (list.hasOwnProperty(key)) {
                holderID = key + "Holder";
                influencerID = key + "Influence";
                //check influence
                var outcome = this.checkInfluencePerKeyAndObjectMethod(key, "scenarios", "fiveYearProfit", 1.1);
                if(outcome !== null) {
                    percentageTimesHundred = (outcome.percentage * 100);
                    html = "<div id="+influencerID+" class=\"influence\">";
                    html += "\t <em>you can change the overall outcome by "+Math.round(outcome.percentage * 100)+"% by changing this value "+outcome.changeDescription+"</em>";
                    html += "\t <span style=\"width: "+(percentageTimesHundred)+"%\"></span>";
                    html += "</div>";
                    jQuery("#" + influencerID).remove();
                    jQuery("#" + holderID).append(html);
                }
                else {
                    jQuery("#" + holderID).remove("#"+influencerID);
                }
            }
        }
    },

    checkInfluencePerKeyAndObjectMethod: function(key, objectAsString, methodAsString, minimumPercentageChange, type) {
        var outcome = false;
        var startingFromZero = false;
        var actualValueInc = 0;
        var actualValueDec = 0;
        var totalProfitInc = 0;
        var totalProfitDec = 0;
        var plusTenPercentMultiplier = 1.05;
        var minusTenPercentMultiplier = (1 / (plusTenPercentMultiplier));
        if(EVC.debug) {
            var defaultProfit = EVC[objectAsString][methodAsString](type);
        }
        var currentValue = EVC.ActualData[key];
        startingFromZero = false;
        if(currentValue == 0) {
            startingFromZero = true;
            var minValue = EVC.DefaultDataMinMax[key][0];
            var maxValue = EVC.DefaultDataMinMax[key][1];
            var avgValueTemp = 0 + (maxValue - minValue) / 2;
            actualValueTempInc = avgValueTemp * plusTenPercentMultiplier;
            actualValueTempDec = avgValueTemp * minusTenPercentMultiplier;
            actualValueInc = actualValueTempInc - actualValueTempDec;
            actualValueDec = 0;
            //console.debug("Min :"+minValue);
            //console.debug("Max :"+maxValue);
            //console.debug("Avg :"+avgValueTemp);
            //console.debug("IncTEMP :"+actualValueTempInc);
            //console.debug("DecTEMP :"+actualValueTempDec);
            //console.debug("Inc :"+actualValueInc);
        }
        else {
            avgValue = currentValue;
            actualValueInc = avgValue * plusTenPercentMultiplier;
            actualValueDec = avgValue * minusTenPercentMultiplier;
        }
        //calculate +10%
        EVC.ActualData[key] = actualValueInc;
        totalProfitInc = EVC[objectAsString][methodAsString](type);
        //calculate +10%
        EVC.ActualData[key] = actualValueDec;
        totalProfitDec = EVC[objectAsString][methodAsString](type);
        // start reset #######################
        EVC.ActualData[key] = currentValue;
        // end reset #######################
        //calculate results
        percentage = Math.abs(totalProfitInc / totalProfitDec);
        if(EVC.debug) {
            var check = EVC[objectAsString][methodAsString]();
            console.debug(key + "(" + Math.round(defaultProfit)+ ")" + "["+Math.round(actualValueDec)+","+Math.round(actualValueInc)+"]: " + Math.round(totalProfitDec)+", "+ Math.round(totalProfitInc)+ " = "+ Math.round(percentage * 100) / 100);
            if(defaultProfit != check) {
                console.debug("ERROR!: " + key + defaultProfit - check);
            }
        }
        if(percentage > minimumPercentageChange || percentage < ( 1 / minimumPercentageChange)) {
            //make sure all are in the same direction ...
            if(percentage < 1) {
                percentage = 1 / percentage;
            }
            percentage--;
            EVC.ActualData.influence[key] = [percentage];
            if(startingFromZero) {
                changeDescription = " to around "+EVC.HTMLInteraction.formatValue(key, (actualValueInc-actualValueDec));
            }
            else {
                changeDescription = " by "+(Math.round((plusTenPercentMultiplier-1)*100)*2)+"%";
            }
            return {
                "percentage": percentage,
                "changeDescription": changeDescription,
            };
        }
        return null;
    },

    checkInfluenceForRowEntry: function(el, objectAsString, methodAsString) {

        var keys = {};
        var list = EVC.DataDescription.otherAssumptionKeys;
        var outcomeE = null;
        var outcomeF = null;
        var hasEntries = false;
        if(jQuery(el).parent().find("div.influencers").length > 0) {
            jQuery(el).parent().find("div.influencers").remove();
            jQuery(el).removeClass("hasInfluencersOpened");
        }
        else {
            jQuery(el).addClass("hasInfluencersOpened");
            for (var key in list) {
                if (list.hasOwnProperty(key)) {
                    outcomeF = this.checkInfluencePerKeyAndObjectMethod(key, objectAsString, methodAsString, 1.001, "f");
                    outcomeE = this.checkInfluencePerKeyAndObjectMethod(key, objectAsString, methodAsString, 1.001, "e");
                    if(outcomeE !== null) {
                        hasEntries = true;
                        keys[key] = outcomeE.percentage;
                    }
                    if(outcomeF !== null) {
                        hasEntries = true;
                        keys[key] = outcomeF.percentage;
                    }
                }
            }
            if(hasEntries === true) {
                var html = "<div class=\"influencers\"><h3>check the assumptions ...</h3><ul>";
                for (var key in keys) {
                    if (list.hasOwnProperty(key)) {
                        html += "<li><a href=\"#"+key+"Holder\" onclick=\"return EVC.HTMLInteraction.openModal('"+key+"');\">"+EVC.DataDescription.labels[key]+" (value: "+EVC.HTMLInteraction.formatValue(key, EVC.ActualData[key])+"</a>)</li>";
                    }
                }
                html += "</ul></div>";
                jQuery(el).after(html);
            }
            else {
                var html = "<div class=\"influencers\"><h3>no assumptions to check apart from the main values set ...</h3></div>";
                jQuery(el).after(html);
            }
        }
        return false;
    },

    /**
     * [function description]
     * @param  {integer} yearsBeforeSwitch
     * @param  {integer} yearsAfterSwitch
     * @param  {integer} kmDrivenPerDay
     * @param  {integer} numberOfYears     number of years to combine
     * @return {float}                     return the total profit including sales value
     */
    totalProfitManyYears: function(yearsBeforeSwitch, yearsAfterSwitch, kmDrivenPerDay, numberOfYears) {
        if(typeof yearsBeforeSwitch === 'undefined') {
            yearsBeforeSwitch = -1;
        }
        if(typeof yearsAfterSwitch === 'undefined') {
            yearsAfterSwitch = 0;
        }
        if(typeof kmDrivenPerDay === 'undefined') {
            kmDrivenPerDay = EVC.ActualData.kmDrivenPerDay;
        }
        if(typeof numberOfYears === 'undefined') {
            numberOfYears = 5;
        }
        var year = 0;
        var totalProfit = 0;
        for(year = 0; year < 5; year++) {
            var yearDefinition = new EVCfx(yearsBeforeSwitch, yearsAfterSwitch + year, kmDrivenPerDay);
            totalProfit += yearDefinition.totalProfit();
        }
        totalProfit += yearDefinition.equityImprovementAtEndOfYear();
        return totalProfit;
    },


    listOfYears: function() {
        var now = new Date();
        var startYear = now.getFullYear() + EVC.ActualData.yearsBeforeSwitch;
        var yearsAfterSwitch = EVC.ActualData.yearsAfterSwitch;
        var i = 0;
        var currentYear = startYear;
        var html = '';
        for(i = 0; i < 5; i++) {
            currentYear = startYear + i;
            var cssClas = (i === yearsAfterSwitch) ? 'current' : 'link';
            html += '<li><a href="#financial-years" onclick="return EVC.HTMLInteraction.setValue(\'yearsAfterSwitch\', '+i+', true);" class="'+cssClas+'">'+currentYear+'</a></li>';
        }
        return html;
    },

}


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

Number.prototype.kmPerYearFormat = function(){
    var n = this;
    return n + "km (="+parseFloat(n*365).formatNumber()+"km. per year)";
};

Number.prototype.formatNumber = function() {
    var n = this;
    n = Math.round(n, 2)
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * DATA
 *
 *
 *
 *
 */

 EVC.DataDescription = {

     keyAssumptionKeys: {
         "CVValueToday":                         "currency",
         "kmDrivenPerDay":                       "kmPerDay"
     },

     playAroundAssumptionKeys: {
         "daysWithContinuousTripsOver100Km":     "number",
         "yearsBeforeSwitch":                    "number",
         "yearsAfterSwitch":                     "number"
     },

     otherAssumptionKeys: {
         "minimumCostElectricVehicle":           "currency",
         "maximumCostElectricVehicle":           "currency",
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
         "repairKMDivider":                      "number",
         "maxCarValueForRepairs":                "currency",
         "exponentialGrowthFactorForRepairs":    "number",
         "valueDividerForRepairCalculation":     "number",
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
         maximumCostElectricVehicle:             "Electric Car: Maximum Purchase Price",
         upgradeCostToGoElectric:                "Premium for Electrical Car",
         EVValueImprovementPerYearPercentage:    "Relative Value Improvement per Year for Electric Cars",
         setupChargeStation:                     "Infrastructure Set Up",
         saleCostForCarInPercentage:             "Sale Related Costs",
         purchaseCostForCarInPercentage:         "Purchase Related Costs",
         financingCostInPercentage:              "Interest Rate",
         principalRepaymentsPerYearPercentage:   "Principal Repayments per Year",
         costOfPetrolPerLitre:                   "Petrol per Litre",
         costOfElectricityPerKwH:                "Electricity per KwH",
         fuelEfficiencyCV:                       "Current Car: KMs per litre of Petrol",
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
         repairKMDivider:                        "KM divider for unexpected repairs",
         maxCarValueForRepairs:                  "Car value where unexpected repairs start",
         exponentialGrowthFactorForRepairs:      "Exponential unexpected repairs growth factor",
         valueDividerForRepairCalculation:       "Inverse value unexpected value divider",
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
         CVValueToday:                           "The price at which you can sell your current car today. If unsure, you can visit tradme.co.nz and search for cars of your make, model, and age.",
         kmDrivenPerDay:                         "Approximate kilometers you drive per day or per year - you can enter either.  There are many ways to work this out, but one of them is to look at Oil Change Stickers in your car which often contain a date and the overall KMs driven by the car up to that date.",
         /* play around assumptions */
         daysWithContinuousTripsOver100Km:       "Any trip where you drive more than 150km in one go and days that you are away on such a trip (e.g. enter seven if you drive to far away holiday destination where you will be away for a week). On these big days you will rent a car so that you can cover larger distances.",
         yearsBeforeSwitch:                      "The number of years you will wait before you make the switch.  Zero means that you make the switch today.",
         yearsAfterSwitch:                       "See the results for the set number of years after you make the switch. For example, if you enter two here, then you will see the results for the year starting two year after you make the switch.",
         /* other assumptions */
         amountOfCurrentCarAsLoan:               "How much of your current car cost have you borrowed? If you paid for your current car with money you saved up then enter 0.",
         minimumCostElectricVehicle:             "Minimum price for an electric vehicle at the moment. Because electric cars are relatively new, there are few older models and depreciated cars, therefore a minimum price may apply.",
         maximumCostElectricVehicle:             "Maximum price for an electric vehicle at the moment. In general, the calculator tries to match your current car with an electric car of a similar value, but this number is limited up to the new price of an electric vehicle.",
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
         repairKMDivider:                        "A number used to divide the number of KMs per year. From there this number is used as a unexpected repair multiplier to basically ensure that the more you drive, the more unexpected repair cost you may have.  A typical value is 40,000.",
         maxCarValueForRepairs:                  "The value of the car when unexpected repairs start.  For example, if set to $5,000, unexpected repairs start once the car is worth less than $5,000.",
         exponentialGrowthFactorForRepairs:      "This is a number between 1 and 3 that is used to exponentially increase the unexpected repair cost as the value of the car decreases.",
         valueDividerForRepairCalculation:       "When working out the unexpected repair cost for the car, we take the inverse value of the car relative to the maximum value at which repairs start.  Thus, for example, if the maximum value at which unexpected repairs start is $5000, then the inverse value increases from $0 to $5000 as the value of the car lowers from $5000 to $0.  The divider value entered here is used to divide this inverse value to get an idea of the unexpected repair value.",
         depreciationRatePerYearCV:              "The value reduction per year for your current car.  For this, we do not take into account kms driven. Instead, we use a relatively high, linear depreciation rate that may be applied by insurance companies and car financing companies.",
         depreciationRatePerYearEV:              "The value reduction per year for your an electric car.  For this, we do not take into account kms driven. Instead, we use a relatively high, linear depreciation rate that may be applied by insurance companies and car financing companies.",
         costPerDayRentalCar:                    "How much does it cost to rent a similar vehicle per day, including a full insurance package.",
         kilometresPerDayForLongTrips:           "What are the average number of KMs you will drive on any days that you will use a rental car?",
         subsidyPaymentFixed:                    "Any subsidies as a percentage of the purchase cost from the government and/or your employer you will receive when purchasing an electric vehicle. This only applies at the time of purchase.  It is not a yearly payment.",
         subsidyPaymentPerKM:                    "Any per kilometer subsidies (government / employer) payments you will receive when driving an electric vehicle.",
         personalContributionFixed:              "Any yearly personal payments or value you would like to add to the total purchase price of your electric vehicle to account for your reduced emissions. This only applies at the time of purchase.  It is not a yearly payment.",
         personalContributionPerKM:              "Any per kilometer, personal, payments or value you would like to add when driving an electric vehicle. This could, for example, be equal to the carbon credits you receive based on your reduced emissions."
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
    kmDrivenPerDay:                          0,

    /* play around assumptions */
    daysWithContinuousTripsOver100Km:        0,
    yearsBeforeSwitch:                       0,
    yearsAfterSwitch:                        0,

    /* other assumptions */
    amountOfCurrentCarAsLoan:                0,
    minimumCostElectricVehicle:          18000,
    maximumCostElectricVehicle:         200000,
    upgradeCostToGoElectric:                30,
    EVValueImprovementPerYearPercentage:    20,
    setupChargeStation:                    300,
    saleCostForCarInPercentage:              7,
    purchaseCostForCarInPercentage:          3,
    financingCostInPercentage:              10,
    principalRepaymentsPerYearPercentage:   20,
    costOfPetrolPerLitre:                 2.00,
    costOfElectricityPerKwH:              0.20,
    fuelEfficiencyCV:                       10,
    fuelEfficiencyEV:                        5,
    fuelEfficiencyRentalCar:                12,
    insuranceBaseCost:                     200,
    insuranceCostPerThousand:               50,
    averageKmsPerTyre:                   40000,
    tyreCostCV:                            100,
    tyreCostEV:                            100,
    licenseWOFCostCVPerYear:               250,
    licenseWOFCostEVPerYear:               350,
    maintenanceCVPerTenThousandKm:         400,
    maintenanceEVPerTenThousandKm:          50,
    repairKMDivider:                     15000,
    maxCarValueForRepairs:                7000,
    exponentialGrowthFactorForRepairs:     1.7,
    valueDividerForRepairCalculation:      100,
    depreciationRatePerYearCV:              27,
    depreciationRatePerYearEV:              27,
    costPerDayRentalCar:                    70,
    kilometresPerDayForLongTrips:          300,
    subsidyPaymentFixed:                     0,
    subsidyPaymentPerKM:                  0.00,
    personalContributionFixed:               0,
    personalContributionPerKM:               0,

};


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
    minimumCostElectricVehicle:              [12000,36000],
    maximumCostElectricVehicle:              [18000,48000],
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
    repairKMDivider:                         [5000,40000],
    maxCarValueForRepairs:                   [2000,12000],
    exponentialGrowthFactorForRepairs:       [0.8,3],
    valueDividerForRepairCalculation:        [5,500],
    depreciationRatePerYearCV:               [10,40],
    depreciationRatePerYearEV:               [10,40],
    costPerDayRentalCar:                     [10,100],
    kilometresPerDayForLongTrips:            [100,2000],
    subsidyPaymentFixed:                     [0,15000],
    subsidyPaymentPerKM:                     [0,0.50],
    personalContributionFixed:               [0,15000],
    personalContributionPerKM:               [0,0.5]
};



EVC.ActualData = EVC.cloneObject(EVC.DefaultData);
