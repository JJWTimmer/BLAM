<?php

/* The Chat class exploses public static methods, used by ajax.php */

class Chat{
	
	public static function login($name,$password){
		if($password=="batavier"||$_SESSION['user'])
			{
			if(!$name){
				throw new Exception('Fill in all the required fields.');
				}
			$user = new ChatUser(array(
				'name'		=> $name,
				));
		
			// The save method returns a MySQLi object
			if($user->save()->affected_rows != 1){
				//user already exists, get his avatar
				$result = DB::query("SELECT avatar,loggedin FROM webchat_users where name='".DB::esc($name)."';");
				$row=$result->fetch_array();
				if($row[0]==""){
					$avatar="img/unknown.png"; 
					}
				else{
					$avatar = $row[0];
					}
				//put logged in on True, if not yet logged in
				if($row[1]==0) 
					{
					DB::query("update webchat_users set loggedin=1 WHERE name = '".DB::esc($name)."';");
					}
				else
				//user was already logged in
				{
				throw new Exception('Already logged in');
				}
			}
			else{
				//user is added, set his avatar to unknown
				$avatar = "img/unknown.png";
			}

			$_SESSION['user']	= array(
				'name'		=> $name,
				'avatar'	=> $avatar
			);
		
			return array(
				'status'	=> 1,
				'name'		=> $name,
				'avatar'	=> $avatar
				);
		}
		else{
		throw new Exception('Incorrect password');
		}
	}

	public static function checkLogged(){
	// check if user is already logged in earlier?	
		$response = array('logged' => false);
			
		if($_SESSION['user']['name']){
			$response['logged'] = true;
			$response['loggedAs'] = array(
				'name'		=> $_SESSION['user']['name'],
				'avatar'	=> $_SESSION['user']['avatar']
			);
		}
		
		return $response;
		
	}
	
	public static function logout(){
		DB::query("update webchat_users set loggedin=0 WHERE name = '".DB::esc($_SESSION['user']['name'])."'");
		
		$_SESSION = array();
		unset($_SESSION);

		return array('status' => 1);
		
	}
	
	public static function submitChat($chatText){
		if(!$_SESSION['user']){
			throw new Exception('You are not logged in');
		}
		
		if(!$chatText){
			throw new Exception('You haven\' entered a chat message.');
		}
	
		$chat = new ChatLine(array(
			'author'	=> $_SESSION['user']['name'],
			'avatar'	=> $_SESSION['user']['avatar'],
			'text'		=> $chatText
		));
	
		// The save method returns a MySQLi object
		$insertID = $chat->save()->insert_id;
	
		return array(
			'status'	=> 1,
			'insertID'	=> $insertID
		);
	}
	
	public static function getUsers(){
		if($_SESSION['user']){
						
		//update timestamp user to prevent auto logout
		if($_SESSION['user']['name']){
			$user = new ChatUser(array('name' => $_SESSION['user']['name']));
			$user->update();
		}
		
		// Deleting chats older than 5 minutes 
		//DB::query("DELETE FROM webchat_lines WHERE ts < SUBTIME(NOW(),'0:5:0')");
		//logging out users inactive for 30 seconds
		DB::query("Update webchat_users set loggedin=0 WHERE last_activity < SUBTIME(NOW(),'0:0:30')");
		
		$result = DB::query('SELECT * FROM webchat_users where loggedin=1 ORDER BY name ASC LIMIT 18');
		
		$users = array();
		while($user = $result->fetch_object()){
			$users[] = $user;
		}
	
		return array(
			'users' => $users,
			'total' => DB::query('SELECT COUNT(*) as cnt FROM webchat_users where loggedin=1')->fetch_object()->cnt
		);
		}
	}
	
	public static function getChats($lastID,$date){
		if($_SESSION['user']){
		
		$lastID = (int)$lastID;
		if($date=='all')
		{
		$result = DB::query('SELECT * FROM webchat_lines WHERE id > '.$lastID.' ORDER BY id ASC;');
		}
		else{		
		$result = DB::query('SELECT * FROM webchat_lines WHERE (id > '.$lastID.' AND ts > SUBTIME(NOW(),\''.$date.'\')) ORDER BY id ASC;');
		}
		//$num_rows = $result->num_rows;
		//$counter=0;
		$chats = array();
		while($chat = $result->fetch_object()){
			// Returning the GMT (UTC) time of the chat creation:
			//if($counter>$num_rows-20)	
			//	{
				$chat->time = array(
					'hours'		=> gmdate('H',strtotime($chat->ts)),
					'minutes'	=> gmdate('i',strtotime($chat->ts))
					);
			
				//add chat to array
				$chats[] = $chat;
			//	}
		//$counter=$counter+1;
		}
	
		return array('chats' => $chats);
		}	
	}

public static function searchChats($keyword){
		if($_SESSION['user']){
		$keyword=str_replace(" ","%",$keyword);
		
		$result = DB::query('SELECT * FROM webchat_lines WHERE text LIKE \'%'.DB::esc($keyword).'%\' OR author LIKE \'%'.DB::esc($keyword).'%\' ORDER BY id ASC;');
				
		$chats = array();
		while($chat = $result->fetch_object()){
			$chat->time = array(
				'hours'		=> gmdate('H',strtotime($chat->ts)),
				'minutes'	=> gmdate('i',strtotime($chat->ts))
				);
			
				//add chat to array
				$chats[] = $chat;
				
		}
	
		return array('chats' => $chats);
		}	
	}


}


?>