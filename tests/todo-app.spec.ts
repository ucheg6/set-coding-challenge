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
  
  test('should add a new todo item and appear last', async ({ page }) => {
    const todoInput = page.locator('.new-todo');
    await todoInput.fill('New Todo Item');
    await todoInput.press('Enter');
    await todoInput.fill('Another Todo Item');
    await todoInput.press('Enter');
    const todoList = page.locator('.todo-list li');
    await expect(todoList.last()).toHaveText('Another Todo Item');
  });
  test('should edit a todo item', async ({ page }) => {
    const todoInput = page.locator('.new-todo');
    await todoInput.fill('Editable Todo Item');
    await todoInput.press('Enter');
    const todoList = page.locator('.todo-list li');
    await todoList.first().dblclick();
    const editInput = todoList.locator('.edit');
    await editInput.fill('Updated Todo Item');
    await editInput.press('Enter');
    await expect(todoList.first()).toHaveText('Updated Todo Item');
  });
  test('should delete a todo item', async ({ page }) => {
    const todoInput = page.locator('.new-todo');
    await todoInput.fill('Delete Todo Item');
    await todoInput.press('Enter');
    const todoList = page.locator('.todo-list li');
    await todoList.first().hover();
    const deleteButton = todoList.locator('.destroy');
    await deleteButton.click();
    await expect(todoList).toHaveCount(0);
  });
  test('should mark a todo as completed', async ({ page }) => {
    const todoInput = page.locator('.new-todo');
    await todoInput.fill('Complete Todo Item');
    await todoInput.press('Enter');
    const todoList = page.locator('.todo-list li');
    const completeToggle = todoList.locator('.toggle');
    await completeToggle.click();
    await expect(todoList).toHaveClass(/completed/);
    await expect(todoList).toHaveText('Complete Todo Item');
  });
  test('should show only active items in Active list', async ({ page }) => {
    const todoInput = page.locator('.new-todo');
    await todoInput.fill('Active Todo Item');
    await todoInput.press('Enter');
    const todoList = page.locator('.todo-list li');
    await todoList.first().locator('.toggle').click();
    await page.click('a:has-text("Active")');
    await expect(todoList).not.toBeVisible();
  });
  test('should clear completed todo items', async ({ page }) => {
    const todoInput = page.locator('.new-todo');
    await todoInput.fill('Completed Todo Item');
    await todoInput.press('Enter');
    const todoList = page.locator('.todo-list li');
    const completeToggle = todoList.locator('.toggle');
    await completeToggle.click();
    await page.click('text=Clear completed');
    await expect(todoList).toHaveCount(0);
  });

});
