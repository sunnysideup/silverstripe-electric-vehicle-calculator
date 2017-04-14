<?php
/**
 * requires external API
 *
 */


class EdmundsAPI extends Edmunds\SDK\ApiClient
{
    private static $api_key = "";

    private static $secret = "";

    private static $_cache = null;

    public function __construct()
    {
        if (!self::$_cache) {
            self::$_cache = new Edmunds\SDK\ApiCache(TEMP_FOLDER);
        }
        return parent::__construct(Config::inst()->get("EdmundsAPI", "api_key"), self::$_cache);
    }

    public static function get_data($call, $params)
    {
        if (substr($call, 0, 1) !== "/") {
            $call = "/".$call;
        }
        $obj = Injector::inst()->get("EdmundsAPI");
        return $obj->makeCall($call, $params);
    }
}
