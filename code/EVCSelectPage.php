<?php


class EVCSelectPage extends Page {

}


class EVCSelectPage_Controller extends Page_Controller {

	private static $allowed_actions = array(
		"SelectForm",
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
			DropdownField::create("Make", "Make", array(0 => $this->pleaseSelectPhrase())),
			DropdownField::create("Model", "Model", array(0 => $this->pleaseSelectPhrase())),
			DropdownField::create("Type", "Type", array(0 => $this->pleaseSelectPhrase())),
			NumericField::create("ODO", "Current Odometer (overall distance travelled - as shown in your dashboard")
		);
		$actions = new FieldList(
			FormAction::create("doselectform")->setTitle("Start Calculation")
		);
		$form = Form::create(
			$this, 
			"SelectForm", 
			$fieldList, 
			$actions
		);
		return $form;
	}

	function doselectform($data, $form) {
		$params = array();
		print_r(EdmundsAPI::get_data("/api/tco/newtruecosttoownbystyleidandzip/".$data["Type"]."/90019", $params));
		die("------------");
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
		return json_encode(array("0" => "sorry an error occured with $method, please reload page ..."));
		
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
		$returnArray = array(0 => $this->pleaseSelectPhrase());
		$year = $this->getValue("Year");
		if($year) {
			$params = array("view" => "full");
			$params["year"] = $year;
			$makes = EdmundsAPI::get_data("/api/vehicle/v2/makes/count", $params);
			foreach($makes->makes as $make) {
				$returnArray[$make->niceName] = $make->niceName;
			}
			asort($returnArray);
		}
		return $returnArray;
	}


	protected function getModels(){
		$returnArray = array(0 => $this->pleaseSelectPhrase());
		$makeNiceName = $this->getValue("Make");
		$year = $this->getValue("Year");
		if($makeNiceName && $year) {
			$params = array();
			$params["year"] = $year;
			$models = EdmundsAPI::get_data("/api/vehicle/v2/".$makeNiceName, $params);
			foreach($models->models as $model) {
				$returnArray[$model->niceName] = $model->name;
			}
			asort($returnArray);
			
		}
		return $returnArray;
	}


	protected function getTypes(){
		$returnArray = array(0 => $this->pleaseSelectPhrase());
		$year = $this->getValue("Year");
		$makeNiceName = $this->getValue("Make");
		$modelNiceName = $this->getValue("Model");
		if($year && $makeNiceName && $modelNiceName) {
			$params = array("view" => "full");
			$params["year"] = $year;
			$types = EdmundsAPI::get_data("/api/vehicle/v2/".$makeNiceName."/".$modelNiceName, $params);
			foreach($types->years as $loopYear) {
				if(intval($loopYear->year) == intval($year)) {
					foreach($loopYear->styles as $style) {
						$returnArray[$style->id] = $style->name;
					}
				}
			}
			asort($returnArray);
		}
		return $returnArray;
	}

	function pleaseSelectPhrase(){
		return "-- please answer all previous questions --";
	}

}
