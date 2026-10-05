
const request = require('supertest');
const app = require('../app'); 
 // Asegúrate de que server.js termine con "module.exports = app;" 
 describe('Suite de Pruebas E2E - API MiniBlog', () => { 
 // Variables para guardar los IDs y usarlos en distintos tests  
   let testAuthorId;    
   let testPostId;   
 
   describe('1. Pruebas de Autores (Authors)', () => {  
          it('POST /authors - Debería crear un autor correctamente (201)', async () => { 
                       const res = await request(app)             
                          .post('/authors')             
                             .send({               
                                     name: 'Test Author',      
                                     email: `tester_${Date.now()}@example.com`,  
                                     bio: 'Bio generada por el test' 
                                    });         
                                    
                        expect(res.status).toBe(201); 
                        expect(res.body).toHaveProperty('id');            
                        expect(res.body.name).toBe('Test Author');

                        // Guardamos el ID para los siguientes tests            
                        testAuthorId = res.body.id;         
                    });        

                    it('POST /authors - Debería fallar si falta el nombre (400)', async () => {
                        const res = await request(app)                
                        .post('/authors')                
                        .send({                    
                            email: 'sinnombre@example.com'                
                        });            
                        
                        expect(res.status).toBe(400);            
                        expect(res.body.error).toBe('El nombre no puede estar vacío');        
                    });        
                    it('POST /authors - Debería fallar por email duplicado (400)', async () => {            
                        const emailDuplicado = `dup_${Date.now()}@example.com`;            
                        // 1. Creamos el primero            
                        await request(app).post('/authors').send({ name: 'Original', email: emailDuplicado });          

                        // 2. Intentamos crear el segundo con el mismo mail            
                        const res = await request(app)                
                        .post('/authors')                
                        .send({ name: 'Copia', email: emailDuplicado });            
                        expect(res.status).toBe(400);            
                        expect(res.body.error).toBe('El email ya está registrado');        
                    });    
                });    

                describe('2. Pruebas de Publicaciones (Posts)', () => {        
                    it('POST /posts - Debería crear un post asignado al autor de prueba (201)', async () => {            
                        const res = await request(app)                
                        .post('/posts')                
                        .send({                    
                            title: 'Título de prueba',                    
                            content: 'Contenido validado por el test',                    
                            author_id: testAuthorId                 
                        });            

                        expect(res.status).toBe(201);            
                        expect(res.body).toHaveProperty('id');            
                        expect(res.body.author_id).toBe(testAuthorId);            
                        // Guardamos el ID para borrarlo luego 

                        testPostId = res.body.id;        
                    });        
                    it('POST /posts - Debería fallar si faltan campos obligatorios (400)', async () => {            
                        const res = await request(app)                
                        .post('/posts')                
                        .send({                    
                            title: 'Falta contenido y autor'                
                        });            
                        expect(res.status).toBe(400);            
                        expect(res.body.error).toBe('Los campos title, content y author_id son obligatorios');        
                    });        it('POST /posts - Debería fallar si el author_id no existe en la base (400)', async () => {            const res = await request(app)                
                        .post('/posts')                
                        .send({                    
                            title: 'Post fantasma',                    
                            content: 'Este autor no existe',                    
                            author_id: 999999                
                        });            
                        expect(res.status).toBe(400);            
                        expect(res.body.error).toBe('El author_id especificado no existe'); 
                        // Valida tu catch de Postgres        
                        });        
                        it('GET /posts/author/:authorId - Debería listar los posts de un autor específico (200)', async () => {            
                            const res = await request(app).get(`/posts/author/${testAuthorId}`);            
                            expect(res.status).toBe(200);            
                            expect(Array.isArray(res.body)).toBe(true);            
                            expect(res.body.length).toBeGreaterThan(0);            
                            expect(res.body[0].author_id).toBe(testAuthorId);        
                        });    
                    });    
                    describe('3. Pruebas de Eliminación y Manejo de Errores 404', () => {        
                        it('DELETE /posts/:id - Debería eliminar el post correctamente (204)', async () => {            
                            const res = await request(app).delete(`/posts/${testPostId}`);            
                            expect(res.status).toBe(204);        
                        });        
                        it('GET /posts/:id - Debería fallar al buscar el post recién eliminado (404)', async () => {            
                            const res = await request(app).get(`/posts/${testPostId}`);            
                            expect(res.status).toBe(404);            
                            expect(res.body.error).toBe('Post no encontrado');        
                        });        it('DELETE /authors/:id - Debería eliminar el autor de prueba (204)', async () => {            
                            const res = await request(app).delete(`/authors/${testAuthorId}`);            
                            expect(res.status).toBe(204);        
                        });    
                    }); 
                });