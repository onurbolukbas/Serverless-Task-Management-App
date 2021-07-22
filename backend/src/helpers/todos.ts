import {v4} from 'uuid'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from './todosAccess'

const todoAccess = new TodoAccess()

export async function getTodos(userId: string): Promise<TodoItem[]> {
  return todoAccess.getTodos(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  const todoId = v4()

  return await todoAccess.createTodo({
    todoId: todoId,
    userId: userId,
    createdAt: new Date().toISOString(),
    dueDate: createTodoRequest.dueDate,
    name: createTodoRequest.name,
    done: false,
  })
}

export async function updateTodo(
  userId: string,
  todoId: string,
  updateTodoRequest: UpdateTodoRequest
): Promise<void> {
  return await todoAccess.updateTodo(userId, todoId, {
    name: updateTodoRequest.name,
    done: updateTodoRequest.done,
    dueDate: updateTodoRequest.dueDate,
  })
}

export async function deleteTodo(
  userId: string,
  todoId: string
): Promise<void> {
  return await todoAccess.deleteTodo(userId, todoId)
}

export async function updateTodoItemImage(
  userId: string,
  todoId: string,
  imageUrl: string
): Promise<void> {
  return todoAccess.updateTodoItemImage(userId, todoId, imageUrl)
}