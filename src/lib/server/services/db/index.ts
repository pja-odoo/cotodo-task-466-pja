import * as userService from './user';
import * as workspaceService from './workspace';
import * as taskService from './task';

export const dbService = {
	user: userService,
	workspace: workspaceService,
	task: taskService
};
