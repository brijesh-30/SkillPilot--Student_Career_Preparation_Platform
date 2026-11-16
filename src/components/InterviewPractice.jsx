import { useEffect, useState } from "react";
import {
  MessagesSquare,
  Code2,
  Database,
  Brain,
  Layers,
  Server,
  Lightbulb,
  Eye,
  EyeOff,
  CheckCircle2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Target,
  Sparkles,
  Trophy,
  Play,
  Pause,
  Timer,
  Check,
  CircleAlert,
} from "lucide-react";
import { recordActivity } from "../utils/recentActivity";

const STORAGE_KEY = "skillpilot-interview-progress";

const categories = [
  { name: "JavaScript", icon: Code2, color: "violet" },
  { name: "React", icon: Layers, color: "blue" },
  { name: "Node.js", icon: Server, color: "emerald" },
  { name: "DBMS", icon: Database, color: "amber" },
  { name: "OOP", icon: Brain, color: "rose" },
  { name: "DSA", icon: Target, color: "indigo" },
];

const questions = [
  {
    id: "js-1",
    category: "JavaScript",
    difficulty: "Beginner",
    question: "What is the difference between var, let, and const?",
    hint: "Think about scope, redeclaration, reassignment, and initialization.",
    answer:
      "var is function-scoped and can be redeclared and reassigned. let is block-scoped and can be reassigned but not redeclared in the same scope. const is block-scoped and cannot be reassigned after initialization. A const object can still have its properties changed.",
    keyPoints: ["Scope", "Redeclaration", "Reassignment"],
  },
  {
    id: "js-2",
    category: "JavaScript",
    difficulty: "Intermediate",
    question: "What is a closure in JavaScript?",
    hint: "What happens when an inner function uses variables from an outer function?",
    answer:
      "A closure is formed when a function retains access to variables from its lexical scope, even when that outer function has finished executing. Closures are useful for data privacy, callbacks, and functions that remember state.",
    keyPoints: ["Lexical scope", "Retained access", "Private state"],
  },
  {
    id: "js-3",
    category: "JavaScript",
    difficulty: "Intermediate",
    question: "What is the difference between == and ===?",
    hint: "Consider whether JavaScript converts types before comparing.",
    answer:
      "The == operator performs a comparison that may convert the operands to compatible types. The === operator compares without that type coercion, so the operands must have matching types and equal values to be strictly equal.",
    keyPoints: ["Equality", "Type coercion", "Strict comparison"],
  },
  {
    id: "js-4",
    category: "JavaScript",
    difficulty: "Intermediate",
    question: "What are promises and async/await?",
    hint: "Think about handling results from asynchronous operations.",
    answer:
      "A Promise represents the eventual success or failure of an asynchronous operation. async functions always return a Promise, and await lets code wait for a Promise to settle inside an async function. try/catch can handle rejected operations.",
    keyPoints: ["Promise states", "async", "await", "Error handling"],
  },
  {
    id: "react-1",
    category: "React",
    difficulty: "Beginner",
    question: "What is the difference between props and state?",
    hint: "Who provides props, and which values can a component update?",
    answer:
      "Props are inputs passed from a parent component and should be treated as read-only. State is data managed by a component, usually with a hook such as useState. Updating state causes React to render the component again when needed.",
    keyPoints: ["Parent inputs", "Component data", "Re-rendering"],
  },
  {
    id: "react-2",
    category: "React",
    difficulty: "Intermediate",
    question: "What is useEffect used for?",
    hint: "Think about synchronizing a component with something outside rendering.",
    answer:
      "useEffect synchronizes a component with external systems, such as subscriptions, timers, or network requests. Its dependency array controls when the effect runs, and an optional cleanup function can unsubscribe or release resources. It is not needed for every calculation or event handler.",
    keyPoints: ["Side effects", "Dependencies", "Cleanup"],
  },
  {
    id: "react-3",
    category: "React",
    difficulty: "Intermediate",
    question: "Why are keys important when rendering lists in React?",
    hint: "How does React identify an item when a list changes?",
    answer:
      "Keys help React identify which list items were added, removed, or reordered. Use a stable, unique identifier for each item. Array indexes can cause problems when list items move or are inserted or removed.",
    keyPoints: ["Unique identity", "Stable keys", "List updates"],
  },
  {
    id: "react-4",
    category: "React",
    difficulty: "Intermediate",
    question: "What is the Virtual DOM?",
    hint: "Think about React's in-memory representation of the UI.",
    answer:
      "The Virtual DOM is a common name for React's in-memory representation of UI. React uses render and reconciliation processes to determine necessary updates to the actual UI. It is not a guarantee that every React update is faster than every direct DOM operation.",
    keyPoints: ["UI representation", "Reconciliation", "DOM updates"],
  },
  {
    id: "node-1",
    category: "Node.js",
    difficulty: "Beginner",
    question: "What is Node.js?",
    hint: "Is it a programming language or a JavaScript runtime?",
    answer:
      "Node.js is a JavaScript runtime that uses the V8 engine. It lets developers run JavaScript outside a browser and provides APIs for building servers, command-line tools, and other applications.",
    keyPoints: ["JavaScript runtime", "V8 engine", "Server-side development"],
  },
  {
    id: "node-2",
    category: "Node.js",
    difficulty: "Intermediate",
    question: "What is middleware in Express.js?",
    hint: "What can execute between receiving a request and sending a response?",
    answer:
      "Middleware is a function that can access the request, response, and next function. It can run code, modify request or response objects, end the response, or pass control to the next middleware. Common uses include authentication, logging, and parsing request bodies.",
    keyPoints: ["Request", "Response", "next()", "Authentication"],
  },
  {
    id: "node-3",
    category: "Node.js",
    difficulty: "Intermediate",
    question: "What is the event loop in Node.js?",
    hint: "How can Node.js handle asynchronous work without blocking on every operation?",
    answer:
      "The event loop coordinates callbacks and other asynchronous operations. Node.js can perform non-blocking I/O while the operating system or supporting worker mechanisms handle suitable tasks. Long-running synchronous JavaScript can still block the event loop.",
    keyPoints: ["Asynchronous work", "Non-blocking I/O", "Callbacks"],
  },
  {
    id: "node-4",
    category: "Node.js",
    difficulty: "Intermediate",
    question: "What is the difference between CommonJS and ES modules?",
    hint: "Compare require/module.exports with import/export.",
    answer:
      "CommonJS commonly uses require() and module.exports. ECMAScript modules use import and export syntax and have a standardized module system. Node.js supports both, with interpretation depending on file extensions and package configuration.",
    keyPoints: ["require()", "import/export", "Module configuration"],
  },
  {
    id: "dbms-1",
    category: "DBMS",
    difficulty: "Beginner",
    question: "What is the difference between a primary key and a foreign key?",
    hint: "One identifies a row; the other establishes a relationship.",
    answer:
      "A primary key uniquely identifies each row in a table and cannot contain NULL values. A foreign key references a candidate key, usually a primary key, in the same or another table and helps maintain referential integrity.",
    keyPoints: ["Unique identity", "Relationship", "Referential integrity"],
  },
  {
    id: "dbms-2",
    category: "DBMS",
    difficulty: "Intermediate",
    question: "What are the ACID properties of a transaction?",
    hint: "The four properties describe reliable transaction processing.",
    answer:
      "Atomicity means all-or-nothing execution. Consistency preserves database rules. Isolation controls how concurrent transactions interact. Durability means committed changes persist according to the database's guarantees.",
    keyPoints: ["Atomicity", "Consistency", "Isolation", "Durability"],
  },
  {
    id: "dbms-3",
    category: "DBMS",
    difficulty: "Intermediate",
    question: "What is database normalization?",
    hint: "Think about redundant data and update anomalies.",
    answer:
      "Normalization organizes relational tables to reduce unnecessary redundancy and update anomalies. First Normal Form addresses repeating groups and atomic values, Second Normal Form addresses partial dependencies on a candidate key, and Third Normal Form addresses transitive dependencies on non-key attributes.",
    keyPoints: ["Redundancy", "Update anomalies", "1NF, 2NF, 3NF"],
  },
  {
    id: "dbms-4",
    category: "DBMS",
    difficulty: "Intermediate",
    question: "What is the difference between DELETE, TRUNCATE, and DROP?",
    hint: "Compare removing selected rows, emptying a table, and removing the table itself.",
    answer:
      "DELETE removes selected rows and can use a WHERE clause. TRUNCATE removes all rows while keeping the table structure, subject to database-specific behavior. DROP removes the table object itself. Transaction, trigger, identity-reset, and rollback behavior varies by database system.",
    keyPoints: ["Rows", "Table structure", "Database-specific behavior"],
  },
  {
    id: "oop-1",
    category: "OOP",
    difficulty: "Beginner",
    question: "What are the four pillars of object-oriented programming?",
    hint: "They include restricting access, reusing behavior, and supporting different implementations.",
    answer:
      "The four commonly taught pillars are encapsulation, abstraction, inheritance, and polymorphism. Encapsulation groups data and behavior while controlling access; abstraction exposes essential features; inheritance derives classes from other classes; polymorphism allows a common interface to have different implementations.",
    keyPoints: ["Encapsulation", "Abstraction", "Inheritance", "Polymorphism"],
  },
  {
    id: "oop-2",
    category: "OOP",
    difficulty: "Intermediate",
    question: "What is the difference between overloading and overriding?",
    hint: "One changes a method's parameter list; the other changes inherited behavior.",
    answer:
      "Overloading uses the same method name with different parameter lists in a context where the language supports it. Overriding provides a new implementation of an inherited method. The exact rules differ by language; JavaScript does not support traditional signature-based method overloading in the same way as Java or C++.",
    keyPoints: ["Method signatures", "Inheritance", "Language differences"],
  },
  {
    id: "oop-3",
    category: "OOP",
    difficulty: "Intermediate",
    question: "What is the difference between an abstract class and an interface?",
    hint: "Think about implementation, state, and contracts.",
    answer:
      "An abstract class can combine shared implementation, state, and abstract methods. An interface primarily defines a contract, though some languages allow default implementations. The supported features and inheritance rules depend on the programming language.",
    keyPoints: ["Contract", "Shared implementation", "Language rules"],
  },
  {
    id: "oop-4",
    category: "OOP",
    difficulty: "Intermediate",
    question: "What is encapsulation, and why is it useful?",
    hint: "Think about protecting internal state and exposing controlled operations.",
    answer:
      "Encapsulation groups data and related operations and controls how internal state is accessed or changed. It reduces unintended dependencies, enforces rules, and makes software easier to maintain. Access modifiers and language-specific mechanisms help implement it.",
    keyPoints: ["Controlled access", "Data integrity", "Maintainability"],
  },
  {
    id: "dsa-1",
    category: "DSA",
    difficulty: "Beginner",
    question: "What is the difference between a stack and a queue?",
    hint: "Compare which element gets removed first.",
    answer:
      "A stack follows Last In, First Out (LIFO), so the newest item is removed first. A queue follows First In, First Out (FIFO), so the oldest item is removed first. Common stack operations are push and pop; common queue operations are enqueue and dequeue.",
    keyPoints: ["LIFO", "FIFO", "Push/pop", "Enqueue/dequeue"],
  },
  {
    id: "dsa-2",
    category: "DSA",
    difficulty: "Intermediate",
    question: "What is the time complexity of binary search?",
    hint: "How much does the search space shrink after each comparison?",
    answer:
      "Binary search takes O(log n) time in the worst case on a sorted collection with efficient access to the middle element. Each comparison eliminates approximately half the remaining search space. An ordinary array's iterative binary search uses O(1) extra space.",
    keyPoints: ["Sorted data", "Halving search space", "O(log n)"],
  },
  {
    id: "dsa-3",
    category: "DSA",
    difficulty: "Intermediate",
    question: "What is the difference between an array and a linked list?",
    hint: "Compare memory layout, access by index, and insertion costs.",
    answer:
      "Arrays provide O(1) indexed access, while linked lists require traversal for indexed access. Inserting into the middle of an array often requires shifting elements; inserting into a linked list can be O(1) when the relevant node or position is already known. Actual performance depends on the operation and implementation.",
    keyPoints: ["Indexed access", "Memory layout", "Insertion costs"],
  },
  {
    id: "dsa-4",
    category: "DSA",
    difficulty: "Intermediate",
    question: "What is Big O notation?",
    hint: "It describes how an algorithm's resource requirements grow as input grows.",
    answer:
      "Big O notation describes an asymptotic upper bound on growth, commonly used for time and space complexity. Examples include O(1), O(log n), O(n), O(n log n), and O(n²). It helps compare scalability without relying only on measurements from one machine.",
    keyPoints: ["Growth rate", "Time complexity", "Space complexity"],
  },
];

