class config:
    SECRET_KEY  = "CORRIDOSTUMBADOS"
    DEBUG = True
    
    class DvelopmentConfig(Config):
        mysql_host = "localhost"
        mysql_user = "root"
        mysql_password = "mysql"
        mysql_database = "onix"
        
        config = {
            "Development": DevelopmentConfig }
        