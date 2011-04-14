<?php
//Wrapper function for mysql functions
class DB {
	private static $instance;
	private $MySQLi;
	//ensures only init can create a new DB wrapper
	private function __construct(array $dbOptions){
		//this-> refers to current object of this class
		//@ refers to memory address?
		$this->MySQLi = @ new mysqli(	$dbOptions['db_host'],
										$dbOptions['db_user'],
										$dbOptions['db_pass'],
										$dbOptions['db_name'] );

		if (mysqli_connect_errno()) {
			throw new Exception('Database error.');
		}

		$this->MySQLi->set_charset("utf8");
	}
	
	public static function init(array $dbOptions){
		//does an instance already exist?
		//self::$instance refers to current class
		if(self::$instance instanceof self){
			return false;
		}
		//if doesn't exist, create new instance
		self::$instance = new self($dbOptions);
	}
    
	//retrieve mysql object to?
	public static function getMySQLiObject(){
		return self::$instance->MySQLi;
	}
    
	//perform query, return result
	public static function query($q){
		return self::$instance->MySQLi->query($q);
	}
    
	//add escape characters string
	public static function esc($str){
		return self::$instance->MySQLi->real_escape_string(htmlspecialchars($str));
	}
}