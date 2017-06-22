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
    <link rel="apple-touch-icon" sizes="57x57" href="/electric-vehicle-calculator/images/icons/apple-icon-57x57.png">
    <link rel="apple-touch-icon" sizes="60x60" href="/electric-vehicle-calculator/images/icons/apple-icon-60x60.png">
    <link rel="apple-touch-icon" sizes="72x72" href="/electric-vehicle-calculator/images/icons/apple-icon-72x72.png">
    <link rel="apple-touch-icon" sizes="76x76" href="/electric-vehicle-calculator/images/icons/apple-icon-76x76.png">
    <link rel="apple-touch-icon" sizes="114x114" href="/electric-vehicle-calculator/images/icons/apple-icon-114x114.png">
    <link rel="apple-touch-icon" sizes="120x120" href="/electric-vehicle-calculator/images/icons//apple-icon-120x120.png">
    <link rel="apple-touch-icon" sizes="144x144" href="/electric-vehicle-calculator/images/icons/apple-icon-144x144.png">
    <link rel="apple-touch-icon" sizes="152x152" href="/electric-vehicle-calculator/images/icons/apple-icon-152x152.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/electric-vehicle-calculator/images/icons/apple-icon-180x180.png">
    <link rel="icon" type="image/png" sizes="192x192"  href="/electric-vehicle-calculator/images/icons/android-icon-192x192.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/electric-vehicle-calculator/images/icons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="96x96" href="/electric-vehicle-calculator/images/icons/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/electric-vehicle-calculator/images/icons/favicon-16x16.png">
    <link rel="manifest" href="/electric-vehicle-calculator/images/icons/manifest.json">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="/electric-vehicle-calculator/images/icons/ms-icon-144x144.png">
    <meta name="theme-color" content="#ffffff">
    <link href='https://fonts.googleapis.com/css?family=Montserrat:100,400,700|Cutive+Mono&amp;subset=latin-ext' rel='stylesheet' type='text/css' />

    <meta property="og:url"           content="$AbsoluteLink" />
    <meta property="og:type"          content="website" />
    <meta property="og:title"         content="$SiteConfig.Title" />
    <meta property="og:description"   content="$Title" />
    <meta property="og:image"         content="$BackgroundImage" />

</head>

<body class="not-ready" style="background-image: url($BackgroundImage);">
    <div class='loading-screen'><span>calculating your results ... </span></div>
