import { test, expect, type Page } from '@playwright/test';
import { checkNumberOfCompletedTodosInLocalStorage, checkNumberOfTodosInLocalStorage, checkTodosInLocalStorage } from '../src/todo-app';
import { TodoPage } from '../pages/TodoPage';

test.beforeEach(async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc');
});

const TODO_ITEMS = [
  'complete code challenge',
  'ensure coverage for all items is automated'
];

test.describe('Create New Todo', () => {
  test('should be able to create new items on the page', async ({ page }) => {
    // create a new todo locator
    const newTodo = page.getByPlaceholder('What needs to be done?');

    // Create 1st todo.
    await newTodo.fill(TODO_ITEMS[0]);
    await newTodo.press('Enter');

    // Make sure the list only has one todo item.
    await expect(page.getByTestId('todo-title')).toHaveText([
      TODO_ITEMS[0]
    ]);

    // Create 2nd todo.
    await newTodo.fill(TODO_ITEMS[1]);
    await newTodo.press('Enter');

    // Make sure the list now has two todo items.
    await expect(page.getByTestId('todo-title')).toHaveText([
      TODO_ITEMS[0],
      TODO_ITEMS[1]
    ]);

    await checkNumberOfTodosInLocalStorage(page, 2);
  });
  

});

test.describe('TodoMVC Tests', () => {
  let todoPage: TodoPage;

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoPage(page);
    await todoPage.navigate();
  });

  test('should add a new todo item', async () => {
    const newTodo = 'Test Todo'
    await todoPage.addTodoItem(newTodo);
    const todoItem = await todoPage.getLastTodoItem();
    await expect(todoItem).toHaveText(newTodo);
  });

  test('should edit a todo item', async () => {
    const oldTodo = 'Old Todo';
    const newTodo = 'Updated Todo';
    await todoPage.addTodoItem(oldTodo);
    await todoPage.editTodoItem(oldTodo, newTodo);
    const editedTodoItem = await todoPage.getEditedItem(newTodo);
    expect(editedTodoItem).toEqual(newTodo);
  });

  test('should delete a todo item', async () => {
    await todoPage.addTodoItem('Todo to delete');
    await todoPage.deleteTodoItem();
    const count = await todoPage.getTodoCount();
    expect(count).toBe(0);
  });

  test('should mark a todo item as completed', async () => {
    await todoPage.addTodoItem('Todo to complete');
    await todoPage.markFirstTodoAsComplete();
    const completedtem = await todoPage.getCompleteItem();
    await expect(completedtem).toHaveClass(/completed/);
  });

  test('should show only active todos', async () => {
    await todoPage.addTodoItem('Active Todo 1');
    await todoPage.addTodoItem('Completed Todo');
    await todoPage.markFirstTodoAsComplete();
    const activeCount = await todoPage.getActiveTodos();
    expect(activeCount).toBe(1); // Only 1 active todo should be shown
  });

  test('should clear completed todos', async () => {
    await todoPage.addTodoItem('Todo 1');
    await todoPage.addTodoItem('Todo 2');
    await todoPage.markFirstTodoAsComplete();
    await todoPage.clearCompleted();
    const count = await todoPage.getTodoCount();
    expect(count).toBe(1); // Only Todo 2 should remain
  });
});
