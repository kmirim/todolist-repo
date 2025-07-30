# todo list

### subir ambiente em front: 

- npm install 
- caso tenha conflito de dependencias next ❯ npm install --legacy-peer-deps
- npm run build
- npm start 

### back: 

- utilizacao de springboot 4, utilizando java 8: 
	- sudo apt install openjdk-8-jdk
	- sudo update-alternatives --config java; 
	- java -version

- conf do spring boot:  
	- acessar  https://start.spring.io/
	- preencher os campos: 
	    - Project: Maven Project
        - Language: Java
        - Spring Boot: 4(SNAPSHOT)
        
        Project Metadata:
        
        - Group: com.kmirim
        - Artifact: nome do projeto, ex: todolist
        - Name: nome do projeto, geralmente igual ao Artifact
        - Packaging: Jar
        - Java: 17

        Dependencias: 
        - Spring Web
        - Spring Data JPA
        - PostgreSQL Driver (ou outro driver JDBC)

- Abrir o projeto na IDE: 
- Procurar a main e execute 
- alternativa: terminal ./mvnw spring-boot:run

- Criar a estrutura de MVC, criando as pastas: model,controller,repository,service
    ```mkdir -p src/main/java/com/kmirim/todolist/{model,controller,repository,service}```
- model: O pacote/pasta model geralmente guarda as classes que representam os dados da sua aplicação — também chamadas de entidades ou models.
 