<div id="EVCWrapper">

    <% if PreviousCalculations %>
    <div id="PreviousCalculations">
        <h2>Please select from the previous calculations below ... </h2>
        <% include ECVPagePreviousCalculations %>
    </div>
    <% else %>
    <form id="start-up-screen">
        <div id="start-up-form-inner">
            <h1>How much can you save by switching to an electric car?</h1>
            <p class="question">
                If you drive a petrol or diesel car then now is the time to find out how much you can save by switching to an electric vehicle.
            </p>
            <div class="field">
                <label for="startup-car-value">1. What is todays value of your current car?</label>
                <div class="middleColumn">
                    <input type="number" inputmode="numeric" pattern="[0-9]*" value="0" min="0" max="40000" name="startup-car-value"   />
                </div>
            </div>
            <div class="field">
                <label for="petrol-spent-per-week">2. How much do you spend on fuel per week?</label>
                <div class="middleColumn">
                    <input type="number" inputmode="numeric" pattern="[0-9]*" value="0" min="0" max="50000" name="petrol-spent-per-week" />
                </div>
            </div>
            <ul class="actions">
                <li id="HowMuchDoWeSave" class="buttonWrapper">
                    <a href="#ProfitAndLoss" class="button">Calculate Savings</a>
                </li>
            </ul>
        </div>

        <h1>Why electric?</h1>
        <p class="question">
            Petrol engines may sound grunty or smell like workhorses — fact is, they are highly inefficient.
            After a century of continuous development, the combustion engine only turns around 25% of its fuel into forward motion.
            All the other energy is turned into heat.
            Meanwhile, a much simpler electric engine easily turns 80% of its energy into forward motion.
        </p>
        <p class="question">
            What is more, here in New Zealand, we generate most of our electricity using hydro schemes — i.e. falling water.
            In short, switching to an electric vehicle is one of the best things you can do to slow down climate change.
        </p>
        <p class="question">
            The marvelous thing is that, while going electric will slash your impact on greenhouse gases by around 80%,
            going electric may also save you money (the more you drive, the more you save).
            Not to mention the better driving experience.
        </p>
        <p class="question">
            If you are curious to find out how much you could save
            if you were to trade-in our <strong>run-around car</strong> car, like a Honda Civic or Toyota Yaris,
            for an <strong>Electric Vehicle</strong> equivalent like a <a href="//www.trademe.co.nz/Browse/SearchResults.aspx?searchString=nissan+leaf">Nissan Leaf</a>
            without paying anything for the new car upfront then this website will tell you.
            You may be surprised, it will not cost the earth.
        </p>
        <p class="question">
            Got questions? Feel free to contact me, <a href="mailto:&#110;&#105;&#99;&#111;&#108;&#97;&#97;&#115;&#64;&#101;&#118;&#115;&#46;&#110;&#122;">Nicolaas</a>, I welcome your feedback.
            Thank you for using this site.
        </p>
        <p class="question">
            Credits:
            night image - <a href="https://www.flickr.com/photos/chris_gin/2197585153/">Chris Gin</a>;
            day image - <a href="https://www.flickr.com/photos/anupshah/13462145935/">Anup Shah</a>.
        </p>

        <div id="startup-form-result"></div>
    </form>
    <form id="ElectricVehicleCalculator">

        <h1>$Title <% if IsLocked %><span class="locked">(customised)</span><% end_if %></h1>
        <div id="ContentHolder">$Content</div>

        <fieldset id="KeyAssupmptions"></fieldset>

        <div id="ProfitAndLoss" class="mainDetailedSections">
            <p class="message warning">
                <a href="#" class="button" onclick="return false;">get updated results ...</a>
            </p>
            <p class="message good">
                We estimate that if you <a href="#switch-explain" class="inline-expand">switch</a>
                <span id="switch-explain" class="hide">(trade-in without any upfront cost) to an electric car</span>
                <span class="straightFillers" data-fx="switchDate">this month</span>
                then, <span class="straightFillers years-ahead" data-fx="profitLossDate">in five years</span>,
                you <span class="straightFillers" data-fx="betterOrWorseOff">save</span>
                <span class="calcVal" data-fx="fiveYearProfit">calculating ...</span>
            </p>
            <ul class="actions">
                <li id="ViewDetailsNow" class="buttonWrapper">
                    <a href="#ResultTableHolder" class="button">view details ...</a>
                </li>
            </ul>

        </div>


        <fieldset id="SummaryResultHolder" class="mainSummarySection">
            <h2>
                total cost comparison
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
                    <tr class="superSummary summary" data-fx="totalCombinedFiveYears">
                        <th scope="row" class="superTotalHeader totalHeader">TOTAL COST</th>
                        <td class="total superTotal" data-type="f"></td>
                        <td class="total superTotal" data-type="e"></td>
                    </tr>
                </tfoot>
                <tbody>
                    <tr class="summary" data-fx="totalCostYear1">
                        <th scope="row" class="totalHeader" id="totalCostYear1">Year 1</th>
                        <td class="total" data-type="f"></td>
                        <td class="total" data-type="e"></td>
                    </tr>
                    <tr class="summary" data-fx="totalCostYear2">
                        <th scope="row" class="totalHeader" id="totalCostYear2">Year 2</th>
                        <td class="total" data-type="f"></td>
                        <td class="total" data-type="e"></td>
                    </tr>
                    <tr class="summary" data-fx="totalCostYear3">
                        <th scope="row" class="totalHeader" id="totalCostYear3">Year 3</th>
                        <td class="total" data-type="f"></td>
                        <td class="total" data-type="e"></td>
                    </tr>
                    <tr class="summary" data-fx="totalCostYear4">
                        <th scope="row" class="totalHeader" id="totalCostYear4">Year 4</th>
                        <td class="total" data-type="f"></td>
                        <td class="total" data-type="e"></td>
                    </tr>
                    <tr class="summary" data-fx="totalCostYear5">
                        <th scope="row" class="totalHeader" id="totalCostYear5">Year 5</th>
                        <td class="total" data-type="f"></td>
                        <td class="total" data-type="e"></td>
                    </tr>
                </tbody>
            </table>
        </fieldset>

        <fieldset id="ResultTableHolder" class="mainDetailedSections">
            <h2>
                detailed results per year:
            </h2>
            <p>
                Total savings for one year
                <span class="straightFillers" data-fx="resultsTableYear"></span>:
                <span class="calcVal" data-fx="totalProfit"></span>
            </p>
            <div class="financial-years">
                <ul class="straightFillers" data-fx='listOfYears'>
                    <li></li>
                </ul>
            </div>

            <table>
                <thead>
                    <tr class="header summary">
                        <th scope="col">&nbsp;</th>
                        <th scope="col">Current Car</th>
                        <th scope="col">Electric Car</th>
                    </tr>
                </thead>
                <tfoot>
                    <tr class="superSummary summary" data-fx="totalCombined">
                        <th scope="row" class="superTotalHeader totalHeader">TOTAL COST</th>
                        <td class="total superTotal" data-type="f"></td>
                        <td class="total superTotal" data-type="e"></td>
                    </tr>
                </tfoot>
                <tbody>
                    <tr class="summary" data-fx="totalUpFrontPayment" >
                        <th scope="row" class="totalHeader" id="SetUpCostRow"><a href="#SetUpCostRow" class="expandRows">setup</a></th>
                        <td class="total" data-type="f"></td>
                        <td class="total" data-type="e"></td>
                    </tr>
                    <tr class="detail includedInTotal" data-fx="setupCost">
                        <th scope="row" class="detailHeader">set up of infrastructure</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
                    </tr>
                    <tr class="detail excludedFromTotal" data-fx="salePrice">
                        <th scope="row" class="detailHeader">sale price</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
                    </tr>
                    <tr class="detail excludedFromTotal" data-fx="purchasePrice">
                        <th scope="row" class="detailHeader">purchase price</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
                    </tr>
                    <tr class="detail excludedFromTotal" data-fx="costOfSwap">
                        <th scope="row" class="detailHeader">cost of sale and purchase</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
                    </tr>
                    <tr class="summary" data-fx="totalFinanceCost">
                        <th scope="row" class="totalHeader" id="FinanceCostRow"><a href="#FinanceCostRow" class="expandRows">finance</a></th>
                        <td class="total" data-type="f"></td>
                        <td class="total" data-type="e"></td>
                    </tr>
                    <tr class="detail includedInTotal" data-fx="interest">
                        <th scope="row" class="detailHeader">interest</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
                    </tr>
                    <tr class="detail includedInTotal" data-fx="principalRepayment">
                        <th scope="row" class="detailHeader">loan repayments</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
                    </tr>
                    <tr class="detail includedInTotal" data-fx="replacementSaving">
                        <th scope="row" class="detailHeader">saving for eventual replacement</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
                    </tr>
                    <tr class="detail excludedFromTotal" data-fx="valueStartOfTheYear">
                        <th scope="row" class="detailHeader">value at the start of the year</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
                    </tr>
                    <tr class="detail excludedFromTotal" data-fx="valueAtTheEndOfTheYear">
                        <th scope="row" class="detailHeader">value at the end of the year</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
                    </tr>
                    <tr class="detail excludedFromTotal" data-fx="totalLoanAtStart">
                        <th scope="row" class="detailHeader">original amount of loan</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
                    </tr>
                    <tr class="detail excludedFromTotal" data-fx="amountBorrowedAtStartOfTheYear">
                        <th scope="row" class="detailHeader">loan at start of the year</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
                    </tr>
                    <tr class="detail excludedFromTotal" data-fx="amountBorrowedAtEndOfTheYear">
                        <th scope="row" class="detailHeader">loan at the end of the year</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
                    </tr>
                    <tr class="detail excluded excludedFromTotal" data-fx="cashLeftAfterSellingCar">
                        <th scope="row" class="detailHeader">cash left after hypothetical end-of-year car sale</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
                    </tr>
                    <tr class="summary" data-fx="totalFixedCost">
                        <th scope="row" class="totalHeader" id="FixCostRow"><a href="#FixCostRow" class="expandRows">fixed</a></th>
                        <td class="total" data-type="f"></td>
                        <td class="total" data-type="e"></td>
                    </tr>
                    <tr class="detail includedInTotal" data-fx="insuranceCost">
                        <th scope="row" class="detailHeader">insurance</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
                    </tr>
                    <tr class="detail includedInTotal" data-fx="licensingAndWOFCost">
                        <th scope="row" class="detailHeader">licensing and WOF</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
                    </tr>
                    <tr class="summary" data-fx="totalOperatingCost">
                        <th scope="row" class="header" id="OperatingCostRow"><a href="#OperatingCostRow" class="expandRows">operating</a></th>
                        <td class="total" data-type="f"></td>
                        <td class="total" data-type="e"></td>
                    </tr>
                    <tr class="detail includedInTotal" data-fx="fuelCost">
                        <th scope="row" class="detailHeader">fuel</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
                    </tr>
                    <tr class="detail includedInTotal" data-fx="maintenanceCost">
                        <th scope="row" class="detailHeader">maintenance and service</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
                    </tr>
                    <tr class="detail includedInTotal" data-fx="tyreCost">
                        <th scope="row" class="detailHeader">tyres</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
                    </tr>
                    <tr class="detail includedInTotal" data-fx="repairCost">
                        <th scope="row" class="detailHeader">unscheduled repairs</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
                    </tr>
                    <tr class="detail includedInTotal" data-fx="costPerKM">
                        <th scope="row" class="detailHeader">total cost per KM</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
                    </tr>
                    <tr class="detail excludedFromTotal" data-fx="actualAnnualKms">
                        <th scope="row" class="detailHeader">actual KMs driven per year</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
                    </tr>
                    <tr class="detail excludedFromTotal" data-fx="actualAnnualKmsPerDay">
                        <th scope="row" class="detailHeader">actual KMs driven per day</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
                    </tr>
                    <tr class="detail excludedFromTotal" data-fx="fuelCostPerWeek">
                        <th scope="row" class="detailHeader">fuel per week</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
                    </tr>
                    <tr class="summary" data-fx="totalOtherCost">
                        <th scope="row" class="header" id="OtherCostRow"><a href="#OtherCostRow" class="expandRows">other</a></th>
                        <td class="total" data-type="f"></td>
                        <td class="total" data-type="e"></td>
                    </tr>
                    <tr class="detail includedInTotal" data-fx="carRentalCost">
                        <th scope="row" class="detailHeader">car rental</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
                    </tr>
                    <tr class="detail includedInTotal" data-fx="carRentaFuel">
                        <th scope="row" class="detailHeader">car rental fuel</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
                    </tr>
                    <tr class="detail includedInTotal" data-fx="subsidy">
                        <th scope="row" class="detailHeader">subsidies</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
                    </tr>
                    <tr class="detail includedInTotal" data-fx="personalContribution">
                        <th scope="row" class="detailHeader">personal contribution</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
                    </tr>
                    <tr class="detail excludedFromTotal" data-fx="numberOfKMsWithRentalCar">
                        <th scope="row" class="detailHeader">car rental KMs driven</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
                    </tr>
                </tbody>
            </table>
        </fieldset>

        <div id="InteractCol" class="mainDetailedSections">

            <fieldset id="PlayAroundAssumptions" class="mainDetailedSections"></fieldset>

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

        </div>

        <h2 id="more-info-about-nissan-leaf">Tell me more about the Nissan Leaf</h2>
        <iframe width="100%" height="315" src="https://www.youtube.com/embed/WpKK72SBxvc" frameborder="0" allowfullscreen></iframe>

        <iframe width="100%" height="315" src="https://www.youtube.com/embed/DMXlV-PV3wI" frameborder="0" allowfullscreen></iframe>


        <div id="RightCol" class="mainDetailedSections">
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


        <div id="LeftCol" class="mainDetailedSections">


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
                Please send us an e-mail: <a href='m&#97;ilt&#111;&#58;evs&#64;&#115;%&#55;5&#110;n%&#55;&#57;side%75p&#46;co&#46;&#110;z'>evs&#64;sun&#110;ysideu&#112;&#46;co&#46;&#110;z</a> if you have any comments.
                Thank you.
            </p>

            <h2>key links</h2>
            <ul>
                <li><a href="http://www.electricheaven.nz/">Electric Heaven: PDF with detailed Information on Electric Cars in New Zealand</a></li>
                <li><a href="http://www.leadingthecharge.org.nz">Leading the Charge: EV enthusiasts</a></li>
                <li><a href="http://flipthefleet.org/">Flip The Fleet: NZ Electric Vehicle Data</a></li>
            </ul>
            <h2>other links</h2>
            <ul>
                <li><a href="http://www.stuff.co.nz/national/9204870/Car-running-costs-lurch-ahead-for-Kiwi-drivers">NZ Car Running Cost</a></li>
                <li><a href="https://www.energywise.govt.nz/tools/fuel-economy/">EECA: Fuel Economy</a></li>
                <li><a href="https://www.energywise.govt.nz/on-the-road/electric-vehicles/">EECA: Electric Vehicles</a></li>
                <li><a href="http://www.afdc.energy.gov/calc/cost_calculator_methodology.html">Detailed Calculations</a></li>
            </ul>

            <h2>disclaimer</h2>
            <p>
                Please use completely at your own risk.
                This tool is meant to be used as an indicative guide only.
                Please seek professional advice for any decisions you may make and do not make any decisions based on what is presented to you in this tool.
            </p>
        </div>
    </form>
    <% end_if %>
    <footer><p>&copy; 2017 <a href="http://www.sunnysideup.co.nz">Sunny Side Up</a> Ltd.</p></footer>
</div>

</body>
</html>
