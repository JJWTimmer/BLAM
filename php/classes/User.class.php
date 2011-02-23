<?php

class User extends RVDLogBase {
	
    protected $id = '';
	protected $username = '';
    protected $password = '';
    protected $role_id = '';
    protected $avatar = '';
	
	public function create() {
		
		DB::query("
			INSERT INTO users (username, password, role_id, avatar)
			VALUES (
				'" . DB::esc($this->username) . "',
				'" . hash('sha1', DB::esc($this->password)) . "',
                '" . DB::esc($this->role_id) . "',
                '" . DB::esc($this->avatar) . "'
            )
            ");
		
		return DB::getMySQLiObject();
	
	}
	
	public function update() {
	
		DB::query("
                UPDATE users
                SET username='".DB::esc($this->username)."', " .
                (!empty($this->password) ? "password='".DB::esc($this->password)."', " : "") .
                "avatar='".DB::esc($this->avatar)."', 
                role_id='".DB::esc($this->role_id)."' 
                WHERE id=".DB::esc($this->id)
                );	
	}
    
    public function login() {
        try {
            $dbresult = DB::query("
                SELECT users.id AS id, username, avatar, roles.name AS role
                FROM users INNER JOIN roles ON users.role_id = roles.id
                WHERE username = '" . DB::esc($this->username) . "' AND password = '" . hash('sha1', DB::esc($this->password)) . "'
                ");
            
            $user = $dbresult->fetch_array();
            DB::query("
                UPDATE users
                SET logged_in = 1
                WHERE id = " . DB::esc($user['id'])
                );
        }
        catch (Exception $e) {
            $user = false;
        }
        
		return $user;
    }
    
    public function logout() {
        DB::query("
            UPDATE users
            SET logged_in = 0
            WHERE id = '" . $this->id
            );
    }
}

?>