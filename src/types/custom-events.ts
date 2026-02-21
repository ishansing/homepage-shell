export interface AddTodoEvent extends CustomEvent<string> {}
export interface RemoveTodoEvent extends CustomEvent<string> {}
export interface ToggleTodoEvent extends CustomEvent<string> {}

export interface AddBookmarkEvent extends CustomEvent<{ name: string; url: string }> {}
export interface RemoveBookmarkEvent extends CustomEvent<string> {}

export interface SetWeatherLocationEvent extends CustomEvent<string> {}

export interface PomoStartEvent extends CustomEvent<{ focus: number; break: number }> {}
export interface PomoEndEvent extends CustomEvent<void> {}

declare global {
  interface WindowEventMap {
    "add-todo": AddTodoEvent;
    "remove-todo": RemoveTodoEvent;
    "toggle-todo": ToggleTodoEvent;
    "add-bookmark": AddBookmarkEvent;
    "remove-bookmark": RemoveBookmarkEvent;
    "set-weather-location": SetWeatherLocationEvent;
    "pomo-start": PomoStartEvent;
    "pomo-end": PomoEndEvent;
  }
}
