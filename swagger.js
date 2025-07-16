const m2s = require('mongoose-to-swagger');
const User = require('./models/user.model');
const Transaction = require('./models/transaction.model');

exports.options = {
  openapi: "3.1.0",
  info: {
    version: "1.0.0",
    title: "DollaBillz Transactions API",
    description: "API for managing users and their financial transactions.",
    contact: {
      name: "API Support",
      url: "https://aria.gr",
      email: "support@example.com"
    }
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local Server"
    },
    {
      url: "http://www.backend.aria.gr",
      description: "Testing server"
    }
  ],
  tags: [
    { name: "Users", description: "User management" },
    { name: "Transactions", description: "User transactions" },
    { name: "Auth", description: "Authentication" }
  ],
  components: {
    schemas: {
      User: m2s(User),
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
          error: { type: "string" }
        }
      }
    }
  },
  paths: {
    // Auth
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthLoginRequest" }
            }
          }
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthLoginResponse" }
              }
            }
          },
          400: { description: "Missing credentials", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          401: { description: "Invalid credentials", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          404: { description: "User not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
        }
      }
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthRegisterRequest" }
            }
          }
        },
        responses: {
          201: {
            description: "User registered",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthLoginResponse" }
              }
            }
          },
          400: { description: "User already exists or validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
        }
      }
    },

    // Users
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "Get all users",
        responses: {
          200: {
            description: "List of users",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserArrayResponse" }
              }
            }
          }
        }
      },
      post: {
        tags: ["Users"],
        summary: "Create user (admin only)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthRegisterRequest" }
            }
          }
        },
        responses: {
          200: {
            description: "User created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserResponse" }
              }
            }
          },
          400: { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
        }
      }
    },
    "/api/users/{userId}": {
      get: {
        tags: ["Users"],
        summary: "Get user by ID",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: {
            description: "User details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserResponse" }
              }
            }
          },
          404: { description: "User not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
        }
      },
      patch: {
        tags: ["Users"],
        summary: "Update user (admin only)",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
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
                  },
                  password: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: "User updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserResponse" }
              }
            }
          },
          404: { description: "User not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
        }
      },
      delete: {
        tags: ["Users"],
        summary: "Delete user (admin only)",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          200: {
            description: "User and associated transactions deleted",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserResponse" }
              }
            }
          },
          404: { description: "User not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
        }
      }
    },

    // Transactions
    "/api/users/{userId}/transactions": {
      get: {
        tags: ["Transactions"],
        summary: "Get all transactions for a user",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
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
        summary: "Add a new transaction for a user",
        parameters: [
          {
            name: "userId",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
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
          400: { description: "Validation error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
        }
      }
    },
    "/api/users/{userId}/transactions/{transactionId}": {
      patch: {
        tags: ["Transactions"],
        summary: "Update a transaction",
        parameters: [
          { name: "userId", in: "path", required: true, schema: { type: "string" } },
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
          404: { description: "Transaction not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
        }
      },
      delete: {
        tags: ["Transactions"],
        summary: "Delete a transaction",
        parameters: [
          { name: "userId", in: "path", required: true, schema: { type: "string" } },
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
          404: { description: "Transaction not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
        }
      }
    },
    "/api/users/{userId}/transactions/summary": {
      get: {
        tags: ["Transactions"],
        summary: "Get financial summary for a user",
        parameters: [
          { name: "userId", in: "path", required: true, schema: { type: "string" } }
        ],
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
}