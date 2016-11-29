<?php


class EVCPage extends Page
{
}


class EVCPage_Controller extends Page_Controller
{
    private static $allowed_actions = array(
        "show" => true,
        "save" => true,
        "retrieve" => true,
        "reset" => true,
        "previous" => true,
        "lock" => true
    );

    public function init()
    {
        parent::init();
        Requirements::themedCSS('ElectricVehicleCalculator', 'electric-vehicle-calculator');
        Requirements::javascript("framework/thirdparty/jquery/jquery.js");
        Requirements::javascript("electric-vehicle-calculator/thirdparty/chartjs/Chart.min.js");
    }

    protected $evcDataSet = null;

    public function index()
    {
        $code = Session::get("EVCLastCode");
        $this->evcDataSet = EVCDataSet::find_or_create($code, true);
        if (!$code) {
            $code = $this->evcDataSet->Code;
            Session::set("EVCLastCode", $code);
        }
        return $this->redirect($this->evcDataSet->MyLink($this, "show"));
    }

    public function HasCustomTitle()
    {
        if ($this->evcDataSet && $this->evcDataSet->Title) {
            return true;
        }
    }

    public function Title()
    {
        if ($this->HasCustomTitle()) {
            return Convert::raw2xml(urldecode($this->evcDataSet->Title));
        }
        return Convert::raw2xml($this->Title);
    }

    public function MetaTitle()
    {
        if ($this->HasCustomTitle()) {
            return Convert::raw2xml(urldecode($this->evcDataSet->Title));
        }
        return Convert::raw2xml($this->MetaTitle);
    }

    public function show($request)
    {
        $code = $request->param("ID");
        $this->evcDataSet = EVCDataSet::find_or_create($code, false);
        if ($this->evcDataSet && $this->evcDataSet->exists()) {
            Requirements::javascript('electric-vehicle-calculator/javascript/ElectricVehicleCalculator.js');

            //Requirements::javascript("assets/evc/translations.js");
            Requirements::customScript("
                EVC.serverInteraction.baseLink = '".$this->AbsoluteLink()."';
                EVC.serverInteraction.serverKey = '".$this->evcDataSet->Code."';
            ", "EVCSetBasics");
            Requirements::customScript($this->evcDataSet->returnValuesAsJS(), "EVCreturnValuesAsJS");
            return array();
        } else {
            return $this->httpError(404);
        }
    }

    /**
     * returns empty string on error...
     * ajax method ...
     * @return string
     */
    public function save($request)
    {
        $code = $request->param("ID");
        $this->evcDataSet = EVCDataSet::find_or_create($code, true);
        //save it
        $key = Convert::raw2sql($request->getVar("key"));
        $value = Convert::raw2sql($request->getVar("value"));
        if ($newCode = $this->evcDataSet->setValue($key, $value)) {
            Session::set("EVCLastCode", $newCode);
            Session::save();
            return $newCode;
        }
    }

    public function retrieve($request)
    {
        $code = $request->param("ID");
        $this->evcDataSet = EVCDataSet::find_or_create($code, false);
        if ($this->evcDataSet && $this->evcDataSet->exists() && $this->evcDataSet->Data) {
            Session::set("EVCLastCode", $this->evcDataSet->Code);
            Session::save();
            return $this->redirect($this->evcDataSet->MyLink($this, "show"));
        } else {
            return $this->httpError(404);
        }
    }

    public function reset($request)
    {
        Session::set("EVCLastCode", "");
        Session::clear("EVCLastCode");
        Session::save();
        return $this->redirect($this->Link());
    }

    /**
     * ajax method ...
     *
     */
    public function lock($request)
    {
        $code = $request->param("ID");
        $this->evcDataSet = EVCDataSet::find_or_create($code, false);
        $title = $request->getVar("title");
        if ($title && $this->evcDataSet && $this->evcDataSet->exists()) {
            if ($title == "ignore") {
                //no need to do anything
            } else {
                $this->evcDataSet = $this->evcDataSet->getCopyIfNeeded();
                $this->evcDataSet->Locked = true;
                $this->evcDataSet->Title = Convert::raw2sql(urldecode($title));
                $this->evcDataSet->write();
            }
            return $this->evcDataSet->MyLink($this, "retrieve");
        }
        return "ERROR!";
    }

    public function EVCDataSet()
    {
        return $this->evcDataSet;
    }

    public function IsLocked()
    {
        return $this->evcDataSet->Locked;
    }


    protected $previousCalculations = null;

    public function previous($request)
    {
        $this->previousCalculations = PaginatedList::create(EVCDataSet::get()->filter(array("Locked" => 1))->where("Title IS NOT NULL AND Title <> ''"));
        $this->previousCalculations->setPageLength(100);
        return array();
    }

    public function PreviousCalculations()
    {
        return $this->previousCalculations;
    }
}
