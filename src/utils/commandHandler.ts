import type { Todo, Link, Note, PomodoroSettings, CalendarConfig } from "../context/DashboardContext";

/**
 * COMMAND CONTEXT
 * This interface defines the API available to command executors.
 * It is populated by the CmdPrompt component using the useDashboard hook.
 */
export interface CommandContext {
  bookmarks: Link[];
  addBookmark: (name: string, url: string) => void;
  removeBookmark: (name: string) => void;
  todos: Todo[];
  addTodo: (text: string) => void;
  removeTodo: (text: string) => void;
  toggleTodo: (text: string) => void;
  notes: Note[];
  addNote: (text: string) => void;
  clearNotes: () => void;
  removeNoteByText: (text: string) => void;
  setPomoSettings: (settings: PomodoroSettings | null) => void;
  setCalendarConfig: (config: CalendarConfig | null) => void;
}

/**
 * COMMAND RESULT
 * output: Array of strings to be printed in the terminal.
 * clear: If true, clears the terminal history.
 */
export type CommandResult = { output?: string[]; clear?: boolean };

/**
 * COMMAND DEFINITION
 * name: The primary keyword to trigger the command.
 * aliases: Alternative keywords (e.g., 'b' for 'bookmark').
 * execute: The function that performs the logic and returns a result.
 */
export interface CommandDefinition {
  name: string;
  aliases?: string[];
  description: string;
  execute: (args: string[], context: CommandContext) => CommandResult;
}

/**
 * REGISTRY: ALL SYSTEM COMMANDS
 */
