# Projeto_MyGym
 Segunda versao do MyGym

Como fazer backup e restaurar o bd com uso do db.dump
    
    criar dump do bd {
    docker exec -it CONTAINER bash
    pg_dump -Fc -U my_gym my_gym > db.dump
    }
    
    copiar dump do bd para diretorio atual{
    docker cp CONTAINER:db.dump db.dump
    }
    
    copiar dump do diretorio atual para o db {
    docker cp ./db.dump CONTAINER:/.
    }
    
    restaura bd no containaer {
    docker exec -it CONTAINER bash
    dropdb -U my_gym my_gym
    pg_restore -C -d postgres db.dump
    }