const colorClasses = {
  violet:
    "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/70 dark:text-indigo-300 dark:border-indigo-800/60",
  blue: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-cyan-950/70 dark:text-cyan-300 dark:border-cyan-800/60",
  emerald:
    "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800/60",
  amber:
    "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800/60",
  rose: "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800/60",
  indigo:
    "bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-950/70 dark:text-violet-300 dark:border-violet-800/60",
};

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return saved && typeof saved === "object" && !Array.isArray(saved)
      ? saved
      : {};
  } catch {
    return {};
  }
}

export default function InterviewPractice() {
  const [activeCategory, setActiveCategory] = useState("JavaScript");
  const [progress, setProgress] = useState(loadProgress);
  const [revealedHints, setRevealedHints] = useState([]);
  const [revealedAnswers, setRevealedAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 2-minute practice timer
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  function resetTimer() {
    setIsTimerRunning(false);
    setTimerSeconds(120);
  }

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error("Unable to save interview progress:", error);
    }
  }, [progress]);

  const categoryQuestions = questions.filter(
    (question) => question.category === activeCategory,
  );

  const currentQuestion = categoryQuestions[currentIndex];
  const completedCount = categoryQuestions.filter(
    (question) => progress[question.id]?.completed,
  ).length;

  const totalCompleted = questions.filter(
    (question) => progress[question.id]?.completed,
  ).length;

  const overallProgress = Math.round(
    (totalCompleted / questions.length) * 100,
  );

  function selectCategory(category) {
    setActiveCategory(category);
    setCurrentIndex(0);
    setRevealedHints([]);
    setRevealedAnswers([]);
    resetTimer();
  }

  function nextQuestion() {
    setCurrentIndex((index) =>
      Math.min(index + 1, categoryQuestions.length - 1),
    );
    setRevealedHints([]);
    setRevealedAnswers([]);
    resetTimer();
  }

  function previousQuestion() {
    setCurrentIndex((index) => Math.max(index - 1, 0));
    setRevealedHints([]);
    setRevealedAnswers([]);
    resetTimer();
  }

  function toggleHint(questionId) {
    setRevealedHints((previous) =>
      previous.includes(questionId)
        ? previous.filter((id) => id !== questionId)
        : [...previous, questionId],
    );
  }

  function toggleAnswer(questionId) {
    setRevealedAnswers((previous) =>
      previous.includes(questionId)
        ? previous.filter((id) => id !== questionId)
        : [...previous, questionId],
    );
  }

  function rateQuestion(questionId, rating) {
    const isCompleted = rating === "mastered" || rating === "review";
    setProgress((prev) => ({
      ...prev,
      [questionId]: {
        completed: isCompleted,
        rating,
      },
    }));

    recordActivity(
      `Marked question as ${rating}: ${currentQuestion.question}`,
      "interview",
    );

    if (currentIndex < categoryQuestions.length - 1) {
      setCurrentIndex((index) => index + 1);
      setRevealedHints([]);
      setRevealedAnswers([]);
      resetTimer();
    }
  }

  function resetProgress() {
    if (
      window.confirm(
        "Reset all interview practice progress? This cannot be undone.",
      )
    ) {
      setProgress({});
      setCurrentIndex(0);
      setRevealedHints([]);
      setRevealedAnswers([]);
      resetTimer();
    }
  }

  if (!currentQuestion) {
    return null;
  }

  const hintVisible = revealedHints.includes(currentQuestion.id);
  const answerVisible = revealedAnswers.includes(currentQuestion.id);
  const currentRating = progress[currentQuestion.id]?.rating || null;

  const ActiveIcon =
    categories.find((category) => category.name === activeCategory)?.icon ||
    MessagesSquare;

  const timerMins = Math.floor(timerSeconds / 60);
  const timerSecs = String(timerSeconds % 60).padStart(2, "0");

  return (
    <div className="mx-auto max-w-7xl space-y-7">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-200">
              <Sparkles size={13} />
              INTERVIEW QUESTION SIMULATOR
            </span>

            <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">
              Practice Speaking. Explain with Confidence.
            </h2>

            <p className="mt-2 max-w-xl text-xs leading-relaxed text-slate-300 sm:text-sm">
              Use the built-in 2-minute timer to practice speaking your answer out loud,
              reveal key points and model answers, and track your retention.
            </p>
          </div>

          <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xs md:max-w-56">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/10">
                <Trophy size={20} className="text-amber-300" />
              </div>
              <div>
                <p className="text-xs text-slate-300">Mastered Questions</p>
                <p className="text-2xl font-black">
                  {totalCompleted}
                  <span className="text-xs font-medium text-slate-400">
                    {" "}/ {questions.length}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-linear-to-r from-indigo-400 to-violet-400 transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>

            <p className="mt-1.5 text-xs text-slate-300">
              {overallProgress}% overall readiness
            </p>
          </div>
        </div>
      </section>

      {/* Category selector */}
      <section>
        <div className="mb-3.5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Choose Topic Track
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select an engineering domain to practice technical interview questions.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {categories.map((category) => {
            const Icon = category.icon;
            const selected = activeCategory === category.name;
            const total = questions.filter(
              (q) => q.category === category.name,
            ).length;
            const completed = questions.filter(
              (q) => q.category === category.name && progress[q.id]?.completed,
            ).length;

            return (
              <button
                type="button"
                key={category.name}
                onClick={() => selectCategory(category.name)}
                className={`rounded-2xl border p-3.5 text-left transition-all duration-150 hover:-translate-y-0.5 ${
                  selected
                    ? "border-indigo-500 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-500/20 dark:border-indigo-500 dark:bg-indigo-950/50"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs dark:border-slate-800 dark:bg-[#0f172a] dark:hover:border-slate-700"
                }`}
              >
                <div
                  className={`mb-2.5 grid h-9 w-9 place-items-center rounded-xl border ${
                    colorClasses[category.color]
                  }`}
                >
                  <Icon size={17} />
                </div>

                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {category.name}
                </p>

                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono-code">
                  {completed}/{total} mastered
                </p>

                <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500 transition-all"
                    style={{
                      width: `${total ? (completed / total) * 100 : 0}%`,
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Practice area */}
      <section className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {/* Question Title & Speaking Timer Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                PRACTICE SESSION
              </p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {activeCategory} Questions
              </h3>
            </div>

            {/* Speaking Timer Pill */}
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-xs shadow-xs dark:border-slate-800 dark:bg-[#0f172a]">
              <Timer size={15} className="text-indigo-600 dark:text-indigo-400" />
              <span className="font-mono font-bold text-slate-800 dark:text-slate-100 font-mono-code">
                {timerMins}:{timerSecs}
              </span>
              <button
                type="button"
                onClick={() => setIsTimerRunning((prev) => !prev)}
                className="rounded p-1 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
                title={isTimerRunning ? "Pause timer" : "Start speaking practice timer"}
              >
                {isTimerRunning ? <Pause size={13} /> : <Play size={13} />}
              </button>
              <button
                type="button"
                onClick={resetTimer}
                className="rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                title="Reset timer"
              >
                <RotateCcw size={12} />
              </button>
            </div>
          </div>

          {/* Flashcard Container */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs sm:p-7 dark:border-slate-800/80 dark:bg-[#0f172a] transition-colors">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300">
                  {currentQuestion.category}
                </span>

                <span
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                    currentQuestion.difficulty === "Beginner"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300"
                      : "bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300"
                  }`}
                >
                  {currentQuestion.difficulty}
                </span>
              </div>

              {currentRating && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                    currentRating === "mastered"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60"
                      : currentRating === "review"
                        ? "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60"
                        : "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/60"
                  }`}
                >
                  {currentRating === "mastered" ? (
                    <Check size={12} />
                  ) : (
                    <CircleAlert size={12} />
                  )}
                  {currentRating === "mastered"
                    ? "Mastered"
                    : currentRating === "review"
                      ? "Review Needed"
                      : "Needs Practice"}
                </span>
              )}
            </div>

            <div className="mt-5 flex items-start gap-3.5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-sm shadow-indigo-200 dark:shadow-none">
                <ActiveIcon size={19} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 font-mono-code">
                  Question {currentIndex + 1} of {categoryQuestions.length}
                </p>

                <h4 className="mt-1.5 text-lg font-bold leading-relaxed text-slate-900 dark:text-white sm:text-xl">
                  {currentQuestion.question}
                </h4>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={() => toggleHint(currentQuestion.id)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50/70 px-4 py-2.5 text-xs font-bold text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-300 dark:hover:bg-indigo-950/80"
              >
                <Lightbulb size={15} />
                {hintVisible ? "Hide Hint" : "Reveal Hint"}
                {hintVisible ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>

              <button
                type="button"
                onClick={() => toggleAnswer(currentQuestion.id)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                {answerVisible ? <EyeOff size={15} /> : <Eye size={15} />}
                {answerVisible ? "Hide Model Answer" : "Reveal Model Answer"}
              </button>
            </div>

            {hintVisible && (
              <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50/70 p-4 text-xs dark:border-amber-900/60 dark:bg-amber-950/40">
                <p className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                  <Lightbulb size={15} />
                  Hint
                </p>
                <p className="mt-1 leading-relaxed text-amber-900 dark:text-amber-200">
                  {currentQuestion.hint}
                </p>
              </div>
            )}

            {answerVisible && (
              <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-xs sm:p-5 dark:border-emerald-900/50 dark:bg-emerald-950/30">
                <p className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 size={16} />
                  Model Answer
                </p>

                <p className="mt-2 leading-relaxed text-slate-700 dark:text-slate-200">
                  {currentQuestion.answer}
                </p>

                <div className="mt-3.5 border-t border-emerald-100 dark:border-emerald-900/50 pt-3">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
                    Key Points to Highlight
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {currentQuestion.keyPoints.map((point) => (
                      <span
                        key={point}
                        className="rounded-lg border border-emerald-200 bg-white px-2 py-1 text-[11px] font-medium text-emerald-800 dark:border-emerald-800 dark:bg-slate-800 dark:text-emerald-300"
                      >
                        {point}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Confidence Self-Rating & Navigation */}
            <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-5">
              <div className="mb-4">
                <p className="mb-2 text-xs font-bold text-slate-700 dark:text-slate-300 text-center sm:text-left">
                  How confidently did you explain this concept?
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => rateQuestion(currentQuestion.id, "mastered")}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border p-2 text-xs font-bold transition ${
                      currentRating === "mastered"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20 dark:border-emerald-500 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : "border-slate-200 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-emerald-600"
                    }`}
                  >
                    <Check size={14} className="text-emerald-600 dark:text-emerald-400" />
                    Mastered
                  </button>

                  <button
                    type="button"
                    onClick={() => rateQuestion(currentQuestion.id, "review")}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border p-2 text-xs font-bold transition ${
                      currentRating === "review"
                        ? "border-amber-500 bg-amber-50 text-amber-800 ring-2 ring-amber-500/20 dark:border-amber-500 dark:bg-amber-950/60 dark:text-amber-300"
                        : "border-slate-200 bg-white text-slate-700 hover:border-amber-300 hover:bg-amber-50/40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-amber-600"
                    }`}
                  >
                    <CircleAlert size={14} className="text-amber-600 dark:text-amber-400" />
                    Review Soon
                  </button>

                  <button
                    type="button"
                    onClick={() => rateQuestion(currentQuestion.id, "hard")}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border p-2 text-xs font-bold transition ${
                      currentRating === "hard"
                        ? "border-rose-500 bg-rose-50 text-rose-800 ring-2 ring-rose-500/20 dark:border-rose-500 dark:bg-rose-950/60 dark:text-rose-300"
                        : "border-slate-200 bg-white text-slate-700 hover:border-rose-300 hover:bg-rose-50/40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-rose-600"
                    }`}
                  >
                    <RotateCcw size={13} className="text-rose-600 dark:text-rose-400" />
                    Needs Practice
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 text-xs">
                <button
                  type="button"
                  onClick={previousQuestion}
                  disabled={currentIndex === 0}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <ChevronLeft size={15} /> Previous
                </button>

                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono-code">
                  Question {currentIndex + 1} of {categoryQuestions.length}
                </span>

                <button
                  type="button"
                  onClick={nextQuestion}
                  disabled={currentIndex === categoryQuestions.length - 1}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Next <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <aside className="space-y-4">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs dark:border-slate-800/80 dark:bg-[#0f172a] transition-colors">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Session Overview</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Mastery in {activeCategory}
            </p>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Mastered Questions</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono-code">
                  {completedCount} / {categoryQuestions.length}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-linear-to-r from-indigo-500 to-violet-600 transition-all duration-500"
                  style={{
                    width: `${
                      categoryQuestions.length
                        ? (completedCount / categoryQuestions.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 p-2.5">
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold">Done</p>
                  <p className="mt-0.5 text-xl font-black text-emerald-800 dark:text-emerald-300 font-mono-code">
                    {completedCount}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Pending</p>
                  <p className="mt-0.5 text-xl font-black text-slate-800 dark:text-slate-200 font-mono-code">
                    {categoryQuestions.length - completedCount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-indigo-100 bg-linear-to-br from-indigo-50/70 to-violet-50/70 p-4 text-xs dark:border-indigo-900/50 dark:from-indigo-950/40 dark:to-violet-950/40">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs">
              <Brain size={17} />
            </div>

            <h4 className="mt-2.5 font-bold text-slate-900 dark:text-white">
              Interview Best Practice
            </h4>
            <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-300">
              In technical rounds, start by defining the concept in 1 sentence, give
              a 1-line real-world code example, and mention 1 edge-case or performance tip.
            </p>
          </div>

          <button
            type="button"
            onClick={resetProgress}
            className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-800 dark:bg-[#0f172a] dark:text-slate-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-300 transition-colors"
          >
            Reset Interview Progress
          </button>
        </aside>
      </section>
    </div>
  );
}
