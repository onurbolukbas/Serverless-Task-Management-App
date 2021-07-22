import 'source-map-support/register'
import {getUserId} from '../utils';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import{updateTodo} from '../../helpers/todos';
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const userId=getUserId(event);
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);
  const updatedItem= await updateTodo(todoId, userId, updatedTodo);
  
return {
  statusCode: 201,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
  },
  body: JSON.stringify({
    item: updatedItem
  })
};
}
