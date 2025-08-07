// swagger.js
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Ecommerce API",
    version: "1.0.0",
    description: "MERN Ecommerce API Docs"
  },
  servers: [
    {
      url: "https://mustaab.onrender.com", // adjust if different
    },
  ],
  components: {
    securitySchemes: {
      clientAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT token for CLIENT user"
      },
      adminAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT token for ADMIN user"
      },
     security: [
  {
    adminAuth: [],
    clientAuth: [],
  },
],
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // <--- Your routes folder path
};

export const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi };
