const m2s = require('mongoose-to-swagger');
const User = require('./models/user.model');
const Transaction = require('./models/transaction.model');

const baseUser = m2s(User);

const SafeUser = {
  ...baseUser,
  properties: {
    ...baseUser.properties,
    password: { type: 'string', writeOnly: true },
    _id: { type: 'string', readOnly: true },
    createdAt: { type: 'string', format: 'date-time', readOnly: true },
    updatedAt: { type: 'string', format: 'date-time', readOnly: true }
  },
  required: (baseUser.required || []).filter(r => r !== 'password')
};

exports.options = {
  openapi: "3.1.0",
  info: {
    version: "1.0.0",
    title: "Money-Tracker Transactions API",
    description: "API for managing users and their financial transactions.",
    contact: {
      name: "API Support",
      url: "https://aria.gr",
      email: "support@example.com"
    }
  },
  servers: [
    { url: "http://localhost:3000", description: "Local Server" },
    { url: "http://www.backend.aria.gr", description: "Testing server" }
  ],
  tags: [
    { name: "Users", description: "User management" },
    { name: "Transactions", description: "User transactions" },
    { name: "Auth", description: "Authentication" }
  ],
  security: [{ bearerAuth: [] }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: SafeUser,
      Transaction: m2s(Transaction),
      UserResponse: {
        type: "object",
        properties: {
          status: { type: "boolean" },
          data: { $ref: "#/components/schemas/User" },
          message: { type: "string" }
        }
      },
      UserArrayResponse: {
        type: "object",
        properties: {
          status: { type: "boolean" },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/User" }
          },
          message: { type: "string" }
        }
      },
      TransactionResponse: {
        type: "object",
        properties: {
          status: { type: "boolean" },
          data: { $ref: "#/components/schemas/Transaction" },
          message: { type: "string" }
        }
      },
      TransactionArrayResponse: {
        type: "object",
        properties: {
          status: { type: "boolean" },
          data: {
            type: "array",
            items: { $ref: "#/components/schemas/Transaction" }
          }
        }
      },
      SummaryResponse: {
        type: "object",
        properties: {
          status: { type: "boolean" },
          data: {
            type: "object",
            properties: {
              income: { type: "number" },
              expense: { type: "number" },
              transactionCount: { type: "number" },
              balance: { type: "number" }
            }
          }
        }
      },
      AuthLoginRequest: {
        type: "object",
        properties: {
          username: { type: "string" },
          password: { type: "string" }
        },
        required: ["username", "password"]
      },
      AuthLoginResponse: {
        type: "object",
        properties: {
          status: { type: "boolean" },
          data: {
            type: "object",
            properties: {
              user: { $ref: "#/components/schemas/User" },
              token: { type: "string" }
            }
          },
          message: { type: "string" }
        }
      },
      AuthRegisterRequest: {
        type: "object",
        properties: {
          username: { type: "string" },
          password: { type: "string" },
          firstname: { type: "string" },
          lastname: { type: "string" },
          email: { type: "string" },
          phone: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: { type: "string" },
                number: { type: "string" }
              }
            }
          }
        },
        required: ["username", "password", "firstname", "lastname", "email"]
      },
      ErrorResponse: {
        type: "object",
        properties: {
          status: { type: "boolean", example: false },
          data: { type: "null", example: null },
          message: { type: "string", example: "User not found" }
        }
      }
    }
  },
  paths: {
    // Auth
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user and get JWT token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthLoginRequest" }
            }
          }
        },
        responses: {
          200: { description: "Login successful", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthLoginResponse" } } } },
          400: { description: "Missing credentials" },
          401: { description: "Invalid credentials" },
          404: { description: "User not found" }
        }
      }
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register new user",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/AuthRegisterRequest" } } }
        },
        responses: {
          201: { description: "User registered", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthLoginResponse" } } } },
          409: { description: "User already exists" },
          400: { description: "Validation error" }
        }
      }
    },
    "/api/auth/google": {
      get: {
        tags: ["Auth"],
        summary: "Start Google OAuth (redirect to Google)",
        responses: { 302: { description: "Redirect to Google OAuth" } }
      }
    },
    "/api/auth/google/callback": {
      get: {
        tags: ["Auth"],
        summary: "Google OAuth callback",
        parameters: [{ name: "code", in: "query", required: true, schema: { type: "string" } }],
        responses: {
          302: { description: "Redirects back to frontend with token" },
          400: { description: "Missing code" }
        }
      }
    },

    // Users
    "/api/user": {
      get: {
        tags: ["Users"],
        summary: "Get all users",
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "List of users" }, 401: { description: "Unauthorized" } }
      },
      post: {
        tags: ["Users"],
        summary: "Create user (admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/AuthRegisterRequest" } } } },
        responses: { 201: { description: "User created" }, 400: { description: "Validation error" }, 403: { description: "Forbidden" } }
      }
    },
    "/api/user/{userId}": {
      get: {
        tags: ["Users"],
        summary: "Get user by ID",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "userId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "User details" }, 404: { description: "Not found" } }
      },
      patch: {
        tags: ["Users"],
        summary: "Update user (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "userId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/AuthRegisterRequest" } } } },
        responses: { 200: { description: "User updated" }, 404: { description: "Not found" } }
      },
      delete: {
        tags: ["Users"],
        summary: "Delete user (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "userId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "User deleted" }, 404: { description: "Not found" } }
      }
    },

        // Transactions
    "/api/transactions": {
      get: {
        tags: ["Transactions"],
        summary: "Get all transactions for the logged-in user",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "List of transactions",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TransactionArrayResponse" }
              }
            }
          }
        }
      },
      post: {
        tags: ["Transactions"],
        summary: "Add a new transaction for the logged-in user",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  amount: { type: "number" },
                  type: { type: "string", enum: ["income", "expense"] },
                  category: { type: "string" },
                  description: { type: "string" },
                  date: { type: "string", format: "date-time" }
                },
                required: ["amount", "type", "category"]
              }
            }
          }
        },
        responses: {
          201: {
            description: "Transaction created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TransactionResponse" }
              }
            }
          },
          400: {
            description: "Validation error",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
          }
        }
      }
    },
    "/api/transactions/{transactionId}": {
      patch: {
        tags: ["Transactions"],
        summary: "Update a transaction",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "transactionId", in: "path", required: true, schema: { type: "string" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  amount: { type: "number" },
                  type: { type: "string", enum: ["income", "expense"] },
                  category: { type: "string" },
                  description: { type: "string" },
                  date: { type: "string", format: "date-time" }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "Transaction updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TransactionResponse" }
              }
            }
          },
          404: {
            description: "Transaction not found",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
          }
        }
      },
      delete: {
        tags: ["Transactions"],
        summary: "Delete a transaction",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "transactionId", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          200: {
            description: "Transaction deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "boolean" },
                    message: { type: "string" }
                  }
                }
              }
            }
          },
          404: {
            description: "Transaction not found",
            content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } }
          }
        }
      }
    },
    "/api/transactions/summary": {
      get: {
        tags: ["Transactions"],
        summary: "Get financial summary for the logged-in user",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Summary returned",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SummaryResponse" }
              }
            }
          }
        }
      }
    }
  }
};
