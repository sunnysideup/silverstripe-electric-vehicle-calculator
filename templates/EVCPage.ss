<!DOCTYPE html>
<!--[if !IE]><!-->
<html lang="$ContentLocale">
<!--<![endif]-->
<head>
	<% base_tag %>
	<title><% if $MetaTitle %>$MetaTitle<% else %>$Title<% end_if %> &raquo; $SiteConfig.Title</title>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	$MetaTags(false)
	<!--[if lt IE 9]>
	<script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
	<![endif]-->
	<link rel="shortcut icon" href="$ThemeDir/images/favicon.ico" />
	<link href='https://fonts.googleapis.com/css?family=Montserrat:400,700' rel='stylesheet' type='text/css' />

	<meta property="og:url"           content="$AbsoluteLink" />
	<meta property="og:type"          content="website" />
	<meta property="og:title"         content="$SiteConfig.Title" />
	<meta property="og:description"   content="$Title" />
	<meta property="og:image"         content="$AbsoluteLink(facebookimage)" />

</head>

<body>
<div id="EVCWrapper">

	<% if PreviousCalculations %>
	<div id="PreviousCalculations">
		<h2>Please select from the previous calculations below ... </h2>
		<% include ECVPagePreviousCalculations %>
	</div>
	<% else %>
	<form id="ElectricVehicleCalculator">

		<h1>$Title <% if IsLocked %><span class="locked">(locked)</span><% end_if %></h1>
		<div id="ContentHolder">$Content</div>

		<fieldset id="KeyAssupmptions"></fieldset>

		<div id="ProfitAndLoss">
			<p class="message good">
				If you switch to an Electric Car <span class="straightFillers" data-fx="switchDate">today</span>,
				your wealth, <span class="straightFillers" data-fx="profitLossDate">five years from now</span>,
				will change by: <span class="calcVal" data-fx="fiveYearProfit"></span>
			</p>
		</div>

		<fieldset id="PlayAroundAssumptions"></fieldset>

		<fieldset id="ResultTableHolder">
			<h2>
				detailed results for one year <span class="straightFillers" data-fx="resultsTableYear"></span>:
				<span class="calcVal" data-fx="totalProfit"></span>
			</h2>
			<table>
				<thead>
					<tr class="header summary">
						<th scope="col">&nbsp;</th>
						<th scope="col">Current Car</th>
						<th scope="col">Electric Car</th>
					</tr>
				</thead>
				<tfoot>
					<tr class="superSummary summary">
						<th scope="row" class="superTotalHeader totalHeader">TOTAL</th>
						<td class="total superTotal" data-fx="totalCombined" data-type="f"></td>
						<td class="total superTotal" data-fx="totalCombined" data-type="e"></td>
					</tr>
				</tfoot>
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
						<th scope="row" class="detailHeader">original amount of loan</th>
						<td class="detail" data-fx="totalLoanAtStart" data-type="f"></td>
						<td class="detail" data-fx="totalLoanAtStart" data-type="e"></td>
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
						<th scope="row" class="detailHeader">actual KMs driven per year</th>
						<td class="detail" data-fx="actualAnnualKms" data-type="f"></td>
						<td class="detail" data-fx="actualAnnualKms" data-type="e"></td>
					</tr>
					<tr class="detail includedInTotal">
						<th scope="row" class="detailHeader">fuel</th>
						<td class="detail" data-fx="fuelCost" data-type="f"></td>
						<td class="detail" data-fx="fuelCost" data-type="e"></td>
					</tr>
					<tr class="detail excludedFromTotal">
						<th scope="row" class="detailHeader">fuel per week</th>
						<td class="detail" data-fx="fuelCostPerWeek" data-type="f"></td>
						<td class="detail" data-fx="fuelCostPerWeek" data-type="e"></td>
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
					<tr class="detail includedInTotal">
						<th scope="row" class="detailHeader">unscheduled repairs</th>
						<td class="detail" data-fx="repairCost" data-type="f"></td>
						<td class="detail" data-fx="repairCost" data-type="e"></td>
					</tr>
					<tr class="detail includedInTotal">
						<th scope="row" class="detailHeader">total cost per KM</th>
						<td class="detail" data-fx="costPerKM" data-type="f"></td>
						<td class="detail" data-fx="costPerKM" data-type="e"></td>
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
				</tbody>
			</table>
		</fieldset>


		<h2>save, lock, and load data</h2>
		<ul class="actions">
			<li class="buttonWrapper">
				<a  id="SaveLink" href="[DECODED_LINK]" class="button saveLink" data-replace-link="yes">save and lock</a>
			</li>
			<li id="ListLink" class="buttonWrapper">
				<a href="{$Link}previous/" class="button saveLink" data-replace-link="no" data-load-into="">view saved results</a>
			</li>
			<li id="ResetLink" class="buttonWrapper">
				<a href="{$Link}reset/" class="button saveLink" data-replace-link="no">start new calculation</a>
			</li>
		</ul>

		<fieldset id="OtherAssumptions"></fieldset>

		<h2>purchase your electric vehicle</h2>
		<p>More information to come ... </p>

		<div id="RightCol">
			<h2>comment</h2>
			<div id="fb-root"></div>
			<div class="fb-comments" data-href="$AbsoluteLink" data-width="320" data-numposts="100" data-order-by="reverse_time"></div>
			<script>(function(d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) return;
				js = d.createElement(s); js.id = id;
				js.src = "//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.5&appId=1551143631876973";
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));</script>
		</div>


		<div id="LeftCol">


			<h2>Share Results ... </h2>
			<ul class="actions">
				<li class="buttonWrapper">
					<a  id="EmailLink" href="mailto:?subject=I+want+an+Electric+Car&amp;body=Please+visit+[ENCODED_LINK]" class="button saveLink" data-replace-link="yes">in E-mail</a>
				</li>
				<li class="buttonWrapper">
					<a id="FacebookLink" href="https://www.facebook.com/sharer/sharer.php?u=[ENCODED_LINK]" class="button saveLink" data-replace-link="yes">on Facebook</a>
				</li>
				<li class="buttonWrapper">
					<a id="TwitterLink" href="https://twitter.com/home?status=Check%20out%20%23ev%20calculator%20on%20[ENCODED_LINK]" class="button saveLink" data-replace-link="yes">on Twitter</a>
				</li>
			</ul>

			<h2>feedback</h2>
			<p>
				Please send us an e-mail: <a href='m&#97;ilt&#111;&#58;evs&#64;&#115;%&#55;5&#110;n%&#55;&#57;side%75p&#46;co&#46;&#110;z'>evs&#64;sun&#110;ysideu&#112;&#46;co&#46;&#110;z</a>, if you have any comments.
				Thank you.
			</p>

			<h2>links</h2>
			<ul>
				<li><a href="http://www.stuff.co.nz/national/9204870/Car-running-costs-lurch-ahead-for-Kiwi-drivers">NZ Car Running Cost</a></li>
				<li><a href="http://www.electricheaven.nz/">Information on Electric Cars in New Zealand</a></li>
			</ul>

			<h2>disclaimer</h2>
			<p>
				Please use completely at your own risk.
				This tool is meant to be used as an indicative guide only.
				Please seek professional advice for any decisions you may make and do not make any decisions based on what is presented to you in this tool.
			</p>
			<p style="background-color: red; color: white; padding: 1em; border-radius: 10px;">ALPHA VERSION ... this page is for testing only ... stay tuned for the first release ... if you have any questions then please contact modules [at] sunnysideup.co.nz </p>

			<h2>to do</h2>
			<ul>
				<li>show years before and after switch in headers to make sense of data</li>
				<li>show results table for actual years after switch but show five year result from first day of switch</li>
				<li>show actual date for five years from now in total after after five years</li>
				<li>listen to scroll to move results bar</li>
				<li>formatting of total profit bar on smallest screen</li>
				<li>add explanation at the top</li>
				<li>create more space at the top for total profit bar</li>
				<li>add settings for max electric car value</li>
				<li>add settings for unexpected repair cost</li>
				<li>create clearer separation between assumptions</li>
				<li>remove key from on... methods and replace by lookup</li>
				<li>add total year profit in table...</li>
			</ul>
		</div>
	</form>
	<% end_if %>
</div>

</body>
</html>
