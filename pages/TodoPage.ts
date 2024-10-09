import { Locator, Page } from '@playwright/test';

export class TodoPage {
  private page: Page;
  private todoInput: Locator;
  private todoList: Locator;
  private clearCompletedButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.todoInput = page.getByPlaceholder('What needs to be done?');
    this.todoList = page.getByTestId('todo-item')
    this.clearCompletedButton = page.locator('.clear-completed');
  }

  async navigate() {
    await this.page.goto('https://todomvc.com/examples/react/dist/');
  }

  async addTodoItem(todo: string) {
    await this.todoInput.fill(todo);
    await this.todoInput.press('Enter');
  }

  async editTodoItem(oldText: string, newText: string) {
    const todoItem = this.todoList.locator('text=' + oldText);
    await todoItem.dblclick();
    const editInput = this.page.locator('.new-todo').nth(1);
    await editInput.fill(newText);
    await editInput.press('Enter');
  }

  async deleteTodoItem() {
    const todoItem = this.todoList.nth(0);
    await todoItem.hover();
    await todoItem.getByTestId('todo-item-button').click();
  }

  async markFirstTodoAsComplete() {
    const todoItem = this.todoList.first()
    await todoItem.getByTestId('todo-item-toggle').check();
  }

  async getActiveTodos() {
    await this.page.locator('a:has-text("Active")').click();
    return await this.getTodoCount();
  }

  async clearCompleted() {
    await this.clearCompletedButton.click();
  }

  async getTodoCount() {
    return await this.todoList.count();
  }
  async getLastTodoItem() {
    return this.todoList.last();
  }
  async getEditedItem(newText: string) {
    const editedItem = this.todoList.locator('text=' + newText);
    return editedItem.textContent();
  }
  async getCompleteItem() {
    const completedItem = this.todoList
    return completedItem;
  }
}
