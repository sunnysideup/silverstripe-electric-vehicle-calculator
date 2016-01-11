<?php


class EVCPage extends Page {


}


class EVCPage_Controller extends Page_Controller {

	private static $allowed_actions = array(
		"show" => true,
		"save" => true,
		"retrieve" => true,
		"reset" => true,
		"previous" => true,
		"lock" => true
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
		return $this->redirect($this->evcDataSet->MyLink($this, "show"));
	}

	public function HasCustomTitle() {
		if($this->evcDataSet && $this->evcDataSet->Title) {
			return true;
		}
	}

	function Title(){
		if($this->HasCustomTitle()){
			return Convert::raw2xml(urldecode($this->evcDataSet->Title));
		}
		return Convert::raw2xml($this->Title);
	}

	function MetaTitle(){
		if($this->HasCustomTitle()){
			return Convert::raw2xml(urldecode($this->evcDataSet->Title));
		}
		return Convert::raw2xml($this->MetaTitle);
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
	 * returns empty string on error...
	 * ajax method ...
	 * @return string
	 */
	function save($request){
		$code = $request->param("ID");
		$this->evcDataSet = EVCDataSet::find_or_create($code, true);
		//save it
		$key = Convert::raw2sql($request->getVar("key"));
		$value = Convert::raw2sql($request->getVar("value"));
		if($this->evcDataSet->setValue($key, $value)) {
			return $this->evcDataSet->Code;
		}
		else {
			return "";
		}
	}

	function retrieve($request){
		$code = $request->param("ID");
		$oldObject = EVCDataSet::find_or_create($code, false);
		if($oldObject && $oldObject->exists() && $oldObject->Data) {
			$this->evcDataSet = EVCDataSet::create();
			$this->evcDataSet->Data = $oldObject->Data;
			$id = $this->evcDataSet->write();
			Session::set("EVCLastCode", $this->evcDataSet->Code);
			Session::save();
			return $this->redirect($this->evcDataSet->MyLink($this, "show"));
		}
		else {
			return $this->httpError(404);
		}
	}

	function reset($request){
		Session::set("EVCLastCode", "");
		Session::clear("EVCLastCode");
		Session::save();
		return $this->redirect($this->Link());
	}

	/**
	 * ajax method ...
	 *
	 */
	function lock($request){
		$code = $request->param("ID");
		$this->evcDataSet = EVCDataSet::find_or_create($code, false);
		if($this->evcDataSet && $this->evcDataSet->exists()) {
			$this->evcDataSet->Locked = true;
			$title = $request->getVar("title");
			$this->evcDataSet->Title = Convert::raw2sql(urldecode($title));
			$this->evcDataSet->write();
			return $this->evcDataSet->MyLink($this, "retrieve");
		}
		return "ERROR!";
	}

	function EVCDataSet(){
		return $this->evcDataSet;
	}

	function IsLocked(){
		return $this->evcDataSet->Locked;
	}


	protected $previousCalculations = null;

	function previous($request){
		$this->previousCalculations = PaginatedList::create(EVCDataSet::get()->filter(array("Locked" => 1)));
		$this->previousCalculations->setPageLength(100);
		return $this->renderWith("ECVPagePreviousCalculations");
	}

	function PreviousCalculations(){
		return $this->previousCalculations;
	}

}
