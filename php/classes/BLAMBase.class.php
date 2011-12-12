<?php

/* This is the base class */

class BLAMBase {

	// This constructor is used by all the BLAM classes:

	public function __construct(array $options){
		//This function saves all the parameter from $options that are defined in the class
		foreach($options as $k=>$v){
			if(isset($this->$k)){
				$this->$k = $v;
			}
		}
	}
}

?>