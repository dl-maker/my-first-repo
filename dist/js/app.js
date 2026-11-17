const form = document.querySelector("[data-todo-form]");
const input = document.querySelector("[data-todo-input]");
const list = document.querySelector("[data-todo-list]");
const count = document.querySelector("[data-todo-count]");
const template = document.querySelector("[data-todo-template]");

const filters = document.querySelector("[data-todo-filters]");

let todos = [];

let currentFilter = "all";   // "all", "active" or "completed"

function render() {
    list.replaceChildren();

    let visible = todos;
    if (currentFilter === "active") {
        visible = todos.filter((todo) => !todo.completed);
    } else if (currentFilter === "completed") {
        visible = todos.filter((todo) => todo.completed);
    }

    for(const todo of visible) {
        const item = template.content.firstElementChild.cloneNode(true);
        const checkbox = item.querySelector(".todo-item__checkbox");
        const title = item.querySelector(".todo-item__title");

        title.textContent = todo.title;
        checkbox.checked = todo.completed;

        checkbox.id = "todo-" + todo.id;
        title.htmlFor = checkbox.id;

        item.dataset.todoId = todo.id;                       
        item.classList.toggle("is-completed", todo.completed); 
        list.append(item);
    }
    const left = todos.filter((todo) => !todo.completed).length;
    count.textContent = "Tasks left: " + left;




    for (const button of filters.querySelectorAll("[data-filter]")) {
        const isCurrent = button.dataset.filter === currentFilter;
        button.classList.toggle("is-active", isCurrent);
        button.setAttribute("aria-pressed", isCurrent);
    }

}

form.addEventListener("submit",(event) =>
{
    event.preventDefault();

    const text = input.value.trim();

    if(text === ""){
        return;
    }

    todos.push({
        id: Date.now(),
        title: text,
        completed: false,

    });

    form.reset();

    render();
});

// Tick / untick a task
list.addEventListener("change", (event) => {
    if (!event.target.matches("[data-todo-toggle]")) {
        return;                                    // the change wasn't a checkbox
    }

    const id = Number(event.target.closest("[data-todo-id]").dataset.todoId);
    const todo = todos.find((todo) => todo.id === id);
    todo.completed = event.target.checked;

    render();
});

// Delete a task
list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-todo-delete]");
    if (!button) {
        return;                                    // the click wasn't on a ×
    }

    const id = Number(button.closest("[data-todo-id]").dataset.todoId);
    todos = todos.filter((todo) => todo.id !== id);

    render();
});


filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) {
        return;
    }

    currentFilter = button.dataset.filter;
    render();
});



render();
