import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { createLogger } from '../utils/logger'

const logger = createLogger('auth')

export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todosCreatedAtIndex = process.env.TODOS_CREATED_AT_INDEX
  ) {}

  async getTodos(userId: string): Promise<TodoItem[]> {

    logger.info(`User: ${userId} fetched todos.`);

    const todoItems=await this.docClient
    .query({
        TableName: this.todosTable,
        IndexName: this.todosCreatedAtIndex,
        ExpressionAttributeValues: {':userId': userId},
        KeyConditionExpression: 'userId = :userId',
    })
    .promise()
    return todoItems.Items as TodoItem[]
  }

  async createTodo(item: TodoItem): Promise<TodoItem> {
    const params = {
      TableName: this.todosTable,
      Item: item
    }

    await this.docClient.put(params).promise()
    return item
  }

  async deleteTodo(userId: string, todoId: string): Promise<void> {
    const params = {
      TableName: this.todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      }
    }

    logger.info(`${todoId} deleted from User: ${userId}.`);

    await this.docClient.delete(params).promise()
  }

  async updateTodo(
    userId: string,
    todoId: string,
    updatedTodo: TodoUpdate
  ): Promise<void> {

    const params = {
      TableName: this.todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      UpdateExpression: "set name = :name, dueDate = :dueDate, done = :done",
      ExpressionAttributeValues: {
        ":name":updatedTodo.name,
        ":dueDate":updatedTodo.dueDate,
        ":done":updatedTodo.done,
      },
      ReturnValues: "UPDATED_NEW"
    }

    logger.info(`${todoId} updated from User: ${userId}.`);

    await this
    .docClient
    .update(params)
    .promise()

    return
  }

  async updateTodoItemImage(
    userId: string,
    todoId: string,
    imageUrl: string
  ): Promise<void> {
    const updateImageParams = {
      TableName: this.todosTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      UpdateExpression: 'set attachmentUrl = :imageUrl',
      ExpressionAttributeValues: {
        ':imageUrl': imageUrl
      }
    }
    await this.docClient.update(updateImageParams).promise()
    return
  }

}