export const commands: CommandDefinition[] = [
  {
    name: "help",
    description: "List all commands",
    execute: () => ({
      output: [
        "Commands:",
        "  todo add <task>     - Add a todo item",
        "  todo rm <task>      - Remove a todo item",
        "  todo done <task>    - Mark todo as done/undone",
        "  bm add <url> <name> - Add bookmark",
        "  bm rm <name>        - Remove bookmark",
        "  note <text>         - Add a quick note",
        "  note rm <text>      - Remove notes by text",
        "  note clear          - Remove all notes",
        "  weather <city>      - Set weather location",
        "  pomo start <f> <b>  - Start pomodoro timer (focus, break minutes)",
        "  pomo end            - Stop pomodoro and show clock",
        "  cal [m/y]           - Show calendar (current, month, or year)",
        "  ls                  - List bookmarks",
        "  g <query>           - Search Google",
        "  p <query>           - Search Perplexity",
        "  clear               - Clear terminal",
        "  <bookmark_name>     - Open a bookmark directly",
      ],
    }),
  },
  {
    name: "note",
    aliases: ["n"],
    description: "Quick notes management",
    execute: (args, { addNote, clearNotes, removeNoteByText }) => {
      const subNoteCmd = args[0]?.toLowerCase();
      
      if (subNoteCmd === "clear") {
        clearNotes();
        return { output: ["[Success] All notes cleared."] };
      }

      if (subNoteCmd === "add") {
        const noteText = args.slice(1).join(" ");
        if (noteText) {
          addNote(noteText);
          return { output: [`[Success] Note added: ${noteText}`] };
        }
        return { output: ["[Error] Usage: note add <text>"] };
      }

      if (subNoteCmd === "rm" || subNoteCmd === "remove") {
        const noteText = args.slice(1).join(" ");
        if (noteText) {
          removeNoteByText(noteText);
          return { output: [`[Success] Note removed: ${noteText}`] };
        }
        return { output: ["[Error] Usage: note rm <text>"] };
      }
      
      // Default to add if no subcommand or unknown subcommand
      const noteText = args.join(" ");
      if (noteText) {
        addNote(noteText);
        return { output: [`[Success] Note added: ${noteText}`] };
      }

      return { output: ["[Error] Usage: note <text>, note add <text>, note rm <text>, or note clear"] };
    },
  },
  {
    name: "ls",
    description: "List all bookmarks",
    execute: (_, { bookmarks }) => {
      if (bookmarks.length > 0) {
        return {
          output: [
            "Bookmarks:",
            ...bookmarks.map((b) => `  - ${b.name} (${b.url})`),
          ],
        };
      }
      return { output: ["No bookmarks found."] };
    },
  },
  {
    name: "todo",
    aliases: ["t"],
    description: "Task management",
    execute: (args, { addTodo, removeTodo, toggleTodo }) => {
      const subTodoCmd = args[0]?.toLowerCase();
      const todoText = args.slice(1).join(" ");

      if (subTodoCmd === "add") {
        if (todoText) {
          addTodo(todoText);
          return { output: [`[Success] Added todo: ${todoText}`] };
        }
        return { output: ["[Error] Usage: todo add <task>"] };
      }
      if (subTodoCmd === "rm" || subTodoCmd === "remove") {
        if (todoText) {
          removeTodo(todoText);
          return { output: [`[Success] Removed todo: ${todoText}`] };
        }
        return { output: ["[Error] Usage: todo rm <task>"] };
      }
      if (
        subTodoCmd === "done" ||
        subTodoCmd === "check" ||
        subTodoCmd === "do"
      ) {
        if (todoText) {
          toggleTodo(todoText);
          return { output: [`[Success] Toggled todo: ${todoText}`] };
        }
        return { output: ["[Error] Usage: todo done <task>"] };
      }
      return { output: ["[Error] Usage: todo <add|rm|done> <task>"] };
    },
  },
  {
    name: "bookmark",
    aliases: ["b", "bm"],
    description: "Bookmark management",
    execute: (args, { addBookmark, removeBookmark }) => {
      const subBmCmd = args[0]?.toLowerCase();
      if (subBmCmd === "add") {
        if (args.length >= 3) {
          const url = args[1];
          const name = args.slice(2).join(" ");
          addBookmark(name, url);
          return { output: [`[Success] Added bookmark: ${name}`] };
        }
        return { output: ["[Error] Usage: bm add <url> <name>"] };
      }
      if (subBmCmd === "rm" || subBmCmd === "remove") {
        const name = args.slice(1).join(" ");
        if (name) {
          removeBookmark(name);
          return { output: [`[Success] Removed bookmark: ${name}`] };
        }
        return { output: ["[Error] Usage: bm rm <name>"] };
      }
      return { output: ["[Error] Usage: bm <add|rm> ..."] };
    },
  },
  {
    name: "weather",
    aliases: ["w"],
    description: "Set weather location",
    execute: (args) => {
      const city = args.join(" ");
      if (city) {
        // We use a custom event here because the Weather component 
        // needs to trigger an imperative geocoding sequence.
        window.dispatchEvent(
          new CustomEvent("set-weather-location", { detail: city }),
        );
        return { output: [`Setting weather location to: ${city}`] };
      }
      return { output: ["[Error] Usage: weather <city>"] };
    },
  },
  {
    name: "pomo",
    description: "Pomodoro timer management",
    execute: (args, { setPomoSettings }) => {
      const subPomoCmd = args[0]?.toLowerCase();
      if (subPomoCmd === "start") {
        const focus = parseInt(args[1]) || 25;
        const breakMins = parseInt(args[2]) || 5;
        setPomoSettings({ focus, break: breakMins });
        return {
          output: [
            `[Success] Pomodoro started: ${focus}m focus, ${breakMins}m break`,
          ],
        };
      }
      if (subPomoCmd === "end" || subPomoCmd === "stop") {
        setPomoSettings(null);
        return { output: ["[Success] Pomodoro ended."] };
      }
      return {
        output: ["[Error] Usage: pomo start <focus> <break> or pomo end"],
      };
    },
  },
  {
    name: "cal",
    aliases: ["calendar"],
    description: "Calendar display",
    execute: (args, { setCalendarConfig }) => {
      const now = new Date();
      const arg = args[0]?.toLowerCase();
      if (!arg) {
        setCalendarConfig({
          month: now.getMonth(),
          year: now.getFullYear(),
          fullYear: false,
        });
        return {
          output: [
            `[Success] Showing calendar for ${now.toLocaleString("default", { month: "long" })} ${now.getFullYear()}`,
          ],
        };
      }
      if (arg === "year" || (parseInt(arg) > 12 && parseInt(arg) < 3000)) {
        const targetYear = parseInt(arg) || now.getFullYear();
        setCalendarConfig({ year: targetYear, fullYear: true });
        return {
          output: [`[Success] Showing calendar for year ${targetYear}`],
        };
      }
      let monthIndex = parseInt(arg) - 1;
      if (isNaN(monthIndex)) {
        const months = [
          "jan", "feb", "mar", "apr", "may", "jun", 
          "jul", "aug", "sep", "oct", "nov", "dec"
        ];
        monthIndex = months.findIndex((m) => arg.startsWith(m));
      }
      if (monthIndex >= 0 && monthIndex < 12) {
        const targetYear = parseInt(args[1]) || now.getFullYear();
        setCalendarConfig({
          month: monthIndex,
          year: targetYear,
          fullYear: false,
        });
        const mName = new Date(0, monthIndex).toLocaleString("default", {
          month: "long",
        });
        return {
          output: [`[Success] Showing calendar for ${mName} ${targetYear}`],
        };
      }
      return {
        output: [
          "[Error] Usage: cal [month/year] (e.g., 'cal', 'cal 12', 'cal year', 'cal may 2025')",
        ],
      };
    },
  },
  {
    name: "google",
    aliases: ["g"],
    description: "Search Google",
    execute: (args) => {
      const gQuery = args.join(" ");
      if (gQuery) {
        window.open(
          `https://www.google.com/search?q=${encodeURIComponent(gQuery)}`,
          "_blank",
        );
        return { output: [`Searching Google for: ${gQuery}`] };
      }
      return { output: ["[Error] Usage: g <query>"] };
    },
  },
  {
    name: "perplexity",
    aliases: ["p"],
    description: "Search Perplexity",
    execute: (args) => {
      const pQuery = args.join(" ");
      if (pQuery) {
        window.open(
          `https://www.perplexity.ai/search?q=${encodeURIComponent(pQuery)}`,
          "_blank",
        );
        return { output: [`Searching Perplexity for: ${pQuery}`] };
      }
      return { output: ["[Error] Usage: p <query>"] };
    },
  },
  {
    name: "clear",
    aliases: ["c"],
    description: "Clear terminal history",
    execute: () => ({ clear: true }),
  },
];

