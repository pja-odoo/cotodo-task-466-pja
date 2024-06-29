import * as userService from './user';
import * as workspaceService from './workspace';

export const dbService = {
	user: userService,
	workspace: workspaceService
};
