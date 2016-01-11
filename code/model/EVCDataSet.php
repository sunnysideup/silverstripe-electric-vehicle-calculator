<?php


class EVCDataSet extends DataObject {

	private static $default_sort = "LastEdited DESC";

	/**
	 *
	 * @param string | null $code
	 *
	 * @return EVCDataSet
	 */
	public static function find_or_create($code = null, $forceCreation = false) {
		$obj = null;
		if($code) {
			Convert::raw2sql($code);
			$obj = EVCDataSet::get()->filter(array("Code" => $code))->first();
			if(!$obj) {
				$obj = EVCDataSet::get()->filter(array("URLSegment" => $code))->first();
			}
		}
		if(!$obj) {
			if($forceCreation) {
				$obj = EVCDataSet::create();
				$id = $obj->write();
			}
		}
		return $obj;
	}

	private static $db = array(
		"Title" => "Varchar(255)",
		"URLSegment" => "Varchar(255)",
		"Code" => "Varchar(7)",
		"IP" => "Varchar(15)",
		"Locked" => "Boolean",
		"Data" => "Text"
	);

	private static $indexes = array(
		"Code" => true
	);

	public function Link($action) {
		$page = EVCPage::get()->first();
		return $this->MyLink($page, $action);
	}

	public function MyLink($page, $action) {
		if($this->URLSegment) {
			return $page->AbsoluteLink("$action/$this->URLSegment/");
		}
		else {
			return $page->AbsoluteLink("$action/$this->Code/");
		}
	}

	public function getCopyIfNeeded() {
		if($this->Locked) {
			$obj = EVCDataSet::find_or_create(null, true);
			$obj->Data = $this->Data;
			$obj->write();
			return $obj;
		}
		return $this;
	}

	/**
	 *
	 * @param string $key
	 * @param string $value
	 *
	 * @return string
	 */
	public function setValue($key, $value) {
		$obj = $this->getCopyIfNeeded();
		$array = unserialize($obj->Data);
		$array[$key] = $value;
		$obj->Data = serialize($array);
		$obj->write();
		return $obj->Code;
	}

	/**
	 * @return string | null
	 */
	public function returnValuesAsJS(){
		$array = unserialize($this->Data);
		$json = null;
		if(is_array($array) && count($array)) {
			$json = "jQuery(document).ready(function(){";
			foreach($array as $key => $value) {
				$json .= "\n\tEVC.HTMLInteraction.setValue('".$key."', ".(floatval($value)-0).");";
			}
			if($this->Locked) {
				$json .= "\nEVC.isLocked = true;";
			}
			$json .= "\nEVC.HTMLInteraction.updateScreen();";
			$json .= "});";
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
		if($this->Title) {
			$filter = URLSegmentFilter::create();
			$this->URLSegment = $filter->filter($this->Title);
			// Fallback to generic page name if path is empty (= no valid, convertable characters)
			if(!$this->URLSegment || $this->URLSegment == '-' || $this->URLSegment == '-1') {
				$this->URLSegment = $this->Code;
			}
			$originalURLSegment = $this->URLSegment;
			$originalTitle = $this->Title;
			$id = intval($this->ID) - 0;
			for($i = 2; $i < 9999; $i++) {
				$count = EVCDataSet::get()->filter(array("URLSegment" => $this->URLSegment))->exclude(array("ID" => $id))->Count();
				if($count) {
					$this->URLSegment = $originalURLSegment."-".$i;
					$this->Title = $originalTitle." #".$i;
				}
				else {
					$i = 9999999;
				}
			}
		}
	}

	private function getIPAddress(){
		$ip = null;
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
