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
    <div class='loading-screen'><span>calculating your results ... </span></div>
<div id="EVCWrapper">

    <% if PreviousCalculations %>
    <div id="PreviousCalculations">
        <h2>Please select from the previous calculations below ... </h2>
        <% include ECVPagePreviousCalculations %>
    </div>
    <% else %>
    <form id="start-up-screen">
        <p class="question">
            If you trade-in your car for an electric vehicle &#8212; what will it cost you?
            <span>Answer the two questions below and we will tell you ... you might be suprised, it will not cost the earth:</span>
        </p>

        <div class="field">
            <label for="startup-car-value">What is the value of your current car?</label>
            <div class="middleColumn">
                <input type="number" inputmode="numeric" pattern="[0-9]*" value="0" min="0" max="40000" name="startup-car-value"   />
            </div>
        </div>
        <div class="field">
            <label for="petrol-spent-per-week">How much do you spend on petrol per week?</label>
            <div class="middleColumn">
                <input type="number" inputmode="numeric" pattern="[0-9]*" value="0" min="0" max="50000" name="petrol-spent-per-week" />
            </div>
        </div>
        <ul class="actions">
            <li id="HowMuchDoWeSave" class="buttonWrapper">
                <a href="#ProfitAndLoss" class="button">View Answer</a>
            </li>
        </ul>

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

        <fieldset id="ResultTableHolder" class="mainDetailedSections">
            <h2>
                detailed results for one year <span class="straightFillers" data-fx="resultsTableYear"></span>:
                <span class="calcVal" data-fx="totalProfit"></span>
            </h2>
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
                        <th scope="row" class="superTotalHeader totalHeader">TOTAL</th>
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
                    <tr class="detail excludedFromTotal" data-fx="actualAnnualKms">
                        <th scope="row" class="detailHeader">actual KMs driven per year</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
                    </tr>
                    <tr class="detail includedInTotal" data-fx="fuelCost">
                        <th scope="row" class="detailHeader">fuel</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
                    </tr>
                    <tr class="detail excludedFromTotal" data-fx="fuelCostPerWeek">
                        <th scope="row" class="detailHeader">fuel per week</th>
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
                    <tr class="summary" data-fx="totalOtherCost">
                        <th scope="row" class="header" id="OtherCostRow"><a href="#OtherCostRow" class="expandRows">other</a></th>
                        <td class="total" data-type="f"></td>
                        <td class="total" data-type="e"></td>
                    </tr>
                    <tr class="detail excludedFromTotal" data-fx="numberOfKMsWithRentalCar">
                        <th scope="row" class="detailHeader">car rental KMs driven</th>
                        <td class="detail" data-type="f"></td>
                        <td class="detail" data-type="e"></td>
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

            <h2>purchase your electric vehicle</h2>
            <p>More information to come ... </p>
        </div>


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
                Please send us an e-mail: <a href='m&#97;ilt&#111;&#58;evs&#64;&#115;%&#55;5&#110;n%&#55;&#57;side%75p&#46;co&#46;&#110;z'>evs&#64;sun&#110;ysideu&#112;&#46;co&#46;&#110;z</a>, if you have any comments.
                Thank you.
            </p>

            <h2>links</h2>
            <ul>
                <li><a href="http://www.stuff.co.nz/national/9204870/Car-running-costs-lurch-ahead-for-Kiwi-drivers">NZ Car Running Cost</a></li>
                <li><a href="http://www.electricheaven.nz/">Information on Electric Cars in New Zealand</a></li>
                <li><a href="https://www.energywise.govt.nz/tools/fuel-economy/">EECA: Fuel Economy</a></li>
                <li><a href="https://www.energywise.govt.nz/on-the-road/electric-vehicles/">EECA: Electric Vehicles</a></li>
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
                <li>add padding on top that is the same as fixed header</li>
                <li>allow to change values from chart</li>
                <li>review: https://www.quora.com/What-are-some-APIs-for-retrieving-car-value-data, http://www.programmableweb.com/api/kelley-blue-book-infodriver, http://developer.edmunds.com/faq.html#faq-2, https://developer.ibm.com/apimanagement/2014/10/31/whats-driving-apis-automotive/, http://www3.epa.gov/otaq/tcldata.htm, https://www.carvoyant.com/</li>
                <li>set up form to select make and model</li>
                <li>dont select current car value, but let user select car model and age ... </li>
                <li>make it easier to understand save methods</li>
                <li>move all content down by size of Header</li>
                <li>make a list of links for each assumption / variable</li>
                <li>see assumptions relevant to each section</li>
                <li>ability to add uber / public transport / walking / train / long distance bus / flying / cycling KMs...</li>
                <li>break down cost in </li>
            </ul>
        </div>
    </form>
    <% end_if %>
    <footer><p>&copy; 2016 Sunny Side Up Ltd.</p></footer>
</div>

</body>
</html>
