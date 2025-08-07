const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Ecommerce API",
    version: "1.0.0",
    description: "MERN Ecommerce API Docs"
  },
  servers: [
    {
      url: "https://mustaab.onrender.com", // ✅ Deployed URL
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
      }
    }
  },
  security: [
    {
      adminAuth: [],
      clientAuth: [],
    },
  ],
};
