<?php


class EVCDataSet extends DataObject {

	/**
	 * 
	 * @param string | null $code
	 *
	 * @return EVCDataSet
	 */ 
	public static find_or_create($code = null, $forceCreation = false) {
		$obj = null;
		if($code) {
			Convert::raw2sql($code);
			$obj = EVCDataSet::get()->filter(array("Code" => $code))->first();
		}
		if(!$obj) {
			if($forceCreation) {
				EVCDataSet::create();
				$id = $this->evcDataSet->write();
			}
		}
		return $obj;
	}

	private static $db = array(
		"Code" => "Varchar(7)",
		"IP" => "Varchar(15)",
		"Data" => "Text"
	);

	private static $indexes = array(
		"Code" => true
	);

	public function setValue($key, $value) {
		$array = unserialize($this->Data);
		$array[$key] = $value;
		$this->Data = serialize($array);
		$this->write();
	}

	public function returnValuesAsJS(){
		$array = unserialize($this->Data);
		$json = "";
		foreach($array as $key => $value) {
			$json .= "\nEVC.DefaultData.".$key." = ".$value.";";
		}
		return $json;
	}
	
	function onBeforeWrite(){
		parent::onBeforeWrite();
		if(!$this->IP) {
			$this->IP = $this->getIPAddress();
		}
		if(!$this->Code) {
			$this->Code = substr(hash("md5", uniqid()), 0, 7);
		}
	}

	private function getIPAddress(){
		if (isset($_SERVER['HTTP_CLIENT_IP'])) {
			$ip = $_SERVER['HTTP_CLIENT_IP'];
		}
		elseif (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
			$ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
		}
		elseif (isset($_SERVER['HTTP_CF_CONNECTING_IP'])) {
			$ip = $_SERVER['HTTP_CF_CONNECTING_IP'];
		}
		if (
			!$ip ||
			!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)
		) {
			$ip = $_SERVER['REMOTE_ADDR'];
		}
		return $ip;
	}


}