/**
 * ENGINE: Command Router
 * Parses raw input and matches it against registry or existing bookmarks.
 */
export const executeCommand = (
  cmdInput: string,
  context: CommandContext,
): CommandResult => {
  const parts = cmdInput.trim().split(" ");
  const commandName = parts[0].toLowerCase();
  const args = parts.slice(1);

  // 1. Try to find a registered command
  const command = commands.find(
    (c) => c.name === commandName || c.aliases?.includes(commandName),
  );

  if (command) {
    return command.execute(args, context);
  }

  // 2. Try to match a bookmark name directly
  const bookmark = context.bookmarks.find(
    (b) => b.name.toLowerCase() === commandName,
  );

  if (bookmark) {
    const url = bookmark.url.includes("://") ? bookmark.url : `https://${bookmark.url}`;
    
    // SECURITY: Protocol validation to prevent 'javascript:' injection
    if (url.toLowerCase().startsWith("javascript:")) {
      console.error("[Security] Blocked bookmark with javascript: protocol.");
      return { output: ["[Error] Blocked execution of unsafe URL."] };
    }
    
    window.open(url, "_blank");
    return { output: [`Opening: ${bookmark.name}...`] };
  }

  // 3. Fallback for unknown input
  return { output: [`[Error] Unknown command: ${commandName}`] };
};
