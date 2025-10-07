// swagger.js
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express"; // Rename for clarity

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Ecommerce API",
    version: "1.0.0",
    description: "MERN Ecommerce API Docs",
  },
  servers: [
    {
      url: "https://mustaab.onrender.com", // ✅ Your deployed URL
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
    }
  },
  security: [
    { clientAuth: [] },
    { adminAuth: [] },
  ]
};

const options = {
  swaggerDefinition,
  apis: ["./Routes/*.js"], // ✅ Make sure your route files contain Swagger comments
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec, swaggerUiExpress };
