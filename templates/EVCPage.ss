<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<link type="text/css" href="css/ElectricVehicleCalculator.css" rel="stylesheet" />
	<link href='https://fonts.googleapis.com/css?family=Montserrat:400,700' rel='stylesheet' type='text/css' />
	<title>Are you ready to switch?</title>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</head>

<body>
	<form id="ElectricVehicleCalculator">
		<p style="background-color: red; color: white; padding: 1em; border-radius: 10px;">ALPHA VERSION ... this page is for testing only ... stay tuned for the first release ... if you have any questions then please contact modules [at] sunnysideup.co.nz </p>
		<h1>How much will I save?</h1>
		<p class="message good">
			The calculator below works out how much you save if you were to traded-in your gasoline driven car for an electric vehicle today.
			Please enter the values (in blue) below to find out if you are ready to be part of a better world:
		</p>
		<fieldset id="KeyAssupmptions"></fieldset>
		<fieldset id="ResultTableHolder">
			<h2>results</h2>
			<p class="message good">Total Savings per Year: <span id="TotalProfit" class="calcVal" data-fx="totalProfit"></span></p>
			<table>
				<thead>
					<tr class="header summary">
						<th scope="col">&nbsp;</th>
						<th scope="col">Current Car</th>
						<th scope="col">Electric Car</th>
					</tr>
				</thead>
				<tbody>
					<tr class="summary">
						<th scope="row" class="totalHeader" id="SetUpCostRow"><a href="#SetUpCostRow" class="expandRows">setup</a></th>
						<td class="total" data-fx="totalUpFrontPayment" data-type="f"></td>
						<td class="total" data-fx="totalUpFrontPayment" data-type="e"></td>
					</tr>
					<tr class="detail includedInTotal">
						<th scope="row" class="detailHeader">set up of infrastructure</th>
						<td class="detail" data-fx="setupCost" data-type="f"></td>
						<td class="detail" data-fx="setupCost" data-type="e"></td>
					</tr>
					<tr class="detail excludedFromTotal">
						<th scope="row" class="detailHeader">sale price</th>
						<td class="detail" data-fx="salePrice" data-type="f"></td>
						<td class="detail" data-fx="salePrice" data-type="e"></td>
					</tr>
					<tr class="detail excludedFromTotal">
						<th scope="row" class="detailHeader">purchase price</th>
						<td class="detail" data-fx="purchasePrice" data-type="f"></td>
						<td class="detail" data-fx="purchasePrice" data-type="e"></td>
					</tr>
					<tr class="detail excludedFromTotal">
						<th scope="row" class="detailHeader">cost of sale and purchase</th>
						<td class="detail" data-fx="costOfSwap" data-type="f"></td>
						<td class="detail" data-fx="costOfSwap" data-type="e"></td>
					</tr>
					<tr class="summary">
						<th scope="row" class="totalHeader" id="FinanceCostRow"><a href="#FinanceCostRow" class="expandRows">finance</a></th>
						<td class="total" data-fx="totalFinanceCost" data-type="f"></td>
						<td class="total" data-fx="totalFinanceCost" data-type="e"></td>
					</tr>
					<tr class="detail excludedFromTotal">
						<th scope="row" class="detailHeader">original price</th>
						<td class="detail" data-fx="originalPrice" data-type="f"></td>
						<td class="detail" data-fx="originalPrice" data-type="e"></td>
					</tr>
					<tr class="detail excludedFromTotal">
						<th scope="row" class="detailHeader">value at the start of the year</th>
						<td class="detail" data-fx="valueStartOfTheYear" data-type="f"></td>
						<td class="detail" data-fx="valueStartOfTheYear" data-type="e"></td>
					</tr>
					<tr class="detail excludedFromTotal">
						<th scope="row" class="detailHeader">value at the end of the year</th>
						<td class="detail" data-fx="valueAtTheEndOfTheYear" data-type="f"></td>
						<td class="detail" data-fx="valueAtTheEndOfTheYear" data-type="e"></td>
					</tr>
					<tr class="detail excludedFromTotal">
						<th scope="row" class="detailHeader">loan at start of the year</th>
						<td class="detail" data-fx="amountBorrowedAtStartOfTheYear" data-type="f"></td>
						<td class="detail" data-fx="amountBorrowedAtStartOfTheYear" data-type="e"></td>
					</tr>
					<tr class="detail includedInTotal">
						<th scope="row" class="detailHeader">interest</th>
						<td class="detail" data-fx="interest" data-type="f"></td>
						<td class="detail" data-fx="interest" data-type="e"></td>
					</tr>
					<tr class="detail includedInTotal">
						<th scope="row" class="detailHeader">loan repayments</th>
						<td class="detail" data-fx="principalRepayment" data-type="f"></td>
						<td class="detail" data-fx="principalRepayment" data-type="e"></td>
					</tr>
					<tr class="detail excludedFromTotal">
						<th scope="row" class="detailHeader">loan at the end of the year</th>
						<td class="detail" data-fx="amountBorrowedAtEndOfTheYear" data-type="f"></td>
						<td class="detail" data-fx="amountBorrowedAtEndOfTheYear" data-type="e"></td>
					</tr>
					<tr class="detail excluded excludedFromTotal">
						<th scope="row" class="detailHeader">cash left after hypothetical end-of-year car sale</th>
						<td class="detail" data-fx="cashLeftAfterSellingCar" data-type="f"></td>
						<td class="detail" data-fx="cashLeftAfterSellingCar" data-type="e"></td>
					</tr>
					<tr class="summary">
						<th scope="row" class="totalHeader" id="FixCostRow"><a href="#FixCostRow" class="expandRows">fixed</a></th>
						<td class="total" data-fx="totalFixedCost" data-type="f"></td>
						<td class="total" data-fx="totalFixedCost" data-type="e"></td>
					</tr>
					<tr class="detail includedInTotal">
						<th scope="row" class="detailHeader">insurance</th>
						<td class="detail" data-fx="insuranceCost" data-type="f"></td>
						<td class="detail" data-fx="insuranceCost" data-type="e"></td>
					</tr>
					<tr class="detail includedInTotal">
						<th scope="row" class="detailHeader">licensing and WOF</th>
						<td class="detail" data-fx="licensingAndWOFCost" data-type="f"></td>
						<td class="detail" data-fx="licensingAndWOFCost" data-type="e"></td>
					</tr>
					<tr class="summary">
						<th scope="row" class="header" id="OperatingCostRow"><a href="#OperatingCostRow" class="expandRows">operating</a></th>
						<td class="total" data-fx="totalOperatingCost" data-type="f"></td>
						<td class="total" data-fx="totalOperatingCost" data-type="e"></td>
					</tr>
					<tr class="detail excludedFromTotal">
						<th scope="row" class="detailHeader">actual KMs driven</th>
						<td class="detail" data-fx="actualAnnualKms" data-type="f"></td>
						<td class="detail" data-fx="actualAnnualKms" data-type="e"></td>
					</tr>
					<tr class="detail excludedFromTotal">
						<th scope="row" class="detailHeader">average kms per day</th>
						<td class="detail" data-fx="actualAnnualKmsPerDay" data-type="f"></td>
						<td class="detail" data-fx="actualAnnualKmsPerDay" data-type="e"></td>
					</tr>
					<tr class="detail includedInTotal">
						<th scope="row" class="detailHeader">fuel</th>
						<td class="detail" data-fx="fuelCost" data-type="f"></td>
						<td class="detail" data-fx="fuelCost" data-type="e"></td>
					</tr>
					<tr class="detail includedInTotal">
						<th scope="row" class="detailHeader">maintenance and service</th>
						<td class="detail" data-fx="maintenanceCost" data-type="f"></td>
						<td class="detail" data-fx="maintenanceCost" data-type="e"></td>
					</tr>
					<tr class="detail includedInTotal">
						<th scope="row" class="detailHeader">tyres</th>
						<td class="detail" data-fx="tyreCost" data-type="f"></td>
						<td class="detail" data-fx="tyreCost" data-type="e"></td>
					</tr>
					<tr class="summary">
						<th scope="row" class="header" id="OtherCostRow"><a href="#OtherCostRow" class="expandRows">other</a></th>
						<td class="total" data-fx="totalOtherCost" data-type="f"></td>
						<td class="total" data-fx="totalOtherCost" data-type="e"></td>
					</tr>
					<tr class="detail excludedFromTotal">
						<th scope="row" class="detailHeader">car rental KMs driven</th>
						<td class="detail" data-fx="numberOfKMsWithRentalCar" data-type="f"></td>
						<td class="detail" data-fx="numberOfKMsWithRentalCar" data-type="e"></td>
					</tr>
					<tr class="detail includedInTotal">
						<th scope="row" class="detailHeader">car rental</th>
						<td class="detail" data-fx="carRentalCost" data-type="f"></td>
						<td class="detail" data-fx="carRentalCost" data-type="e"></td>
					</tr>
					<tr class="detail includedInTotal">
						<th scope="row" class="detailHeader">car rental fuel</th>
						<td class="detail" data-fx="carRentaFuel" data-type="f"></td>
						<td class="detail" data-fx="carRentaFuel" data-type="e"></td>
					</tr>
					<tr class="detail includedInTotal">
						<th scope="row" class="detailHeader">subsidies</th>
						<td class="detail" data-fx="subsidy" data-type="f"></td>
						<td class="detail" data-fx="subsidy" data-type="e"></td>
					</tr>
					<tr class="detail includedInTotal">
						<th scope="row" class="detailHeader">personal contribution</th>
						<td class="detail" data-fx="personalContribution" data-type="f"></td>
						<td class="detail" data-fx="personalContribution" data-type="e"></td>
					</tr>
					<tr class="superSummary summary">
						<th scope="row" class="superTotalHeader totalHeader">TOTAL</th>
						<td class="total superTotal" data-fx="totalCombined" data-type="f"></td>
						<td class="total superTotal" data-fx="totalCombined" data-type="e"></td>
					</tr>
				</tbody>
			</table>
		</fieldset>


		<fieldset id="PlayAroundAssumptions">

		</fieldset>


		<fieldset id="Scenarios">
			<h2>more results</h2>
			<p>Three year result: <span class="calcVal" data-fx="theeYearProfit"</p>
			<p>Driving 5,000km more - first year result:<span class="calcVal" data-fx="plusFiveThousand"</p>
			<p>Driving 5,000km less - first year result:<span class="calcVal" data-fx="minusFiveThousand"</p>
			<p>Purchasing electric car in three years time:<span class="calcVal" data-fx="inThreeYearsTime"</p>
		</fieldset>

		<fieldset id="OtherAssumptions">

		</fieldset>

		<h2>send results to a friend</h2>
		<p>
			<a href="#" id="ShareLink">e-mail current calculation to a friend</a>
		</p>

		<h2>purchase your electric vehicle</h2>
		<p>More information to come ... </p>

		<h2>load data</h2>
		<p>
			<a href="./test.html" id="#ResetLink">reset all settings</a>
		</p>

		<h2>feedback</h2>
		<p>
			Please send us an e-mail: <a href='m&#97;ilt&#111;&#58;evs&#64;&#115;%&#55;5&#110;n%&#55;&#57;side%75p&#46;co&#46;&#110;z'>evs&#64;sun&#110;ysideu&#112;&#46;co&#46;&#110;z</a>, if you have any comments.
			Thank you.
		</p>

	</form>

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
	<script src="javascript/ElectricVehicleCalculator.js"></script>

</body>
</html>