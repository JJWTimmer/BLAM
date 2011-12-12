<?php

class User extends BLAMBase {
	
    public $id = '';
	public $username = '';
    public $password = '';
    public $newpw = '';
    public $role = '';
    public $avatar = '';
	
	public function create() {
		
		DB::query("
			INSERT INTO users (username, password, role_id)
			VALUES (
				'" . DB::esc($this->username) . "',
				'" . hash('sha1', DB::esc($this->password)) . "',
                '" . DB::esc($this->role) . "'
            )
            ");
            
        $this->id = DB::getMySQLiObject()->insert_id;
		
		return $this->id;
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
    
    	
	public function setAvatar() {
        $q = "
                UPDATE users
                SET avatar='".DB::esc($this->avatar)."'
                WHERE id=".DB::esc($this->id);
		DB::query($q);	
	}	
    
	public function delete() {
	
		DB::query("DELETE FROM users WHERE id=".DB::esc($this-id));	
	}
    
    public function login() {
        $user = false;
        try {
            $dbresult = DB::query("
                SELECT users.id AS id, username, avatar, roles.name AS role
                FROM users INNER JOIN roles ON users.role_id = roles.id
                WHERE username = '" . DB::esc($this->username) . "'
                AND password = '" . hash('sha1', DB::esc($this->password)) . "'
                ");
            
            // remove unencrypted password
            unset($this->password);
            
            if ( $dbresult->num_rows == 1 ) {

                $user = $dbresult->fetch_array();
                $this->id       = $user['id'];
                $this->username = $user['username'];
                $this->role     = $user['role'];
                $this->avatar   = $user['avatar'];

                DB::query("
                    UPDATE users
                    SET logged_in = 1
                    WHERE id = " . DB::esc($this->id)
                    );
            } else {
                $user = false;
            }
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
            WHERE id = " . DB::esc($this->id)
            );
    }
    
    public function changepw() {
        $res = DB::query("SELECT * FROM users WHERE id = ".DB::esc($this->id)." AND password = '".sha1($this->password)."'");
        if (DB::rows() > 0) {
            $q = "UPDATE users SET password = '" . sha1($this->newpw) . "' WHERE id = ".DB::esc($this->id);
            $res2 = DB::query($q);
            if (DB::rows() > 0 )
                return true;
            else
                return false;
        } else {
            return false;
        }
    }
    
    public function activity() {
        DB::query("
            UPDATE users
            SET last_activity = NOW(), logged_in = 1
            WHERE id = " . DB::esc($this->id)
            );
        DB::query("
            UPDATE users
            SET logged_in = 0
            WHERE last_activity < DATE_SUB(NOW(), INTERVAL 30 MINUTE)
        ");
    }
    
    public function get($options = 'all') {
        if (is_string($options) && $options == 'all') {
            $results = DB::query("
                SELECT users.id AS id, roles.name AS role, username, avatar
                    FROM users INNER JOIN roles ON users.role_id = roles.id
                ");
        } elseif (is_string($options) && $options == 'logged') {
            $results = DB::query("
                SELECT users.id AS id, roles.name AS role, username, avatar
                    FROM users INNER JOIN roles ON users.role_id = roles.id
                    WHERE logged_in = 1
                ");
        } else {
            throw new Exception('unknown option');
        }
        
		while ($data[] = mysqli_fetch_assoc($results));
        if (!is_null($data) && end($data) == null) array_pop($data);
		return $data;
	}
    
}

?>