import React, { useState } from 'react'

// Course Quiz Data Map
const quizData = {
  'csharp': [
    {
      q: 'Which of the following describes where value types and reference types are typically stored in memory?',
      options: [
        'Value types are on the Heap; Reference types are on the Stack.',
        'Value types are on the Stack; Reference types are on the Heap.',
        'Both value types and reference types are stored entirely on the Stack.',
        'Value types are stored in registers; Reference types are stored in virtual memory.'
      ],
      correct: 1,
      explanation: 'In C#, value types (like int, struct, bool) are stored on the Stack, while reference types (like class, interface, string) are allocated on the Heap with their reference pointers stored on the Stack.'
    },
    {
      q: 'What is Boxing in C#?',
      options: [
        'Converting a reference type to a value type.',
        'Packaging a project into a zip file for deployment.',
        'Converting a value type to a reference type (object).',
        'Casting a float to an integer.'
      ],
      correct: 2,
      explanation: 'Boxing is the process of converting a value type to the type object or to any interface type implemented by this value type. Unboxing is the reverse.'
    },
    {
      q: 'Which C# keyword is used to define a variable whose type is resolved dynamically at runtime rather than compile-time?',
      options: [
        'var',
        'dynamic',
        'object',
        'readonly'
      ],
      correct: 1,
      explanation: 'The dynamic keyword specifies that operations on the variable bypass compile-time type checking. Instead, they are resolved dynamically at runtime.'
    }
  ],
  'design-patterns': [
    {
      q: 'Which GoF design pattern category does the Factory Method pattern belong to?',
      options: [
        'Behavioral Patterns',
        'Structural Patterns',
        'Creational Patterns',
        'Concurrency Patterns'
      ],
      correct: 2,
      explanation: 'Factory Method belongs to Creational patterns, which deal with object creation mechanisms, trying to create objects in a manner suitable to the situation.'
    },
    {
      q: 'Which design pattern is used to join two incompatible interfaces so that they can work together?',
      options: [
        'Adapter Pattern',
        'Bridge Pattern',
        'Facade Pattern',
        'Proxy Pattern'
      ],
      correct: 0,
      explanation: 'The Adapter pattern converts the interface of a class into another interface that clients expect. It lets classes work together that couldn\'t otherwise because of incompatible interfaces.'
    }
  ],
  'microservices': [
    {
      q: 'What is the primary role of an API Gateway in a microservices architecture?',
      options: [
        'To host the central database shared by all microservices.',
        'To act as a single entry point that routes client requests to the appropriate downstream microservice.',
        'To compile the code for all services.',
        'To replace containerization tools like Docker.'
      ],
      correct: 1,
      explanation: 'An API Gateway sits between clients and microservices. It handles routing, aggregation, protocol translation, authentication, and load balancing.'
    },
    {
      q: 'Which of the following is commonly used for lightweight asynchronous, message-based communication between microservices?',
      options: [
        'SOAP Web Services',
        'Direct SQL queries',
        'RabbitMQ or Apache Kafka',
        'Nginx reverse proxies'
      ],
      correct: 2,
      explanation: 'Message brokers like RabbitMQ or Apache Kafka are used for asynchronous event-driven communications, decoupling microservices from synchronous dependencies.'
    }
  ],
  'aspnet-core': [
    {
      q: 'What is ASP.NET Core Middleware?',
      options: [
        'The database connection pool driver.',
        'Software components assembled into an application pipeline to handle requests and responses.',
        'A browser-side Javascript caching tool.',
        'A template engine like Razor.'
      ],
      correct: 1,
      explanation: 'Middleware is software that is assembled into an application pipeline to handle requests and responses. Each component chooses whether to pass the request to the next component in the pipeline.'
    },
    {
      q: 'In ASP.NET Core 6 and newer, which file serves as the main entry point to configure both services and the HTTP request pipeline?',
      options: [
        'Startup.cs',
        'appsettings.json',
        'Program.cs',
        'Web.config'
      ],
      correct: 2,
      explanation: 'Starting with .NET 6, ASP.NET Core uses the minimal hosting model where Startup.cs is unified into Program.cs to configure the DI container and the middleware pipeline.'
    }
  ],
  'aspnet-core-webapi': [
    {
      q: 'Which HTTP method is specifically intended to perform partial updates to an existing resource?',
      options: [
        'PUT',
        'POST',
        'PATCH',
        'DELETE'
      ],
      correct: 2,
      explanation: 'While PUT is used to replace an entire resource, PATCH is designed to apply partial modifications to a resource.'
    },
    {
      q: 'What is a major benefit of applying the [ApiController] attribute to your Web API controllers?',
      options: [
        'It automatically connects to the database.',
        'It enforces automatic model validation and returns a 400 Bad Request if validation fails.',
        'It speeds up Javascript rendering.',
        'It converts the database from SQL to NoSQL.'
      ],
      correct: 1,
      explanation: 'The [ApiController] attribute enables API-specific behaviors like automatic HTTP 400 responses on model validation errors, binding source parameter inference (e.g. [FromBody]), and multipart/form-data requirements.'
    }
  ],
  'azure': [
    {
      q: 'Which Azure service is best suited to execute serverless, event-driven code blocks without managing VMs?',
      options: [
        'Azure Virtual Machines',
        'Azure Functions',
        'Azure App Service',
        'Azure Cosmos DB'
      ],
      correct: 1,
      explanation: 'Azure Functions is a serverless compute service that enables you to run event-triggered code without having to explicitly provision or manage infrastructure.'
    },
    {
      q: 'What type of database service is Azure Cosmos DB?',
      options: [
        'A strictly relational MS SQL service.',
        'A legacy file-based database.',
        'A globally distributed, multi-model NoSQL database service.',
        'A memory caching broker.'
      ],
      correct: 2,
      explanation: 'Azure Cosmos DB is Microsoft\'s globally distributed, multi-model NoSQL database service supporting APIs for Document, Key-Value, Graph, and Column-family models.'
    }
  ],
  'aspnet-webapi': [
    {
      q: 'In legacy .NET Framework ASP.NET Web API 2 projects, which base class do API controllers typically inherit from?',
      options: [
        'Controller',
        'ApiController',
        'BaseController',
        'HttpController'
      ],
      correct: 1,
      explanation: 'In legacy Web API 2, API controllers inherit from System.Web.Http.ApiController. (In unified ASP.NET Core, both MVC and API controllers inherit from ControllerBase or Controller).'
    }
  ],
  'linq': [
    {
      q: 'What does "Deferred Execution" mean in the context of LINQ queries?',
      options: [
        'The query is compiled but never executed.',
        'The query definition is stored, but data evaluation is delayed until the query is actually iterated (e.g., using a foreach loop or .ToList()).',
        'The query runs on a background background thread.',
        'The query takes longer to execute due to slow database connections.'
      ],
      correct: 1,
      explanation: 'LINQ queries are not evaluated when they are declared. The execution is deferred until the data is queried, usually when calling .ToList(), .ToArray(), or entering a foreach loop.'
    },
    {
      q: 'Which LINQ operator is used to project elements into a new form or object structure?',
      options: [
        'Where',
        'Select',
        'SelectMany',
        'GroupBy'
      ],
      correct: 1,
      explanation: 'The Select operator projects each element of a sequence into a new form (often mapping to anonymous types or ViewModels).'
    }
  ],
  'ado-net': [
    {
      q: 'Which ADO.NET class provides a fast, forward-only, read-only stream of data from a SQL database?',
      options: [
        'SqlDataAdapter',
        'SqlDataReader',
        'SqlCommand',
        'DataSet'
      ],
      correct: 1,
      explanation: 'SqlDataReader reads a forward-only stream of rows from a SQL Server database, making it extremely fast and lightweight.'
    },
    {
      q: 'What is the key structural difference between a DataTable and a DataSet?',
      options: [
        'A DataTable has columns, while a DataSet only has rows.',
        'A DataSet contains multiple DataTables along with relations linking them together in memory.',
        'DataTable is for SQL Server, DataSet is for Oracle.',
        'DataTable resides in memory, DataSet resides on disk.'
      ],
      correct: 1,
      explanation: 'A DataTable represents a single in-memory table. A DataSet is an in-memory representation of a relational database, containing multiple tables, relations, and constraint rules.'
    }
  ],
  'solid-principles': [
    {
      q: 'What does the Liskov Substitution Principle (L in SOLID) state?',
      options: [
        'Classes should be open for extension but closed for modification.',
        'Objects of a superclass should be replaceable with objects of its subclasses without affecting the correctness of the program.',
        'A class should have only one reason to change.',
        'Clients should not be forced to depend on methods they do not use.'
      ],
      correct: 1,
      explanation: 'The Liskov Substitution Principle states that subclasses must be substitutable for their base classes. Subclasses should extend the behavior without altering the base contract.'
    },
    {
      q: 'What is the primary goal of the Single Responsibility Principle (S in SOLID)?',
      options: [
        'A class should only have one interface.',
        'A class should only have one instance.',
        'A class should have only one reason to change (one primary responsibility).',
        'All variables should be declared in a single file.'
      ],
      correct: 2,
      explanation: 'The Single Responsibility Principle (SRP) states that a class should have one, and only one, reason to change, keeping classes focused, cohesion high, and coupling low.'
    }
  ],
  'csharp-programs': [
    {
      q: 'In C#, what is the numerical result of the integer division `7 / 3`?',
      options: [
        '2.333',
        '2',
        '3',
        '2.5'
      ],
      correct: 1,
      explanation: 'Dividing two integers in C# performs integer division. The fractional part is truncated, leaving only the whole integer quotient: 2.'
    }
  ],
  'mssql': [
    {
      q: 'What is the primary difference between a Clustered Index and a Non-Clustered Index in SQL Server?',
      options: [
        'Clustered indexes are stored in memory; Non-clustered are stored on disk.',
        'A Clustered index physically reorganizes the storage order of the rows in the table, whereas a Non-clustered index stores references to rows.',
        'A Clustered index can only index numerical columns.',
        'There can be up to 250 Clustered indexes on a table.'
      ],
      correct: 1,
      explanation: 'A Clustered index defines the physical order in which data is sorted and stored in the table. Because data can only be physically sorted one way, there can only be one clustered index per table. Non-clustered indexes contain pointers to physical locations.'
    },
    {
      q: 'Which join type returns all records from the left table and only the matched records from the right table?',
      options: [
        'INNER JOIN',
        'RIGHT OUTER JOIN',
        'LEFT OUTER JOIN',
        'FULL OUTER JOIN'
      ],
      correct: 2,
      explanation: 'A LEFT JOIN (or LEFT OUTER JOIN) returns all rows from the left table, plus matched rows from the right table. If there is no match, NULL values are returned for the right table columns.'
    }
  ],
  'dsa': [
    {
      q: 'What is the average and worst-case time complexity of searching for an element in a Hash Map?',
      options: [
        'Average: O(log N), Worst-case: O(N)',
        'Average: O(1), Worst-case: O(N)',
        'Average: O(1), Worst-case: O(log N)',
        'Average: O(N), Worst-case: O(N^2)'
      ],
      correct: 1,
      explanation: 'A Hash Map offers O(1) average lookup time. However, in the worst case (e.g. if many hash collisions occur causing all items to fall into a single bucket), searching can degrade to O(N).'
    },
    {
      q: 'Which data structure operates on a First-In-First-Out (FIFO) basis?',
      options: [
        'Stack',
        'Queue',
        'Binary Tree',
        'Priority Queue'
      ],
      correct: 1,
      explanation: 'A Queue works on the FIFO (First-In-First-Out) principle, where the first element added is the first one removed. A Stack works on LIFO (Last-In-First-Out).'
    }
  ]
};

