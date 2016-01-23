<?php


class EVCSelectPage extends Page {

}


class EVCSelectPage_Controller extends Page_Controller {

	private static $allowed_actions = array(
		"nextstep"
	);

	protected $steps = array(
		"Year",
		"Make",
		"Model",
		"Type",
		"ODO"
	);

	function init() {
		parent::init();
		Requirements::themedCSS('ElectricVehicleCalculatorSelectPage', 'electric-vehicle-calculator');
		Requirements::javascript("framework/thirdparty/jquery/jquery.js");
		Requirements::javascript('electric-vehicle-calculator/javascript/EVCSelectPage.js');
		Requirements::customScript("EVCSelectPage.baseLink = '".$this->AbsoluteLink()."';", "EVCSelectPageBasics");
	}

	function SelectForm(){
		$fieldList = new FieldList(
			NumericField::create("Year", "Manufacturing Year"),
			DropdownField::create("Make", "Make", array(0 => "-- no idea! --") + $this->getMakes()),
			DropdownField::create("Model", "Model", array(0 => "-- no idea! --")),
			DropdownField::create("Type", "Type", array(0 => "-- no idea! --")),
			NumericField::create("ODO", "Current Odometer (overall distance travelled - as shown in your dashboard")
		);
		$actions = new FieldList(
			FormAction::create("doselectform")->setTitle("Start Calculation")
		);
		$form = Form::create(
			$this, 
			"SelectForm", 
			$fieldList, 
			$actions, 
			$required = RequiredFields::create(array("Year", "Make", "Model", "Type"))
		);
		return $form;
	}



	/**
	 * action
	 * set value and returns next list
	 * @param HTTPRequest
	 */ 
	function nextstep($request){
		$key = $request->param("ID");
		if(!in_array($key, $this->steps)) {
			return user_error("setting unknown value: $key");
		}
		else {
			$index = array_search($key, $this->steps);
			$nextIndex = $index + 1;
		}
		$value = $request->param("OtherID");
		if($key == "Year") {
			$value = intval($value);
		}
		Session::set("EVCSelectPage_".$key, $value);
		$nextKey = $this->steps[$nextIndex];
		$method = "get".$nextKey."s";
		if($this->hasMethod($method)) {
			return json_encode($this->$method());
		}
		return json_encode(array("error" => "could not find method $method"));
		
	}


	function getValue($key){
		$value = Session::get("EVCSelectPage_".$key);
		if($key == "Year") {
			if($value < 1900 || $value > Date("Year", strtotime("Now"))) {
				$value = 0;
			}
		}
		return $value;
	}


	protected function getMakes(){
		$params = array("view" => "full");
		if($year = $this->getValue("Year")) {
			$params["year"] = $year;
		}		
		$makes = EdmundsAPI::get_data("/api/vehicle/v2/makes/count", $params);
		$returnArray = array();
		foreach($makes->makes as $make) {
			$returnArray[$make->niceName] = $make->niceName;
		}
		asort($returnArray);
		return $returnArray;
	}


	protected function getModels(){
		$makeNiceName = $this->getValue("Model");
		if(!$makeNiceName) {
			$makeNiceName = "audi";
		}
		$year = $this->getValue("Year");
		if($year < 1900 || $year > Date("Year", strtotime("Now"))) {
			$year = 0;
		}
		$params = array();
		if($year) {
			$params["year"] = $year;
		}		
		$models = EdmundsAPI::get_data("/api/vehicle/v2/".$makeNiceName, $params);
		$returnArray = array();
		foreach($models->models as $model) {
			$returnArray[$model->id] = $model->name;
		}
		asort($returnArray);
		return $returnArray;
	}


}
