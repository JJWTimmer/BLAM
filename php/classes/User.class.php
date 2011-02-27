<?php

class User extends RVDLogBase {
	
    protected $id = '';
	protected $username = '';
    protected $password = '';
    protected $role = '';
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