export type QuizQuestion = {
  id: string;
  text: string;
  options: string[];
  /** Index into `options` of the correct answer. */
  correctIndex: number;
};

export type QuizCategory = {
  id: string;
  order: number;
  title: string;
  recordedWalkthroughUrl: string;
  trainingSlidesUrl: string;
};

export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export type QuizModule = {
  id: string;
  categoryId: string;
  categoryOrder: number;
  title: string;
  difficulty: Difficulty;
  questions: QuizQuestion[];
};

const PASS_THRESHOLD = 0.8;
const MAX_ATTEMPTS = 3;

const SHARED_TRAINING_SLIDES_URL =
  "https://coparto365.sharepoint.com/:b:/s/all-it/IQA55tYsJykaR5JQR3zqo9F6ATkpOChM814g8MU1gE5gaTE?e=KiFL8I";

export const quizCategories: QuizCategory[] = [
  {
    id: "user-101",
    order: 1,
    title: "User 101",
    recordedWalkthroughUrl: "https://www.loom.com/share/2148c1dee768411f9f409e928b4dd856",
    trainingSlidesUrl:
      "https://coparto365.sharepoint.com/:b:/s/all-it/IQDaNUxRMrN-QJLYuqCooGuLAe2ea-lCBpHdaFwpel88cdk?e=1PbQsM",
  },
  {
    id: "permissions-control",
    order: 2,
    title: "Permissions & Control",
    recordedWalkthroughUrl: "https://www.loom.com/share/62ad724712db4669ab3c72b3ffa40d02",
    trainingSlidesUrl: SHARED_TRAINING_SLIDES_URL,
  },
  {
    id: "developer-101",
    order: 3,
    title: "Developer 101",
    recordedWalkthroughUrl: "https://www.loom.com/share/94c3051a0d754677a7ac5412648ea3b4",
    trainingSlidesUrl: SHARED_TRAINING_SLIDES_URL,
  },
  {
    id: "embedded-analytics",
    order: 4,
    title: "Embedded Analytics",
    recordedWalkthroughUrl: "https://www.loom.com/share/42b67e17c95348e4be750f1de5245c30",
    trainingSlidesUrl: SHARED_TRAINING_SLIDES_URL,
  },
  {
    id: "ai-modes-optimization",
    order: 5,
    title: "AI Modes & Optimization",
    recordedWalkthroughUrl:
      "https://www.loom.com/share/fbaca752f5124898954115d852386f10?sid=d595bd00-cc48-45b4-8f1f-c5431d0481c4",
    trainingSlidesUrl: SHARED_TRAINING_SLIDES_URL,
  },
];