export default function QuizView({ courseId }) {
  const questions = quizData[courseId] || [
    {
      q: 'Which C# data type is used to store high-precision decimal numbers, commonly for financial transactions?',
      options: ['float', 'double', 'decimal', 'long'],
      correct: 2,
      explanation: 'The decimal keyword indicates a 128-bit data type. Compared to floating-point types (float and double), the decimal type has more precision and a smaller range, making it appropriate for financial and monetary calculations.'
    },
    {
      q: 'What is the primary advantage of generic classes in .NET?',
      options: [
        'They execute code faster at compile time.',
        'They provide type safety without the overhead of boxing/unboxing operations.',
        'They allow classes to bypass security permissions.',
        'They make files smaller on disk.'
      ],
      correct: 1,
      explanation: 'Generics maximize code reuse, type safety, and performance. Using generic collections avoids boxing and unboxing costs, which were major bottlenecks in .NET 1.1.'
    }
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const activeQuestion = questions[currentIdx];

  const handleSubmit = () => {
    if (selectedOpt === null) return;
    
    if (selectedOpt === activeQuestion.correct) {
      setScore(prev => prev + 1);
    }
    setShowAnswer(true);
  };

  const handleNext = () => {
    setSelectedOpt(null);
    setShowAnswer(false);
    
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setShowAnswer(false);
    setScore(0);
    setIsFinished(false);
  };

  if (isFinished) {
    const percent = Math.round((score / questions.length) * 100);
    return (
      <div className="fade-in" style={{
        padding: '3rem 2rem',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        backgroundColor: 'var(--bg-secondary)',
        textAlign: 'center',
        marginTop: '1rem'
      }}>
        <i className="fa-solid fa-trophy" style={{ fontSize: '3.5rem', color: percent >= 70 ? 'var(--warning)' : 'var(--text-tertiary)', marginBottom: '1.5rem' }}></i>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Quiz Completed!</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
          You scored <strong>{score}</strong> out of <strong>{questions.length}</strong> ({percent}%)
        </p>

        <div style={{
          display: 'inline-block',
          padding: '0.5rem 1.25rem',
          borderRadius: '50px',
          backgroundColor: percent >= 70 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
          color: percent >= 70 ? 'var(--success)' : 'var(--danger)',
          fontWeight: 700,
          marginBottom: '2rem',
          fontSize: '0.9rem'
        }}>
          {percent >= 70 ? '🎉 Congratulations! You Passed!' : '📚 Review the concepts and try again.'}
        </div>

        <div>
          <button className="nav-btn" onClick={handleRestart} style={{ margin: '0 auto' }}>
            <i className="fa-solid fa-rotate-right"></i> Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in" style={{
      padding: '2rem',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      backgroundColor: 'var(--bg-secondary)',
      marginTop: '1rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1rem',
        marginBottom: '1.5rem'
      }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-color)' }}>
          QUESTION {currentIdx + 1} OF {questions.length}
        </span>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Current Score: {score}
        </span>
      </div>

      <h3 style={{
        fontSize: '1.2rem',
        fontWeight: 700,
        color: 'var(--text-primary)',
        lineHeight: '1.5',
        marginBottom: '1.5rem'
      }}>
        {activeQuestion.q}
      </h3>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        marginBottom: '2rem'
      }}>
        {activeQuestion.options.map((opt, idx) => {
          const isSelected = selectedOpt === idx;
          const isCorrect = activeQuestion.correct === idx;
          
          let optBg = 'var(--bg-primary)';
          let optBorder = 'var(--border-color)';
          let optColor = 'var(--text-secondary)';

          if (showAnswer) {
            if (isCorrect) {
              optBg = 'rgba(16, 185, 129, 0.1)';
              optBorder = 'var(--success)';
              optColor = 'var(--success)';
            } else if (isSelected) {
              optBg = 'rgba(239, 68, 68, 0.1)';
              optBorder = 'var(--danger)';
              optColor = 'var(--danger)';
            }
          } else if (isSelected) {
            optBg = 'var(--accent-glow)';
            optBorder = 'var(--accent-color)';
            optColor = 'var(--text-primary)';
          }

          return (
            <button
              key={idx}
              disabled={showAnswer}
              onClick={() => setSelectedOpt(idx)}
              style={{
                width: '100%',
                padding: '1rem 1.25rem',
                backgroundColor: optBg,
                border: `1px solid ${optBorder}`,
                borderRadius: '8px',
                textAlign: 'left',
                color: optColor,
                fontSize: '0.95rem',
                fontWeight: isSelected || (showAnswer && isCorrect) ? 700 : 500,
                cursor: showAnswer ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
              onMouseEnter={(e) => {
                if (!showAnswer && !isSelected) {
                  e.currentTarget.style.borderColor = 'var(--text-tertiary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!showAnswer && !isSelected) {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                }
              }}
            >
              <span style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: isSelected ? 'var(--accent-color)' : 'var(--bg-tertiary)',
                color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 800,
                flexShrink: 0
              }}>
                {String.fromCharCode(65 + idx)}
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {showAnswer && (
        <div className="fade-in" style={{
          padding: '1rem 1.25rem',
          backgroundColor: 'var(--bg-tertiary)',
          borderLeft: '4px solid var(--accent-secondary)',
          borderRadius: '0 8px 8px 0',
          marginBottom: '2rem',
          fontSize: '0.92rem',
          lineHeight: '1.6',
          color: 'var(--text-secondary)'
        }}>
          <h4 style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            {selectedOpt === activeQuestion.correct ? '🎯 Correct!' : '❌ Incorrect'}
          </h4>
          <p>{activeQuestion.explanation}</p>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {!showAnswer ? (
          <button
            className="nav-btn"
            onClick={handleSubmit}
            disabled={selectedOpt === null}
            style={{
              backgroundColor: selectedOpt === null ? 'var(--bg-secondary)' : 'var(--accent-color)',
              color: selectedOpt === null ? 'var(--text-tertiary)' : '#ffffff',
              borderColor: selectedOpt === null ? 'var(--border-color)' : 'var(--accent-color)',
              cursor: selectedOpt === null ? 'not-allowed' : 'pointer'
            }}
          >
            Submit Answer <i className="fa-solid fa-paper-plane" style={{ marginLeft: '0.35rem' }}></i>
          </button>
        ) : (
          <button className="nav-btn" onClick={handleNext}>
            {currentIdx < questions.length - 1 ? 'Next Question' : 'View Results'} <i className="fa-solid fa-arrow-right" style={{ marginLeft: '0.35rem' }}></i>
          </button>
        )}
      </div>
    </div>
  )
}
