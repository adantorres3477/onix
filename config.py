class Config:
    SECRET_KEY = "CORRIDOSTUMBADOS"
    DEBUG = True


class DevelopmentConfig(Config):
    MYSQL_HOST = 'localhost'
    MYSQL_USER = 'root'
    MYSQL_PASSWORD = 'mysql'
    MYSQL_DATABASE = 'onix'


config = {
    "Development": DevelopmentConfig
}