export const quizModules: QuizModule[] = [
  {
    id: "module-1",
    categoryId: "user-101",
    categoryOrder: 1,
    title: "Platform Fundamentals & Navigation",
    difficulty: "Beginner",
    questions: [
      {
        id: "m1-q1",
        text: "What are the two primary content types you build in Omni?",
        options: [
          "Reports and Charts",
          "Workbooks and Dashboards",
          "Models and Views",
          "Queries and Forms",
        ],
        correctIndex: 1,
      },
      {
        id: "m1-q2",
        text: "Which layer of Omni's model mirrors your raw database structure?",
        options: [
          "Workbook Model",
          "Shared Model",
          "Schema Model",
          "Topic Model",
        ],
        correctIndex: 2,
      },
      {
        id: "m1-q3",
        text: "True/False: A dashboard tile can be built directly from a saved workbook query.",
        options: ["True", "False"],
        correctIndex: 0,
      },
      {
        id: "m1-q4",
        text: "Where do you go to see all dashboards/workbooks you have access to?",
        options: [
          "Admin panel",
          "Content/Browse area",
          "Connections page",
          "Model IDE",
        ],
        correctIndex: 1,
      },
      {
        id: "m1-q5",
        text: "What's the fastest way to ask a business question in plain English inside Omni?",
        options: [
          "Write raw SQL",
          "Ask Blobby",
          "Open the Admin panel",
          "Email the data team",
        ],
        correctIndex: 1,
      },
      {
        id: "m1-q6",
        text: "True/False: Every Omni user sees the same navigation regardless of role.",
        options: ["True", "False"],
        correctIndex: 1,
      },
      {
        id: "m1-q7",
        text: "What is a 'tile'?",
        options: [
          "A user role",
          "A single visualization/element on a dashboard",
          "A database table",
          "A git branch",
        ],
        correctIndex: 1,
      },
      {
        id: "m1-q8",
        text: "Which of these is NOT a core Omni content type?",
        options: ["Workbook", "Dashboard", "Topic", "Spreadsheet macro"],
        correctIndex: 3,
      },
    ],
  },
  {
    id: "module-2",
    categoryId: "developer-101",
    categoryOrder: 1,
    title: "Connecting Data & the Data Model",
    difficulty: "Intermediate",
    questions: [
      {
        id: "m2-q1",
        text: "What are Omni's three modeling layers, in order from most raw to most flexible?",
        options: [
          "Workbook → Shared → Schema",
          "Schema → Shared → Workbook",
          "Shared → Schema → Workbook",
          "Topic → Schema → Shared",
        ],
        correctIndex: 1,
      },
      {
        id: "m2-q2",
        text: "Which layer should contain your organization's official, governed metric definitions?",
        options: [
          "Schema Model",
          "Shared Model",
          "Workbook Model",
          "None — metrics live in dashboards",
        ],
        correctIndex: 1,
      },
      {
        id: "m2-q3",
        text: "True/False: Changes in a Workbook Model automatically change the Shared Model.",
        options: ["True", "False"],
        correctIndex: 1,
      },
      {
        id: "m2-q4",
        text: "What triggers a schema refresh?",
        options: [
          "Only manual admin click",
          "On-click, schedule, or API call",
          "Only a git merge",
          "It happens automatically every query",
        ],
        correctIndex: 1,
      },
      {
        id: "m2-q5",
        text: "Which of these is a supported native warehouse connection?",
        options: ["MongoDB", "Snowflake", "Redis", "Kafka"],
        correctIndex: 1,
      },
      {
        id: "m2-q6",
        text: "True/False: Omni can join data across two different warehouses in a single query without ETL.",
        options: ["True", "False"],
        correctIndex: 0,
      },
      {
        id: "m2-q7",
        text: "Who typically governs the Shared Model in a distributed org?",
        options: [
          "Any workbook editor",
          "The core data team",
          "External auditors",
          "Nobody — it's auto-generated",
        ],
        correctIndex: 1,
      },
      {
        id: "m2-q8",
        text: "What does OAuth delegation to the warehouse trade off?",
        options: [
          "Nothing, it's strictly better",
          "It bypasses the shared cache",
          "It disables Row-Level Security entirely",
          "It requires no user attributes",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "module-3",
    categoryId: "user-101",
    categoryOrder: 2,
    title: "Workbooks & Querying Basics",
    difficulty: "Beginner",
    questions: [
      {
        id: "m3-q1",
        text: "What is the primary purpose of a workbook?",
        options: [
          "Store user passwords",
          "Build and save queries/analysis",
          "Manage git branches",
          "Configure SSO",
        ],
        correctIndex: 1,
      },
      {
        id: "m3-q2",
        text: "True/False: You must know SQL to query data in Omni.",
        options: ["True", "False"],
        correctIndex: 1,
      },
      {
        id: "m3-q3",
        text: "What connects two tables together in a query?",
        options: ["A filter", "A join", "A tile", "A branch"],
        correctIndex: 1,
      },
      {
        id: "m3-q4",
        text: "Which feature lets you reuse a single filter control across multiple tiles?",
        options: [
          "Access grant",
          "Templated filter",
          "Connection role",
          "Schema refresh",
        ],
        correctIndex: 1,
      },
      {
        id: "m3-q5",
        text: "True/False: A saved query in a workbook can directly become a dashboard tile.",
        options: ["True", "False"],
        correctIndex: 0,
      },
      {
        id: "m3-q6",
        text: "What is the benefit of Excel-style formulas in Omni?",
        options: [
          "They replace SQL entirely for all users",
          "Familiar syntax for spreadsheet-comfortable users doing calculations",
          "They configure git integration",
          "They set user roles",
        ],
        correctIndex: 1,
      },
      {
        id: "m3-q7",
        text: "Which of these is NOT typically part of building a query?",
        options: [
          "Selecting fields",
          "Applying filters",
          "Choosing a visualization",
          "Issuing a pull request",
        ],
        correctIndex: 3,
      },
      {
        id: "m3-q8",
        text: "True/False: You can ask Blobby to refine a query result conversationally.",
        options: ["True", "False"],
        correctIndex: 0,
      },
    ],
  },
  {
    id: "module-4",
    categoryId: "user-101",
    categoryOrder: 3,
    title: "Visualizations & Charts",
    difficulty: "Beginner",
    questions: [
      {
        id: "m4-q1",
        text: "Which chart type is best for showing a trend over time?",
        options: ["Pie chart", "Line/area chart", "Single KPI card", "Table"],
        correctIndex: 1,
      },
      {
        id: "m4-q2",
        text: "What should you check before publishing a chart to a dashboard?",
        options: [
          "Nothing, publish immediately",
          "That it reads clearly and the data is correct",
          "That it uses only red and green",
          "That it has a git commit",
        ],
        correctIndex: 1,
      },
      {
        id: "m4-q3",
        text: "True/False: A KPI/summary tile is best for showing multi-dimensional breakdowns.",
        options: ["True", "False"],
        correctIndex: 1,
      },
      {
        id: "m4-q4",
        text: "What is a common risk of over-decorating a chart?",
        options: [
          "Improved clarity",
          "Obscuring the actual data/insight",
          "Faster load time",
          "Better accessibility",
        ],
        correctIndex: 1,
      },
      {
        id: "m4-q5",
        text: "Which visualization is typically best for precise row-level detail?",
        options: ["Table", "Pie chart", "Gauge", "Word cloud"],
        correctIndex: 0,
      },
      {
        id: "m4-q6",
        text: "True/False: Color should be used consistently across related tiles on a dashboard.",
        options: ["True", "False"],
        correctIndex: 0,
      },
      {
        id: "m4-q7",
        text: "What does an AI Summary tile do?",
        options: [
          "Deletes old dashboards",
          "Auto-generates a written explanation of the data",
          "Manages user roles",
          "Creates a git branch",
        ],
        correctIndex: 1,
      },
      {
        id: "m4-q8",
        text: "True/False: You should always default to the most visually complex chart type available.",
        options: ["True", "False"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "module-5",
    categoryId: "user-101",
    categoryOrder: 4,
    title: "Dashboards & Sharing Basics",
    difficulty: "Beginner",
    questions: [
      {
        id: "m5-q1",
        text: "What is the minimum step before a dashboard viewer can see your changes?",
        options: [
          "Nothing, changes are always live",
          "Publishing the draft",
          "Deleting the workbook",
          "Creating a new connection",
        ],
        correctIndex: 1,
      },
      {
        id: "m5-q2",
        text: "True/False: Sharing a dashboard as 'Viewer' allows the recipient to edit tiles.",
        options: ["True", "False"],
        correctIndex: 1,
      },
      {
        id: "m5-q3",
        text: "What determines who can open a shared dashboard?",
        options: [
          "The dashboard's color theme",
          "Content permissions and the recipient's connection role",
          "The number of tiles",
          "The dashboard's file size",
        ],
        correctIndex: 1,
      },
      {
        id: "m5-q4",
        text: "What is AccessBoost used for?",
        options: [
          "Increasing chart resolution",
          "Letting viewers see content they couldn't query directly themselves",
          "Speeding up git merges",
          "Changing font size",
        ],
        correctIndex: 1,
      },
      {
        id: "m5-q5",
        text: "True/False: You should review AccessBoost usage carefully on embedded dashboards.",
        options: ["True", "False"],
        correctIndex: 0,
      },
      {
        id: "m5-q6",
        text: "Which of these is a valid way to distribute a dashboard?",
        options: [
          "Direct link/sharing",
          "Scheduled email/export",
          "Embedding",
          "All of the above",
        ],
        correctIndex: 3,
      },
      {
        id: "m5-q7",
        text: "What happens to a dashboard's version history when you make changes?",
        options: [
          "It's discarded",
          "It's preserved so you can roll back",
          "It's emailed to admins",
          "It's deleted after 24 hours",
        ],
        correctIndex: 1,
      },
      {
        id: "m5-q8",
        text: "True/False: Folder-level permissions can control who can even see a dashboard exists.",
        options: ["True", "False"],
        correctIndex: 0,
      },
    ],
  },
  {
    id: "module-6",
    categoryId: "developer-101",
    categoryOrder: 2,
    title: "Advanced Modeling",
    difficulty: "Advanced",
    questions: [
      {
        id: "m6-q1",
        text: "What syntax engine does Omni use to parameterize SQL with dynamic values?",
        options: ["Jinja", "Mustache", "Liquid", "Handlebars-SQL"],
        correctIndex: 2,
      },
      {
        id: "m6-q2",
        text: "True/False: Templated filters are a security boundary.",
        options: ["True", "False"],
        correctIndex: 1,
      },
      {
        id: "m6-q3",
        text: "What does `default_filter` do on a templated filter field?",
        options: [
          "Deletes the field",
          "Auto-populates a starting filter value",
          "Grants admin access",
          "Creates a git branch",
        ],
        correctIndex: 1,
      },
      {
        id: "m6-q4",
        text: "What is a calculated field?",
        options: [
          "A raw database column only",
          "A custom field derived from other fields/logic",
          "A user role",
          "A git commit message",
        ],
        correctIndex: 1,
      },
      {
        id: "m6-q5",
        text: "True/False: A join defines how two tables relate for querying purposes.",
        options: ["True", "False"],
        correctIndex: 0,
      },
      {
        id: "m6-q6",
        text: "Where should curated, reusable filters be defined for consistency?",
        options: [
          "In every individual dashboard separately",
          "In the model YAML, so they're reusable across content",
          "In a Slack message",
          "In the browser cache",
        ],
        correctIndex: 1,
      },
      {
        id: "m6-q7",
        text: "What does `filter_single_select_only` control?",
        options: [
          "Whether the filter allows only one selected value",
          "The color of the filter",
          "Git branch naming",
          "User role assignment",
        ],
        correctIndex: 0,
      },
      {
        id: "m6-q8",
        text: "True/False: Advanced modeling changes should go through the same review process as basic ones.",
        options: ["True", "False"],
        correctIndex: 0,
      },
    ],
  },
  {
    id: "module-7",
    categoryId: "ai-modes-optimization",
    categoryOrder: 1,
    title: "AI & Blobby",
    difficulty: "Intermediate",
    questions: [
      {
        id: "m7-q1",
        text: "What must exist before Blobby can answer a natural-language question reliably?",
        options: [
          "A PDF export",
          "A governed Topic",
          "A git branch",
          "An AccessBoost grant",
        ],
        correctIndex: 1,
      },
      {
        id: "m7-q2",
        text: "Why do Topics matter for AI reliability specifically?",
        options: [
          "They make dashboards load faster",
          "They let admins control context, behavior, and permissions per topic",
          "They automatically translate languages",
          "They replace the need for user roles",
        ],
        correctIndex: 1,
      },
      {
        id: "m7-q3",
        text: "What does the AI formula generator produce?",
        options: [
          "SQL only",
          "Excel-style formulas for calculated columns",
          "New user roles",
          "Git commits",
        ],
        correctIndex: 1,
      },
      {
        id: "m7-q4",
        text: "What's the correct order of operations when Blobby builds a dashboard from a description?",
        options: [
          "Publish → Generate → Describe",
          "Describe → Generate → Review/Refine → Publish",
          "Generate → Delete → Republish",
          "Review → Describe → Auto-publish",
        ],
        correctIndex: 1,
      },
      {
        id: "m7-q5",
        text: "True/False: Blobby can assist with building/updating Topics directly in the modeling IDE.",
        options: ["True", "False"],
        correctIndex: 0,
      },
      {
        id: "m7-q6",
        text: "What does an AI Summary tile add to a dashboard?",
        options: [
          "A new user role",
          "A written, auto-generated explanation of the data",
          "A git pull request",
          "A row-level security filter",
        ],
        correctIndex: 1,
      },
      {
        id: "m7-q7",
        text: "When should you use SQL generation instead of a natural-language question through a Topic?",
        options: [
          "Never, natural language always suffices",
          "When you need deep/custom query logic below the topic layer",
          "Only for dashboard titles",
          "Only when Blobby is offline",
        ],
        correctIndex: 1,
      },
      {
        id: "m7-q8",
        text: "True/False: Refining a Blobby answer conversationally requires rebuilding the query from scratch.",
        options: ["True", "False"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "module-8",
    categoryId: "permissions-control",
    categoryOrder: 1,
    title: "Security & Governance",
    difficulty: "Advanced",
    questions: [
      {
        id: "m8-q1",
        text: "What do Row-Level Security access filters control?",
        options: [
          "Which fields are visible",
          "Which rows a query returns",
          "Which dashboards exist",
          "Which git branch is active",
        ],
        correctIndex: 1,
      },
      {
        id: "m8-q2",
        text: "What should the default value of a user attribute be, for fail-closed security?",
        options: ["Blank", "Admin", "All values", "The most common value"],
        correctIndex: 0,
      },
      {
        id: "m8-q3",
        text: "What is the difference between Row-Level Security and Column-Level Security?",
        options: [
          "They are the same thing",
          "RLS filters rows; CLS hides entire fields/topics",
          "RLS is for admins only; CLS is for everyone",
          "CLS filters rows; RLS hides fields",
        ],
        correctIndex: 1,
      },
      {
        id: "m8-q4",
        text: "Which connection role allows editing the data model?",
        options: ["Viewer", "Restricted Querier", "Modeler", "No Access"],
        correctIndex: 2,
      },
      {
        id: "m8-q5",
        text: "What does 'View as' let an admin do?",
        options: [
          "Permanently change their own role",
          "Preview a dashboard through another user's attributes",
          "Delete another user's account",
          "Bypass git review",
        ],
        correctIndex: 1,
      },
      {
        id: "m8-q6",
        text: "True/False: Admins can bypass row-level access filters entirely.",
        options: ["True", "False"],
        correctIndex: 1,
      },
      {
        id: "m8-q7",
        text: "What governs who can view, edit, or manage a specific dashboard?",
        options: [
          "Connection role alone",
          "Content permissions",
          "The dashboard's color theme",
          "The workbook's file size",
        ],
        correctIndex: 1,
      },
      {
        id: "m8-q8",
        text: "Why should AccessBoost be reviewed carefully on embedded dashboards?",
        options: [
          "It slows down queries",
          "It can expose data to viewers who couldn't otherwise query it",
          "It disables all charts",
          "It requires a new git repo",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "module-9",
    categoryId: "embedded-analytics",
    categoryOrder: 1,
    title: "Embedding & Distribution",
    difficulty: "Intermediate",
    questions: [
      {
        id: "m9-q1",
        text: "What is embedding used for?",
        options: [
          "Deleting dashboards",
          "Displaying Omni content inside another application",
          "Creating git branches",
          "Assigning user roles",
        ],
        correctIndex: 1,
      },
      {
        id: "m9-q2",
        text: "True/False: Scheduled exports can deliver a dashboard via email automatically.",
        options: ["True", "False"],
        correctIndex: 0,
      },
      {
        id: "m9-q3",
        text: "Who typically consumes embedded analytics?",
        options: [
          "Only internal admins",
          "External customers or partners via a host application",
          "Only the data modeling team",
          "Nobody, it's unused",
        ],
        correctIndex: 1,
      },
      {
        id: "m9-q4",
        text: "What must you review carefully when embedding dashboards that use AccessBoost?",
        options: [
          "Font choice",
          "Whether it over-exposes data to embedded viewers",
          "The dashboard's title length",
          "Git commit history",
        ],
        correctIndex: 1,
      },
      {
        id: "m9-q5",
        text: "True/False: Embedded content always inherits the exact same permissions as the internal Omni instance.",
        options: ["True", "False"],
        correctIndex: 1,
      },
      {
        id: "m9-q6",
        text: "What format(s) can scheduled dashboard deliveries typically use?",
        options: [
          "PDF/PNG/email only, no other options",
          "Various export formats like PDF and image, depending on configuration",
          "Only raw CSV",
          "Only live links, no static exports",
        ],
        correctIndex: 1,
      },
      {
        id: "m9-q7",
        text: "Why might you set user-specific timezones for embedded viewers?",
        options: [
          "It's required for git integration",
          "So date-based data displays correctly for each viewer's locale",
          "To bypass Row-Level Security",
          "To disable AI features",
        ],
        correctIndex: 1,
      },
      {
        id: "m9-q8",
        text: "True/False: Distribution settings should be reviewed as part of your security checklist.",
        options: ["True", "False"],
        correctIndex: 0,
      },
    ],
  },
  {
    id: "module-10",
    categoryId: "ai-modes-optimization",
    categoryOrder: 2,
    title: "Performance & Troubleshooting",
    difficulty: "Advanced",
    questions: [
      {
        id: "m10-q1",
        text: "What helps speed up repeated queries in Omni?",
        options: [
          "Disabling all filters",
          "Intelligent caching",
          "Removing all joins",
          "Deleting the model",
        ],
        correctIndex: 1,
      },
      {
        id: "m10-q2",
        text: "What is a common cause of a broken dashboard tile after a model change?",
        options: [
          "A renamed or removed field/join the tile still references",
          "Too many users viewing it",
          "The dashboard's color theme",
          "A slow internet connection only",
        ],
        correctIndex: 0,
      },
      {
        id: "m10-q3",
        text: "What tool helps catch broken references across dashboards before merging a model change?",
        options: [
          "Content validation",
          "AccessBoost",
          "Templated filters",
          "Schema refresh only",
        ],
        correctIndex: 0,
      },
      {
        id: "m10-q4",
        text: "True/False: OAuth-based warehouse access bypasses Omni's shared cache.",
        options: ["True", "False"],
        correctIndex: 0,
      },
      {
        id: "m10-q5",
        text: "What's a first troubleshooting step when a dashboard shows unexpected/missing rows for one user?",
        options: [
          "Delete the dashboard",
          "Check that user's attribute values and applicable access filters",
          "Restart the browser only",
          "Assume it's a bug and escalate immediately",
        ],
        correctIndex: 1,
      },
      {
        id: "m10-q6",
        text: "True/False: Schema refresh keeps Omni's model in sync with warehouse schema changes.",
        options: ["True", "False"],
        correctIndex: 0,
      },
      {
        id: "m10-q7",
        text: "What can you use to test how a change performs before it reaches production?",
        options: [
          "Dynamic environment swap on a branch",
          "Deleting user accounts",
          "Turning off all security",
          "Editing the shared model directly",
        ],
        correctIndex: 0,
      },
      {
        id: "m10-q8",
        text: "True/False: Performance issues should always be diagnosed by first assuming the warehouse is at fault.",
        options: ["True", "False"],
        correctIndex: 1,
      },
    ],
  },
  {
    id: "module-11",
    categoryId: "developer-101",
    categoryOrder: 3,
    title: "Administration & Deployment",
    difficulty: "Advanced",
    questions: [
      {
        id: "m11-q1",
        text: "At what level does Omni's git integration sync a model to a repository?",
        options: [
          "Individual dashboard level",
          "Model level",
          "User level",
          "Tile level",
        ],
        correctIndex: 1,
      },
      {
        id: "m11-q2",
        text: "What does enabling git integration require for shared model changes?",
        options: [
          "Nothing changes",
          "Branch Mode for all modifications",
          "Deleting all existing content",
          "Disabling user attributes",
        ],
        correctIndex: 1,
      },
      {
        id: "m11-q3",
        text: "What is the correct order of the deployment flow covered in this module?",
        options: [
          "Merge → Branch → Test → Review",
          "Branch → Edit → Test → Review → Merge → Publish",
          "Publish → Branch → Edit",
          "Review → Merge → Branch → Test",
        ],
        correctIndex: 1,
      },
      {
        id: "m11-q4",
        text: "What is the difference between a branch and a draft?",
        options: [
          "They're identical",
          "A branch isolates the model (and optionally content); a draft isolates a single document",
          "A draft isolates the model; a branch isolates one document",
          "Branches are for users, drafts are for admins",
        ],
        correctIndex: 1,
      },
      {
        id: "m11-q5",
        text: "How do you validate a model change against real data before merging?",
        options: [
          "Guess based on the YAML",
          "Swap to a QA/staging dynamic environment from your branch",
          "Merge first, then check",
          "Ask an end user to test in production",
        ],
        correctIndex: 1,
      },
      {
        id: "m11-q6",
        text: "What happens to attached content drafts when you merge a branch?",
        options: [
          "They're discarded",
          "They publish simultaneously with the model merge",
          "They require a separate manual publish step always",
          "Nothing, they stay in draft forever",
        ],
        correctIndex: 1,
      },
      {
        id: "m11-q7",
        text: "True/False: Requiring pull requests before merge is optional but recommended for governance.",
        options: ["True", "False"],
        correctIndex: 0,
      },
      {
        id: "m11-q8",
        text: "Where do connection roles get assigned to control base-level access?",
        options: [
          "In the User Management / admin area",
          "Inside a dashboard tile",
          "In a workbook formula",
          "In the certificate template",
        ],
        correctIndex: 0,
      },
    ],
  },
];

export function getModule(moduleId: string): QuizModule | undefined {
  return quizModules.find((m) => m.id === moduleId);
}

export function getCategoriesWithModules(): Array<
  QuizCategory & { modules: QuizModule[] }
> {
  return [...quizCategories]
    .sort((a, b) => a.order - b.order)
    .map((category) => ({
      ...category,
      modules: quizModules
        .filter((m) => m.categoryId === category.id)
        .sort((a, b) => a.categoryOrder - b.categoryOrder),
    }));
}

export function scoreQuiz(quizModule: QuizModule, answers: Record<string, number>) {
  let score = 0;
  for (const question of quizModule.questions) {
    if (answers[question.id] === question.correctIndex) {
      score += 1;
    }
  }
  const total = quizModule.questions.length;
  const passed = score / total >= PASS_THRESHOLD;
  return { score, total, passed };
}

export type ReviewItem = {
  questionId: string;
  text: string;
  options: string[];
  selectedIndex: number | null;
  correct: boolean;
  correctIndex?: number;
};

/** Reveal the correct answer per question only when `reveal` is true. */
export function buildReview(
  quizModule: QuizModule,
  answers: Record<string, number>,
  reveal: boolean
): ReviewItem[] {
  return quizModule.questions.map((q) => {
    const selectedIndex = answers[q.id] ?? null;
    return {
      questionId: q.id,
      text: q.text,
      options: q.options,
      selectedIndex,
      correct: selectedIndex === q.correctIndex,
      ...(reveal ? { correctIndex: q.correctIndex } : {}),
    };
  });
}

export const QUIZ_TIME_ESTIMATE = "10–15 min";
export const PROJECT_TIME_ESTIMATE = "5–6 hrs";

export { PASS_THRESHOLD, MAX_ATTEMPTS };
