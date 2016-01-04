<?php


class EVCPage extends Page {


}


class EVCPage_Controller extends Page_Controller {

	private static $allowed_actions = array(
		"show" => true,
		"save" => true,
		"retrieve" => true,
		"reset" => true
	);

	function init(){
		parent::init();
	}

	protected $evcDataSet = null;

	function index(){
		$code = Session::get("EVCLastCode");
		$this->evcDataSet = EVCDataSet::find_or_create($code, true);
		if(!$code) {
			$code = $this->evcDataSet->Code;
			Session::set("EVCLastCode", $code);
		}
		return $this->redirect($this->Link("show/".$code."/"));
	}

	function show($request){
		$code = $request->param("ID");
		$this->evcDataSet = EVCDataSet::find_or_create($code, false);
		if($this->evcDataSet && $this->evcDataSet->exists()) {
			Requirements::themedCSS('ElectricVehicleCalculator', 'electric-vehicle-calculator');
			Requirements::javascript("framework/thirdparty/jquery/jquery.js");
			Requirements::javascript('electric-vehicle-calculator/javascript/ElectricVehicleCalculator.js');
			
			//Requirements::javascript("assets/evc/translations.js");
			Requirements::customScript("
				EVC.baseLink = '".$this->AbsoluteLink()."';
				EVC.serverKey = '".$this->evcDataSet->Code."';
			", "EVCSetBasics");
			Requirements::customScript($this->evcDataSet->returnValuesAsJS(), "EVCreturnValuesAsJS");
			return array();
		}
		else {
			return $this->httpError(404);
		}
	}

	/**
	 * ajax method ...
	 *
	 */
	function save($request){
		$code = $request->param("ID");
		$this->evcDataSet = EVCDataSet::find_or_create($code, true);
		//save it
		$key = Convert::raw2sql($request->getVar("key"));
		$value = Convert::raw2sql($request->getVar("value"));
		$this->evcDataSet->setValue($key, $value);
		return $this->evcDataSet->Code;
	}

	function retrieve($request){
		$code = $request->param("ID");
		$oldObject = EVCDataSet::find_or_create($code, false);
		if($oldObject && $objObject->exists() && $oldObject->Data) {
			$this->evcDataSet = EVCDataSet::create();
			$this->evcDataSet->Data = $objObject->Data;
			$id = $this->evcDataSet->write();
			Session::set("EVCLastCode", $this->evcDataSet->Code);
			Session::save();
			return $this->redirect($this->Link("show/".$this->evcDataSet->Code."/"));
		}
		else {
			return $this->httpError(404);
		}
	}

	function reset($request){
		Session::set("EVCLastCode", "");
		Session::clear("EVCLastCode");
		return $this->redirect($this->Link());
	}

	function EVCDataSet(){
		return $this->evcDataSet;
	}

}
