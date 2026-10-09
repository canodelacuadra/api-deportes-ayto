import swaggerJSDoc from 'swagger-jsdoc';

const options = {
 definition: {
   openapi: '3.0.0',
   info: {
     title: 'API de Espacios Deportivos del Ayuntamiento',
     version: '1.0.0',
     description: 'API REST para gestionar espacios, usuarios y reservas deportivas municipales.',
   },
   components: {
     securitySchemes: {
       bearerAuth: {
         type: 'http',
         scheme: 'bearer',
         bearerFormat: 'JWT',
       }
     }
   }
 },
 // Le decimos que busque los comentarios en estos archivos
 apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;

