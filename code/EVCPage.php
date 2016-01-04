<?php


class EVCPage extends Page {


}


class EVCPage_Controller extends Page_Controller {

	private static $allowed_actions = array(
		"show" => true,
		"save" => true,
		"retrieve" => true
	);

	protected $evcDataSet = null;

	function index(){
		$this->evcDataSet = EVCDataSet::find_or_create("", true);
		return $this->redirect($this->Link("show/".$this->evcDataSet->Code."/"));
	}

	function show($request){
		$code = $request->param("ID");
		$this->evcDataSet = EVCDataSet::find_or_create($code, false);
		if($oldObject && $objObject->exists() && $oldObject->Data) {
			Requirements::javascript("electric-vehicle-calculator/javascript/base.js");
			Requirements::javascript("assets/evc/translations.js");
			Requirements::customScript($this->returnValuesAsJS(), "EVCreturnValuesAsJS");
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
		$key = Convert::raw2sql($request->getParam("key"));
		$value = Convert::raw2sql($request->getParam("value"));
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
			return $this->redirect($this->Link("show/".$this->evcDataSet->Code."/"));
		}
		else {
			return $this->httpError(404);
		}
	}

	function EVCDataSet(){
		return $this->evcDataSet;
	}

}
